import { invoke } from "@tauri-apps/api/core";
import { User } from "../../domains/entites/User";
import type { UserRepository } from "../../domains/repositories/UserRepository";
import { FailedCount } from "../../domains/values/FailedCount";
import { LastLogin } from "../../domains/values/LastLogin";
import { LockPeriod } from "../../domains/values/LockPeriod";
import type { PasswordHash } from "../../domains/values/PasswordHash";
import { Role } from "../../domains/values/Role";
import { UserId } from "../../domains/values/UserId";

export class UserDAO implements UserRepository {
	// ユーザ取得
	async findById(id: UserId): Promise<User | null> {
		try {
			type UserRow = {
				id: string;
				roles: string[];
				passwordHash?: string | null;
				failedCount: number;
				lockedUntil?: string | null;
				lastLogin?: string | null;
			} | null;
			const result = await invoke<UserRow>("get_user", { userId: id.value });
			if (!result) return null;

			return new User(
				new UserId(result.id),
				result.roles.map((r: string) => new Role(r)),
				result.passwordHash
					? ({ value: result.passwordHash } as PasswordHash)
					: null,
				new FailedCount(result.failedCount),
				result.lockedUntil
					? new LockPeriod(new Date(result.lockedUntil))
					: null,
				result.lastLogin ? new LastLogin(new Date(result.lastLogin)) : null,
			);
		} catch (err) {
			const errorMsg =
				err instanceof Error
					? err.message
					: typeof err === "string"
						? err
						: JSON.stringify(err);
			console.error(`[UserDAO] Error in findById: ${errorMsg}`);
			throw new Error(errorMsg);
		}
	}

	// ユーザ作成
	async createUser(
		username: string,
		passwordHash: string,
		roles: string[] = [],
	): Promise<string> {
		try {
			return await invoke<string>("create_user", {
				args: { username, passwordHash, roles },
			});
		} catch (err) {
			const errorMsg =
				err instanceof Error
					? err.message
					: typeof err === "string"
						? err
						: JSON.stringify(err);
			console.error(`[UserDAO] Error in createUser: ${errorMsg}`);
			throw new Error(errorMsg);
		}
	}

	// ユーザ更新（FailedCount, Lock, LastLogin など）
	async save(user: User): Promise<void> {
		try {
			await invoke<void>("update_user", {
				args: {
					id: user.id.value,
					passwordHash: user.getPasswordHash()?.value ?? null,
					failedCount: user.getFailedCount().value,
					lockedUntil: user.getLockedUntil()?.value ?? null,
					lastLogin: user.getLastLogin()?.value ?? null,
					roles: user.roles.map((r) => r.value),
				},
			});
		} catch (err) {
			const errorMsg =
				err instanceof Error
					? err.message
					: typeof err === "string"
						? err
						: JSON.stringify(err);
			console.error(`[UserDAO] Error in save: ${errorMsg}`);
			throw new Error(errorMsg);
		}
	}

	// AD接続チェック
	async checkAd(
		username: string,
		password: string,
		domain: string,
		domainController: string,
	): Promise<boolean> {
		try {
			return await invoke<boolean>("check_ad_user_group", {
				args: { username, password, domain, domainController },
			});
		} catch (err) {
			const errorMsg =
				err instanceof Error
					? err.message
					: typeof err === "string"
						? err
						: JSON.stringify(err);
			console.error(`[UserDAO] Error in checkAd: ${errorMsg}`);
			throw new Error(errorMsg);
		}
	}
}
