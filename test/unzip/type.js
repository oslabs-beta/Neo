'use strict';

var ES5Type = require('../5/Type');

// https://262.ecma-international.org/11.0/#sec-ecmascript-data-types-and-values

module.exports = function Type(x) {
	if (typeof x === 'symbol') {
		return 'Symbol';
	}
	if (typeof x === 'bigint') {
		return 'BigInt';
	}
	return ES5Type(x);
};
);
const error_1 = require("./error");
exports.intRange = {
    int8: [-128, 127, 3],
    uint8: [0, 255, 3],
    int16: [-32768, 32767, 5],
    uint16: [0, 65535, 5],
    int32: [-2147483648, 2147483647, 10],
    uint32: [0, 4294967295, 10],
};
const error = {
    message: (cxt) => (0, error_1.typeErrorMessage)(cxt, cxt.schema),
    params: (cxt) => (0, error_1.typeErrorParams)(cxt, cxt.schema),
};
function timestampCode(cxt) {
    const { gen, data, it } = cxt;
    const { timestamp, allowDate } = it.opts;
    if (timestamp === "date")
        return (0, codegen_1._) `${data} instanceof Date `;
    const vts = (0, util_1.useFunc)(gen, timestamp_1.default);
    const allowDateArg = allowDate ? (0, codegen_1._) `, true` : codegen_1.nil;
    const validString = (0, codegen_1._) `typeof ${data} == "string" && ${vts}(${data}${allowDateArg})`;
    return timestamp === "string" ? validString : (0, codegen_1.or)((0, codegen_1._) `${data} instanceof Date`, validString);
}
const def = {
    keyword: "type",
    schemaType: "string",
    error,
    code(cxt) {
        (0, metadata_1.checkMetadata)(cxt);
        const { data, schema, parentSchema, it } = cxt;
        let cond;
        switch (schema) {
            case "boolean":
            case "string":
                cond = (0, codegen_1._) `typeof ${data} == ${schema}`;
                break;
            case "timestamp": {
                cond = timestampCode(cxt);
                break;
            }
            case "float32":
            case "float64":
                cond = (0, codegen_1._) `typeof ${data} == "number"`;
                break;
            default: {
                const sch = schema;
                cond = (0, codegen_1._) `typeof ${data} == "number" && isFinite(${data}) && !(${data} % 1)`;
                if (!it.opts.int32range && (sch === "int32" || sch === "uint32")) {
                    if (sch === "uint32")
                        cond = (0, codegen_1._) `${cond} && ${data} >= 0`;
                }
                else {
                    const [min, max] = exports.intRange[sch];
                    cond = (0, codegen_1._) `${cond} && ${data} >= ${min} && ${data} <= ${max}`;
                }
            }
        }
        cxt.pass(parentSchema.nullable ? (0, codegen_1.or)((0, codegen_1._) `${data} === null`, cond) : cond);
    },
};
exports.default = def;
//# sourceMappingURL=type.js.map