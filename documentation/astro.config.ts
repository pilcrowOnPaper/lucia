import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import solidJs from "@astrojs/solid-js";
import type { Root, RootContent, Text } from "hast";
import siena from "siena";
import { generate, generateCollection } from "./cela/generate";

import path from "path";

// https://astro.build/config
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), solidJs()],
	vite: {
		plugins: [
			{
				name: "cela",
				buildStart: () => {
					generate();
				},
				handleHotUpdate: async (ctx) => {
					const collectionDirPath = path.join(process.cwd(), "content");
					if (!ctx.file.startsWith(collectionDirPath)) return;
					await ctx.read();
					const workingPath = ctx.file.replace(
						path.join(process.cwd(), "content"),
						""
					);
					const [baseCollectionId] = workingPath.replace("/", "").split("/");
					generateCollection(baseCollectionId);
				}
			}
		]
	},
	output: "server",
	markdown: {
		shikiConfig: {
			theme: "github-dark"
		},
		rehypePlugins: [
			siena,
			[
				"rehype-wrap-all",
				{
					selector: "table",
					wrapper: "div.table-wrapper"
				}
			],
			[
				"rehype-rewrite",
				{
					rewrite: (node: Root | RootContent) => {
						const setBlockquoteProperties = () => {
							if (node.type !== "element" || node.tagName !== "blockquote")
								return;
							const pElement = node.children.find((child) => {
								if (child.type !== "element") return false;
								if (child.tagName !== "p") return false;
								return true;
							});
							if (pElement?.type !== "element") return;
							const firstTextContent = pElement.children.filter(
								(child): child is Text => child.type === "text"
							)[0];
							if (!node.properties) return;
							const classNames = [
								...(node.properties.class?.toString() ?? "").split(" "),
								"bq-default"
							];
							if (firstTextContent.value.startsWith("(warn)")) {
								classNames.push("bq-warn");
								firstTextContent.value = firstTextContent.value.replace(
									"(warn)",
									""
								);
							}
							if (firstTextContent.value.startsWith("(red)")) {
								classNames.push("bq-red");
								firstTextContent.value = firstTextContent.value.replace(
									"(red)",
									""
								);
							}
							node.properties.class = classNames.join(" ");
						};
						setBlockquoteProperties();
					}
				}
			]
		]
	},
	adapter: node({
		mode: "standalone"
	})
});
