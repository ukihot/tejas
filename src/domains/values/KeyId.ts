export class KeyId {
	constructor(readonly value: string) {
		if (!value) throw new Error("KeyId cannot be empty");
	}
}
