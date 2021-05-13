import { parse, validate } from "fast-xml-parser";
import DebugHandler from "./DebugHandler";
import chalk from "chalk";
import { DirectoryItem } from "./getDirectoryTree";
import getStringFromFile from "./getStringFromFile";
import { useTry } from "no-try";

export default function* getDataXmlAsJson(
	files: Array<DirectoryItem>,
	debugHandler?: DebugHandler
): Generator<DataJson | null> {
	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		const [getStringFromFileError, dataXmlString] = useTry(() => {
			return getStringFromFile(file.path);
		});

		if (getStringFromFileError != null) {
			console.log(chalk.red("Error skipping " + file.path));
			console.log(getStringFromFileError.message);
			continue;
		}

		if (validate(dataXmlString)) {
			const documentJson = parse(dataXmlString, {
				ignoreAttributes: false,
				attributeNamePrefix: "",
			});

			if (
				documentJson?.Documents?.items?.item == null ||
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
