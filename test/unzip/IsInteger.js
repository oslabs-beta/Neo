var convert = require('./convert'),
    func = convert('isInteger', require('../isInteger'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
rnational.org/6.0/#sec-isinteger

module.exports = function IsInteger(argument) {
	if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
		return false;
	}
	var absValue = abs(argument);
	return floor(absValue) === absValue;
};
