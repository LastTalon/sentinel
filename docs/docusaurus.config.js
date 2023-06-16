// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: "Sentinel",
	tagline: "A cooperative, hero-based, wave-based horde survival game.",
	// favicon: "img/favicon.ico",

	// Set the production url of your site here
	url: "https://lasttalon.github.io",
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: "/sentinel/",

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: "LastTalon", // Usually your GitHub org/user name.
	projectName: "sentinel", // Usually your repo name.

	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",

	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang. For example, if your site is Chinese, you may want
	// to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},

	presets: [
		[
			"classic",
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve("./sidebars.js"),
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl: "https://github.com/LastTalon/sentinel/tree/main/docs/",
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl: "https://github.com/LastTalon/sentinel/tree/main/docs/",
				},
				// theme: {
				// 	customCss: require.resolve("./src/css/custom.css"),
				// },
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			// Replace with your project's social card
			// image: "img/docusaurus-social-card.jpg",
			navbar: {
				title: "Sentinel",
				// logo: {
				// 	alt: "My Site Logo",
				// 	src: "img/logo.svg",
				// },
				items: [
					// {
					// 	type: "docSidebar",
					// 	sidebarId: "tutorialSidebar",
					// 	position: "left",
					// 	label: "Tutorial",
					// },
					{ to: "/blog", label: "Blog", position: "left" },
					{
						href: "https://github.com/LastTalon/sentinel",
						label: "GitHub",
						position: "right",
					},
				],
			},
			footer: {
				style: "dark",
				links: [
					{
						title: "Docs",
						items: [
							// {
							// 	label: "Tutorial",
							// 	to: "/docs/intro",
							// },
						],
					},
					{
						title: "Community",
						items: [
							{
								label: "Discord",
								href: "https://discord.gg/aq2UkZUWsj",
							},
							{
								label: "Mastodon",
								href: "https://mastodon.gamedev.place/@LastTalon",
							},
							{
								label: "Twitter",
								href: "https://twitter.com/LastTalon",
							},
						],
					},
					{
						title: "More",
						items: [
							{
								label: "Blog",
								to: "/blog",
							},
							{
								label: "GitHub",
								href: "https://github.com/LastTalon/sentinel",
							},
						],
					},
				],
				copyright: `Copyright © 2023 Lucas Gangstad. Built with Docusaurus.`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
		}),
};

module.exports = config;
