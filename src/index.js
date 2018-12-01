/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Abbi Amine <abbi.amine@gmail.com>
*/

const fs = require('fs-extra')
const { resolve } = require('path')
const { red, blue, yellow, bold } = require('chalk')
const minimatch = require('minimatch')

const pluginName = 'MoveCopyChunkPlugin'

class MoveCopyChunkPlugin {
	/**
	 * Creates an instance of MoveCopyChunk.
	 * @param {MoveCopyChunkOptions} options options passed to MoveCopyChunk
	 */
	constructor(options, globOptions = {}) {
		if (!Array.isArray(options)) {
			throw new Error(red(`[${pluginName}]: Fail - Argument should be an array`))
		}
		this.options = options
		this.globOptions = globOptions
		this.filteredChunks = []
	}

	/**
	 * Apply the plugin
	 * @param {Compiler} compiler Webpack Compiler
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.emit.tap(pluginName, compilation => {
			const helper = {
				options: this.options,
				fromPath: MoveCopyChunkPlugin.getDefaultOutput(compiler),
				toContext: MoveCopyChunkPlugin.getContext(compiler),
				chunksFileName: MoveCopyChunkPlugin.getChunksFileName(compilation)
			}
			this.parseChunkOptions(helper, MoveCopyChunkPlugin.processChunks, this.filteredChunks)
		})
		compiler.hooks.afterEmit.tap(pluginName, () => {
			this.chunkActionType(this.filteredChunks)
		})
	}

	/**
	 * Get output path to use as from path
	 * @param {Compiler} Webpack Compiler
	 * @returns {String} returns output path
	 */
	static getDefaultOutput(compiler) {
		const {
			options: {
				output: { path: from }
			}
		} = compiler
		return from
	}

	/**
	 * Get context path to use as context option if not set
	 * @returns {String} context path
	 */
	static getContext(compiler) {
		const {
			options: { context }
		} = compiler
		return context
	}

	/**
	 * Get chunk filename
	 * @param {compilation} compilation chunks list
	 * @returns {Array} returns chunks filenames
	 */
	static getChunksFileName(compilation) {
		const { chunks } = compilation
		const chunksFile = []
		Object.keys(chunks).forEach(key => {
			const { files } = chunks[key]
			Object.values(files).forEach(fileName => chunksFile.push(fileName))
		})
		return chunksFile
	}

	/**
	 * Helper Fn to check if we can show log console or not
	 */
	showLogs(callback) {
		const { logInfo = true } = this.globOptions
		logInfo && callback()
	}

	/**
	 * Parse plugin options argument
	 * @param {chunksOptions} chunks options
	 * @returns {void}
	 */
	parseChunkOptions({ options, fromPath, toContext, chunksFileName }, processChunks, filteredChunks) {
		Object.keys(options).forEach(key => {
			const { context: chunkToContext } = options[key]
			const context = chunkToContext || toContext
			const mergedOption = { ...options[key], from: fromPath, context }
			processChunks.call(this, mergedOption, chunksFileName, filteredChunks)
		})
	}

	/**
	 * Returns if chunk name match pattern or not
	 * @param {string} chunk fileName
	 * @param {string} chunk RegEx to match
	 * @returns {boolean} returns true if chunk match the given pattern
	 */
	static isChunkNameMatch(name, pattern) {
		return minimatch(name, pattern)
	}

	/**
	 * Prepare the list of chunks that will be managed by the specified action type
	 * @param {Array} chunks array fileNames
	 * @param {Object} additional chunk option
	 * @returns {void}
	 */
	static processChunks({ from, to, pattern, actionType, context }, chunksName, filteredChunks) {
		Object.values(chunksName).forEach(fileName => {
			if (MoveCopyChunkPlugin.isChunkNameMatch(fileName, pattern)) {
				filteredChunks.push({
					fileName,
					actionType,
					from,
					to,
					context
				})
			}
		})
		return filteredChunks
	}

	/**
	 * Execute the specified action for each chunk after file emit
	 * @param {chunksList} chunks filtred list
	 * @returns {void}
	 */
	chunkActionType(chunksList) {
		Object.values(chunksList).forEach(data => {
			const { actionType, ...actionData } = data
			if (actionType === undefined || actionType === '') {
				throw new Error(red(`[${pluginName}]: Fail - Missing or wrong actionType argument value`))
			}
			switch (actionType.toLowerCase()) {
				case 'copy':
					this.copyChunk(actionData)
					break
				case 'move':
					this.moveChunk(actionData)
					break
				default:
					console.warn(yellow(`${bold(pluginName)}: actionType:${actionType} is not recognized`))
					break
			}
		})
	}

	/**
	 * Returns path to resolve from or to
	 * @param {String} path from where to resolve from or to
	 * @param {String} fileName to resolve from and to use for the to output
	 * @param {String} separator separate path to resolve correct path
	 * @returns {String} full path for the given from or to directory
	 */
	static resolveActionPath(path, fileName, separator = '/') {
		return resolve(process.cwd(), `${path}${separator}${fileName}`)
	}

	/**
	 * Dispatcher of action type (Copy or move)
	 * @param {Function} actionType
	 * @param {Object} actionData
	 * @returns {void}
	 */
	actionProcess(actionType, actionData, additionalOptions = {}) {
		const { from, to, fileName, context } = actionData
		const fromPath = MoveCopyChunkPlugin.resolveActionPath(from, fileName)
		const toPath = MoveCopyChunkPlugin.resolveActionPath(context, `${to}/${fileName}`)

		if (fs.existsSync(fromPath)) {
			actionType(fromPath, toPath, additionalOptions)
			this.showLogs(() => {
				console.info(`${bold(pluginName)}: \n Chunk: [${blue(`${fromPath}`)}] \n Saved to: [${blue(`${toPath}`)}]\n`)
			})
		} else {
			console.warn(yellow(`${bold(pluginName)}: ${fromPath} not found`))
		}
	}

	/**
	 * Copy the matched chunk to the given path
	 * @param {Object} chunk data
	 */
	copyChunk(actionData) {
		this.actionProcess(fs.copySync, actionData)
	}

	/**
	 * Move the matched chunk to the given path
	 * @param {Object} chunk
	 */
	moveChunk(actionData) {
		this.actionProcess(fs.moveSync, actionData, { overwrite: true })
	}
}

module.exports = MoveCopyChunkPlugin
