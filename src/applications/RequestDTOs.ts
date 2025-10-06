/**
 * ユーザ認証リクエスト
 */
export type AuthenticateUserRequestDTO = {
	userId: string;
	password: string;
	displayName?: string;
};

export interface CheckAdRequestDTO {
	username: string;
	password: string;
	domain: string;
	domainController: string;
}
