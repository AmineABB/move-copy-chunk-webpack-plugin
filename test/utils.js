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
 * Merge base webpack config with passed config
 * @param {Object} config
 * @returns {Object} webpack config
 */
export const mergeConfig = config => {
	const plugins = baseWebpackConfig.plugins.push(config)
	return {
		...baseWebpackConfig,
		...plugins
	}
}

/**
 * Webpack build simulator
 * @param {Compiler} webpack
 * @returns {Promise}
 */
export const simulateWebpackBuild = (webpack, pluginOption) => {
	const config = mergeConfig(pluginOption)
	return compileWebpack(webpack, config)
}
