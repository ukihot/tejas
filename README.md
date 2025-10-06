# Dharma — MicroVault for On-Premises AD Environment / オンプレAD環境向けマイクロVault

<img width="512" height="512" alt="icon" src="https://github.com/user-attachments/assets/99835d30-1634-4df0-9ef0-bdff4a69d8bd" />

## Why Dharma? / Dharmaが必要な理由

Managing organizational information assets can no longer rely on Excel spreadsheets or personal notebooks.
組織の情報資産管理は、もはやExcelや個人ノートでは対応できません。

Storing privileged accounts or confidential information in plain text increases the risk of **internal leaks, file theft, and data breaches**.
特権アカウントや機密情報を平文で管理すると、**内部漏洩・ファイル持ち出し・盗難**のリスクが高まります。

Dharma is a **microVault designed to combine practical security with operational efficiency**.
Dharmaは、**実務で使える安全性と運用性を両立**するマイクロVaultです。

It integrates seamlessly with on-premises AD environments and secures Truso file-based databases through encryption.
オンプレAD環境に統合し、TrusoファイルベースDBを暗号化して安全に管理します。

---

## What is a Vault? / Vaultとは？

A Vault is not merely a secure storage location.
Vaultは単なる暗号化保管場所ではありません。

It is a system that integrates **access control, auditing, and lifecycle management** of secrets.
秘密情報の**アクセス制御・監査・ライフサイクル管理**を統合したシステムです。

### Essential Components / Vaultの必須要素

1. **Secure Storage / 安全な保管**
   - Secrets are encrypted using AES-256-GCM or HSM/KMS.
     秘密情報はAES-256-GCMまたはHSM/KMSで暗号化されます。
   - Protects against file theft and tampering.
     ファイル持ち出しや改ざんを防ぎます。
   - Truso files are placed on AD-managed file servers and cannot be edited directly.
     TrusoファイルはAD管理下のファイルサーバに配置され、直接編集はできません。
   - Supports encrypted backups with versioning to mitigate accidental loss.
     暗号化済みバックアップの世代管理により、障害時の復旧が可能です。

2. **Access Control (RBAC) / アクセス制御**
   - Synchronizes user permissions with AD/LDAP.
     AD/LDAPと連携し、ユーザ権限を反映します。
   - Privileged and service accounts can only be accessed through the Vault.
     特権アカウントやサービスアカウントはVault経由でのみアクセス可能です。
   - Concurrent access is controlled via application-level locks to prevent simultaneous write conflicts.
     同時アクセス時はアプリケーションレベルで排他制御を行います。

3. **Audit & Logging / 監査・ログ**
   - All operations are logged.
     すべての操作をログ化します。
   - Records include AD user ID, timestamp, and target resource.
     ADユーザID、タイムスタンプ、対象リソースを記録します。
   - Logs are tamper-resistant, encrypted, and can be integrated with SIEM.
     ログは改ざん防止・暗号化され、SIEMと統合可能です。
   - Log formats, retention periods, and external aggregation policies are explicitly defined.
     ログフォーマット、保持期間、外部集約方針を明確に設計できます。

4. **Secret Lifecycle Management / 秘密情報ライフサイクル管理**
   - Manages the creation, distribution, usage, rotation, and disposal of secrets.
     秘密情報の作成、配布、使用、ローテーション、廃棄を管理します。
   - Supports Dynamic Secrets, allowing short-lived DB/service account credentials and API keys with automatic rotation.
     Dynamic Secrets対応により、DBやサービスアカウント、APIキーを短期発行・自動ローテーション可能です。

5. **Key Management (Optional) / 鍵管理（オプション）**
   - Safely stores encryption keys and certificate private keys.
     暗号鍵や証明書秘密鍵を安全に保護します。
   - Can integrate with HSM/KMS to securely manage root keys and peppers.
     HSMやKMSと連携して、ルート鍵やペッパーを安全に管理します。
   - Fallback for environments without HSM/KMS: secondary password input or locally protected key store.
     HSM/KMS未導入環境向けには、二次パスワード入力やローカル安全保管によるフォールバックを提供。

6. **UX & Policy Enforcement / UXとポリシー適用**
   - Provides intuitive UI feedback for policy violations.
     ポリシー違反時には直感的なUIでフィードバックします。
   - Visualizes permission hierarchies and operation history.
     権限階層や操作履歴を可視化します。
   - Access through the viewer reduces risks of file-based database exfiltration.
     ビューワ経由の操作制御により、ファイルベースDBの持ち出しリスクを低減します。

---

## Dharma Concept / Dharmaのコンセプト

- **Centralized Secrets, Operationally Simple / 中央管理と運用の簡易化**
  - Consolidates privileged and confidential accounts in one place.
    特権アカウントや機密情報を一元管理します。
  - Tauri viewer enables intuitive operation.
    Tauriビューワ経由で直感的に操作可能です。

- **AD-Integrated Authentication & RBAC / AD統合認証とRBAC**
  - Directly maps AD groups to Vault RBAC.
    ADグループを直接RBACに反映します。
  - Avoids dual user management.
    ユーザ管理の二重化を避けます。

