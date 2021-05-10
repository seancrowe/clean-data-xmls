import { DirectoryTree } from "directory-tree";
import fs from "fs-extra";
import { parse, validate } from "fast-xml-parser";
import DebugHandler from "./DebugHandler";
import chalk from "chalk";

export default function* getDataXmlAsJson(
	files: Array<DirectoryTree>,
	debugHandler?: DebugHandler
): Generator<DataJson|null> {
	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		const dataXmlString = fs.readFileSync(file.path, "utf8");
		if (validate(dataXmlString)) {
			const documentJson = parse(dataXmlString, {
				ignoreAttributes: false,
				attributeNamePrefix: "",
			});

			if (
				documentJson.Documents == null ||
				documentJson.Documents.items == null ||
				documentJson.Documents.items.item == null ||
				!Array.isArray(documentJson.Documents.items.item)
			) {
				console.log(
					chalk.yellow("Found badly formed data XML at " + file.path)
				);

				debugHandler?.log(documentJson);

				yield null;
				continue;
			}

			const documents: Array<ChiliDocument> = getChiliDocumentArray(
				documentJson.Documents.items.item
			);

			yield {
				name: file.name,
				path: file.path,
				jsonXml: documentJson,
				documents: documents,
			};
		} else {
			console.log(chalk.yellow("Invalid data XML at " + file.path));
		}
	}
}

function getChiliDocumentArray(
	items: Array<Record<string, unknown>>
): Array<ChiliDocument> {
	if (!Array.isArray(items)) {
		return [];
	}

	return items.filter(
		(item) => item.name != null && item.id != null && item.relativePath != null
	) as Array<ChiliDocument>;
}

export type DataJson = {
	name: string;
	path: string;
	jsonXml: Record<string, unknown>;
	documents: Array<ChiliDocument>;
};

export type ChiliDocument = {
	name: string;
	id: string;
	relativePath: string;
};
