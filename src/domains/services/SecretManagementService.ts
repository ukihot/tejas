import type { Secret } from "../entites/Secret";
import type { Vault } from "../entites/Vault";
import type { SecretRepository } from "../repositories/SecretRepository";
import type { SecretValue } from "../values/SecretValue";

export class SecretManagementService {
	constructor(private readonly secretRepo: SecretRepository) {}

	/**
	 * 新規Secretを作成して保存
	 */
	async create(secret: Secret, vault: Vault): Promise<void> {
		// 永続化はRepositoryに委譲
		await this.secretRepo.save(secret, vault.id);
	}

	/**
	 * Secretのローテーション
	 */
	async rotate(secret: Secret, newValue: SecretValue): Promise<Secret> {
		const rotated = secret.withRotatedValue(newValue);
		await this.secretRepo.save(rotated);
		return rotated;
	}

	/**
	 * Secretの廃止
	 */
	async revoke(secret: Secret): Promise<Secret> {
		const revoked = secret.revoke();
		await this.secretRepo.save(revoked);
		return revoked;
	}
}
