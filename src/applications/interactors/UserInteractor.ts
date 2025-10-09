import type { User } from "../../domains/entites/User";
import type { UserRepository } from "../../domains/repositories/UserRepository";
import type {
	AuthService,
	AuthService as AuthServiceClass,
} from "../../domains/services/AuthService";
import { UserId } from "../../domains/values/UserId";

type AuthResult = Awaited<ReturnType<AuthServiceClass["authenticate"]>>;

import type { UserInputPort } from "../InputPorts";
import type { HomeOutputPort, SignInOutputPort } from "../OutputPorts";
import type {
	AuthenticateUserRequestDTO,
	CheckAdRequestDTO,
} from "../RequestDTOs";
import type { AuthenticateUserResponseDTO } from "../ResponseDTOs";

export class UserInteractor implements UserInputPort {
	constructor(
		private readonly userRepo: UserRepository,
		private readonly homeOutputPort?: HomeOutputPort,
		private readonly signInOutputPort?: SignInOutputPort,
		private readonly authService?: AuthService,
	) {}

	// 共通のエラーハンドリングヘルパー
	private presentError(message: string, err?: unknown) {
		// 開発時はスタックトレースをコンソールに出す
		if (err) console.error("UserInteractor error:", err);
		this.homeOutputPort?.presentMessage({ message: `Error: ${message}` });
	}

	async checkAd(request: CheckAdRequestDTO): Promise<void> {
		// 入力バリデーション
		if (!request?.username || !request?.password) {
			this.homeOutputPort?.presentMessage({
				message: "Invalid AD credentials",
			});
			return;
		}

		if (typeof this.userRepo.checkAd !== "function") {
			this.homeOutputPort?.presentMessage({
				message: "AD check not supported by repository",
			});
			return;
		}

		try {
			const ok = await this.userRepo.checkAd(
				request.username,
				request.password,
				request.domain,
				request.domainController,
			);

			const resp: AuthenticateUserResponseDTO = {
				allowed: ok,
				message: ok
					? "AD authentication succeeded"
					: "AD authentication failed",
			};

			this.signInOutputPort?.presentAdCheckResult(resp);
		} catch (err) {
			// リポジトリ呼び出しで失敗した場合、その原因を明確に伝える
			const msg = err instanceof Error ? err.message : String(err);
			this.presentError(`AD check failed: ${msg}`, err);
		}
	}

	async authenticate(request: AuthenticateUserRequestDTO): Promise<void> {
		if (!request?.userId) {
			this.homeOutputPort?.presentMessage({ message: "Invalid userId" });
			return;
		}

		// findById は失敗する可能性があるため個別にハンドリング
		let user: User | null;
		try {
			const id = new UserId(request.userId);
			user = await this.userRepo.findById(id);
		} catch (err) {
			this.presentError("Failed to lookup user", err);
			return;
		}

		if (!user) {
			const resp: AuthenticateUserResponseDTO = {
				allowed: false,
				message: "User not found",
			};
			this.signInOutputPort?.presentAdCheckResult(resp);
			return;
		}

		if (!this.authService) {
			this.homeOutputPort?.presentMessage({
				message: "Auth service not available",
			});
			return;
		}

		// 認証処理は外部サービスへの呼び出しなので個別に try-catch
		let result: AuthResult;
		try {
			result = await this.authService.authenticate(
				user,
				request.password,
				new Date(),
			);
		} catch (err) {
			this.presentError("Authentication service error", err);
			return;
		}

		// ユーザー状態の永続化は副作用なので失敗してもログを残して続行
		if (result.user) {
			try {
				await this.userRepo.save(result.user);
			} catch (err) {
				console.error("Failed to persist user after authentication:", err);
				this.homeOutputPort?.presentMessage({
					message: "Warning: failed to persist user state",
				});
			}
		}

		let resp: AuthenticateUserResponseDTO;
		if (result.status === "SUCCESS") {
			resp = { allowed: true, message: "Authenticated" };
		} else if (result.status === "LOCKED") {
			resp = { allowed: false, message: "Account locked" };
		} else {
			const reason = result.reason ? `: ${result.reason}` : "";
			resp = { allowed: false, message: `Authentication failed${reason}` };
		}

		this.signInOutputPort?.presentAdCheckResult(resp);
	}
}
