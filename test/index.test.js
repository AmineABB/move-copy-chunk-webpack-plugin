import fs from 'fs'
import webpack from 'webpack'
import { expect } from 'chai'
import { simulateWebpackBuild } from './utils'
import MoveCopyChunkPlugin from '../lib'

describe('MoveCopyChunkWebpackPlugin', () => {
	it('should find plugin module', () => {
		expect(MoveCopyChunkPlugin).to.exist
	})

	it('should successfully copie file to destination directory when { actionType: "copy", pattern: test.*0.*.js, to: "test.copied.chunk"} provided', async () => {
		const option = new MoveCopyChunkPlugin(
			[
				{
					actionType: 'copy',
					pattern: 'test.*0.*.js',
					to: 'test.copied.chunk'
				}
			],
			{
				logInfo: false
			}
		)

		await simulateWebpackBuild(webpack, option)

		const result = fs
			.readdirSync('./test.copied.chunk')
			.filter(file => file.startsWith('test.async'))
			.toString()

		expect(result)
			.to.be.a('string')
			.that.have.string('test.async.md.0')
	})

	it('should successfully move and create destination directory when { actionType: "move", pattern: test.*2.*.js, to: "test.moved.chunk"} provided', async () => {
		const option = new MoveCopyChunkPlugin(
			[
				{
					actionType: 'move',
					pattern: 'test.*2.*.js',
					to: 'test.moved.chunk'
				}
			],
			{
				logInfo: false
			}
		)

		await simulateWebpackBuild(webpack, option)

		const result = fs.existsSync('./test.moved.chunk')
		expect(result).to.be.true
	})

	it('should successfully find moved chunk file when { actionType: "move", pattern: test.*2.*.js, to: "test.moved.chunk"} provided', () => {
		const result = fs
			.readdirSync('./test.moved.chunk')
			.filter(file => file.startsWith('test.async'))
			.toString()

		expect(result)
			.to.be.a('string')
			.that.have.string('test.async')
	})

	it('should fail webpack build if no options are passed', () => {
		const pluginFn = () => {
			new MoveCopyChunkPlugin()
		}
		expect(pluginFn).to.throw(Error)
	})

	it('should fail webpack build if the options are an object', () => {
		const pluginFn = () => {
			new MoveCopyChunkPlugin({})
		}
		expect(pluginFn).to.throw(Error)
	})
})
