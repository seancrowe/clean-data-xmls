import FS from "fs";
import PATH from "path";

function safeReadDirSync(path: string): string[] {
	let dirData = [];
	// eslint-disable-next-line no-useless-catch
	try {
		dirData = FS.readdirSync(path);
	} catch (ex) {
		throw ex;
	}
	return dirData;
}

enum DirectoryType {
	directory = "directory",
	file = "file",
	other = "other",
}

export type DirectoryItem = {
	path: string;
	name: string;
	size: number;
	level: number;
	type: DirectoryType;
	children?: Array<DirectoryItem>;
	extension?: string;
};

export default function getDirectoryTree(
	path: string,
	maxSubDirectoryLevel = 1,
	onEachFile?: (file: DirectoryItem) => unknown,
	onEachDirectory?: (directory: DirectoryItem) => unknown
): DirectoryItem {
	const name = PATH.basename(path);
	const stats = (() => {
		// eslint-disable-next-line no-useless-catch
		try {
			return FS.statSync(path);
		} catch (e) {
			throw e;
		}
	})();

	const level = maxSubDirectoryLevel - 1;

	if (stats.isFile()) {
		const size = stats != null ? stats.size : 0;
		const extension = PATH.extname(path).toLowerCase();
		const type = DirectoryType.file;

		const item = {
			name,
			size,
			level,
			path,
			type,
			extension,
		};

		if (onEachFile) {
			onEachFile(item);
		}

		return item;
	} else if (stats.isDirectory()) {
		const dirData = safeReadDirSync(path);

		const children =
			level >= 0
				? dirData
						.map((child) =>
							getDirectoryTree(
								PATH.join(path, child),
								level,
								onEachFile,
								onEachDirectory
							)
						)
						.filter((e) => !!e)
				: undefined;
		const size =
			children != null
				? children.reduce((prev, cur) => prev + cur?.size, 0)
				: 0;
		const type = DirectoryType.directory;

		const item = {
			name,
			size,
			level,
			path,
			type,
			children,
		};

		if (onEachDirectory) {
			onEachDirectory(item);
		}

		return item;
	} else {
		const size = 0;
		const type = DirectoryType.other;

		return {
			name,
			size,
			level,
			type,
			path,
		};
	}
}
