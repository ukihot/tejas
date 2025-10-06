export class VaultStatus {
	private constructor(readonly value: "ACTIVE" | "MAINTENANCE" | "LOCKED") {}
	static Active() {
		return new VaultStatus("ACTIVE");
	}
	static Maintenance() {
		return new VaultStatus("MAINTENANCE");
	}
	static Locked() {
		return new VaultStatus("LOCKED");
	}
}
