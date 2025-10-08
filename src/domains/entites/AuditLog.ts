import type { EntityBase } from "../EntityBase";
import type { AccessEvent } from "../values/AccessEvent";
import type { AuditLogId } from "../values/AuditLogId";
import type { UserId } from "../values/UserId";

export class AuditLog implements EntityBase<AuditLogId> {
	constructor(
		readonly id: AuditLogId,
		readonly userId: UserId,
		private readonly events: AccessEvent[],
	) {}

	addEvent(event: AccessEvent): AuditLog {
		return new AuditLog(this.id, this.userId, [...this.events, event]);
	}

	getEvents(): AccessEvent[] {
		return [...this.events];
	}

	equals(other: AuditLog): boolean {
		return this.id.equals(other.id);
	}
}
