export interface EntityBase<ID, E = EntityBase<ID, unknown>> {
	readonly id: ID;
	equals(other: E): boolean;
}
