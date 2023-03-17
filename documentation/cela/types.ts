import type { getContent } from "./content";

export type Section = {
	title: string;
	order: number;
	documents: {
		id: string
		title: string;
		href: string;
		order: number;
	}[];
	id: string
};

export type Collection = {
	title: string;
	sections: Section[];
};

export type MarkdownDocument = Exclude<
	Awaited<ReturnType<typeof getContent>>,
	null
>;

export type DocumentMetaData = {
	collectionId: string;
	frameworkId: string | null;
	redirect: string | null;
	title: string;
	id: string;
	path: string;
	href: string;
};
