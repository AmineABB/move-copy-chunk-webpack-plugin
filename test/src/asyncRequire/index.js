/**
 * Load module by name
 * @param {String} name
 */
export const asyncRequire = name => {
	import(/* webpackChunkName: "test.async.md.[index].chk" */ `../modules/${name}`).then(({ default: init }) => {
		init()
	})
}
