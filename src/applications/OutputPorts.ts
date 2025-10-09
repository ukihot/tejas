import type {
	AuthenticateUserResponseDTO,
	MessageResponse,
} from "./ResponseDTOs";

// 出力ポートを画面ごとに分割する
export interface HomeOutputPort {
	// DBやマイグレーションなど汎用メッセージを表示する
	presentMessage(resp: MessageResponse): void;
}

export interface SignInOutputPort {
	// AD審査結果の表示・認証状態の反映など
	presentAdCheckResult(resp: AuthenticateUserResponseDTO): void;
}
