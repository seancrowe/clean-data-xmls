import { Command } from "commander";
import fakeProgram from "./fake/fakeProgram";
import cleanProgram from "./clean/cleanProgram";
import testProgram from "./test/testProgram";

(async () => {
	const program = new Command();
	program.version("0.0.1", "-v -V --version");

	fakeProgram(<Command>program);
	cleanProgram(<Command>program);
	testProgram(<Command>program);

	await program.parseAsync(process.argv);
})();
