import type { AuditLog } from "../entites/AuditLog";
import type { AuditLogRepository } from "../repositories/AuditLogRepository";
import type { AccessEvent } from "../values/AccessEvent";

export class AuditLoggingService {
	constructor(private readonly auditRepo: AuditLogRepository) {}

	/**
	 * アクセスイベント追加
	 */
	async record(log: AuditLog, event: AccessEvent): Promise<AuditLog> {
		const updated = log.addEvent(event);
		await this.auditRepo.save(updated);
		return updated;
	}
}
