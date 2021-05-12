import "jest";
import fs from "fs-extra";
import processDataXmlsFake from "../fake/fakeProcessDataXmls";
import processDataXmlsClean from "../clean/cleanProcessDataXmls";
import directoryTree from "../common/getDirectoryTree";
import { parse, validate } from "fast-xml-parser";

const testData = __dirname + "/test_files/data";
const testFiles = __dirname + "/test_files/files";
const testModifiedData = __dirname + "/test_files/dataMod";
const parseConfig = {
	ignoreAttributes: false,
	attributeNamePrefix: "",
};

afterAll(() => {
	fs.emptydirSync(testFiles);
	fs.emptydirSync(testModifiedData);
});

describe("modify data XMLs by calling processDataXml no skips", () => {
	beforeAll(async () => {
		fs.emptydirSync(testFiles);
		fs.emptydirSync(testModifiedData);

		await processDataXmlsFake(testData, testFiles, false);
	});

	let documentsNotFound = [];

	test("create modified data XMLs ", async () => {
		documentsNotFound = await processDataXmlsClean(
			testData,
			testFiles,
			testModifiedData,
			2
		);
		expect(documentsNotFound).toBeDefined();
	});

	test("there should be 3 data XML files", () => {
		const children = directoryTree(testModifiedData).children;

		expect(children).not.toBeNull();
		expect(children?.length).toBe(4);
	});

	test("new XMLs should be valid XML", async () => {
		const children = directoryTree(testModifiedData).children;

		if (children == null) {
			expect(children).toBeDefined();
			return;
		}

		for (const directoryChild of children) {
			const validXml = validate(fs.readFileSync(directoryChild.path, "utf8"));

			expect(validXml).toEqual(true);
		}
		//const children = directoryTree(testModifiedData).children;
	});

	test("new XMLs should be the same data as previous XMLs", async () => {
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

			expect(dataXmlJsonMod).toEqual(dataXmlJsonOrg);
		}
	});
});
