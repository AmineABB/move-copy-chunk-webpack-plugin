module.exports = {
	env: {
		browser: false,
		es6: true,
		node: true,
		mocha: true
	},
	parser: 'babel-eslint',
	rules: {
		indent: [2, 'tab', { SwitchCase: 1 }],
		semi: [2, 'never'],
		'no-tabs': 0,
		'comma-dangle': 0,
		'no-use-before-define': [2, { functions: false }]
	}
}
