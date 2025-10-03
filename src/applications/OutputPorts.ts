import type { CheckAdResponse, MessageResponse } from "./ResponseDTOs";

export interface OutputPort {
	presentMessage(resp: MessageResponse): void;

	presentAdCheckResult(resp: CheckAdResponse): void;
}
