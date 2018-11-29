import fs from 'fs'
import { expect } from 'chai'
import MoveCopyChunkPlugin from '../lib'

describe('MoveCopyChunkWebpackPlugin', () => {
	it('Should find plugin module', () => {
		expect(MoveCopyChunkPlugin).to.be.exist
	})

	it('Should successfully copie file to destination directory when { pattern: *.0*.js, actionType: "copie", to: "test.copied.chunk"} provided', done => {
		const result = fs
			.readdirSync('./test.copied.chunk')
			.filter(fn => fn.startsWith('test.async'))
			.toString()

		expect(result)
			.to.be.a('string')
			.that.have.string('test.async.md.0')
		done()
	})

	it('Should successfully move and create destination directory when { pattern: *.2*.js, actionType: "move", to: "test.moved.chunk"} provided', done => {
		const result = fs.existsSync('./test.moved.chunk')
		expect(result).to.be.true
		done()
	})

	it('Should successfully find moved chunk file when { pattern: *.2*.js, actionType: "move", to: "test.moved.chunk"} provided', done => {
		const result = fs
			.readdirSync('./test.moved.chunk')
			.filter(fn => fn.startsWith('test.async'))
			.toString()

		expect(result)
			.to.be.a('string')
			.that.have.string('test.async')
		done()
	})
})
