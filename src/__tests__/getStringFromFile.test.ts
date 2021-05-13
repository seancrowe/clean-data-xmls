import getStringFromFile from "../common/getStringFromFile";
import { validate, parse } from "fast-xml-parser";
import { useTry } from "no-try";
import "jest";

const testUtf8File1 = __dirname + "/test_files/data/data.xml";
const testUtf8File2 = __dirname + "/test_files/data/data0000002.xml";
const testUtf16File1 = __dirname + "/test_files/data16/data0000015.xml";
const testUtf16File2 = __dirname + "/test_files/data16/data0000016.xml";

describe("read data XMLs", () => {
	const dataXmlStrings: Array<string> = [];

	test("get back string from utf8 xml fills", async () => {
		const [error1, documentXmlString1] = useTry(() => {
			return getStringFromFile(testUtf8File1);
		});
		const [error2, documentXmlString2] = useTry(() => {
			return getStringFromFile(testUtf8File2);
		});

		expect(error1).toBeNull();
		expect(error2).toBeNull();

		dataXmlStrings.push(documentXmlString1);
		dataXmlStrings.push(documentXmlString2);
	});

	test("get back string from utf16 xml fills", async () => {
		const [error1, documentXmlString1] = useTry(() => {
			return getStringFromFile(testUtf16File1);
		});
		const [error2, documentXmlString2] = useTry(() => {
			return getStringFromFile(testUtf16File2);
		});

		expect(error1).toBeNull();
		expect(error2).toBeNull();

		dataXmlStrings.push(documentXmlString1);
		dataXmlStrings.push(documentXmlString2);
	});

	test("utf16 and utf8 files return valid XML", async () => {
		for (const documentXmlString of dataXmlStrings) {
			expect(validate(documentXmlString)).toEqual(true);
		}
	});

	test("utf16 and utf8 files contain proper tags for data XML", async () => {
		for (const documentXmlString of dataXmlStrings) {
			const documentJson = parse(documentXmlString, {
				ignoreAttributes: false,
				attributeNamePrefix: "",
			});

			expect(documentJson?.Documents?.items?.item == null).toEqual(false);
		}
	});
});
