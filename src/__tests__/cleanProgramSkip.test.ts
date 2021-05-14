import "jest";
import fs from "fs-extra";
import processDataXmlsFake from "../fake/fakeProcessDataXmls";
import processDataXmlsClean from "../clean/cleanProcessDataXmls";
import directoryTree from "../common/getDirectoryTree";
import { parse, validate } from "fast-xml-parser";
import { ChiliItem } from "../common/types";

const testData = __dirname + "/test_files/data";
const testFiles = __dirname + "/test_files/skip_files";
const testModifiedData = __dirname + "/test_files/skip_dataMod";
const parseConfig = {
	ignoreAttributes: false,
	attributeNamePrefix: "",
};

afterAll(() => {
	fs.emptydirSync(testFiles);
	fs.emptydirSync(testModifiedData);
});

describe("modify data XMLs by calling processDataXml with skips", () => {
	let skippeditems: Array<ChiliItem> = [];
	let itemsNotFound: Array<ChiliItem> = [];

	beforeAll(async () => {
		fs.emptydirSync(testFiles);
		fs.emptydirSync(testModifiedData);

		skippeditems = await processDataXmlsFake(testData, testFiles, true);

		console.log("Skipped " + skippeditems.length + " items");
	});

	test("create modified data XMLs ", async () => {
		itemsNotFound = await processDataXmlsClean(
			testData,
			testFiles,
			testModifiedData,
			2
		);
		expect(itemsNotFound).toBeDefined();
	});

	test("there should be 7 modified data XML files", () => {
		const children = directoryTree(testModifiedData).children;

		expect(children).not.toBeNull();
		expect(children?.length).toBe(7);
	});

	test("new XMLs should be valid XML", async () => {
		const children = directoryTree(testModifiedData).children;

		if (children == null || children?.length == 0) {
			expect(children).toBeDefined();
			expect(children?.length).toBeGreaterThan(0);
			return;
		}

		for (const directoryChild of children) {
			const validXml = validate(fs.readFileSync(directoryChild.path, "utf8"));

			expect(validXml).toEqual(true);
		}
		//const children = directoryTree(testModifiedData).children;
	});

	test("new XMLs should NOT be the same data as previous XMLs", async () => {
		const childrenModified = directoryTree(testModifiedData).children;
		const childrenOriginal = directoryTree(testData).children;

		if (childrenModified == null || childrenOriginal == null) {
			expect(childrenModified).toBeDefined();
			expect(childrenOriginal).toBeDefined();
			return;
		}

		for (let index = 0; index < childrenOriginal.length; index++) {
			const directoryChildOriginal = childrenOriginal[index];
			const directoryChildModified = childrenModified[index];

			const dataXmlJsonOrg = parse(
				fs.readFileSync(directoryChildOriginal.path, "utf8"),
				parseConfig
			);
			const dataXmlJsonMod = parse(
				fs.readFileSync(directoryChildModified.path, "utf8"),
				parseConfig
			);

			expect(dataXmlJsonMod).not.toEqual(dataXmlJsonOrg);
		}
	});

	let itemListOriginal: Array<ChiliItem> = [];
	let itemListModified: Array<ChiliItem> = [];

	test("number of items in data XML should equal number in modified + skipped", () => {
		const childrenModified = directoryTree(testModifiedData).children;
		const childrenOriginal = directoryTree(testData).children;

		if (childrenModified == null || childrenOriginal == null) {
			expect(childrenModified).toBeDefined();
			expect(childrenOriginal).toBeDefined();
			return;
		}

		for (const directoryChildOriginal of childrenOriginal) {
			const dataXmlJson = parse(
				fs.readFileSync(directoryChildOriginal.path, "utf8"),
				parseConfig
			);

			itemListOriginal = itemListOriginal.concat(
				dataXmlJson[Object.keys(dataXmlJson)[0]].items.item as Array<ChiliItem>
			);
		}

		for (const directoryChildModified of childrenModified) {
			const dataXmlJson = parse(
				fs.readFileSync(directoryChildModified.path, "utf8"),
				parseConfig
			);
			itemListModified = itemListModified.concat(
				dataXmlJson[Object.keys(dataXmlJson)[0]].items.item as Array<ChiliItem>
			);
		}

		expect(itemListOriginal.length).toEqual(
			itemListModified.length + skippeditems.length
		);
	});

	test("original data XMLs are the same as modified XMLs when skipped are added", () => {
		const itemListModifiedPlus = itemListModified.concat(skippeditems);

		const itemIds: Array<string> = [];

		for (const item of itemListOriginal) {
			itemIds.push(item.id);
		}

		for (const item of itemListModifiedPlus) {
			const index = itemIds.findIndex((id) => id === item.id);
			itemIds.splice(index, 1);
		}

		expect(itemIds.length).toBe(0);
	});

	test("items not found same as items skipped", () => {
		const itemIds: Array<string> = [];

		for (const item of itemsNotFound) {
			itemIds.push(item.id);
		}

		for (const item of skippeditems) {
			const index = itemIds.findIndex((id) => id === item.id);
			itemIds.splice(index, 1);
		}

		expect(itemIds.length).toBe(0);
	});

	test("items skipped are missing", () => {
		for (const skippeditem of skippeditems) {
			const path = testFiles + "\\" + skippeditem.relativePath;

			if (fs.existsSync(path) == true) {
				console.log("hio");
			}

			expect(fs.existsSync(path)).toBe(false);
		}
	});

	test("items not skipped are there", () => {
		for (const item of itemListModified) {
			const path = testFiles + "\\" + item.relativePath;

			expect(fs.existsSync(path)).toBe(true);
		}
	});
});
