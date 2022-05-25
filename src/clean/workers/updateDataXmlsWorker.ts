import * as fs from "fs-extra";
import { ChiliItem, DataJson } from "../../common/types";
import { j2xParser } from "fast-xml-parser";
import { minifyXmlAtPath } from "../../common/minifyXml";

export function updateDataXmlsWorker (
	dataJson: DataJson,
	resourceFolderPath: string,
	minifyXml= false
): [string, Array<ChiliItem>, Array<string>] {
	let notFoundItems: Array<ChiliItem> = [];
	const failedMinifiedDocs = [];

	for (let i = dataJson.chiliItems.length - 1; i >= 0; i--) {
		const item = dataJson.chiliItems[i];

		const path = resourceFolderPath + "\\" + item.relativePath;

		if (!fs.existsSync(path)) {
			const removedItem = dataJson.chiliItems.splice(i, 1);
			notFoundItems = notFoundItems.concat(removedItem);
		}
		else{
			if (minifyXml) {
				if (!minifyXmlAtPath(path)) {
					failedMinifiedDocs.push(path);
				}
			}
		}
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
		failedMinifiedDocs
	];
}
