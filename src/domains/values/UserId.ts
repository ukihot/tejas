export class UserId {
	constructor(readonly value: string) {
		if (!value.match(/^[a-zA-Z0-9_-]+$/))
			throw new Error(`Invalid UserId format: ${value}`);
	}
	toString(): string {
		return this.value;
	}
}
