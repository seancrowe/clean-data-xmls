import { DirectoryTree } from "directory-tree";
import fs from "fs-extra";
import { parse, validate } from "fast-xml-parser";
import DebugHandler from "./DebugHandler";
import chalk from "chalk";

export default function* getDataXmlAsJson(
	files: Array<DirectoryTree>,
	debugHandler?: DebugHandler
): Generator<DataJson> {
	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		const dataXmlString = fs.readFileSync(file.path, "utf8");
		if (validate(dataXmlString)) {
			const documentJson = parse(dataXmlString, {
				ignoreAttributes: false,
				attributeNamePrefix: "",
			});

			const documents: Array<ChiliDocument> = documentJson.Documents.items
			.item as Array<ChiliDocument>;

			yield {
				name: file.name,
				path: file.path,
				jsonXml: documentJson,
				documents: documents,
			};
	}
}
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
