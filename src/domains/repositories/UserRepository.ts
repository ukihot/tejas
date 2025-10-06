import type { User } from "../entites/User";
import type { UserId } from "../values/UserId";

/**
 * User集約の永続化を担うリポジトリ
 * - 認証結果の反映（失敗回数・ロック・最終ログイン）を含む
 * - AD/LDAP同期 or ファイルDB or RDBなどの実装はインフラ層で行う
 */
export interface UserRepository {
	/**
	 * UserIDによる検索
	 * - 存在しない場合はnullを返す
	 * - 永続層で暗号化やHSM経由復号を行ってもよい
	 */
	findById(id: UserId): Promise<User | null>;

	/**
	 * Userの保存（新規または更新）
	 * - 認証失敗回数やロック状態更新に利用
	 * - 冪等性を保証すべき
	 */
	save(user: User): Promise<void>;

	/**
	 * AD/LDAPによる認証チェック（任意実装）
	 * - オンプレ環境やディレクトリサービスで直接認証を試す実装向け
	 */
	checkAd?: (
		username: string,
		password: string,
		domain: string,
		domainController: string,
	) => Promise<boolean>;

	/**
	 * AD/LDAPからの同期（任意実装）
	 * - オンプレ環境のディレクトリサービス連携用
	 */
	syncFromDirectory?(): Promise<void>;

	/**
	 * 特定ロールを持つユーザの列挙
	 * - RBAC／承認ワークフローでの利用を想定
	 */
	findByRole?(roleName: string): Promise<User[]>;
}
