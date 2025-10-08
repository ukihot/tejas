import { describe, expect, it } from "vitest";
import { FailedCount } from "../../../src/domains/values/FailedCount";

describe("FailedCount", () => {
	it("cannot be negative and supports zero/increment", () => {
		expect(() => new FailedCount(-1)).toThrow();
		const z = FailedCount.zero();
		expect(z.value).toBe(0);
		const i = z.increment();
		expect(i.value).toBe(1);
	});
});
