import type { IDatabaseRepository } from "../repositories/IDatabaseRepository";

export class LoginService {
	constructor(private repo: IDatabaseRepository) {}

	async checkAd(
		username: string,
		password: string,
		domain: string,
		dc: string,
	): Promise<boolean> {
		// ここで必要なビジネスルールを集約
		// 例: グループ所属チェックやローカルDB更新のロジックなど
		return await this.repo.checkAd(username, password, domain, dc);
	}
}
