import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";
import { ChiliDocument } from "../common/types";

export default function writeFakeFiles(
	documents: Array<ChiliDocument>,
	outputPath: string,
	skipFiles: boolean
): Array<ChiliDocument> {
	const skippedFiles = [];

	for (let j = 0; j < documents.length; j++) {
		const document = documents[j];

		const path = outputPath + "\\" + document.relativePath;

		const skip = skipFiles ? Math.floor(Math.random() * 10) : 10;

		if (skip <= 2) {
			skippedFiles.push(document);
			continue;
		}

		fs.outputFileSync(path, uuidv4(), { encoding: "utf8" });
	}

	return skippedFiles;
}
