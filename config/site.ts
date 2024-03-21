export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Passwordless",
	description: "Passwordless auth",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
    {
      label: "Protected",
      href: "/protected",
    },
	],
	navMenuItems: [
		{
			label: "Home",
			href: "/home",
		},
		{
			label: "Protected",
			href: "/protected",
		},
	],
	links: {
		github: "https://titasmallick.github.io/",
		twitter: "https://titasmallick.github.io/",
		docs: "https://titasmallick.github.io/",
		discord: "https://titasmallick.github.io/",
    sponsor: "https://titasmallick.github.io/"
	},
};
