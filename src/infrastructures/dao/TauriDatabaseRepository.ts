import { invoke } from "@tauri-apps/api/core";
import type { IDatabaseRepository } from "../../domains/repositories/IDatabaseRepository";

export class TauriDatabaseRepository implements IDatabaseRepository {
	// Rust 側 set_db コマンドに対応
	async setPath(path: string): Promise<string> {
		try {
			return await invoke<string>("set_db", { args: { path } });
		} catch (err) {
			const errorMsg =
				err instanceof Error
					? err.message
					: typeof err === "string"
						? err
						: JSON.stringify(err);
			console.error(`[TauriDatabaseRepository] Error in setPath: ${errorMsg}`);
			throw new Error(errorMsg);
		}
	}

	// Rust 側 create_users_table コマンドに対応（引数なし）
	async createTable(): Promise<string> {
		try {
			return await invoke<string>("create_users_table");
		} catch (err) {
			const errorMsg =
				err instanceof Error
					? err.message
					: typeof err === "string"
						? err
						: JSON.stringify(err);
			console.error(
				`[TauriDatabaseRepository] Error in createTable: ${errorMsg}`,
			);
			throw new Error(errorMsg);
		}
	}

	// Rust 側 create_user コマンドに対応
	async createUser(
		username: string,
		password: string,
		displayName?: string,
	): Promise<string> {
		try {
			return await invoke<string>("create_user", {
				args: {
					username,
					password,
					displayName,
				},
			});
		} catch (err) {
			const errorMsg =
				err instanceof Error
					? err.message
					: typeof err === "string"
						? err
						: JSON.stringify(err);
			console.error(
				`[TauriDatabaseRepository] Error in createUser: ${errorMsg}`,
			);
			throw new Error(errorMsg);
		}
	}

	// --------------------
	// Rust 側 login_user コマンドに対応
	// --------------------
	async checkAd(
		username: string,
		password: string,
		domain: string,
		domainController: string,
	): Promise<boolean> {
		try {
			return await invoke<boolean>("check_ad_user_group", {
				args: { username, password, domain, domainController },
			});
		} catch (err) {
			const errorMsg =
				err instanceof Error
					? err.message
					: typeof err === "string"
						? err
						: JSON.stringify(err);
			console.error(`[TauriDatabaseRepository] Error in checkAd: ${errorMsg}`);
			throw new Error(errorMsg);
		}
	}
}
