import { describe, expect, it } from "vitest";
import { Secret } from "../../src/domains/entites/Secret";
import { SecretId } from "../../src/domains/values/SecretId";
import { SecretStatus } from "../../src/domains/values/SecretStatus";
import { SecretType } from "../../src/domains/values/SecretType";
import { SecretValue } from "../../src/domains/values/SecretValue";
import { UserId } from "../../src/domains/values/UserId";

describe("Secret entity", () => {
	const id = new SecretId("s1");
	const val = new SecretValue("enc-v", "iv-v", "pepper-1");
	const owner = new UserId("owner");
	const s = new Secret(
		id,
		new SecretType("PASSWORD"),
		val,
		owner,
		SecretStatus.Active(),
	);

	it("isActive reflects status", () => {
		expect(s.isActive()).toBeTruthy();
	});

	it("withRotatedValue returns rotated secret with new value", () => {
		const r = s.withRotatedValue(
			new SecretValue("enc-new", "iv-new", "pepper-2"),
		);
		expect(r.getValue().encrypted).toBe("enc-new");
		expect(r.getStatus().isActive()).toBeFalsy();
	});

	it("revoke sets status to revoked", () => {
		const r = s.revoke();
		expect(r.getStatus().isActive()).toBeFalsy();
	});
});
