export interface IDatabaseRepository {
	// DB パスを設定（Rust 側 set_db コマンドに対応）
	setPath(path: string): Promise<string>;

	// SQL ファイルでテーブルを作成（Rust 側 create_table コマンドに対応）
	createTable(): Promise<string>;

	// ユーザ作成（Rust 側 create_user コマンドに対応）
	createUser(
		username: string,
		password: string,
		displayName?: string,
	): Promise<string>;

	checkAd(
		username: string,
		password: string,
		domain: string,
		domainController: string,
	): Promise<boolean>;
}
