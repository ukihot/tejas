import type { Secret } from "../entites/Secret";
import type { SecretId } from "../values/SecretId";
import type { VaultId } from "../values/VaultId";

export interface SecretRepository {
	findById(id: SecretId): Promise<Secret | null>;
	save(secret: Secret, vaultId?: VaultId): Promise<void>;
	delete(secret: Secret): Promise<void>;
	findByOwner(ownerId: string): Promise<Secret[]>;
}
