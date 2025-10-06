export class AuditLogId {
	constructor(readonly value: string) {
		if (!value) throw new Error("AuditLogId cannot be empty");
	}
}
