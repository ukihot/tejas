import type { ValueObjectBase } from "../ValueObjectBase";

export class VaultId implements ValueObjectBase<string> {
	constructor(readonly value: string) {
		if (!value) throw new Error("VaultId cannot be empty");
	}

	valueOf(): string {
		return this.value;
	}

	toNumber(): number {
		return NaN;
	}

	equals(other: this | string): boolean {
		if (typeof other === "string") return this.value === other;
		return this.value === other.value;
	}
}
