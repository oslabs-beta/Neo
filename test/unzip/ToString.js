var convert = require('./convert'),
    func = convert('toString', require('../toString'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
/#sec-tostring

module.exports = function ToString(argument) {
	if (typeof argument === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a string');
	}
	return $String(argument);
};
