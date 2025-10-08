import { describe, expect, it } from "vitest";
import { User } from "../../../src/domains/entites/User";
import { FailedCount } from "../../../src/domains/values/FailedCount";
import { LastLogin } from "../../../src/domains/values/LastLogin";
import type { Role } from "../../../src/domains/values/Role";
import { UserId } from "../../../src/domains/values/UserId";

describe("User entity", () => {
	const base = new User(
		new UserId("bob"),
		[] as Role[],
		null,
		new FailedCount(0),
		null,
		null,
	);

	it("incrementFailed returns a new user with increased failed count", () => {
		const u = base.incrementFailed();
		expect(u.getFailedCount().value).toBe(1);
		expect(base.getFailedCount().value).toBe(0);
	});

	it("resetFailures sets failed count to zero and clears lock", () => {
		const u = base.incrementFailed().lockUntil(new Date(Date.now() + 1000));
		const r = u.resetFailures();
		expect(r.getFailedCount().value).toBe(0);
		expect(r.getLockedUntil()).toBeNull();
	});

	it("withLastLogin sets last login and resets failures", () => {
		const at = new Date();
		const u = base.incrementFailed();
		const r = u.withLastLogin(at);
		expect(r.getFailedCount().value).toBe(0);
		expect(r.getLastLogin()).toBeInstanceOf(LastLogin);
		expect(r.getLastLogin()?.value.getTime()).toBe(at.getTime());
	});

	it("isLocked returns true when lockedUntil is active", () => {
		const now = new Date();
		const u = base.lockUntil(new Date(now.getTime() + 1000));
		expect(u.isLocked(now)).toBeTruthy();
	});
});
