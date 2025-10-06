export class SecretStatus {
	private constructor(readonly value: "ACTIVE" | "ROTATED" | "REVOKED") {}
	static Active() {
		return new SecretStatus("ACTIVE");
	}
	static Rotated() {
		return new SecretStatus("ROTATED");
	}
	static Revoked() {
		return new SecretStatus("REVOKED");
	}
	isActive(): boolean {
		return this.value === "ACTIVE";
	}
}
