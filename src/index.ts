import { Command } from "commander";
import fakeProgram from "./fake/fakeProgram";
import cleanProgram from "./clean/cleanProgram";

(async () => {
	const program = new Command();
	program.version("0.0.1", "-v -V --version");

	fakeProgram(<Command>program);
	cleanProgram(<Command>program);

	await program.parseAsync(process.argv);
})();
