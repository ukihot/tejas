import type { Vault } from "../entites/Vault";
import type { VaultId } from "../values/VaultId";

export interface VaultRepository {
	findById(id: VaultId): Promise<Vault | null>;
	save(vault: Vault): Promise<void>;
	lockVault(vault: Vault): Promise<void>;
	unlockVault(vault: Vault): Promise<void>;
}
