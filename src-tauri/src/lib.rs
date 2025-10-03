use argon2::{Algorithm, Argon2, Params, PasswordHasher, Version};
use miette::{Diagnostic, Report};
use password_hash::{rand_core::OsRng, SaltString};
use std::fmt;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::cmds::create_user::create_user;
use crate::cmds::create_users_table::create_users_table;
use crate::cmds::login_user::check_ad_user_group;
use crate::cmds::set_db::set_db;

mod cmds;

// --------------------
// 共有状態
// --------------------
#[derive(Clone)]
struct AppState {
    db_path: Arc<Mutex<Option<PathBuf>>>,
}

// --------------------
// カスタムエラー
// --------------------
#[derive(Debug, Diagnostic)]
#[diagnostic(code(custom::auth_error))]
struct AuthError {
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

fn hash_password(plain: &str) -> Result<String, Report> {
    let argon2 = build_argon2();
    let salt = SaltString::generate(&mut OsRng);
    let phc = argon2
        .hash_password(plain.as_bytes(), &salt)
        .map_err(|e| Report::new(AuthError { msg: e.to_string() }))?
        .to_string();
    Ok(phc)
}

// --------------------
// Tauri run
// --------------------
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(AppState {
            db_path: Arc::new(Mutex::new(None)),
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            set_db,
            create_users_table,
            create_user,
            check_ad_user_group
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
