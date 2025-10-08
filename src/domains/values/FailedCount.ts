import type { ValueObjectBase } from "../ValueObjectBase";

export class FailedCount implements ValueObjectBase<number> {
	constructor(readonly value: number) {
		if (value < 0) throw new Error("FailedCount cannot be negative");
	}

	static zero(): FailedCount {
		return new FailedCount(0);
	}

	increment(): FailedCount {
		return new FailedCount(this.value + 1);
	}

	// ValueObjectBase
	valueOf(): number {
		return this.value;
	}

	toNumber(): number {
		return this.value;
	}

	equals(other: this | number): boolean {
		if (typeof other === "number") return this.value === other;
		return this.value === other.value;
	}

	add(other: this | number): this {
		const amount = typeof other === "number" ? other : other.value;
		return new FailedCount(this.value + amount) as this;
	}

	subtract(other: this | number): this {
		const amount = typeof other === "number" ? other : other.value;
		return new FailedCount(this.value - amount) as this;
	}
}
