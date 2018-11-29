import fs from 'fs'
import { expect } from 'chai'
import MoveCopyChunkPlugin from '../lib'

describe('MoveCopyChunkWebpackPlugin', () => {
	it('should find plugin module', () => {
		expect(MoveCopyChunkPlugin).to.be.exist
	})

	it('should successfully copie file to destination directory when { actionType: "copie", pattern: test.*0.*.js, to: "test.copied.chunk"} provided', done => {
		const result = fs
			.readdirSync('./test.copied.chunk')
			.filter(fn => fn.startsWith('test.async'))
			.toString()

		expect(result)
			.to.be.a('string')
			.that.have.string('test.async.md.0')
		done()
	})

	it('should successfully move and create destination directory when { actionType: "move", pattern: test.*2.*.js, to: "test.moved.chunk"} provided', done => {
		const result = fs.existsSync('./test.moved.chunk')
		expect(result).to.be.true
		done()
	})

	it('should successfully find moved chunk file when { actionType: "move", pattern: test.*2.*.js, to: "test.moved.chunk"} provided', done => {
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
