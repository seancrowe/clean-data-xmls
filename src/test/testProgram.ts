import { Command } from "commander";
import fs from "fs-extra";
import { ChiliDocument } from "../common/types";

export default function (program: Command): void {
	program
		.command("test []")
		.description("test documentsNotFound.json")
		.requiredOption(
			"-r --resource-directory <resource>",
			"Source of the resource files for the data XMLs"
		)
		.action(async (options) => {
			const { resourceDirectory } = options;

			if (!fs.existsSync("./documentsNotFound.json")) {
				console.log("No documentsNotFound.json file found");
				return;
			}

			if (!fs.existsSync(resourceDirectory)) {
				console.log("Resource Directory not found");
				return;
			}

			const file = fs.readFileSync("./documentsNotFound.json", "utf8");

			const documentsNotFoundArray = JSON.parse(file);

			if (!Array.isArray(documentsNotFoundArray)) {
				console.log("documentsNotFound.json in unexpected format");
				return;
			}

			console.log("Documents not found: " + documentsNotFoundArray.length);

			const filesFound: ChiliDocument[] = [];

			for (const document of <Array<ChiliDocument>>documentsNotFoundArray) {
				if (fs.existsSync(resourceDirectory + "//" + document.relativePath)) {
					filesFound.push(document);
				}
			}

			fs.writeFileSync("./docum entsFound.json", JSON.stringify(filesFound));

			console.log("Doucments actually found: " + filesFound.length);
		});
}
