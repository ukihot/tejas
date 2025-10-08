import type { EntityBase } from "../EntityBase";
import type { SecretId } from "../values/SecretId";
import { SecretStatus } from "../values/SecretStatus";
import type { SecretType } from "../values/SecretType";
import type { SecretValue } from "../values/SecretValue";
import type { UserId } from "../values/UserId";

export class Secret implements EntityBase<SecretId> {
	constructor(
		readonly id: SecretId,
		readonly type: SecretType,
		private readonly value: SecretValue,
		readonly ownerId: UserId,
		private readonly status: SecretStatus,
	) {}

	// -------------------------
	// ドメインクエリ
	// -------------------------
	getValue(): SecretValue {
		return this.value;
	}

	getStatus(): SecretStatus {
		return this.status;
	}

	isActive(): boolean {
		return this.status.isActive();
	}

	// -------------------------
	// ドメイン操作
	// -------------------------
	withRotatedValue(newValue: SecretValue): Secret {
		return new Secret(
			this.id,
			this.type,
			newValue,
			this.ownerId,
			SecretStatus.Rotated(),
		);
	}

	revoke(): Secret {
		return new Secret(
			this.id,
			this.type,
			this.value,
			this.ownerId,
			SecretStatus.Revoked(),
		);
	}

	equals(other: Secret): boolean {
		return this.id.equals(other.id);
	}
}
