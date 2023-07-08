var convert = require('./convert'),
    func = convert('invoke', require('../invoke'));

func.placeholder = require('./placeholder');
module.exports = func;
re('./IsArray');
var GetV = require('./GetV');
var IsPropertyKey = require('./IsPropertyKey');

// https://262.ecma-international.org/6.0/#sec-invoke

module.exports = function Invoke(O, P) {
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	var argumentsList = arguments.length > 2 ? arguments[2] : [];
	if (!IsArray(argumentsList)) {
		throw new $TypeError('Assertion failed: optional `argumentsList`, if provided, must be a List');
	}
	var func = GetV(O, P);
	return Call(func, O, argumentsList);
};
