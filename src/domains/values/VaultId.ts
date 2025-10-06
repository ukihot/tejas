export class VaultId {
	constructor(readonly value: string) {
		if (!value) throw new Error("VaultId cannot be empty");
	}
}
