import type { User } from "../entites/User";
import type { PasswordHash } from "../values/PasswordHash";

export class AuthService {
	private readonly MAX_FAILED = 5;
	private readonly LOCK_DURATION_MS = 30 * 60 * 1000;

	constructor(
		private readonly passwordComparer: (
			raw: string,
			hash: PasswordHash,
		) => Promise<boolean>,
	) {}

	async authenticate(user: User, password: string, now: Date) {
		if (user.isLocked(now)) return { status: "LOCKED", user };

		const hash = user.getPasswordHash();
		if (!hash) return { status: "FAILED", user, reason: "Password not set" };

		const matched = await this.passwordComparer(password, hash);
		if (matched)
			return {
				status: "SUCCESS",
				user: user.resetFailures().withLastLogin(now),
			};

		let updated = user.incrementFailed();
		if (updated.getFailedCount().value >= this.MAX_FAILED) {
			updated = updated.lockUntil(
				new Date(now.getTime() + this.LOCK_DURATION_MS),
			);
			return { status: "LOCKED", user: updated };
		}

		return { status: "FAILED", user: updated };
	}
}
