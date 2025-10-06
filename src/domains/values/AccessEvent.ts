export class AccessEvent {
	constructor(
		readonly type: "LOGIN" | "LOGOUT" | "SECRET_ACCESS" | "VAULT_ACCESS",
		readonly timestamp: Date,
		readonly sourceIp: string,
	) {
		if (!(timestamp instanceof Date)) throw new Error("Invalid timestamp");
		if (!sourceIp) throw new Error("sourceIp required");
	}
}
