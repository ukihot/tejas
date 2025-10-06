export type MessageResponse = {
	message: string;
};

export type AuthenticateUserResponseDTO = {
	allowed: boolean; // 審査結果
	message: string; // メッセージ添付
};
