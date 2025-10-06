export class FailedCount {
	constructor(readonly value: number) {
		if (value < 0) throw new Error("FailedCount cannot be negative");
	}

	static zero(): FailedCount {
		return new FailedCount(0);
	}

	increment(): FailedCount {
		return new FailedCount(this.value + 1);
	}
}
