/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { AsyncParallelHook, AsyncSeriesBailHook, SyncHook } = require("tapable");
const {
	makeWebpackError,
	makeWebpackErrorCallback
} = require("./HookWebpackError");

/** @typedef {import("./WebpackError")} WebpackError */

/**
 * @typedef {Object} Etag
 * @property {function(): string} toString
 */

/**
 * @template T
 * @callback CallbackCache
 * @param {(WebpackError | null)=} err
 * @param {T=} result
 * @returns {void}
 */

/**
 * @callback GotHandler
 * @param {any} result
 * @param {function(Error=): void} callback
 * @returns {void}
 */

const needCalls = (times, callback) => {
	return err => {
		if (--times === 0) {
			return callback(err);
		}
		if (err && times > 0) {
			times = 0;
			return callback(err);
		}
	};
};

class Cache {
	constructor() {
		this.hooks = {
			/** @type {AsyncSeriesBailHook<[string, Etag | null, GotHandler[]], any>} */
			get: new AsyncSeriesBailHook(["identifier", "etag", "gotHandlers"]),
			/** @type {AsyncParallelHook<[string, Etag | null, any]>} */
			store: new AsyncParallelHook(["identifier", "etag", "data"]),
			/** @type {AsyncParallelHook<[Iterable<string>]>} */
			storeBuildDependencies: new AsyncParallelHook(["dependencies"]),
			/** @type {SyncHook<[]>} */
			beginIdle: new SyncHook([]),
			/** @type {AsyncParallelHook<[]>} */
			endIdle: new AsyncParallelHook([]),
			/** @type {AsyncParallelHook<[]>} */
			shutdown: new AsyncParallelHook([])
		};
	}

	/**
	 * @template T
	 * @param {string} identifier the cache identifier
	 * @param {Etag | null} etag the etag
	 * @param {CallbackCache<T>} callback signals when the value is retrieved
	 * @returns {void}
	 */
	get(identifier, etag, callback) {
		const gotHandlers = [];
		this.hooks.get.callAsync(identifier, etag, gotHandlers, (err, result) => {
			if (err) {
				callback(makeWebpackError(err, "Cache.hooks.get"));
				return;
			}
			if (result === null) {
				result = undefined;
			}
			if (gotHandlers.length > 1) {
				const innerCallback = needCalls(gotHandlers.length, () =>
					callback(null, result)
				);
				for (const gotHandler of gotHandlers) {
					gotHandler(result, innerCallback);
				}
			} else if (gotHandlers.length === 1) {
				gotHandlers[0](result, () => callback(null, result));
			} else {
				callback(null, result);
			}
		});
	}

	/**
	 * @template T
	 * @param {string} identifier the cache identifier
	 * @param {Etag | null} etag the etag
	 * @param {T} data the value to store
	 * @param {CallbackCache<void>} callback signals when the value is stored
	 * @returns {void}
	 */
	store(identifier, etag, data, callback) {
		this.hooks.store.callAsync(
			identifier,
			etag,
			data,
			makeWebpackErrorCallback(callback, "Cache.hooks.store")
		);
	}

	/**
	 * After this method has succeeded the cache can only be restored when build dependencies are
	 * @param {Iterable<string>} dependencies list of all build dependencies
	 * @param {CallbackCache<void>} callback signals when the dependencies are stored
	 * @returns {void}
	 */
	storeBuildDependencies(dependencies, callback) {
		this.hooks.storeBuildDependencies.callAsync(
			dependencies,
			makeWebpackErrorCallback(callback, "Cache.hooks.storeBuildDependencies")
		);
	}

	/**
	 * @returns {void}
	 */
	beginIdle() {
		this.hooks.beginIdle.call();
	}

	/**
	 * @param {CallbackCache<void>} callback signals when the call finishes
	 * @returns {void}
	 */
	endIdle(callback) {
		this.hooks.endIdle.callAsync(
			makeWebpackErrorCallback(callback, "Cache.hooks.endIdle")
		);
	}

