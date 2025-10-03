use tauri::State;
use turso::Builder;

use crate::AppState;

// ユーザーテーブル作成
#[tauri::command]
pub async fn create_users_table(state: State<'_, AppState>) -> Result<String, String> {
    let db_path = {
        let lock = state.db_path.lock().await;
        match &*lock {
            Some(p) => p.clone(),
            None => {
                eprintln!("[create_users_table] DB path not set");
                return Err("DB path not set".to_string());
            }
        }
    };

    let db = Builder::new_local(db_path.to_str().unwrap())
        .build()
        .await
        .map_err(|e| {
            eprintln!("[create_users_table] Failed to build DB: {}", e);
            e.to_string()
        })?;
    let conn = db.connect().map_err(|e| {
        eprintln!("[create_users_table] Failed to connect DB: {}", e);
        e.to_string()
    })?;

    let sql = r#"
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT UNIQUE,
            pwd_hash TEXT NOT NULL,
            display_name TEXT,
            created_at INTEGER DEFAULT (strftime('%s','now')),
            last_login_at INTEGER,
            failed_login_attempts INTEGER DEFAULT 0,
            locked_until INTEGER,
            role TEXT DEFAULT 'user' CHECK(role IN ('user','admin','moderator')),
            notes TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);
    "#;

    for stmt in sql.split(';') {
        let stmt = stmt.trim();
        if stmt.is_empty() {
            continue;
        }
        conn.execute(stmt, ()).await.map_err(|e| {
            eprintln!("[create_users_table] Failed to execute statement: {}", e);
            e.to_string()
        })?;
    }

    Ok("Users table created successfully".to_string())
}
