import type { UserInputPort } from "../../applications/InputPorts";
import type {
	AuthenticateUserRequestDTO,
	CheckAdRequestDTO,
} from "../../applications/RequestDTOs";

export class UserController {
	constructor(private readonly userInput: UserInputPort) {}

	/**
	 * ユーザ認証
	 */
	async authenticateUser(userId: string, password: string) {
		const request: AuthenticateUserRequestDTO = { userId, password };
		return await this.userInput.authenticate(request);
	}

	/**
	 * ADチェック
	 */
	async checkAd(
		username: string,
		password: string,
		domain: string,
		domainController: string,
	) {
		const request: CheckAdRequestDTO = {
			username,
			password,
			domain,
			domainController,
		};

		return await this.userInput.checkAd?.(request);
	}
}
