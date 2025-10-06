import type { AuditLog } from "../entites/AuditLog";
import type { AuditLogId } from "../values/AuditLogId";

export interface AuditLogRepository {
	findById(id: AuditLogId): Promise<AuditLog | null>;
	save(log: AuditLog): Promise<void>;
	findByUserId(userId: string): Promise<AuditLog[]>;
}
