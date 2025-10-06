import type { Vault } from "../entites/Vault";
import type { VaultRepository } from "../repositories/VaultRepository";
import type { BackupMetadata } from "../values/BackupMetadata";

export class VaultOperationService {
	constructor(private readonly vaultRepo: VaultRepository) {}

	/**
	 * バックアップ追加
	 */
	async addBackup(vault: Vault, backup: BackupMetadata): Promise<Vault> {
		const updated = vault.addBackup(backup);
		await this.vaultRepo.save(updated);
		return updated;
	}

	/**
	 * Vault状態変更
	 */
	async updateStatus(
		vault: Vault,
		status: (typeof Vault.prototype)["status"],
	): Promise<Vault> {
		const updated = vault.withStatus(status);
		await this.vaultRepo.save(updated);
		return updated;
	}
}
