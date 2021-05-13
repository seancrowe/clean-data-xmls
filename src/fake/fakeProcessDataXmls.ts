import { SingleBar } from "cli-progress";
import getDataXmlAsJson from "../common/getDataXmlAsJson";
import { ChiliDocument } from "../common/types";
import getDataXmls from "../common/getDataXmls";
import writeFakeFiles from "./frakeWriteFakeFiles";

export default async function (
	source: string,
	output: string,
	skipFiles: boolean
): Promise<Array<ChiliDocument>> {
	const files = getDataXmls(source);
	const dataXmlJsonGen = getDataXmlAsJson(files);
	const processingData = [];

	const bar = new SingleBar({});
	bar.start(files.length, 0);

	for (const dataJson of dataXmlJsonGen) {
		if (dataJson == null) continue;

		const promise = (): Promise<Array<ChiliDocument>> => {
			return new Promise((resolve) => {
				const skippedFiles = writeFakeFiles(
					dataJson.documents,
					output,
					skipFiles
				);
				bar.increment();
				resolve(skippedFiles);
			});
		};

		processingData.push(promise());
	}

	const skippedFilesArray = await Promise.all(processingData);
	bar.stop();

	let totalSkippedDocuments: Array<ChiliDocument> = [];

	for (const skippedDocuments of skippedFilesArray) {
		totalSkippedDocuments = totalSkippedDocuments.concat(
			skippedDocuments as Array<ChiliDocument>
		);
	}

	return totalSkippedDocuments;
}
