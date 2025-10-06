import { describe, expect, it } from "vitest";
import { PasswordHash } from "../../src/domains/values/PasswordHash";

describe("PasswordHash", () => {
	it("accepts valid hash format and rejects others", () => {
		expect(() => new PasswordHash("$argon2-something")).not.toThrow();
		expect(() => new PasswordHash("plain-text")).toThrow();
	});
});
