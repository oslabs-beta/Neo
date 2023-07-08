var convert = require('./convert'),
    func = convert('toLength', require('../toLength'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
 len = ToIntegerOrInfinity(argument);
	if (len <= 0) { return 0; } // includes converting -0 to +0
	if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
	return len;
};
