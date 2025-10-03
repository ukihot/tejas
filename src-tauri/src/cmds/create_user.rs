use serde::Deserialize;
use tauri::State;
use turso::Builder;

use crate::{hash_password, AppState};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateUserArgs {
    username: String,
    password: String,
    display_name: Option<String>,
}

// ユーザ追加
#[tauri::command]
pub async fn create_user(
    args: CreateUserArgs,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let db_path = {
        let lock = state.db_path.lock().await;
        match &*lock {
            Some(p) => p.clone(),
            None => return Err("DB path not set".to_string()),
        }
    };

    let db = Builder::new_local(db_path.to_str().unwrap())
        .build()
        .await
        .map_err(|e| {
            eprintln!("[create_user] Failed to build DB: {}", e);
            e.to_string()
        })?;
    let conn = db.connect().map_err(|e| {
        eprintln!("[create_user] Failed to connect DB: {}", e);
        e.to_string()
    })?;

    let pwd_hash = hash_password(&args.password).map_err(|e| {
        eprintln!("[create_user] Password hashing failed: {}", e);
        e.to_string()
    })?;

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
    .map_err(|e| {
        eprintln!("[create_user] Failed to execute INSERT: {}", e);
        e.to_string()
    })?;

    Ok(format!("User '{}' created", args.username))
}
