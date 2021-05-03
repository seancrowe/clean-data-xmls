import directoryTree, { DirectoryTree } from "directory-tree";

export default function getDataXmls(source: string): Array<DirectoryTree> {
	const directoryItems = directoryTree(source).children;

	if (directoryItems == null) {
		console.log("No items found at Source");
		return [];
	}

	const directories = [];
	const files = [];

	for (let i = 0; i < directoryItems.length; i++) {
		const item = directoryItems[i];

		if (item.type === "directory") {
			directories.push(item);
		} else {
			if (item.name.includes("data") && item.extension?.includes(".xml"))
				files.push(item);
		}
	}

	return files;
}
