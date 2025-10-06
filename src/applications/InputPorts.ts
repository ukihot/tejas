import type {
	AuthenticateUserRequestDTO,
	CheckAdRequestDTO,
} from "./RequestDTOs";

export interface UserInputPort {
	/**
	 * ユーザ認証ユースケース
	 * @param request DTO形式で受け取る
	 */
	authenticate(request: AuthenticateUserRequestDTO): Promise<void>;

	/**
	 * AD接続チェックユースケース
	 * @param request DTO形式で受け取る
	 */
	checkAd(request: CheckAdRequestDTO): Promise<void>;
}
