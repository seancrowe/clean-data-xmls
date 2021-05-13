import directoryTree from "../common/getDirectoryTree";
import  { DirectoryItem } from "../common/types";
import "jest";

describe("get directory", () => {
	const path = __dirname + "/test_files/";

	test("there should be 6 DirectoryItems in /test_files with default level", async () => {
		const children = directoryTree(path).children;

		expect(children?.length).toBe(6);
	});

	test("there should be no files in /test_file with default levels", () => {
		const children = directoryTree(path).children;

		expect(children?.filter((item) => item.type === "file").length).toBe(0);
	});

	test("there should be four files in /test_files/data with default level", async () => {
		const children = directoryTree(path + "/data").children;

		expect(children?.filter((item) => item.type === "file").length).toBe(4);
		//const children = directoryTree(testModifiedData).children
	});

	test("there should be four files in ./ with default level", async () => {
		const children = directoryTree(__dirname).children;

		expect(children?.filter((item) => item.type === "file").length).toBe(4);
		//const children = directoryTree(testModifiedData).children
	});

	test("there should be greater than 6 files in ./ with level 3", async () => {
		const getFiles = (directoryItem: DirectoryItem): Array<DirectoryItem> => {
			if (directoryItem.type == "directory") {
				if (directoryItem.children != null) {
					let files: Array<DirectoryItem> = [];

					for (const childItem of directoryItem.children) {
						files = files.concat(getFiles(childItem));
					}

					return files;
				}
			}

			return [directoryItem];
		};

		const files = getFiles(directoryTree(__dirname, 3));

		expect(files.length).toBeGreaterThan(6);
		//const children = directoryTree(testModifiedData).children
	});
});
