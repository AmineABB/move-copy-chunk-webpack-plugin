import { asyncRequire } from './asyncRequire'

const test = () => {
	asyncRequire('moduleA')
	asyncRequire('moduleB')
}
/**
 * Simple Fn that require async modules
 */
export const initModules = () => {
	test()
}
