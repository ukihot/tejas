import type { CreateUserRequest, DbPathRequest } from "./RequestDTOs";

export interface InputPort {
	// Rust 側 set_db コマンド
	setDatabasePath(req: DbPathRequest): Promise<void>;

	// Rust 側 create_table コマンド
	createTable(): Promise<void>;

	// Rust 側 create_user コマンド
	createUser(req: CreateUserRequest): Promise<void>;

	checkAd(args: {
		username: string;
		password: string;
		domain: string;
		domainController: string;
	}): Promise<void>;
}
