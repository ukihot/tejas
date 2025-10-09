use miette::{Context, IntoDiagnostic, Result};
use serde::Deserialize;
use tauri::State;
use turso::Connection;

use crate::{hash_password, AppState};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateUserArgs {
    username: String,
    password: String,
    display_name: Option<String>,
}

// -------------------
// 内部処理関数（miette で ? が使える）
// -------------------
async fn create_user_inner(args: CreateUserArgs, state: &State<'_, AppState>) -> Result<String> {
    // DB 接続取得（無ければ失敗）
    let conn: Connection = {
        let lock = state.db_conn.lock().await;
        lock.as_ref()
            .ok_or_else(|| miette::miette!("DB connection not available in AppState"))?
            .clone()
    };

    // パスワードハッシュ化
    let pwd_hash = hash_password(&args.password)
        .map_err(|e| miette::miette!("Password hashing failed: {}", e))?;

    // ユーザ追加
    let sql = "INSERT INTO users (username, pwd_hash, display_name) VALUES (?, ?, ?)";
    conn.execute(
        sql,
        (
            args.username.as_str(),
            pwd_hash.as_str(),
            args.display_name.as_deref().unwrap_or(""),
        ),
    )
    .await
    .into_diagnostic()
    .wrap_err("Failed to execute INSERT statement")?;

    Ok(format!("User '{}' created", args.username))
}

// -------------------
// Tauri コマンド
// -------------------
#[tauri::command]
pub async fn create_user(
    args: CreateUserArgs,
    state: State<'_, AppState>,
) -> Result<String, String> {
    create_user_inner(args, &state)
        .await
        .map_err(|e| e.to_string())
}
