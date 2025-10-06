export class SecretId {
	constructor(readonly value: string) {
		if (!value) throw new Error("SecretId cannot be empty");
	}
}
