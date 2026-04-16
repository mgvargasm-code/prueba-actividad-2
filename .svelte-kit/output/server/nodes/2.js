import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.oxZQiTZt.js","_app/immutable/chunks/VIqI3I3Y.js","_app/immutable/chunks/CAUtrwhf.js","_app/immutable/chunks/4OkWPtTs.js","_app/immutable/chunks/DlIXmFvj.js","_app/immutable/chunks/upeKwYfS.js","_app/immutable/chunks/sapqUEOU.js","_app/immutable/chunks/FY7AgEyh.js","_app/immutable/chunks/Dq5DRvL7.js"];
export const stylesheets = ["_app/immutable/assets/2.DRx9iR_1.css"];
export const fonts = [];