	/**
	 * @param {CallbackCache<void>} callback signals when the call finishes
	 * @returns {void}
	 */
	shutdown(callback) {
		this.hooks.shutdown.callAsync(
			makeWebpackErrorCallback(callback, "Cache.hooks.shutdown")
		);
	}
}

Cache.STAGE_MEMORY = -10;
Cache.STAGE_DEFAULT = 0;
Cache.STAGE_DISK = 10;
Cache.STAGE_NETWORK = 20;

module.exports = Cache;
a;

        var contentBuffer;
        try {
          contentBuffer = fs.readFileSync(file);
        } catch (ex) {
          contentBuffer = '';
        }

        var isDifferent = true;
        var hash = this.getHash(contentBuffer);

        if (!meta) {
          meta = { hash: hash };
        } else {
          isDifferent = hash !== meta.hash;
        }

        var nEntry = (normalizedEntries[file] = {
          key: file,
          changed: !cacheExists || isDifferent,
          meta: meta,
        });

        return nEntry;
      },

      /**
       * Return the list o the files that changed compared
       * against the ones stored in the cache
       *
       * @method getUpdated
       * @param files {Array} the array of files to compare against the ones in the cache
       * @returns {Array}
       */
      getUpdatedFiles: function (files) {
        var me = this;
        files = files || [];

        return me
          .normalizeEntries(files)
          .filter(function (entry) {
            return entry.changed;
          })
          .map(function (entry) {
            return entry.key;
          });
      },

      /**
       * return the list of files
       * @method normalizeEntries
       * @param files
       * @returns {*}
       */
      normalizeEntries: function (files) {
        files = files || [];

        var me = this;
        var nEntries = files.map(function (file) {
          return me.getFileDescriptor(file);
        });

        //normalizeEntries = nEntries;
        return nEntries;
      },

      /**
       * Remove an entry from the file-entry-cache. Useful to force the file to still be considered
       * modified the next time the process is run
       *
       * @method removeEntry
       * @param entryName
       */
      removeEntry: function (entryName) {
        delete normalizedEntries[entryName];
        cache.removeKey(entryName);
      },

      /**
       * Delete the cache file from the disk
       * @method deleteCacheFile
       */
      deleteCacheFile: function () {
        cache.removeCacheFile();
      },

      /**
       * remove the cache from the file and clear the memory cache
       */
      destroy: function () {
        normalizedEntries = {};
        cache.destroy();
      },

      _getMetaForFileUsingCheckSum: function (cacheEntry) {
        var contentBuffer = fs.readFileSync(cacheEntry.key);
        var hash = this.getHash(contentBuffer);
        var meta = Object.assign(cacheEntry.meta, { hash: hash });
        delete meta.size;
        delete meta.mtime;
        return meta;
      },

      _getMetaForFileUsingMtimeAndSize: function (cacheEntry) {
        var stat = fs.statSync(cacheEntry.key);
        var meta = Object.assign(cacheEntry.meta, {
          size: stat.size,
          mtime: stat.mtime.getTime(),
        });
        delete meta.hash;
        return meta;
      },

      /**
       * Sync the files and persist them to the cache
       * @method reconcile
       */
      reconcile: function (noPrune) {
        removeNotFoundFiles();

        noPrune = typeof noPrune === 'undefined' ? true : noPrune;

        var entries = normalizedEntries;
        var keys = Object.keys(entries);

        if (keys.length === 0) {
          return;
        }

        var me = this;

        keys.forEach(function (entryName) {
          var cacheEntry = entries[entryName];

          try {
            var meta = useChecksum
              ? me._getMetaForFileUsingCheckSum(cacheEntry)
              : me._getMetaForFileUsingMtimeAndSize(cacheEntry);
            cache.setKey(entryName, meta);
          } catch (err) {
            // if the file does not exists we don't save it
            // other errors are just thrown
            if (err.code !== 'ENOENT') {
              throw err;
            }
          }
        });

        cache.save(noPrune);
      },
    };
  },
};
