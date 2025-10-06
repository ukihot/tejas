import { Secret } from "../entites/Secret";
import type { Vault } from "../entites/Vault";
import type { SecretRepository } from "../repositories/SecretRepository";
import { SecretId } from "../values/SecretId";
import { SecretStatus } from "../values/SecretStatus";
import { SecretType } from "../values/SecretType";
import { SecretValue } from "../values/SecretValue";
import type { UserId } from "../values/UserId";

export class DynamicSecretService {
	constructor(private readonly secretRepo: SecretRepository) {}

	/**
	 * 短期特権Secret発行
	 */
	async issueTemporarySecret(
		ownerId: UserId,
		type: SecretType["value"],
		vault: Vault,
	): Promise<Secret> {
		// 暗号化/生成はInfrastructureで実装、ここではVOとして受け取る
		const tempValue = new SecretValue("encryptedData", "iv", "pepperId");
		const secret = new Secret(
			new SecretId("generatedId"),
			new SecretType(type),
			tempValue,
			ownerId,
			SecretStatus.Active(),
		);

		await this.secretRepo.save(secret, vault.id);
		return secret;
	}
}
