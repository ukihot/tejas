use miette::{Context, IntoDiagnostic, Result};
use tauri::State;
use turso::Connection;

use crate::AppState;

async fn create_users_table_inner(state: &State<'_, AppState>) -> Result<String> {
    // DB 接続取得（失敗なら miette::Report）
    let conn: Connection = {
        let lock = state.db_conn.lock().await;
        lock.as_ref()
            .ok_or_else(|| miette::miette!("DB connection not available in AppState"))?
            .clone()
    };

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
        conn.execute(stmt, ())
            .await
            .into_diagnostic()
            .wrap_err_with(|| format!("Failed to execute statement `{}`", stmt))?;
    }

    Ok("Users table created successfully".to_string())
}

// -------------------
// Tauri コマンド
// -------------------
#[tauri::command]
pub async fn create_users_table(state: State<'_, AppState>) -> Result<String, String> {
    create_users_table_inner(&state)
        .await
        .map_err(|e| e.to_string()) // miette::Report -> String に変換
}
