import { SingleBar } from "cli-progress";
import getDataXmlAsJson from "../common/getDataXmlAsJson";
import { ChiliItem } from "../common/types";
import getDataXmls from "../common/getDataXmls";
import writeFakeFiles from "./frakeWriteFakeFiles";

export default async function (
	source: string,
	output: string,
	skipFiles: boolean
): Promise<Array<ChiliItem>> {
	const files = getDataXmls(source);
	const dataXmlJsonGen = getDataXmlAsJson(files);
	const processingData = [];

	const bar = new SingleBar({});
	bar.start(files.length, 0);

	for (const dataJson of dataXmlJsonGen) {
		if (dataJson == null) continue;

		const promise = (): Promise<Array<ChiliItem>> => {
			return new Promise((resolve) => {
				const skippedFiles = writeFakeFiles(
					dataJson.chiliItems,
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

	let totalSkippedItems: Array<ChiliItem> = [];

	for (const skippedItems of skippedFilesArray) {
		totalSkippedItems = totalSkippedItems.concat(
			skippedItems as Array<ChiliItem>
		);
	}

	return totalSkippedItems;
}
