import fs from "fs-extra";
import getDataXmls from "../common/getDataXmls";
import getDataXmlAsJson from "../common/getDataXmlAsJson";
import { ChiliDocument } from "../common/types";
import { SingleBar } from "cli-progress";
import updateDataXmls from "./cleanUpdateDataXmls";
import DebugHandler from "../common/DebugHandler";

export default async function (
	source: string,
	resourceDirectory: string,
	output: string,
	batchAmount: number,
	debug = false
): Promise<Array<ChiliDocument>> {
	if (batchAmount < 1) {
		batchAmount = 1;
	}

	const debugHandler = new DebugHandler(debug);

	console.log("Reading source directory");

	const files = getDataXmls(source, debugHandler);
	const dataXmlJsonGen = getDataXmlAsJson(files, debugHandler);

	let totalDocuments = 0;

	const processDocumentsPromiseFunctions: Array<() => Promise<void>> = [];

	const processDocumentsBar = new SingleBar({});
	const readingXmlsBar = new SingleBar({});

	console.log("Reading data XMLs");
	readingXmlsBar.start(files.length, 0);

	const notFoundDocumentsArray: Array<Array<ChiliDocument>> = [];

	for (const dataJson of dataXmlJsonGen) {
		readingXmlsBar.increment();

		if (dataJson == null) continue;

		totalDocuments += dataJson.documents.length;

		const promise = () => {
			return new Promise<void>((resolve): void => {
				const [dataXml, notFoundDocuments] = updateDataXmls(
					dataJson,
					resourceDirectory,
					processDocumentsBar
				);

				notFoundDocumentsArray.push(notFoundDocuments);

				const writePath = output + "\\" + dataJson.name;

				fs.writeFileSync(writePath, dataXml, {
					encoding: "utf8",
				});

				resolve();
			});
		};

		processDocumentsPromiseFunctions.push(promise);
	}

	readingXmlsBar.stop();
	console.log("Checking item existence");

	processDocumentsBar.start(totalDocuments, 0);

	const processDocumentsPromises = [];

	while (processDocumentsPromiseFunctions.length > 0) {
		if (processDocumentsPromises.length < batchAmount) {
			const promiseFunction = processDocumentsPromiseFunctions.pop();

			if (promiseFunction != null) {
				const promise = promiseFunction();
				processDocumentsPromises.push(promise);
			}
		} else {
			await Promise.all(processDocumentsPromises);
			processDocumentsPromises.splice(0);
		}
	}

	if (processDocumentsPromises.length > 0) {
		await Promise.all(processDocumentsPromises);
	}

	let notFoundDocuments: Array<ChiliDocument> = [];

	for (const chiliDocumentArray of notFoundDocumentsArray) {
		notFoundDocuments = notFoundDocuments.concat(chiliDocumentArray);
	}

	processDocumentsBar.stop();
	console.log("Documents not found: " + notFoundDocuments.length);

	return notFoundDocuments;
}
