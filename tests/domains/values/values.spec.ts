import { describe, expect, it } from "vitest";
import { AccessEvent } from "../../../src/domains/values/AccessEvent";
import { AuditLogId } from "../../../src/domains/values/AuditLogId";
import { BackupMetadata } from "../../../src/domains/values/BackupMetadata";
import { FailedCount } from "../../../src/domains/values/FailedCount";
import { KeyId } from "../../../src/domains/values/KeyId";
import { KeyType } from "../../../src/domains/values/KeyType";
import { LastLogin } from "../../../src/domains/values/LastLogin";
import { LockPeriod } from "../../../src/domains/values/LockPeriod";
import { PasswordHash } from "../../../src/domains/values/PasswordHash";
import { Role } from "../../../src/domains/values/Role";
import { SecretId } from "../../../src/domains/values/SecretId";
import { SecretStatus } from "../../../src/domains/values/SecretStatus";
import { SecretType } from "../../../src/domains/values/SecretType";
import { SecretValue } from "../../../src/domains/values/SecretValue";
import { UserId } from "../../../src/domains/values/UserId";
import { VaultId } from "../../../src/domains/values/VaultId";
import { VaultStatus } from "../../../src/domains/values/VaultStatus";

describe("Value objects", () => {
	describe("FailedCount", () => {
		it("rejects negative values and supports increment/zero", () => {
			expect(() => new FailedCount(-1)).toThrow();
			const z = FailedCount.zero();
			expect(z.valueOf()).toBe(0);
			const inc = z.increment();
			expect(inc.valueOf()).toBe(1);
		});

		it("supports arithmetic and equals", () => {
			const a = new FailedCount(2);
			expect(a.toNumber()).toBe(2);
			const b = a.add(3);
			expect(b.toNumber()).toBe(5);
			const c = b.subtract(new FailedCount(1));
			expect(c.toNumber()).toBe(4);
			expect(a.equals(2)).toBe(true);
			expect(a.equals(new FailedCount(2))).toBe(true);
		});
	});

	describe("Identifiers (UserId/KeyId/SecretId/VaultId/AuditLogId)", () => {
		it("UserId validates pattern and equals", () => {
			expect(() => new UserId("inv@lid")).toThrow();
			const u = new UserId("alice_01");
			expect(u.valueOf()).toBe("alice_01");
			expect(Number.isNaN(u.toNumber())).toBe(true);
			expect(u.equals("alice_01")).toBe(true);
		});

		it("KeyId/SecretId/VaultId/AuditLogId basic checks", () => {
			expect(() => new KeyId("")).toThrow();
			expect(new KeyId("k1").valueOf()).toBe("k1");
			expect(new SecretId("s1").valueOf()).toBe("s1");
			expect(new VaultId("v1").valueOf()).toBe("v1");
			expect(new AuditLogId("a1").valueOf()).toBe("a1");
		});
	});

	describe("Role", () => {
		it("requires a name and compares equals", () => {
			expect(() => new Role("")).toThrow();
			const r = new Role("admin");
			expect(r.valueOf()).toBe("admin");
			expect(r.equals("admin")).toBe(true);
		});
	});

	describe("PasswordHash", () => {
		it("validates format", () => {
			expect(() => new PasswordHash("plain")).toThrow();
			expect(() => new PasswordHash("$argon2id$...")).not.toThrow();
		});
	});

	describe("Temporal and period values", () => {
		it("LastLogin exposes value", () => {
			const d = new Date();
			const l = new LastLogin(d);
			expect(l.value).toBe(d);
		});

		it("LockPeriod validates and isActive", () => {
			const until = new Date(Date.now() + 1000 * 60);
			const p = new LockPeriod(until);
			expect(p.value).toBe(until);
			expect(p.isActive(new Date())).toBe(true);
			expect(() => new LockPeriod("bad" as unknown as Date)).toThrow();
		});
	});

	describe("KeyType/SecretType", () => {
		it("constructs types", () => {
			expect(new KeyType("AES").value).toBe("AES");
			expect(new SecretType("PASSWORD").value).toBe("PASSWORD");
		});
	});

	describe("VaultStatus/SecretStatus", () => {
		it("VaultStatus factories produce objects", () => {
			expect(VaultStatus.Active()).toBeDefined();
			expect(VaultStatus.Maintenance()).toBeDefined();
			expect(VaultStatus.Locked()).toBeDefined();
		});

		it("SecretStatus isActive works", () => {
			expect(SecretStatus.Active().isActive()).toBe(true);
			expect(SecretStatus.Rotated().isActive()).toBe(false);
			expect(SecretStatus.Revoked().isActive()).toBe(false);
		});
	});

	describe("SecretValue", () => {
		it("requires encrypted/iv/pepperId", () => {
			expect(() => new SecretValue("", "iv", "p")).toThrow();
			expect(() => new SecretValue("enc", "", "p")).toThrow();
			expect(() => new SecretValue("enc", "iv", "")).toThrow();
			const s = new SecretValue("enc", "iv", "p");
			expect(s.encrypted).toBe("enc");
		});
	});

	describe("AccessEvent and BackupMetadata", () => {
		it("AccessEvent validates timestamp and sourceIp", () => {
			expect(
				() =>
					new AccessEvent("LOGIN", "not-a-date" as unknown as Date, "1.2.3.4"),
			).toThrow();
			const ev = new AccessEvent("LOGIN", new Date(), "1.2.3.4");
			expect(ev.type).toBe("LOGIN");
		});

		it("BackupMetadata validates args", () => {
			expect(() => new BackupMetadata("", new Date(), 1)).toThrow();
			expect(
				() => new BackupMetadata("p", "no-date" as unknown as Date, 1),
			).toThrow();
			expect(() => new BackupMetadata("p", new Date(), -1)).toThrow();
			const b = new BackupMetadata("/b", new Date(), 0);
			expect(b.path).toBe("/b");
		});
	});
});
