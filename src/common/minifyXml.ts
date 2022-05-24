import {minify} from "minify-xml";
import { readFileSync, writeFileSync } from "fs";

export function minifyXmlAtPath(path:string):boolean {

	try {
		const xml = readFileSync(path, "utf-8");

		if (xml.includes("\r")) {
			writeFileSync(path, minify(xml));
		}
		return true;
	}
	catch (e) {
		console.log(e);
		return false;
	}

}