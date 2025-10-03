use serde::Deserialize;
use std::path::PathBuf;
use tauri::State;

use crate::AppState;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetDbArgs {
    path: PathBuf,
}

// DBファイル選択
#[tauri::command]
pub async fn set_db(args: SetDbArgs, state: State<'_, AppState>) -> Result<String, String> {
    if tokio::fs::metadata(&args.path).await.is_err() {
        eprintln!("[set_db] File does not exist: {:?}", args.path);
        return Err(format!("File does not exist: {:?}", args.path));
    }
    let mut lock = state.db_path.lock().await;
    *lock = Some(args.path.clone());
    Ok(format!("Database path set: {:?}", args.path))
}
