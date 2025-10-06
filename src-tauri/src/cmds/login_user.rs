use ldap3::{LdapConnAsync, Scope, SearchEntry};
use serde::Deserialize;

const GROUP_CN: &str = "Dharma Users";

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CheckAdArgs {
    username: String,
    password: String,
    domain: String,
    domain_controller: String,
}

// --------------------
// AD Bind (ユーザ認証)
// --------------------
async fn bind_user(
    username: &str,
    password: &str,
    domain: &str,
    ldap_url: &str,
) -> Result<ldap3::Ldap, String> {
    let (conn, mut ldap) = LdapConnAsync::new(ldap_url)
        .await
        .map_err(|e| format!("Failed to connect to AD: {}", e))?;
    ldap3::drive!(conn);

    let bind_user = format!("{}@{}", username, domain);
    ldap.simple_bind(&bind_user, password)
        .await
        .map_err(|_| "Invalid username or password".to_string())?
        .success()
        .map_err(|_| "Invalid username or password".to_string())?;

    Ok(ldap)
}

// --------------------
// ADグループチェック
// --------------------
#[tauri::command]
pub async fn check_ad_user_group(args: CheckAdArgs) -> Result<bool, String> {
    let ldap_url = format!("ldap://{}", args.domain_controller);

    // 1. 認証 (Bind)
    let mut ldap = bind_user(&args.username, &args.password, &args.domain, &ldap_url).await?;

    // 2. 検索ベース作成
    let search_base = args
        .domain
        .split('.')
        .map(|dc| format!("DC={}", dc))
        .collect::<Vec<_>>()
        .join(",");

    let filter = format!("(&(objectClass=user)(sAMAccountName={}))", args.username);

    let (rs, _res) = ldap
        .search(&search_base, Scope::Subtree, &filter, vec!["memberOf"])
        .await
        .map_err(|e| format!("LDAP search failed: {}", e))?
        .success()
        .map_err(|e| format!("LDAP search failed (success check): {:?}", e))?;

    let entry = rs
        .first()
        .ok_or_else(|| format!("User '{}' not found in AD", args.username))
        .map(|re: &ldap3::ResultEntry| SearchEntry::construct(re.clone()))?;

    let is_member = entry
        .attrs
        .get("memberOf")
        .map(|groups| groups.iter().any(|dn| dn.contains(GROUP_CN)))
        .unwrap_or(false);

    if !is_member {
        return Err(format!(
            "User '{}' is not a member of {}",
            args.username, GROUP_CN
        ));
    }

    Ok(true)
}
