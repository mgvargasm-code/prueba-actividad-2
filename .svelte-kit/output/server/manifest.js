export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".gitkeep"]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BVBSmEOl.js",app:"_app/immutable/entry/app.DaczqAVT.js",imports:["_app/immutable/entry/start.BVBSmEOl.js","_app/immutable/chunks/sapqUEOU.js","_app/immutable/chunks/CAUtrwhf.js","_app/immutable/chunks/FY7AgEyh.js","_app/immutable/entry/app.DaczqAVT.js","_app/immutable/chunks/CAUtrwhf.js","_app/immutable/chunks/Dq5DRvL7.js","_app/immutable/chunks/VIqI3I3Y.js","_app/immutable/chunks/FY7AgEyh.js","_app/immutable/chunks/upeKwYfS.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
