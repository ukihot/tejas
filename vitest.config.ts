import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		include: ["tests/**/*.spec.ts"],
		coverage: {
			provider: "v8",
			all: true,
			include: ["src/**"],
			reportsDirectory: "coverage",
		},
	},
});
