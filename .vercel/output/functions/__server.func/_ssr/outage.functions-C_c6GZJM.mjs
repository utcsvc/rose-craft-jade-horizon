import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/outage.functions-C_c6GZJM.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function asText(value, max) {
	return String(value ?? "").trim().slice(0, max);
}
var getHome_createServerFn_handler = createServerRpc({
	id: "539182f38e07d7eab2cf711512b2523e6e8eb67f8cb5ec4a1ca39f263cbdf376",
	name: "getHome",
	filename: "src/lib/outage.functions.ts"
}, (opts) => getHome.__executeServer(opts));
var getHome = createServerFn({ method: "GET" }).handler(getHome_createServerFn_handler, async () => {
	const { loadHome } = await import("./outage.server-Dn28-cO-.mjs");
	return loadHome();
});
var getQueue_createServerFn_handler = createServerRpc({
	id: "82bf843b6a752c773974ca9225410fb37bea5236f9a88d8e2ef6f5278758d199",
	name: "getQueue",
	filename: "src/lib/outage.functions.ts"
}, (opts) => getQueue.__executeServer(opts));
var getQueue = createServerFn({ method: "GET" }).validator((input) => {
	const slug = asText(input?.slug, 32);
	if (!/^[0-9]+(?:-[0-9]+)+$/.test(slug)) throw new Error("Невідома черга");
	return { slug };
}).handler(getQueue_createServerFn_handler, async ({ data }) => {
	const { loadQueue } = await import("./outage.server-Dn28-cO-.mjs");
	return loadQueue(data.slug);
});
var searchCities_createServerFn_handler = createServerRpc({
	id: "9cb0189b6b52bcf3b841e81ce6cdf16954a2855f09c6bae4bbc36665f952eefe",
	name: "searchCities",
	filename: "src/lib/outage.functions.ts"
}, (opts) => searchCities.__executeServer(opts));
var searchCities = createServerFn({ method: "GET" }).validator((input) => ({ term: asText(input?.term, 80) })).handler(searchCities_createServerFn_handler, async ({ data }) => {
	const { findCities } = await import("./outage.server-Dn28-cO-.mjs");
	return findCities(data.term);
});
var searchStreets_createServerFn_handler = createServerRpc({
	id: "59bc27ae5b4f444b12a2063bff62c6128dac525517358972b7dbaa776356fced",
	name: "searchStreets",
	filename: "src/lib/outage.functions.ts"
}, (opts) => searchStreets.__executeServer(opts));
var searchStreets = createServerFn({ method: "GET" }).validator((input) => ({
	city: asText(input?.city, 80),
	term: asText(input?.term, 80)
})).handler(searchStreets_createServerFn_handler, async ({ data }) => {
	const { findStreets } = await import("./outage.server-Dn28-cO-.mjs");
	if (!data.city) return [];
	return findStreets(data.city, data.term);
});
var searchHouses_createServerFn_handler = createServerRpc({
	id: "bd4500fea9440ee23f48fb7910685d4fa0e489f5d483ac4f48d6c975c6cbf70e",
	name: "searchHouses",
	filename: "src/lib/outage.functions.ts"
}, (opts) => searchHouses.__executeServer(opts));
var searchHouses = createServerFn({ method: "GET" }).validator((input) => ({
	city: asText(input?.city, 80),
	street: asText(input?.street, 80),
	term: asText(input?.term, 32)
})).handler(searchHouses_createServerFn_handler, async ({ data }) => {
	const { findHouses } = await import("./outage.server-Dn28-cO-.mjs");
	if (!data.city || !data.street) return [];
	return findHouses(data.city, data.street, data.term);
});
var lookupAddress_createServerFn_handler = createServerRpc({
	id: "4ee6e81ed82039a7697acc2590769532d3095089e74541a27ec75d38967ef0ee",
	name: "lookupAddress",
	filename: "src/lib/outage.functions.ts"
}, (opts) => lookupAddress.__executeServer(opts));
var lookupAddress = createServerFn({ method: "POST" }).validator((input) => ({
	city: asText(input?.city, 80),
	street: asText(input?.street, 80),
	house: asText(input?.house, 32)
})).handler(lookupAddress_createServerFn_handler, async ({ data }) => {
	const { resolveQueue } = await import("./outage.server-Dn28-cO-.mjs");
	if (!data.city || !data.street || !data.house) return { slug: null };
	return { slug: await resolveQueue(data.city, data.street, data.house) };
});
//#endregion
export { getHome_createServerFn_handler, getQueue_createServerFn_handler, lookupAddress_createServerFn_handler, searchCities_createServerFn_handler, searchHouses_createServerFn_handler, searchStreets_createServerFn_handler };
