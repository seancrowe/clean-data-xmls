import chalk from "chalk";

export default class DebugHandler {
	constructor(private debug: boolean) {}

	error(message: unknown): void {
		if (!this.debug) return;

		console.log(chalk.red("Error: " + new Date().toISOString()));
		console.log(message);
	}

	log(message: unknown): void {
		if (!this.debug) return;

		console.log(chalk.green("Log: " + new Date().toISOString()));
		console.log(message);
	}
}
