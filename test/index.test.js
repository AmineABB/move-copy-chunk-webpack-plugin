import fs from 'fs'
import webpack from 'webpack'
import chai from 'chai'
import { simulateWebpackBuild } from './utils'
import MoveCopyChunkPlugin from '../src'

const { expect } = chai
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

describe('MoveCopyChunkWebpackPlugin', () => {
	before(function() {
		console.info = () => {}
		console.warn = () => {}
	})

	it('should find plugin module', () => {
		expect(MoveCopyChunkPlugin).to.not.be.undefined
	})

	it('should successfully copie file to destination directory when { actionType: "copy", pattern: test.*0.*.js, to: "test/test.copied.chunk"} provided', async () => {
		const option = new MoveCopyChunkPlugin(
			[
				{
					actionType: 'copy',
					pattern: 'test.*0.*.js',
					to: 'test/test.copied.chunk'
				}
			],
			{
				logInfo: false
			}
		)

		await simulateWebpackBuild(webpack, option)

		const result = fs
			.readdirSync('test/test.copied.chunk')
			.filter(file => file.startsWith('test.async'))
			.toString()

		expect(result)
			.to.be.a('string')
			.that.have.string('test.async.md.0')
	})

	it('should successfully move and create destination directory when { actionType: "move", pattern: test.*2.*.js, to: "test/test.moved.chunk"} provided', async () => {
		const option = new MoveCopyChunkPlugin(
			[
				{
					actionType: 'move',
					pattern: 'test.*2.*.js',
					to: 'test/test.moved.chunk'
				}
			],
			{ logInfo: false }
		)

		await simulateWebpackBuild(webpack, option)

		const result = fs.existsSync('test/test.moved.chunk')
		expect(result).to.be.true
	})

	it('should successfully find moved chunk file when { actionType: "move", pattern: test.*2.*.js, to: "test/test.moved.chunk"} provided', () => {
		const result = fs
			.readdirSync('test/test.moved.chunk')
			.filter(file => file.startsWith('test.async'))
			.toString()

		expect(result)
			.to.be.a('string')
			.that.have.string('test.async')
	})

	it('should successfully show log for copied or moved files when optional option { logInfo: true } provided', async () => {
		const option = new MoveCopyChunkPlugin(
			[
				{
					actionType: 'copy',
					pattern: 'bundle.js',
					to: 'test/test.copied.chunk'
				}
			],
			{ logInfo: true }
		)

		await simulateWebpackBuild(webpack, option)
		const result = fs
			.readdirSync('test/test.copied.chunk')
			.filter(file => file.startsWith('bundle'))
			.toString()

		expect(result)
			.to.be.a('string')
			.that.have.string('bundle')
	})

	it('should successfully show log for no found file when optional option { } provided', async () => {
		const option = new MoveCopyChunkPlugin(
			[
				{
					actionType: 'move',
					pattern: 'test.*2*.js',
					to: 'test/test.moved.chunk'
				}
			],
			{}
		)

		await simulateWebpackBuild(webpack, option)
		const result = fs
			.readdirSync('test/test.moved.chunk')
			.filter(file => file.includes('2'))
			.toString()

		expect(result)
			.to.be.a('string')
			.that.have.string('2')
	})

	it('should fail webpack build if no options are passed', async () => {
		const pluginFn = () => {
			new MoveCopyChunkPlugin()
		}
		await expect(pluginFn).to.throw(Error)
	})

	it('should fail webpack build if the options are an object', async () => {
		const pluginFn = () => {
			new MoveCopyChunkPlugin({})
		}
		await expect(pluginFn).to.throw(Error)
	})

	it('should fail webpack build if actionType is not recognized', async () => {
		const plugin = new MoveCopyChunkPlugin(
			[
				{
					pattern: 'bundle.js',
					to: 'test/test.moved.chunk'
				}
			],
			{
				logInfo: false
			}
		)

		await expect(simulateWebpackBuild(webpack, plugin)).to.be.rejectedWith(
			Error,
			'[MoveCopyChunkPlugin]: Fail - actionType:undefined is not recognized'
		)
	})
})
