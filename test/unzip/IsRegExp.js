var convert = require('./convert'),
    func = convert('isRegExp', require('../isRegExp'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
olean');

// https://262.ecma-international.org/6.0/#sec-isregexp

module.exports = function IsRegExp(argument) {
	if (!argument || typeof argument !== 'object') {
		return false;
	}
	if ($match) {
		var isRegExp = argument[$match];
		if (typeof isRegExp !== 'undefined') {
			return ToBoolean(isRegExp);
		}
	}
	return hasRegExpMatcher(argument);
};
