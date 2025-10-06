export class LockPeriod {
	constructor(readonly until: Date) {
		if (!(until instanceof Date))
			throw new Error("Invalid Date for LockPeriod");
	}

	isActive(now: Date): boolean {
		return now < this.until;
	}

	// 互換性のためのエイリアス (.value を期待する呼び出しに対応)
	get value(): Date {
		return this.until;
	}
}
