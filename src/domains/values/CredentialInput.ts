export type CredentialInput = {
	targetDbPath: string; // transient: 操作中だけ使う
	plainPassword: string; // transient: 絶対に永続化しない
	presentedAt: Date;
	remoteIp?: string;
};
