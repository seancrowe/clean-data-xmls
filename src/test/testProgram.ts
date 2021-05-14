import { Command } from "commander";
import fs from "fs-extra";
import { ChiliItem } from "../common/types";

export default function (program: Command): void {
	program
		.command("test []")
		.description("test itemsNotFound.json")
		.requiredOption(
			"-r --resource-directory <resource>",
			"Source of the resource files for the data XMLs"
		)
		.action(async (options) => {
			const { resourceDirectory } = options;

			if (!fs.existsSync("./itemsNotFound.json")) {
				console.log("No itemsNotFound.json file found");
				return;
			}

			if (!fs.existsSync(resourceDirectory)) {
				console.log("Resource Directory not found");
				return;
			}

			const file = fs.readFileSync("./itemsNotFound.json", "utf8");

			const itemsNotFoundArray = JSON.parse(file);

			if (!Array.isArray(itemsNotFoundArray)) {
				console.log("itemsNotFound.json in unexpected format");
				return;
			}

			console.log("Items not found: " + itemsNotFoundArray.length);

			const filesFound: ChiliItem[] = [];

			for (const item of <Array<ChiliItem>>itemsNotFoundArray) {
				if (fs.existsSync(resourceDirectory + "//" + item.relativePath)) {
					filesFound.push(item);
				}
			}

			fs.writeFileSync("./itemsFound.json", JSON.stringify(filesFound));

			console.log("Items still present: " + filesFound.length);
		});
}
