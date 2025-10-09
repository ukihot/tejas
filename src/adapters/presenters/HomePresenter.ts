import type { HomeOutputPort } from "../../applications/OutputPorts";
import type { MessageResponse } from "../../applications/ResponseDTOs";

type SetMessageFn = (msg: string) => void;

export class HomePresenter implements HomeOutputPort {
	constructor(
		private setDbMsg: SetMessageFn,
		private setMigrationMsg: SetMessageFn,
	) {}

	presentMessage(resp: MessageResponse) {
		const msg = resp.message;
		if (msg.includes("database") || msg.includes("Path")) this.setDbMsg(msg);
		else this.setMigrationMsg(msg);
	}
}
