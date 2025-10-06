export class SecretValue {
	constructor(
		readonly encrypted: string,
		readonly iv: string,
		readonly pepperId: string,
	) {
		if (!encrypted || !iv || !pepperId)
			throw new Error("SecretValue incomplete");
	}
}
