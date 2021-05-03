import { Command } from "commander";
import fs from "fs-extra";
import chalk from "chalk";
import processDataXmls from "./cleanProcessDataXmls";

export default function (program: Command): void {
	program
		.command("clean []")
		.description(
			"Searches through all data XMLs, lookup the resource file, and removes the entry if it does not exist"
		)
		.requiredOption("-s --source <source>", "Source of data XMLs")
		.option(
			"-r --resource-directory <resource>",
			"Source of the resource files for the data XMLs - defaults to --source value"
		)
		.option(
			"-o --output <output>",
			"Output directory of the data XMLs after being modified - defaults to --source value"
		)
		.option(
			"-p --process-amount <number>",
			"Number of data XMLs to process at the same time - defaults to 10",
			"10"
		)
		.action(async (options) => {
			const { source, resourceDirectory, output, processAmount } = ((
				options
			) => {
				const { source, resourceDirectory, output, processAmount } = options;

				const amount = parseInt(processAmount);

				return {
					source: source,
					resourceDirectory:
						resourceDirectory == null ? source : resourceDirectory,
					output: output == null ? source : output,
					processAmount: isNaN(amount) ? 10 : amount,
				};
			})(options);

			if (!fs.existsSync(source)) {
				console.log(chalk.red("Source does not exist"));
				return;
			}

			if (!fs.existsSync(resourceDirectory)) {
				console.log(chalk.red("Files Directory does not exist"));
				return;
			}

			if (!fs.existsSync(output)) {
				console.log(chalk.red("Output does not exist"));
				return;
			}

			const notFoundDocuments = await processDataXmls(
				source,
				resourceDirectory,
				output,
				processAmount
			);

			fs.writeFileSync(
				"./documentsNotFound.json",
				JSON.stringify(notFoundDocuments)
			);
		});
}
