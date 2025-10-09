use argon2::{Algorithm, Argon2, Params, PasswordHasher, Version};
use miette::{Diagnostic, Report};
use password_hash::{rand_core::OsRng, SaltString};
use std::fmt;
use std::sync::Arc;
use tokio::sync::Mutex;
use turso::{Builder, Connection};

use crate::cmds::{
    create_user::create_user, create_users_table::create_users_table,
    login_user::check_ad_user_group,
};
mod cmds;

// --------------------
// 共有状態
// --------------------
#[derive(Clone)]
pub struct AppState {
    pub db_conn: Arc<Mutex<Option<Connection>>>, // DB 接続
}

// --------------------
// カスタムエラー
// --------------------
#[derive(Debug, Diagnostic)]
#[diagnostic(code(custom::auth_error))]
pub struct AuthError {
    msg: String,
}

impl fmt::Display for AuthError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Auth error: {}", self.msg)
    }
}

impl std::error::Error for AuthError {}

// --------------------
// Argon2 ユーティリティ
// --------------------
fn build_argon2() -> Argon2<'static> {
    let params = Params::new(65536, 3, 1, None).expect("valid params");
    Argon2::new(Algorithm::Argon2id, Version::V0x13, params)
}

pub fn hash_password(password: &str) -> Result<String, Report> {
    let argon2 = build_argon2();
    let salt = SaltString::generate(&mut OsRng);

    Ok(argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|e| Report::new(AuthError { msg: e.to_string() }))?
        .to_string())
}

// --------------------
// Tauri run
// --------------------
pub fn run() {
    // CLI から DB パスを取得
    let args: Vec<String> = std::env::args().collect();
    let db_path = args
        .windows(2)
        .find(|w| w[0] == "--db")
        .map(|w| w[1].clone())
        .unwrap_or("database.db".to_string());

    // State 初期化（まだ接続なし）
    let app_state = AppState {
        db_conn: Arc::new(Mutex::new(None)),
    };

    let app_state_clone = app_state.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(app_state)
        .setup(move |_app| {
            let db_path = db_path.clone();
            let state = app_state_clone.clone();
            // 非同期ブロックで DB 接続初期化
            tokio::spawn(async move {
                match Builder::new_local(&db_path).build().await {
                    Ok(db) => match db.connect() {
                        Ok(conn) => {
                            let mut lock = state.db_conn.lock().await;
                            *lock = Some(conn);
                            println!("[setup] DB connection established");
                        }
                        Err(e) => eprintln!("[setup] DB connect failed: {}", e),
                    },
                    Err(e) => eprintln!("[setup] Builder failed: {}", e),
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_users_table,
            create_user,
            check_ad_user_group
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
