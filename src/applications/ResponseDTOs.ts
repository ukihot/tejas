export interface MessageResponse {
	message: string;
}

export interface CheckAdResponse {
	allowed: boolean; // 審査結果
	message: string; // メッセージ添付
}
