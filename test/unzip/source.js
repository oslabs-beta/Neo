/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

class Source {
	source() {
		throw new Error("Abstract");
	}

	buffer() {
		const source = this.source();
		if (Buffer.isBuffer(source)) return source;
		return Buffer.from(source, "utf-8");
	}

	size() {
		return this.buffer().length;
	}

	map(options) {
		return null;
	}

	sourceAndMap(options) {
		return {
			source: this.source(),
			map: this.map(options)
		};
	}

	updateHash(hash) {
		throw new Error("Abstract");
	}
}

module.exports = Source;
uffer() : a.source();
	/** @type {Buffer|string} */
	let bSource = typeof b.buffer === "function" ? b.buffer() : b.source();
	if (aSource === bSource) return true;
	if (typeof aSource === "string" && typeof bSource === "string") return false;
	if (!Buffer.isBuffer(aSource)) aSource = Buffer.from(aSource, "utf-8");
	if (!Buffer.isBuffer(bSource)) bSource = Buffer.from(bSource, "utf-8");
	return aSource.equals(bSource);
};

/**
 * @param {Source} a a source
 * @param {Source} b another source
 * @returns {boolean} true, when both sources are equal
 */
const isSourceEqual = (a, b) => {
	if (a === b) return true;
	const cache1 = equalityCache.get(a);
	if (cache1 !== undefined) {
		const result = cache1.get(b);
		if (result !== undefined) return result;
	}
	const result = _isSourceEqual(a, b);
	if (cache1 !== undefined) {
		cache1.set(b, result);
	} else {
		const map = new WeakMap();
		map.set(b, result);
		equalityCache.set(a, map);
	}
	const cache2 = equalityCache.get(b);
	if (cache2 !== undefined) {
		cache2.set(a, result);
	} else {
		const map = new WeakMap();
		map.set(a, result);
		equalityCache.set(b, map);
	}
	return result;
};
exports.isSourceEqual = isSourceEqual;
