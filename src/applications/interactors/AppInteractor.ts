import type { IDatabaseRepository } from "../../domains/repositories/IDatabaseRepository";
import { LoginService } from "../../domains/services/LoginService";
import type { InputPort } from "../InputPorts";
import type { OutputPort } from "../OutputPorts";
import type {
	CheckAdRequest,
	CreateUserRequest,
	DbPathRequest,
} from "../RequestDTOs";

export class AppInteractor implements InputPort {
	constructor(
		private repo: IDatabaseRepository,
		private outputPort: OutputPort,
	) {}

	// --------------------
	// set_db コマンド
	// --------------------
	async setDatabasePath(req: DbPathRequest): Promise<void> {
		console.log(
			`[AppInteractor] setDatabasePath called with path: ${req.path}`,
		);
		if (!req.path) {
			this.outputPort.presentMessage({
				message: "Please select a database path first.",
			});
			console.log(`[AppInteractor] setDatabasePath aborted: no path`);
			return;
		}
		try {
			const msg = await this.repo.setPath(req.path);
			this.outputPort.presentMessage({ message: msg });
		} catch (err) {
			const errorMsg = `Error: ${(err as Error).message}`;
			this.outputPort.presentMessage({ message: errorMsg });
			console.error(`[AppInteractor] setDatabasePath failed: ${errorMsg}`);
		}
	}

	// --------------------
	// create_table コマンド
	// --------------------
	async createTable(): Promise<void> {
		try {
			const msg = await this.repo.createTable();
			this.outputPort.presentMessage({ message: msg });
		} catch (err) {
			const errorMsg = `Error: ${(err as Error).message}`;
			this.outputPort.presentMessage({ message: errorMsg });
			console.error(`[AppInteractor] createTable failed: ${errorMsg}`);
		}
	}

	// --------------------
	// create_user コマンド
	// --------------------
	async createUser(req: CreateUserRequest): Promise<void> {
		if (!req.username || !req.password) {
			this.outputPort.presentMessage({
				message: "Username and password are required.",
			});
			console.log(
				`[AppInteractor] createUser aborted: missing username or password`,
			);
			return;
		}
		try {
			const msg = await this.repo.createUser(
				req.username,
				req.password,
				req.displayName ?? "",
			);
			this.outputPort.presentMessage({ message: msg });
		} catch (err) {
			const errorMsg = `Error: ${(err as Error).message}`;
			this.outputPort.presentMessage({ message: errorMsg });
			console.error(`[AppInteractor] createUser failed: ${errorMsg}`);
		}
	}

	async checkAd(req: CheckAdRequest): Promise<void> {
		const service = new LoginService(this.repo);
		try {
			const isAllowed = await service.checkAd(
				req.username,
				req.password,
				req.domain,
				req.domainController,
			);

			this.outputPort.presentAdCheckResult({
				allowed: isAllowed,
				message: isAllowed ? "ADグループ審査: 承認" : "ADグループ審査: 拒否",
			});
		} catch (err) {
			this.outputPort.presentAdCheckResult({
				allowed: false,
				message: `Error: ${(err as Error).message}`,
			});
		}
	}
}
