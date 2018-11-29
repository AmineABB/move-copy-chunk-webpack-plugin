import { asyncRequire } from './asyncRequire'

/**
 * Simple async modules which are used to test output files
 */
const initAsyncModules = () => {
	asyncRequire('moduleA')
	asyncRequire('moduleB')
}

/**
 * Fn entry point
 */
export default function initTestModules() {
	initAsyncModules()
}