- **Strong Encryption & Controlled Pepper / 強力な暗号化とペッパー管理**
  - Truso DB is encrypted using AES-256-GCM.
    Truso DBはAES-256-GCMで暗号化されます。
  - Keys are derived using Argon2id.
    鍵はArgon2idで派生されます。
  - Pepper is securely managed via external HSM/KMS or secondary password input.
    ペッパーは外部HSM/KMSまたは第二パスワード入力で安全に管理されます。

- **Privileged Access Management / 特権アクセス管理**
  - Vault is the exclusive access path for privileged and service accounts.
    Vaultは特権・サービスアカウントの専用アクセス経路です。
  - Includes automated rotation, approval workflows, and logging.
    自動ローテーション、承認フロー、ログ化が組み込まれています。
  - RDP/SSH or database client access can be restricted through the Vault, with optional session recording.
    RDP/SSHやDBクライアントのアクセスはVault経由に限定でき、セッション録画も可能です。

- **Audit-First, SIEM-Ready / 監査重視・SIEM対応**
  - Records all operations with AD user ID, timestamp, and target resource.
    すべての操作をADユーザID＋タイムスタンプ＋対象リソースで記録します。
  - Provides a UI for log review and seamless SIEM integration.
    ログ閲覧UIとSIEM連携で監査・内部統制要件に対応します。

- **Dynamic Secrets & Rotation-Ready / 動的秘密情報対応**
  - Supports dynamic issuance of short-lived privileged accounts and API keys.
    短期特権アカウントやAPIキーを動的発行できます。
  - Future extensions include automatic rotation and cloud resource support.
    将来的に自動ローテーションやクラウドリソース対応も視野に入れています。

---

## Design Principles / 設計原則

1. **Minimal Trust, Maximum Auditability / 最小権限・最大監査性**
   - Users access only the information they need.
     必要な情報にのみアクセス可能です。
   - All operations are fully traceable.
     すべての操作は証跡として残ります。

2. **Composable Security / 組み合わせ可能なセキュリティ**
   - Combines encryption, AD authentication, pepper, approval workflows, and audit logs flexibly.
     暗号化、AD認証、ペッパー、承認ワークフロー、監査ログを柔軟に組み合わせます。

3. **Operational Simplicity / 運用簡便性**
   - Minimizes the complex operational steps often seen in commercial Vaults.
     商用Vaultで複雑だった運用手順を最小化します。
   - AD integration and Tauri viewer streamline operations.
     AD連携とTauriビューワで直感的に操作できます。

4. **Self-Contained & Extensible / 自己完結・拡張可能**
   - Lightweight, file-based deployment.
     ファイルベースで軽量に導入できます。
   - Supports integration with Web APIs and other systems as needed.
     必要に応じてWeb APIや他システムと連携可能です。

5. **UX Meets Security / UXとセキュリティの両立**
   - Optimized for both operators and general users.
     運用担当者と一般ユーザの双方の作業効率を重視します。
   - Policy violations, permission hierarchies, and log access are visualized in the UI.
     ポリシー違反、権限階層、ログ閲覧をUIで可視化します。

6. **Secure File & Key Handling / 安全なファイル・鍵管理**
   - Direct editing of Truso files is prohibited.
     Trusoファイルの直接編集は不可です。
   - Peppers are securely stored, using KMS/HSM or user input.
     ペッパーは秘密に保持し、KMS/HSMまたはユーザ入力で管理します。
   - Backups are encrypted and versioned to prevent data loss.
     バックアップは暗号化・世代管理され、データ損失を防ぎます。
   - Application-level locks prevent concurrent write conflicts.
     同時書き込み時はアプリケーションレベルで排他制御を行います。

---

## Target Use Cases / 対象ユースケース

- Managing privileged accounts on Windows/Linux servers and RDS
  Windows/LinuxサーバやRDSの特権アカウント管理
- Centralized management and automated rotation of service accounts and API keys
  サービスアカウント・APIキーの集中管理と自動ローテーション
- Secure storage and controlled access to confidential credentials
  機密情報・認証情報の安全な保存とアクセス制御
- Preventing file-based DB exfiltration and ensuring audit log compliance
  ファイルベースDBの持ち出し防止、監査ログ管理

---

## Philosophy / フィロソフィー

- **From Excel to Secure Vault / ExcelからセキュアVaultへ**
  - Evolves from personal notebooks or Excel spreadsheets.
    社員個人のノートやExcel台帳から進化しました。
  - Provides a microVault that balances **usability and security**.
    「便利さ」と「リスク」を両立させるマイクロVaultを提供します。

- **Open, Controlled, Audit-Ready / OSS・統制・監査対応**
  - Leverages OSS flexibility.
    OSSの柔軟性を享受します。
  - Standardizes on-prem AD integration, permission management, and audit logging.
    オンプレAD統合、権限管理、監査ログを標準化しました。
  - Future extensions may include Dynamic Secrets and automatic rotation.
    Dynamic Secretsや自動ローテーションの将来的拡張も視野に入れます。

---

Dharma is **a microVault philosophy for secure, operationally simple, and auditable secrets management in on-premises enterprise environments**, combining strong encryption, AD-based access control, and UX-driven policy enforcement.
Dharmaは**オンプレAD環境における安全で運用簡便、監査可能な秘密情報管理のマイクロVault哲学**であり、強力な暗号化、ADベースのアクセス制御、UX主導のポリシー適用を統合しています。
