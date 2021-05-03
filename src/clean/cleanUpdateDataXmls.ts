import * as fs from "fs-extra";
import { ChiliDocument, DataJson } from "../common/getDataXmlAsJson";
import { j2xParser } from "fast-xml-parser";
import { SingleBar } from "cli-progress";

export default function (
	dataJson: DataJson,
	resourceFolderPath: string,
	progressBar?: SingleBar
): [string, Array<ChiliDocument>] {
	let notFoundDocuments: Array<ChiliDocument> = [];

	for (let i = dataJson.documents.length - 1; i >= 0; i--) {
		const document = dataJson.documents[i];

		const path = resourceFolderPath + "\\" + document.relativePath;

		if (!fs.existsSync(path)) {
			const removedDocument = dataJson.documents.splice(i, 1);
			notFoundDocuments = notFoundDocuments.concat(removedDocument);
		}

		progressBar?.increment();
	}

	const parser = new j2xParser({
		ignoreAttributes: false,
		attributeNamePrefix: "",
	});

	return [
		parser.parse({ Documents: { items: { item: dataJson.documents } } }),
		notFoundDocuments,
	];
}
