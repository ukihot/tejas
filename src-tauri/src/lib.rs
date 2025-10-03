use miette::{Diagnostic, Report};
use std::fmt;
use std::sync::Arc;
use tauri::State;
use tokio::fs;
use tokio::sync::Mutex;
use turso::Builder;

// --------------------
// 共有状態
// --------------------
#[derive(Clone)]
struct AppState {
    db_path: Arc<Mutex<Option<String>>>, // 接続済みDBのパス
}

// --------------------
// カスタムエラー定義
// --------------------
#[derive(Debug, Diagnostic)]
#[diagnostic(
    code(custom::db_error),
    help("Check the database connection or SQL syntax.")
)]
struct DbError {
    msg: String,
}

impl fmt::Display for DbError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Database error: {}", self.msg)
    }
}

impl std::error::Error for DbError {}

#[derive(Debug, Diagnostic)]
#[diagnostic(code(custom::io_error), help("Check the file path and permissions."))]
struct IoError {
    msg: String,
}

impl fmt::Display for IoError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "IO error: {}", self.msg)
    }
}

impl std::error::Error for IoError {}

// --------------------
// SQLマイグレーション実行関数
// --------------------
async fn do_migration(state: &State<'_, AppState>) -> Result<(), Report> {
    // 非同期Mutexを使用してDBパス取得
    let db_path = {
        let db_lock = state.db_path.lock().await;
        match &*db_lock {
            Some(p) => p.clone(),
            None => {
                return Err(Report::new(DbError {
                    msg: "DB path not set".into(),
                }))
            }
        }
    };

    // DB接続
    let db = Builder::new_local(&db_path)
        .build()
        .await
        .map_err(|e| Report::new(DbError { msg: e.to_string() }))?;
    let conn = db
        .connect()
        .map_err(|e| Report::new(DbError { msg: e.to_string() }))?;

    // SQLファイル読み込み
    let sql = fs::read_to_string("migrations/001_create_posts.sql")
        .await
        .map_err(|e| Report::new(IoError { msg: e.to_string() }))?;

    // SQL実行
    if let Err(e) = conn.execute(&sql, ()).await {
        let report = Report::new(DbError { msg: e.to_string() });

        // エラーログ出力
        fs::write("error.log", report.to_string())
            .await
            .map_err(|e| Report::new(IoError { msg: e.to_string() }))?;

        return Err(report);
    }

    Ok(())
}

// --------------------
// Tauriコマンド
// --------------------
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
async fn run_migration(state: State<'_, AppState>) -> Result<String, String> {
    match do_migration(&state).await {
        Ok(_) => Ok("Migration applied successfully.".to_string()),
        Err(e) => {
            // Report を文字列化して返す
            let msg = format!("Migration failed:\n{}", e);
            Err(msg)
        }
    }
}

#[tauri::command]
async fn set_db_path(path: &str, state: State<'_, AppState>) -> Result<String, String> {
    if tokio::fs::metadata(&path).await.is_ok() {
        let mut db_lock = state.db_path.lock().await;
        *db_lock = Some(path.to_string());
        Ok(format!("Database path set: {}", path))
    } else {
        let err = IoError {
            msg: format!("File does not exist: {}", path),
        };
        Err(err.to_string())
    }
}

#[tauri::command]
async fn create_db(folder_path: &str) -> Result<String, String> {
    use std::path::Path;

    if tokio::fs::metadata(&folder_path).await.is_err() {
        let err = IoError {
            msg: format!("Folder does not exist: {}", folder_path),
        };
        return Err(err.to_string());
    }

    let db_file = Path::new(&folder_path).join("database.db");

    if tokio::fs::metadata(&db_file).await.is_ok() {
        let err = IoError {
            msg: format!("File already exists: {:?}", db_file),
        };
        return Err(err.to_string());
    }

    match tokio::fs::File::create(&db_file).await {
        Ok(_) => Ok(format!("New database created at {:?}", db_file)),
        Err(e) => {
            let err = IoError {
                msg: format!("Failed to create database: {}", e),
            };
            Err(err.to_string())
        }
    }
}

// --------------------
// Tauriアプリ起動
// --------------------
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(AppState {
            db_path: Arc::new(Mutex::new(None)),
        }) // 共有状態登録
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            set_db_path,
            run_migration,
            create_db
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
