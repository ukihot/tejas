import type { ValueObjectBase } from "../ValueObjectBase";

export class Role implements ValueObjectBase<string> {
	constructor(readonly name: string) {
		if (!name) throw new Error("Role name cannot be empty");
	}

	// 互換性のためのエイリアス
	get value(): string {
		return this.name;
	}

	valueOf(): string {
		return this.name;
	}

	toNumber(): number {
		return NaN;
	}

	equals(other: this | string): boolean {
		if (typeof other === "string") return this.name === other;
		return this.name === other.name;
	}
}
