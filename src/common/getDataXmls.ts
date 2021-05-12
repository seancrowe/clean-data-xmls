import DebugHandler from "./DebugHandler";
import getDirectoryTree, { DirectoryItem } from "./getDirectoryTree";

export default function getDataXmls(
	source: string,
	debugHandler?: DebugHandler
): Array<DirectoryItem> {
	const directoryItems = getDirectoryTree(source)?.children;

	debugHandler?.log(directoryItems);

	if (directoryItems == null) {
		console.log("No items found at Source");
		return [];
	}

	const directories = [];
	const files = [];

	debugHandler?.log(directoryItems.length);

	for (let i = 0; i < directoryItems.length; i++) {
		const item = directoryItems[i];

		debugHandler?.log(i);

		if (item.type === "directory") {
			directories.push(item);
		} else {
			if (item.name.includes("data") && item.extension?.includes(".xml"))
				files.push(item);
		}
	}

	debugHandler?.log(files);

	return files;
}
