export class Role {
	constructor(readonly name: string) {
		if (!name) throw new Error("Role name cannot be empty");
	}

	// 互換性のためのエイリアス (.value を期待する呼び出しに対応)
	get value(): string {
		return this.name;
	}

	equal(other: Role): boolean {
		return this.name === other.name;
	}
}
