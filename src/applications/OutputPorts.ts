import type {
	AuthenticateUserResponseDTO,
	MessageResponse,
} from "./ResponseDTOs";

export interface UserOutputPort {
	presentMessage(resp: MessageResponse): void;

	presentAdCheckResult(resp: AuthenticateUserResponseDTO): void;
}
