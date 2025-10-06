export class BackupMetadata {
	constructor(
		readonly path: string,
		readonly timestamp: Date,
		readonly version: number,
	) {
		if (!path) throw new Error("Backup path cannot be empty");
		if (!(timestamp instanceof Date)) throw new Error("Invalid timestamp");
		if (version < 0) throw new Error("Invalid version");
	}
}
