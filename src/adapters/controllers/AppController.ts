import type { InputPort } from "../../applications/InputPorts";

export class AppController {
	constructor(private inputPort: InputPort) {}

	// Rust 側 set_db コマンドに対応
	async setDatabasePath(path: string) {
		await this.inputPort.setDatabasePath({ path });
	}

	// Rust 側 create_table コマンドに対応
	async createTable() {
		await this.inputPort.createTable();
	}

	// Rust 側 create_user コマンドに対応
	async createUser(username: string, password: string, displayName?: string) {
		await this.inputPort.createUser({ username, password, displayName });
	}

	async checkAd(
		username: string,
		password: string,
		domain: string,
		domainController: string,
	) {
		await this.inputPort.checkAd({
			username,
			password,
			domain,
			domainController,
		});
	}
}
