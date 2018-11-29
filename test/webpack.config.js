const { resolve } = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MoveCopyChunkPlugin = require('../lib')

module.exports = {
	entry: resolve(__dirname, 'src/index.js'),
	output: {
		path: resolve(__dirname, 'dist/'),
		filename: 'bundle.js'
	},
	mode: 'production',
	optimization: {
		namedChunks: true
	},
	plugins: [
		new CleanWebpackPlugin(['dist', 'copied.chunk.dir', 'moved.chunk.dir']),
		new MoveCopyChunkPlugin([
			{
				actionType: 'copy',
				pattern: 'test.*0.*.js',
				to: 'test.copied.chunk'
			},
			{
				actionType: 'move',
				pattern: 'test.*2.*.js',
				to: 'test.moved.chunk'
			}
		])
	]
}
