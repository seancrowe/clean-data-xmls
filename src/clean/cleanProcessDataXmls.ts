import fs from "fs-extra";
import getDataXmls from "../common/getDataXmls";
import getDataXmlAsJson from "../common/getDataXmlAsJson";
import { ChiliItem } from "../common/types";
import { SingleBar } from "cli-progress";
import DebugHandler from "../common/DebugHandler";
import { updateDataXmlsWorker } from "./workers/updateDataXmlsWorker";


export default async function (
	source: string,
	resourceDirectory: string,
	output: string,
	batchAmount: number,
	minify: boolean,
	debug = false
): Promise<[Array<ChiliItem>, Array<string>]> {
	if (batchAmount < 1) {
		batchAmount = 1;
	}

	const debugHandler = new DebugHandler(debug);

	console.log("Reading source directory");

	const files = getDataXmls(source, debugHandler);
	const dataXmlJsonGen = getDataXmlAsJson(files, debugHandler);

	let totalDatas = 0;

	const processDatasPromiseFunctions: Array<() => Promise<void>> = [];

	const processDatasBar = new SingleBar({});
	const readingXmlsBar = new SingleBar({});

	console.log("Reading data XMLs");
	readingXmlsBar.start(files.length, 0);

	const notFoundDatasArray: Array<Array<ChiliItem>> = [];
	const failedMinifiedDocumentsArray: Array<Array<string>> = [];

	for (const dataJson of dataXmlJsonGen) {
		readingXmlsBar.increment();

		if (dataJson == null) continue;

		totalDatas += dataJson.chiliItems.length;

		const promise = () => {
			return new Promise<void>((resolve): void => {
				const [dataXml, notFoundDatas, failedMinifiedDocs] = updateDataXmlsWorker(dataJson, resourceDirectory, minify);

				notFoundDatasArray.push(notFoundDatas);
				failedMinifiedDocumentsArray.push(failedMinifiedDocs);

				processDatasBar.increment(dataJson.chiliItems.length);

				const writePath = output + "\\" + dataJson.name;

				fs.writeFileSync(writePath, dataXml, {
					encoding: "utf8",
				});

				resolve();
			});
		};

		processDatasPromiseFunctions.push(promise);
	}

	readingXmlsBar.stop();
	console.log("Checking item existence");

	processDatasBar.start(totalDatas, 0);

	const processDatasPromises = [];

	while (processDatasPromiseFunctions.length > 0) {
		if (processDatasPromises.length < batchAmount) {
			const promiseFunction = processDatasPromiseFunctions.pop();

			if (promiseFunction != null) {
				const promise = promiseFunction();
				processDatasPromises.push(promise);
			}
		} else {
			await Promise.all(processDatasPromises);
			processDatasPromises.splice(0);
		}
	}

	if (processDatasPromises.length > 0) {
		await Promise.all(processDatasPromises);
	}

	let notFoundDatas: Array<ChiliItem> = [];

	for (const ChiliItemArray of notFoundDatasArray) {
		notFoundDatas = notFoundDatas.concat(ChiliItemArray);
	}

	const failedMinifiedDocuments = failedMinifiedDocumentsArray.reduce((previousValue, currentValue) => [...previousValue, ...currentValue], []);
	processDatasBar.stop();

	console.log("Items not found: " + notFoundDatas.length);
	console.log("Documents failed to minify: " + failedMinifiedDocuments.length);

	return [notFoundDatas, failedMinifiedDocuments];
}
