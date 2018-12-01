import { baseWebpackConfig } from './webpack.config'

/**
 * Compile webpack fn
 * @param {*} webpack
 * @param {*} options
 */
export const compileWebpack = (webpack, options) => {
	return new Promise((resolve, reject) => {
		webpack(options, (err, stats) => {
			if (err) {
				return reject(err)
			} else if (stats.hasErrors()) {
				return reject(new Error(stats.toString()))
			}

			resolve(stats)
		})
	})
}

/**
 * Webpack build simulator
 * @param {*} webpack
 */
export const simulateWebpackBuild = (webpack, pluginOption) => {
	const plugins = baseWebpackConfig.plugins.push(pluginOption)
	const config = { ...baseWebpackConfig, ...plugins }
	return compileWebpack(webpack, config)
}
