import type { ValueObjectBase } from "../ValueObjectBase";

export class UserId implements ValueObjectBase<string> {
	constructor(readonly value: string) {
		if (!value.match(/^[a-zA-Z0-9_-]+$/))
			throw new Error(`Invalid UserId format: ${value}`);
	}
	toString(): string {
		return this.value;
	}

	// ValueObjectBase
	valueOf(): string {
		return this.value;
	}

	toNumber(): number {
		// UserId は数値ではないがインターフェースにあるため最低限の実装
		return NaN;
	}

	equals(other: this | string): boolean {
		if (typeof other === "string") return this.value === other;
		return this.value === other.value;
	}
}
