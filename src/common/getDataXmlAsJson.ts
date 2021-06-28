import { parse, validate } from "fast-xml-parser";
import DebugHandler from "./DebugHandler";
import chalk from "chalk";
import { DirectoryItem } from "./types";
import getStringFromFile from "./getStringFromFile";
import { ChiliItem, DataJson } from "./types";
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
			const [dataJsonError, dataJson] = useTry<Record<string, unknown>>(() => {
				return parse(dataXmlString, {
					ignoreAttributes: false,
					attributeNamePrefix: "",
				});
			});

			if (dataJsonError != null) {
				console.log(chalk.yellow("Could not parse XML at " + file.path));

				debugHandler?.log(dataJsonError);

				yield null;
				continue;
			}

			const { chiliItems, chiliType } = getChiliItemAndTypeFromJson(dataJson);

			if (chiliType == null || chiliItems.length == 0) {
				console.log(
					chalk.yellow("Found badly formed data XML at " + file.path)
				);

				debugHandler?.log(dataJson);

				yield null;
				continue;
			}

			yield {
				name: file.name,
				path: file.path,
				jsonXml: dataJson,
				chiliType: chiliType,
				chiliItems: chiliItems,
			};
		} else {
			console.log(chalk.yellow("Invalid data XML at " + file.path));
			yield null;
		}
	}
}

function getChiliItemAndTypeFromJson(dataJson: Record<string, any>) {
	for (const topLevel in dataJson) {
		const element = dataJson[topLevel];

		if (element?.items?.item != null) {
			return {
				chiliItems: getOnlyChiliItemArray(element?.items?.item),
				chiliType: topLevel,
			};
		}
	}

	return {
		chiliItems: [],
		chiliType: null,
	};
}

function getOnlyChiliItemArray(
	items: Array<Record<string, unknown>>
): Array<ChiliItem> {
	if (!Array.isArray(items)) {
		return [];
	}

	return items.filter(
		(item) => item.name != null && item.id != null && item.relativePath != null
	) as Array<ChiliItem>;
}
