

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.rWI3gfPM.js","_app/immutable/chunks/VIqI3I3Y.js","_app/immutable/chunks/CAUtrwhf.js","_app/immutable/chunks/4OkWPtTs.js"];
export const stylesheets = ["_app/immutable/assets/0.C29fD765.css"];
export const fonts = [];
