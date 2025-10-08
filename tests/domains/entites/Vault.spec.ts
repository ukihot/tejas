import { describe, expect, it } from "vitest";
import { Vault } from "../../../src/domains/entites/Vault";
import { BackupMetadata } from "../../../src/domains/values/BackupMetadata";
import { VaultId } from "../../../src/domains/values/VaultId";
import { VaultStatus } from "../../../src/domains/values/VaultStatus";

describe("Vault entity", () => {
	const id = new VaultId("v1");
	const meta = new BackupMetadata("/path", new Date(0), 1);
	const v = new Vault(id, VaultStatus.Active(), [meta]);

	it("getStatus and withStatus", () => {
		expect(v.getStatus()).toBeInstanceOf(VaultStatus);
		const w = v.withStatus(VaultStatus.Maintenance());
		expect(w.getStatus()).toBeInstanceOf(VaultStatus);
	});

	it("addBackup and getBackups", () => {
		const added = v.addBackup(new BackupMetadata("/x", new Date(1), 2));
		expect(added.getBackups().length).toBe(2);
		expect(v.getBackups().length).toBe(1);
	});
});
