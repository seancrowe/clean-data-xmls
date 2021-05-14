import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";
import { ChiliItem } from "../common/types";

export default function writeFakeFiles(
	items: Array<ChiliItem>,
	outputPath: string,
	skipFiles: boolean
): Array<ChiliItem> {
	const skippedFiles = [];

	for (let j = 0; j < items.length; j++) {
		const item = items[j];

		const path = outputPath + "\\" + item.relativePath;

		const skip = skipFiles ? Math.floor(Math.random() * 10) : 10;

		if (skip <= 2) {
			skippedFiles.push(item);
			continue;
		}

		fs.outputFileSync(path, uuidv4(), { encoding: "utf8" });
	}

	return skippedFiles;
}
