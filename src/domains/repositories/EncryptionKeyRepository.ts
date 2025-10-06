import type { EncryptionKey } from "../entites/EncryptionKey";
import type { KeyId } from "../values/KeyId";

export interface EncryptionKeyRepository {
	findById(id: KeyId): Promise<EncryptionKey | null>;
	save(key: EncryptionKey): Promise<void>;
	rotateKey(key: EncryptionKey, rotatedAt: Date): Promise<void>;
	revokeKey(key: EncryptionKey, revokedAt: Date): Promise<void>;
}
