export type ChiliDocument = {
	name: string;
	id: string;
	relativePath: string;
};

export type DataJson = {
	name: string;
	path: string;
	jsonXml: Record<string, unknown>;
	documents: Array<ChiliDocument>;
};

export type DirectoryItem = {
	path: string;
	name: string;
	size: number;
	level: number;
	type: DirectoryType;
	children?: Array<DirectoryItem>;
	extension?: string;
};

export enum DirectoryType {
	directory = "directory",
	file = "file",
	other = "other",
}
