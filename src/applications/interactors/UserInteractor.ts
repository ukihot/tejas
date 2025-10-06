import type { UserRepository } from "../../domains/repositories/UserRepository";
import type { AuthService } from "../../domains/services/AuthService";
import { UserId } from "../../domains/values/UserId";
import type { UserInputPort } from "../InputPorts";
import type { UserOutputPort } from "../OutputPorts";
import type {
	AuthenticateUserRequestDTO,
	CheckAdRequestDTO,
} from "../RequestDTOs";
import type { AuthenticateUserResponseDTO } from "../ResponseDTOs";

export class UserInteractor implements UserInputPort {
	constructor(
		private readonly userRepo: UserRepository,
		private readonly outputPort: UserOutputPort,
		private readonly authService?: AuthService,
	) {}

	async checkAd(request: CheckAdRequestDTO): Promise<void> {
		try {
			// If the repository provides an AD check implementation, call it.
			if (typeof this.userRepo.checkAd !== "function") {
				this.outputPort.presentMessage({
					message: "AD check not supported by repository",
				});
				return;
			}

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

			this.outputPort.presentAdCheckResult(resp);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			this.outputPort.presentMessage({ message: `Error: ${msg}` });
		}
	}

	async authenticate(request: AuthenticateUserRequestDTO): Promise<void> {
		try {
			const id = new UserId(request.userId);
			const user = await this.userRepo.findById(id);

			if (!user) {
				const resp: AuthenticateUserResponseDTO = {
					allowed: false,
					message: "User not found",
				};
				this.outputPort.presentAdCheckResult(resp);
				return;
			}

			if (!this.authService) {
				this.outputPort.presentMessage({
					message: "Auth service not available",
				});
				return;
			}

			const now = new Date();
			const result = await this.authService.authenticate(
				user,
				request.password,
				now,
			);

			// Persist updated user state (failed counts, lock, lastLogin)
			if (result.user) {
				await this.userRepo.save(result.user);
			}

			let resp: AuthenticateUserResponseDTO;
			if (result.status === "SUCCESS") {
				resp = { allowed: true, message: "Authenticated" };
			} else if (result.status === "LOCKED") {
				resp = { allowed: false, message: "Account locked" };
			} else {
				// FAILED
				const reason = result.reason ? `: ${result.reason}` : "";
				resp = { allowed: false, message: `Authentication failed${reason}` };
			}

			this.outputPort.presentAdCheckResult(resp);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			this.outputPort.presentMessage({ message: `Error: ${msg}` });
		}
	}
}
