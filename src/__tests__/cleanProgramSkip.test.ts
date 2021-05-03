import "jest";
import fs from "fs-extra";
import processDataXmlsFake from "../fake/fakeProcessDataXmls";
import processDataXmlsClean from "../clean/cleanProcessDataXmls";
import directoryTree from "directory-tree";
import { parse, validate } from "fast-xml-parser";
import { ChiliDocument } from "../common/getDataXmlAsJson";

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
	let skippedDocuments: Array<ChiliDocument> = [];
	let documentsNotFound: Array<ChiliDocument> = [];

	beforeAll(async () => {
		fs.emptydirSync(testFiles);
		fs.emptydirSync(testModifiedData);

		skippedDocuments = await processDataXmlsFake(testData, testFiles, true);

		console.log("Skipped " + skippedDocuments.length + " documents");
	});

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

	let documentListOriginal: Array<ChiliDocument> = [];
	let documentListModified: Array<ChiliDocument> = [];

	test("number of documents in data XML should equal number in modified + skipped", () => {
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
			documentListOriginal = documentListOriginal.concat(
				dataXmlJson.Documents.items.item as Array<ChiliDocument>
			);
		}

		for (const directoryChildModified of childrenModified) {
			const dataXmlJson = parse(
				fs.readFileSync(directoryChildModified.path, "utf8"),
				parseConfig
			);
			documentListModified = documentListModified.concat(
				dataXmlJson.Documents.items.item as Array<ChiliDocument>
			);
		}

		expect(documentListOriginal.length).toEqual(
			documentListModified.length + skippedDocuments.length
		);
	});

	test("original data XMLs are the same as modified XMLs when skipped are added", () => {
		const documentListModifiedPlus = documentListModified.concat(
			skippedDocuments
		);

		const documentIds: Array<string> = [];

		for (const document of documentListOriginal) {
			documentIds.push(document.id);
		}

		for (const document of documentListModifiedPlus) {
			const index = documentIds.findIndex((id) => id === document.id);
			documentIds.splice(index, 1);
		}

		expect(documentIds.length).toBe(0);
	});

	test("documents not found same as documents skipped", () => {
		const documentIds: Array<string> = [];

		for (const document of documentsNotFound) {
			documentIds.push(document.id);
		}

		for (const document of skippedDocuments) {
			const index = documentIds.findIndex((id) => id === document.id);
			documentIds.splice(index, 1);
		}

		expect(documentIds.length).toBe(0);
	});

	test("documents skipped are missing", () => {
		for (const skippedDocument of skippedDocuments) {
			const path = testFiles + "\\" + skippedDocument.relativePath;

			if (fs.existsSync(path) == true) {
				console.log("hio");
			}

			expect(fs.existsSync(path)).toBe(false);
		}
	});

	test("documents not skipped are there", () => {
		for (const document of documentListModified) {
			const path = testFiles + "\\" + document.relativePath;

			expect(fs.existsSync(path)).toBe(true);
		}
	});
});
