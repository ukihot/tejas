import type { KeyId } from "../values/KeyId";
import type { UserId } from "../values/UserId";

export class EncryptionKey {
	constructor(
		readonly id: KeyId,
		readonly type: KeyType,
		readonly ownerId: UserId,
		private readonly createdAt: Date,
		private readonly rotatedAt: Date | null,
		private readonly revokedAt: Date | null,
	) {}

	isActive(): boolean {
		return this.revokedAt === null;
	}

	withRotated(at: Date): EncryptionKey {
		return new EncryptionKey(
			this.id,
			this.type,
			this.ownerId,
			this.createdAt,
			at,
			this.revokedAt,
		);
	}

	revoke(at: Date): EncryptionKey {
		return new EncryptionKey(
			this.id,
			this.type,
			this.ownerId,
			this.createdAt,
			this.rotatedAt,
			at,
		);
	}
}
