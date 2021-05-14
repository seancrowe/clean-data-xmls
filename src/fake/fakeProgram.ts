import chalk from "chalk";
import { Command } from "commander";
import fs from "fs-extra";
import processDataXmls from "./fakeProcessDataXmls";

export default function (program: Command): void {
	program
		.command("fake []")
		.description("run setup commands for all envs")
		.requiredOption("-s --source <source>", "Source of data XMLs")
		.requiredOption("-o --output <output>", "Output location of fake files")
		.option("--skip-files", "Purposefully skip files", false)
		.action(async (options) => {
			const { source, output, skipFiles } = options;

			if (!fs.existsSync(source)) {
				console.log(chalk.red("Source does not exist"));
				return;
			}

			if (!fs.existsSync(output)) {
				console.log(chalk.red("Output does not exist"));
				return;
			}

			const skippedItems = await processDataXmls(source, output, skipFiles);

			fs.writeFileSync("./skipped.json", JSON.stringify(skippedItems));
		});
}
