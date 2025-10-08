import type { EntityBase } from "../EntityBase";
import type { BackupMetadata } from "../values/BackupMetadata";
import type { VaultId } from "../values/VaultId";
import type { VaultStatus } from "../values/VaultStatus";

export class Vault implements EntityBase<VaultId> {
	constructor(
		readonly id: VaultId,
		private readonly status: VaultStatus,
		private readonly backups: BackupMetadata[],
	) {}

	getStatus(): VaultStatus {
		return this.status;
	}

	withStatus(newStatus: VaultStatus): Vault {
		return new Vault(this.id, newStatus, this.backups);
	}

	addBackup(metadata: BackupMetadata): Vault {
		return new Vault(this.id, this.status, [...this.backups, metadata]);
	}

	getBackups(): BackupMetadata[] {
		return [...this.backups];
	}

	equals(other: Vault): boolean {
		return this.id.equals(other.id);
	}
}
