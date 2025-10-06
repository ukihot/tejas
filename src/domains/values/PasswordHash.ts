export class PasswordHash {
	constructor(readonly value: string) {
		if (!value.startsWith("$argon2"))
			// or any hash scheme prefix
			throw new Error("Invalid password hash format");
	}
}
