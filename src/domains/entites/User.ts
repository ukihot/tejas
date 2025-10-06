import { FailedCount } from "../values/FailedCount";
import { LastLogin } from "../values/LastLogin";
import { LockPeriod } from "../values/LockPeriod";
import type { PasswordHash } from "../values/PasswordHash";
import type { Role } from "../values/Role";
import type { UserId } from "../values/UserId";

export class User {
	constructor(
		readonly id: UserId,
		readonly roles: Role[],
		private readonly passwordHash: PasswordHash | null,
		private readonly failedCount: FailedCount,
		private readonly lockedUntil: LockPeriod | null,
		private readonly lastLogin: LastLogin | null,
	) {}

	// -------------------------
	// ドメインクエリ
	// -------------------------
	isLocked(now: Date): boolean | undefined {
		return this.lockedUntil?.isActive(now);
	}

	getFailedCount(): FailedCount {
		return this.failedCount;
	}

	getPasswordHash(): PasswordHash | null {
		return this.passwordHash ?? null;
	}

	getLockedUntil(): LockPeriod | null {
		return this.lockedUntil;
	}

	getLastLogin(): LastLogin | null {
		return this.lastLogin;
	}

	// -------------------------
	// ドメイン操作（不変オブジェクト再構築）
	// -------------------------
	incrementFailed(): User {
		return new User(
			this.id,
			this.roles,
			this.passwordHash,
			this.failedCount.increment(),
			this.lockedUntil,
			this.lastLogin,
		);
	}

	resetFailures(): User {
		return new User(
			this.id,
			this.roles,
			this.passwordHash,
			FailedCount.zero(),
			null,
			this.lastLogin,
		);
	}

	lockUntil(until: Date): User {
		return new User(
			this.id,
			this.roles,
			this.passwordHash,
			this.failedCount,
			new LockPeriod(until),
			this.lastLogin,
		);
	}

	withLastLogin(at: Date): User {
		return new User(
			this.id,
			this.roles,
			this.passwordHash,
			FailedCount.zero(),
			null,
			new LastLogin(at),
		);
	}
}
