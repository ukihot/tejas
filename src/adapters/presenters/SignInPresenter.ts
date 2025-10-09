import type { SignInOutputPort } from "../../applications/OutputPorts";
import type { AuthenticateUserResponseDTO } from "../../applications/ResponseDTOs";

type SetMessageFn = (msg: string) => void;
type SetAuthFn = (auth: boolean) => void;

export class SignInPresenter implements SignInOutputPort {
	constructor(
		private setAdCheckMsg: SetMessageFn,
		private setAuthenticated: SetAuthFn,
	) {}

	presentAdCheckResult(resp: AuthenticateUserResponseDTO): void {
		const { allowed, message } = resp;
		this.setAdCheckMsg(message);
		this.setAuthenticated(allowed);
	}
}
