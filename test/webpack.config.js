const { resolve } = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

export const baseWebpackConfig = {
	entry: resolve(__dirname, 'src'),
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	mode: 'production',
	optimization: {
		namedChunks: true
	},
	plugins: [new CleanWebpackPlugin(['dist', 'test.copied.chunk', 'test.moved.chunk'])]
}
