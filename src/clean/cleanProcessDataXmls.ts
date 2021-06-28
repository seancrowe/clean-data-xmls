import fs from "fs-extra";
import getDataXmls from "../common/getDataXmls";
import getDataXmlAsJson from "../common/getDataXmlAsJson";
import { ChiliItem } from "../common/types";
import { SingleBar } from "cli-progress";
import updateDataXmls from "./cleanUpdateDataXmls";
import DebugHandler from "../common/DebugHandler";

export default async function (
	source: string,
	resourceDirectory: string,
	output: string,
	batchAmount: number,
	debug = false
): Promise<Array<ChiliItem>> {
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

	for (const dataJson of dataXmlJsonGen) {
		readingXmlsBar.increment();

		if (dataJson == null) continue;

		totalDatas += dataJson.chiliItems.length;

		const promise = () => {
			return new Promise<void>((resolve): void => {
				const [dataXml, notFoundDatas] = updateDataXmls(
					dataJson,
					resourceDirectory,
					processDatasBar
				);

				notFoundDatasArray.push(notFoundDatas);

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

	processDatasBar.stop();
	console.log("Items not found: " + notFoundDatas.length);

	return notFoundDatas;
}
