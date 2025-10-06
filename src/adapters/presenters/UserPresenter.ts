import type { UserOutputPort } from "../../applications/OutputPorts";
import type {
	AuthenticateUserResponseDTO,
	MessageResponse,
} from "../../applications/ResponseDTOs";

type SetMessageFn = (msg: string) => void;
type SetAuthFn = (auth: boolean) => void;

export class UserPresenter implements UserOutputPort {
	constructor(
		private setDbMsg: SetMessageFn,
		private setMigrationMsg: SetMessageFn,
		private setAdCheckMsg: SetMessageFn,
		private setAuthenticated: SetAuthFn,
	) {}

	presentAdCheckResult(resp: AuthenticateUserResponseDTO): void {
		const { allowed, message } = resp;

		// メッセージ反映
		this.setAdCheckMsg(message);

		// 認証状態更新
		this.setAuthenticated(allowed);
	}

	presentMessage(resp: MessageResponse) {
		const msg = resp.message;
		if (msg.includes("database") || msg.includes("Path")) this.setDbMsg(msg);
		else this.setMigrationMsg(msg);
	}
}
