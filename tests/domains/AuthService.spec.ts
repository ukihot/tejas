import { describe, expect, it } from "vitest";
import { User } from "../../src/domains/entites/User";
import { AuthService } from "../../src/domains/services/AuthService";
import { FailedCount } from "../../src/domains/values/FailedCount";
import { LastLogin } from "../../src/domains/values/LastLogin";
import { LockPeriod } from "../../src/domains/values/LockPeriod";
import { PasswordHash } from "../../src/domains/values/PasswordHash";
import type { Role } from "../../src/domains/values/Role";
import { UserId } from "../../src/domains/values/UserId";

describe("AuthService", () => {
	const makeUser = (
		hash: PasswordHash | null,
		failed = 0,
		lockedUntil: Date | null = null,
	) =>
		new User(
			new UserId("alice"),
			[] as Role[],
			hash,
			new FailedCount(failed),
			lockedUntil ? new LockPeriod(lockedUntil) : null,
			null,
		);

	it("succeeds when password matches and resets failures and sets last login", async () => {
		const fakeComparer = async (raw: string) => raw === "correct";
		const svc = new AuthService(fakeComparer);
		const now = new Date();
		const user = makeUser(new PasswordHash("$argon2...hash"), 2);

		const res = await svc.authenticate(user, "correct", now);

		expect(res.status).toBe("SUCCESS");
		expect(res.user).toBeDefined();
		expect(res.user?.getFailedCount().value).toBe(0);
		expect(res.user?.getLastLogin()).toBeInstanceOf(LastLogin);
	});

	it("fails when password not set", async () => {
		const svc = new AuthService(async () => false);
		const user = makeUser(null);
		const res = await svc.authenticate(user, "whatever", new Date());
		expect(res.status).toBe("FAILED");
		// Narrow to an inline shaped type so we don't use `any`
		const failed = res as { status: string; user: User; reason?: string };
		expect(failed.reason).toBe("Password not set");
	});

	it("increments failures and locks when threshold reached", async () => {
		const svc = new AuthService(async () => false);
		const now = new Date();
		const user = makeUser(new PasswordHash("$argon2...hash"), 4);
		const res = await svc.authenticate(user, "wrong", now);
		expect(res.status).toBe("LOCKED");
		expect(res.user).toBeDefined();
		const locked = res.user?.getLockedUntil();
		expect(locked).not.toBeNull();
		expect(locked?.isActive(now)).toBeTruthy();
	});
});
