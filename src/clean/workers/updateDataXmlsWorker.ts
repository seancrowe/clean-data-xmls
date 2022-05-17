import * as fs from "fs-extra";
import { ChiliItem, DataJson } from "../../common/types";
import { j2xParser } from "fast-xml-parser";
import { SingleBar } from "cli-progress";
import {expose} from "threads";

expose (function updateDataXmlsWorker (
	dataJson: DataJson,
	resourceFolderPath: string,
	progressBar?: SingleBar
): [string, Array<ChiliItem>] {
	let notFoundItems: Array<ChiliItem> = [];

	for (let i = dataJson.chiliItems.length - 1; i >= 0; i--) {
		const item = dataJson.chiliItems[i];

		const path = resourceFolderPath + "\\" + item.relativePath;

		if (!fs.existsSync(path)) {
			const removedItem = dataJson.chiliItems.splice(i, 1);
			notFoundItems = notFoundItems.concat(removedItem);
		}

		progressBar?.increment();
	}

	const parser = new j2xParser({
		ignoreAttributes: false,
		attributeNamePrefix: "",
	});

	return [
		parser.parse({
			[dataJson.chiliType]: { items: { item: dataJson.chiliItems } },
		}),
		notFoundItems,
	];
});