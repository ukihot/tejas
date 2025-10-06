export class LastLogin {
	constructor(readonly at: Date) {
		if (!(at instanceof Date)) throw new Error("Invalid Date for LastLogin");
	}

	// 互換性のためのエイリアス (.value を期待する呼び出しに対応)
	get value(): Date {
		return this.at;
	}
}
