'use strict';

var use = require('use');
var define = require('define-property');
var debug = require('debug')('snapdragon:compiler');
var utils = require('./utils');

/**
 * Create a new `Compiler` with the given `options`.
 * @param {Object} `options`
 */

function Compiler(options, state) {
  debug('initializing', __filename);
  this.options = utils.extend({source: 'string'}, options);
  this.state = state || {};
  this.compilers = {};
  this.output = '';
  this.set('eos', function(node) {
    return this.emit(node.val, node);
  });
  this.set('noop', function(node) {
    return this.emit(node.val, node);
  });
  this.set('bos', function(node) {
    return this.emit(node.val, node);
  });
  use(this);
}

/**
 * Prototype methods
 */

Compiler.prototype = {

  /**
   * Throw an error message with details including the cursor position.
   * @param {String} `msg` Message to use in the Error.
   */

  error: function(msg, node) {
    var pos = node.position || {start: {column: 0}};
    var message = this.options.source + ' column:' + pos.start.column + ': ' + msg;

    var err = new Error(message);
    err.reason = msg;
    err.column = pos.start.column;
    err.source = this.pattern;

    if (this.options.silent) {
      this.errors.push(err);
    } else {
      throw err;
    }
  },

  /**
   * Define a non-enumberable property on the `Compiler` instance.
   *
   * ```js
   * compiler.define('foo', 'bar');
   * ```
   * @name .define
   * @param {String} `key` propery name
   * @param {any} `val` property value
   * @return {Object} Returns the Compiler instance for chaining.
   * @api public
   */

  define: function(key, val) {
    define(this, key, val);
    return this;
  },

  /**
   * Emit `node.val`
   */

  emit: function(str, node) {
    this.output += str;
    return str;
  },

  /**
   * Add a compiler `fn` with the given `name`
   */

  set: function(name, fn) {
    this.compilers[name] = fn;
    return this;
  },

  /**
   * Get compiler `name`.
   */

  get: function(name) {
    return this.compilers[name];
  },

  /**
   * Get the previous AST node.
   */

  prev: function(n) {
    return this.ast.nodes[this.idx - (n || 1)] || { type: 'bos', val: '' };
  },

  /**
   * Get the next AST node.
   */

  next: function(n) {
    return this.ast.nodes[this.idx + (n || 1)] || { type: 'eos', val: '' };
  },

  /**
   * Visit `node`.
   */

  visit: function(node, nodes, i) {
    var fn = this.compilers[node.type];
    this.idx = i;

    if (typeof fn !== 'function') {
      throw this.error('compiler "' + node.type + '" is not registered', node);
    }
    return fn.call(this, node, nodes, i);
  },

  /**
   * Map visit over array of `nodes`.
   */

  mapVisit: function(nodes) {
    if (!Array.isArray(nodes)) {
      throw new TypeError('expected an array');
    }
    var len = nodes.length;
    var idx = -1;
    while (++idx < len) {
      this.visit(nodes[idx], nodes, idx);
    }
    return this;
  },

  /**
   * Compile `ast`.
   */

  compile: function(ast, options) {
    var opts = utils.extend({}, this.options, options);
    this.ast = ast;
    this.parsingErrors = this.ast.errors;
    this.output = '';

    // source map support
    if (opts.sourcemap) {
      var sourcemaps = require('./source-maps');
      sourcemaps(this);
      this.mapVisit(this.ast.nodes);
      this.applySourceMaps();
      this.map = opts.sourcemap === 'generator' ? this.map : this.map.toJSON();
      return this;
    }

    this.mapVisit(this.ast.nodes);
    return this;
  }
};

/**
 * Expose `Compiler`
 */

module.exports = Compiler;
eturns {boolean} true, if the filename contains any hash
 */
const includesHash = (filename, hashes) => {
	if (!hashes) return false;
	if (Array.isArray(hashes)) {
		return hashes.some(hash => filename.includes(hash));
	} else {
		return filename.includes(hashes);
	}
};

class Compiler {
	/**
	 * @param {string} context the compilation path
	 * @param {WebpackOptions} options options
	 */
	constructor(context, options = /** @type {WebpackOptions} */ ({})) {
		this.hooks = Object.freeze({
			/** @type {SyncHook<[]>} */
			initialize: new SyncHook([]),

			/** @type {SyncBailHook<[Compilation], boolean>} */
			shouldEmit: new SyncBailHook(["compilation"]),
			/** @type {AsyncSeriesHook<[Stats]>} */
			done: new AsyncSeriesHook(["stats"]),
			/** @type {SyncHook<[Stats]>} */
			afterDone: new SyncHook(["stats"]),
			/** @type {AsyncSeriesHook<[]>} */
			additionalPass: new AsyncSeriesHook([]),
			/** @type {AsyncSeriesHook<[Compiler]>} */
			beforeRun: new AsyncSeriesHook(["compiler"]),
			/** @type {AsyncSeriesHook<[Compiler]>} */
			run: new AsyncSeriesHook(["compiler"]),
			/** @type {AsyncSeriesHook<[Compilation]>} */
			emit: new AsyncSeriesHook(["compilation"]),
			/** @type {AsyncSeriesHook<[string, AssetEmittedInfo]>} */
			assetEmitted: new AsyncSeriesHook(["file", "info"]),
			/** @type {AsyncSeriesHook<[Compilation]>} */
			afterEmit: new AsyncSeriesHook(["compilation"]),

			/** @type {SyncHook<[Compilation, CompilationParams]>} */
			thisCompilation: new SyncHook(["compilation", "params"]),
			/** @type {SyncHook<[Compilation, CompilationParams]>} */
			compilation: new SyncHook(["compilation", "params"]),
			/** @type {SyncHook<[NormalModuleFactory]>} */
			normalModuleFactory: new SyncHook(["normalModuleFactory"]),
			/** @type {SyncHook<[ContextModuleFactory]>}  */
			contextModuleFactory: new SyncHook(["contextModuleFactory"]),

			/** @type {AsyncSeriesHook<[CompilationParams]>} */
			beforeCompile: new AsyncSeriesHook(["params"]),
			/** @type {SyncHook<[CompilationParams]>} */
			compile: new SyncHook(["params"]),
			/** @type {AsyncParallelHook<[Compilation]>} */
			make: new AsyncParallelHook(["compilation"]),
			/** @type {AsyncParallelHook<[Compilation]>} */
			finishMake: new AsyncSeriesHook(["compilation"]),
			/** @type {AsyncSeriesHook<[Compilation]>} */
			afterCompile: new AsyncSeriesHook(["compilation"]),

			/** @type {AsyncSeriesHook<[]>} */
			readRecords: new AsyncSeriesHook([]),
			/** @type {AsyncSeriesHook<[]>} */
			emitRecords: new AsyncSeriesHook([]),

			/** @type {AsyncSeriesHook<[Compiler]>} */
			watchRun: new AsyncSeriesHook(["compiler"]),
			/** @type {SyncHook<[Error]>} */
			failed: new SyncHook(["error"]),
			/** @type {SyncHook<[string | null, number]>} */
			invalid: new SyncHook(["filename", "changeTime"]),
			/** @type {SyncHook<[]>} */
			watchClose: new SyncHook([]),
			/** @type {AsyncSeriesHook<[]>} */
			shutdown: new AsyncSeriesHook([]),

			/** @type {SyncBailHook<[string, string, any[]], true>} */
			infrastructureLog: new SyncBailHook(["origin", "type", "args"]),

			// TODO the following hooks are weirdly located here
			// TODO move them for webpack 5
			/** @type {SyncHook<[]>} */
			environment: new SyncHook([]),
			/** @type {SyncHook<[]>} */
			afterEnvironment: new SyncHook([]),
			/** @type {SyncHook<[Compiler]>} */
			afterPlugins: new SyncHook(["compiler"]),
			/** @type {SyncHook<[Compiler]>} */
			afterResolvers: new SyncHook(["compiler"]),
			/** @type {SyncBailHook<[string, Entry], boolean>} */
			entryOption: new SyncBailHook(["context", "entry"])
		});

		this.webpack = webpack;

		/** @type {string=} */
		this.name = undefined;
		/** @type {Compilation=} */
		this.parentCompilation = undefined;
		/** @type {Compiler} */
		this.root = this;
		/** @type {string} */
		this.outputPath = "";
		/** @type {Watching} */
		this.watching = undefined;

		/** @type {OutputFileSystem} */
		this.outputFileSystem = null;
		/** @type {IntermediateFileSystem} */
		this.intermediateFileSystem = null;
		/** @type {InputFileSystem} */
		this.inputFileSystem = null;
		/** @type {WatchFileSystem} */
		this.watchFileSystem = null;

		/** @type {string|null} */
		this.recordsInputPath = null;
		/** @type {string|null} */
		this.recordsOutputPath = null;
		this.records = {};
		/** @type {Set<string | RegExp>} */
		this.managedPaths = new Set();
		/** @type {Set<string | RegExp>} */
		this.immutablePaths = new Set();

		/** @type {ReadonlySet<string>} */
		this.modifiedFiles = undefined;
		/** @type {ReadonlySet<string>} */
		this.removedFiles = undefined;
		/** @type {ReadonlyMap<string, FileSystemInfoEntry | "ignore" | null>} */
		this.fileTimestamps = undefined;
		/** @type {ReadonlyMap<string, FileSystemInfoEntry | "ignore" | null>} */
		this.contextTimestamps = undefined;
		/** @type {number} */
		this.fsStartTime = undefined;

		/** @type {ResolverFactory} */
		this.resolverFactory = new ResolverFactory();

		this.infrastructureLogger = undefined;

		this.options = options;

		this.context = context;

		this.requestShortener = new RequestShortener(context, this.root);

		this.cache = new Cache();

		/** @type {Map<Module, { buildInfo: object, references: WeakMap<Dependency, Module>, memCache: WeakTupleMap }> | undefined} */
		this.moduleMemCaches = undefined;

		this.compilerPath = "";

		/** @type {boolean} */
		this.running = false;

		/** @type {boolean} */
		this.idle = false;

		/** @type {boolean} */
		this.watchMode = false;

		this._backCompat = this.options.experiments.backCompat !== false;

		/** @type {Compilation} */
		this._lastCompilation = undefined;
		/** @type {NormalModuleFactory} */
		this._lastNormalModuleFactory = undefined;

		/** @private @type {WeakMap<Source, { sizeOnlySource: SizeOnlySource, writtenTo: Map<string, number> }>} */
		this._assetEmittingSourceCache = new WeakMap();
		/** @private @type {Map<string, number>} */
		this._assetEmittingWrittenFiles = new Map();
		/** @private @type {Set<string>} */
		this._assetEmittingPreviousFiles = new Set();
	}

	/**
	 * @param {string} name cache name
	 * @returns {CacheFacade} the cache facade instance
	 */
	getCache(name) {
		return new CacheFacade(
			this.cache,
			`${this.compilerPath}${name}`,
			this.options.output.hashFunction
		);
	}

	/**
	 * @param {string | (function(): string)} name name of the logger, or function called once to get the logger name
	 * @returns {Logger} a logger with that name
	 */
	getInfrastructureLogger(name) {
		if (!name) {
			throw new TypeError(
				"Compiler.getInfrastructureLogger(name) called without a name"
			);
		}
		return new Logger(
			(type, args) => {
				if (typeof name === "function") {
					name = name();
					if (!name) {
						throw new TypeError(
							"Compiler.getInfrastructureLogger(name) called with a function not returning a name"
						);
					}
				}
				if (this.hooks.infrastructureLog.call(name, type, args) === undefined) {
					if (this.infrastructureLogger !== undefined) {
						this.infrastructureLogger(name, type, args);
					}
				}
			},
			childName => {
				if (typeof name === "function") {
					if (typeof childName === "function") {
						return this.getInfrastructureLogger(() => {
							if (typeof name === "function") {
								name = name();
								if (!name) {
									throw new TypeError(
										"Compiler.getInfrastructureLogger(name) called with a function not returning a name"
									);
								}
							}
							if (typeof childName === "function") {
								childName = childName();
								if (!childName) {
									throw new TypeError(
										"Logger.getChildLogger(name) called with a function not returning a name"
									);
								}
							}
							return `${name}/${childName}`;
						});
					} else {
						return this.getInfrastructureLogger(() => {
							if (typeof name === "function") {
								name = name();
								if (!name) {
									throw new TypeError(
										"Compiler.getInfrastructureLogger(name) called with a function not returning a name"
									);
								}
							}
							return `${name}/${childName}`;
						});
					}
				} else {
					if (typeof childName === "function") {
						return this.getInfrastructureLogger(() => {
							if (typeof childName === "function") {
								childName = childName();
								if (!childName) {
									throw new TypeError(
										"Logger.getChildLogger(name) called with a function not returning a name"
									);
								}
							}
							return `${name}/${childName}`;
						});
					} else {
						return this.getInfrastructureLogger(`${name}/${childName}`);
					}
				}
			}
		);
	}

	// TODO webpack 6: solve this in a better way
	// e.g. move compilation specific info from Modules into ModuleGraph
	_cleanupLastCompilation() {
		if (this._lastCompilation !== undefined) {
			for (const module of this._lastCompilation.modules) {
				ChunkGraph.clearChunkGraphForModule(module);
				ModuleGraph.clearModuleGraphForModule(module);
				module.cleanupForCache();
			}
			for (const chunk of this._lastCompilation.chunks) {
				ChunkGraph.clearChunkGraphForChunk(chunk);
			}
			this._lastCompilation = undefined;
		}
	}

	// TODO webpack 6: solve this in a better way
	_cleanupLastNormalModuleFactory() {
		if (this._lastNormalModuleFactory !== undefined) {
			this._lastNormalModuleFactory.cleanupForCache();
			this._lastNormalModuleFactory = undefined;
		}
	}

	/**
	 * @param {WatchOptions} watchOptions the watcher's options
	 * @param {Callback<Stats>} handler signals when the call finishes
	 * @returns {Watching} a compiler watcher
	 */
	watch(watchOptions, handler) {
		if (this.running) {
			return handler(new ConcurrentCompilationError());
		}

		this.running = true;
		this.watchMode = true;
		this.watching = new Watching(this, watchOptions, handler);
		return this.watching;
	}

	/**
	 * @param {Callback<Stats>} callback signals when the call finishes
	 * @returns {void}
	 */
	run(callback) {
		if (this.running) {
			return callback(new ConcurrentCompilationError());
		}

		let logger;

		const finalCallback = (err, stats) => {
			if (logger) logger.time("beginIdle");
			this.idle = true;
			this.cache.beginIdle();
			this.idle = true;
			if (logger) logger.timeEnd("beginIdle");
			this.running = false;
			if (err) {
				this.hooks.failed.call(err);
			}
			if (callback !== undefined) callback(err, stats);
			this.hooks.afterDone.call(stats);
		};

		const startTime = Date.now();

		this.running = true;

		const onCompiled = (err, compilation) => {
			if (err) return finalCallback(err);

			if (this.hooks.shouldEmit.call(compilation) === false) {
				compilation.startTime = startTime;
				compilation.endTime = Date.now();
				const stats = new Stats(compilation);
				this.hooks.done.callAsync(stats, err => {
					if (err) return finalCallback(err);
					return finalCallback(null, stats);
				});
				return;
			}

			process.nextTick(() => {
				logger = compilation.getLogger("webpack.Compiler");
				logger.time("emitAssets");
				this.emitAssets(compilation, err => {
					logger.timeEnd("emitAssets");
					if (err) return finalCallback(err);

					if (compilation.hooks.needAdditionalPass.call()) {
						compilation.needAdditionalPass = true;

						compilation.startTime = startTime;
						compilation.endTime = Date.now();
						logger.time("done hook");
						const stats = new Stats(compilation);
						this.hooks.done.callAsync(stats, err => {
							logger.timeEnd("done hook");
							if (err) return finalCallback(err);

							this.hooks.additionalPass.callAsync(err => {
								if (err) return finalCallback(err);
								this.compile(onCompiled);
							});
						});
						return;
					}

					logger.time("emitRecords");
					this.emitRecords(err => {
						logger.timeEnd("emitRecords");
						if (err) return finalCallback(err);

						compilation.startTime = startTime;
						compilation.endTime = Date.now();
						logger.time("done hook");
						const stats = new Stats(compilation);
						this.hooks.done.callAsync(stats, err => {
							logger.timeEnd("done hook");
							if (err) return finalCallback(err);
							this.cache.storeBuildDependencies(
								compilation.buildDependencies,
								err => {
									if (err) return finalCallback(err);
									return finalCallback(null, stats);
								}
							);
						});
					});
				});
			});
		};

		const run = () => {
			this.hooks.beforeRun.callAsync(this, err => {
				if (err) return finalCallback(err);

				this.hooks.run.callAsync(this, err => {
					if (err) return finalCallback(err);

					this.readRecords(err => {
						if (err) return finalCallback(err);

						this.compile(onCompiled);
					});
				});
			});
		};

		if (this.idle) {
			this.cache.endIdle(err => {
				if (err) return finalCallback(err);

				this.idle = false;
				run();
			});
		} else {
			run();
		}
	}

	/**
	 * @param {RunAsChildCallback} callback signals when the call finishes
	 * @returns {void}
	 */
	runAsChild(callback) {
		const startTime = Date.now();

		const finalCallback = (err, entries, compilation) => {
			try {
				callback(err, entries, compilation);
			} catch (e) {
				const err = new WebpackError(
					`compiler.runAsChild callback error: ${e}`
				);
				err.details = e.stack;
				this.parentCompilation.errors.push(err);
			}
		};

		this.compile((err, compilation) => {
			if (err) return finalCallback(err);

			this.parentCompilation.children.push(compilation);
			for (const { name, source, info } of compilation.getAssets()) {
				this.parentCompilation.emitAsset(name, source, info);
			}

			const entries = [];
			for (const ep of compilation.entrypoints.values()) {
				entries.push(...ep.chunks);
			}

			compilation.startTime = startTime;
			compilation.endTime = Date.now();

			return finalCallback(null, entries, compilation);
		});
	}

	purgeInputFileSystem() {
		if (this.inputFileSystem && this.inputFileSystem.purge) {
			this.inputFileSystem.purge();
		}
	}

	/**
	 * @param {Compilation} compilation the compilation
	 * @param {Callback<void>} callback signals when the assets are emitted
	 * @returns {void}
	 */
	emitAssets(compilation, callback) {
		let outputPath;

		const emitFiles = err => {
			if (err) return callback(err);

			const assets = compilation.getAssets();
			compilation.assets = { ...compilation.assets };
			/** @type {Map<string, { path: string, source: Source, size: number, waiting: { cacheEntry: any, file: string }[] }>} */
			const caseInsensitiveMap = new Map();
			/** @type {Set<string>} */
			const allTargetPaths = new Set();
			asyncLib.forEachLimit(
				assets,
				15,
				({ name: file, source, info }, callback) => {
					let targetFile = file;
					let immutable = info.immutable;
					const queryStringIdx = targetFile.indexOf("?");
					if (queryStringIdx >= 0) {
						targetFile = targetFile.slice(0, queryStringIdx);
						// We may remove the hash, which is in the query string
						// So we recheck if the file is immutable
						// This doesn't cover all cases, but immutable is only a performance optimization anyway
						immutable =
							immutable &&
							(includesHash(targetFile, info.contenthash) ||
								includesHash(targetFile, info.chunkhash) ||
								includesHash(targetFile, info.modulehash) ||
								includesHash(targetFile, info.fullhash));
					}

					const writeOut = err => {
						if (err) return callback(err);
						const targetPath = join(
							this.outputFileSystem,
							outputPath,
							targetFile
						);
						allTargetPaths.add(targetPath);

						// check if the target file has already been written by this Compiler
						const targetFileGeneration =
							this._assetEmittingWrittenFiles.get(targetPath);

						// create an cache entry for this Source if not already existing
						let cacheEntry = this._assetEmittingSourceCache.get(source);
						if (cacheEntry === undefined) {
							cacheEntry = {
								sizeOnlySource: undefined,
								writtenTo: new Map()
							};
							this._assetEmittingSourceCache.set(source, cacheEntry);
						}

						let similarEntry;

						const checkSimilarFile = () => {
							const caseInsensitiveTargetPath = targetPath.toLowerCase();
							similarEntry = caseInsensitiveMap.get(caseInsensitiveTargetPath);
							if (similarEntry !== undefined) {
								const { path: other, source: otherSource } = similarEntry;
								if (isSourceEqual(otherSource, source)) {
									// Size may or may not be available at this point.
									// If it's not available add to "waiting" list and it will be updated once available
									if (similarEntry.size !== undefined) {
										updateWithReplacementSource(similarEntry.size);
									} else {
										if (!similarEntry.waiting) similarEntry.waiting = [];
										similarEntry.waiting.push({ file, cacheEntry });
									}
									alreadyWritten();
								} else {
									const err =
										new WebpackError(`Prevent writing to file that only differs in casing or query string from already written file.
This will lead to a race-condition and corrupted files on case-insensitive file systems.
${targetPath}
${other}`);
									err.file = file;
									callback(err);
								}
								return true;
							} else {
								caseInsensitiveMap.set(
									caseInsensitiveTargetPath,
									(similarEntry = {
										path: targetPath,
										source,
										size: undefined,
										waiting: undefined
									})
								);
								return false;
							}
						};

						/**
						 * get the binary (Buffer) content from the Source
						 * @returns {Buffer} content for the source
						 */
						const getContent = () => {
							if (typeof source.buffer === "function") {
								return source.buffer();
							} else {
								const bufferOrString = source.source();
								if (Buffer.isBuffer(bufferOrString)) {
									return bufferOrString;
								} else {
									return Buffer.from(bufferOrString, "utf8");
								}
							}
						};

						const alreadyWritten = () => {
							// cache the information that the Source has been already been written to that location
							if (targetFileGeneration === undefined) {
								const newGeneration = 1;
								this._assetEmittingWrittenFiles.set(targetPath, newGeneration);
								cacheEntry.writtenTo.set(targetPath, newGeneration);
							} else {
								cacheEntry.writtenTo.set(targetPath, targetFileGeneration);
							}
							callback();
						};

						/**
						 * Write the file to output file system
						 * @param {Buffer} content content to be written
						 * @returns {void}
						 */
						const doWrite = content => {
							this.outputFileSystem.writeFile(targetPath, content, err => {
								if (err) return callback(err);

								// information marker that the asset has been emitted
								compilation.emittedAssets.add(file);

								// cache the information that the Source has been written to that location
								const newGeneration =
									targetFileGeneration === undefined
										? 1
										: targetFileGeneration + 1;
								cacheEntry.writtenTo.set(targetPath, newGeneration);
								this._assetEmittingWrittenFiles.set(targetPath, newGeneration);
								this.hooks.assetEmitted.callAsync(
									file,
									{
										content,
										source,
										outputPath,
										compilation,
										targetPath
									},
									callback
								);
							});
						};

						const updateWithReplacementSource = size => {
							updateFileWithReplacementSource(file, cacheEntry, size);
							similarEntry.size = size;
							if (similarEntry.waiting !== undefined) {
								for (const { file, cacheEntry } of similarEntry.waiting) {
									updateFileWithReplacementSource(file, cacheEntry, size);
								}
							}
						};

						const updateFileWithReplacementSource = (
							file,
							cacheEntry,
							size
						) => {
							// Create a replacement resource which only allows to ask for size
							// This allows to GC all memory allocated by the Source
							// (expect when the Source is stored in any other cache)
							if (!cacheEntry.sizeOnlySource) {
								cacheEntry.sizeOnlySource = new SizeOnlySource(size);
							}
							compilation.updateAsset(file, cacheEntry.sizeOnlySource, {
								size
							});
						};

						const processExistingFile = stats => {
							// skip emitting if it's already there and an immutable file
							if (immutable) {
								updateWithReplacementSource(stats.size);
								return alreadyWritten();
							}

							const content = getContent();

							updateWithReplacementSource(content.length);

							// if it exists and content on disk matches content
							// skip writing the same content again
							// (to keep mtime and don't trigger watchers)
							// for a fast negative match file size is compared first
							if (content.length === stats.size) {
								compilation.comparedForEmitAssets.add(file);
								return this.outputFileSystem.readFile(
									targetPath,
									(err, existingContent) => {
										if (
											err ||
											!content.equals(/** @type {Buffer} */ (existingContent))
										) {
											return doWrite(content);
										} else {
											return alreadyWritten();
										}
									}
								);
							}

							return doWrite(content);
						};

						const processMissingFile = () => {
							const content = getContent();

							updateWithReplacementSource(content.length);

							return doWrite(content);
						};

						// if the target file has already been written
						if (targetFileGeneration !== undefined) {
							// check if the Source has been written to this target file
							const writtenGeneration = cacheEntry.writtenTo.get(targetPath);
							if (writtenGeneration === targetFileGeneration) {
								// if yes, we may skip writing the file
								// if it's already there
								// (we assume one doesn't modify files while the Compiler is running, other then removing them)

								if (this._assetEmittingPreviousFiles.has(targetPath)) {
									// We assume that assets from the last compilation say intact on disk (they are not removed)
									compilation.updateAsset(file, cacheEntry.sizeOnlySource, {
										size: cacheEntry.sizeOnlySource.size()
									});

									return callback();
								} else {
									// Settings immutable will make it accept file content without comparing when file exist
									immutable = true;
								}
							} else if (!immutable) {
								if (checkSimilarFile()) return;
								// We wrote to this file before which has very likely a different content
								// skip comparing and assume content is different for performance
								// This case happens often during watch mode.
								return processMissingFile();
							}
						}

						if (checkSimilarFile()) return;
						if (this.options.output.compareBeforeEmit) {
							this.outputFileSystem.stat(targetPath, (err, stats) => {
								const exists = !err && stats.isFile();

								if (exists) {
									processExistingFile(stats);
								} else {
									processMissingFile();
								}
							});
						} else {
							processMissingFile();
						}
					};

					if (targetFile.match(/\/|\\/)) {
						const fs = this.outputFileSystem;
						const dir = dirname(fs, join(fs, outputPath, targetFile));
						mkdirp(fs, dir, writeOut);
					} else {
						writeOut();
					}
				},
				err => {
					// Clear map to free up memory
					caseInsensitiveMap.clear();
					if (err) {
						this._assetEmittingPreviousFiles.clear();
						return callback(err);
					}

					this._assetEmittingPreviousFiles = allTargetPaths;

					this.hooks.afterEmit.callAsync(compilation, err => {
						if (err) return callback(err);

						return callback();
					});
				}
			);
		};

		this.hooks.emit.callAsync(compilation, err => {
			if (err) return callback(err);
			outputPath = compilation.getPath(this.outputPath, {});
			mkdirp(this.outputFileSystem, outputPath, emitFiles);
		});
	}

	/**
	 * @param {Callback<void>} callback signals when the call finishes
	 * @returns {void}
	 */
	emitRecords(callback) {
		if (this.hooks.emitRecords.isUsed()) {
			if (this.recordsOutputPath) {
				asyncLib.parallel(
					[
						cb => this.hooks.emitRecords.callAsync(cb),
						this._emitRecords.bind(this)
					],
					err => callback(err)
				);
			} else {
				this.hooks.emitRecords.callAsync(callback);
			}
		} else {
			if (this.recordsOutputPath) {
				this._emitRecords(callback);
			} else {
				callback();
			}
		}
	}

	/**
	 * @param {Callback<void>} callback signals when the call finishes
	 * @returns {void}
	 */
	_emitRecords(callback) {
		const writeFile = () => {
			this.outputFileSystem.writeFile(
				this.recordsOutputPath,
				JSON.stringify(
					this.records,
					(n, value) => {
						if (
							typeof value === "object" &&
							value !== null &&
							!Array.isArray(value)
						) {
							const keys = Object.keys(value);
							if (!isSorted(keys)) {
								return sortObject(value, keys);
							}
						}
						return value;
					},
					2
				),
				callback
			);
		};

		const recordsOutputPathDirectory = dirname(
			this.outputFileSystem,
			this.recordsOutputPath
		);
		if (!recordsOutputPathDirectory) {
			return writeFile();
		}
		mkdirp(this.outputFileSystem, recordsOutputPathDirectory, err => {
			if (err) return callback(err);
			writeFile();
		});
	}

	/**
	 * @param {Callback<void>} callback signals when the call finishes
	 * @returns {void}
	 */
	readRecords(callback) {
		if (this.hooks.readRecords.isUsed()) {
			if (this.recordsInputPath) {
				asyncLib.parallel(
					[
						cb => this.hooks.readRecords.callAsync(cb),
						this._readRecords.bind(this)
					],
					err => callback(err)
				);
			} else {
				this.records = {};
				this.hooks.readRecords.callAsync(callback);
			}
		} else {
			if (this.recordsInputPath) {
				this._readRecords(callback);
			} else {
				this.records = {};
				callback();
			}
		}
	}

	/**
	 * @param {Callback<void>} callback signals when the call finishes
	 * @returns {void}
	 */
	_readRecords(callback) {
		if (!this.recordsInputPath) {
			this.records = {};
			return callback();
		}
		this.inputFileSystem.stat(this.recordsInputPath, err => {
			// It doesn't exist
			// We can ignore this.
			if (err) return callback();

			this.inputFileSystem.readFile(this.recordsInputPath, (err, content) => {
				if (err) return callback(err);

				try {
					this.records = parseJson(content.toString("utf-8"));
				} catch (e) {
					e.message = "Cannot parse records: " + e.message;
					return callback(e);
				}

				return callback();
			});
		});
	}

	/**
	 * @param {Compilation} compilation the compilation
	 * @param {string} compilerName the compiler's name
	 * @param {number} compilerIndex the compiler's index
	 * @param {OutputOptions=} outputOptions the output options
	 * @param {WebpackPluginInstance[]=} plugins the plugins to apply
	 * @returns {Compiler} a child compiler
	 */
	createChildCompiler(
		compilation,
		compilerName,
		compilerIndex,
		outputOptions,
		plugins
	) {
		const childCompiler = new Compiler(this.context, {
			...this.options,
			output: {
				...this.options.output,
				...outputOptions
			}
		});
		childCompiler.name = compilerName;
		childCompiler.outputPath = this.outputPath;
		childCompiler.inputFileSystem = this.inputFileSystem;
		childCompiler.outputFileSystem = null;
		childCompiler.resolverFactory = this.resolverFactory;
		childCompiler.modifiedFiles = this.modifiedFiles;
		childCompiler.removedFiles = this.removedFiles;
		childCompiler.fileTimestamps = this.fileTimestamps;
		childCompiler.contextTimestamps = this.contextTimestamps;
		childCompiler.fsStartTime = this.fsStartTime;
		childCompiler.cache = this.cache;
		childCompiler.compilerPath = `${this.compilerPath}${compilerName}|${compilerIndex}|`;
		childCompiler._backCompat = this._backCompat;

		const relativeCompilerName = makePathsRelative(
			this.context,
			compilerName,
			this.root
		);
		if (!this.records[relativeCompilerName]) {
			this.records[relativeCompilerName] = [];
		}
		if (this.records[relativeCompilerName][compilerIndex]) {
			childCompiler.records = this.records[relativeCompilerName][compilerIndex];
		} else {
			this.records[relativeCompilerName].push((childCompiler.records = {}));
		}

		childCompiler.parentCompilation = compilation;
		childCompiler.root = this.root;
		if (Array.isArray(plugins)) {
			for (const plugin of plugins) {
				plugin.apply(childCompiler);
			}
		}
		for (const name in this.hooks) {
			if (
				![
					"make",
					"compile",
					"emit",
					"afterEmit",
					"invalid",
					"done",
					"thisCompilation"
				].includes(name)
			) {
				if (childCompiler.hooks[name]) {
					childCompiler.hooks[name].taps = this.hooks[name].taps.slice();
				}
			}
		}

		compilation.hooks.childCompiler.call(
			childCompiler,
			compilerName,
			compilerIndex
		);

		return childCompiler;
	}

	isChild() {
		return !!this.parentCompilation;
	}

	createCompilation(params) {
		this._cleanupLastCompilation();
		return (this._lastCompilation = new Compilation(this, params));
	}

	/**
	 * @param {CompilationParams} params the compilation parameters
	 * @returns {Compilation} the created compilation
	 */
	newCompilation(params) {
		const compilation = this.createCompilation(params);
		compilation.name = this.name;
		compilation.records = this.records;
		this.hooks.thisCompilation.call(compilation, params);
		this.hooks.compilation.call(compilation, params);
		return compilation;
	}

	createNormalModuleFactory() {
		this._cleanupLastNormalModuleFactory();
		const normalModuleFactory = new NormalModuleFactory({
			context: this.options.context,
			fs: this.inputFileSystem,
			resolverFactory: this.resolverFactory,
			options: this.options.module,
			associatedObjectForCache: this.root,
			layers: this.options.experiments.layers
		});
		this._lastNormalModuleFactory = normalModuleFactory;
		this.hooks.normalModuleFactory.call(normalModuleFactory);
		return normalModuleFactory;
	}

	createContextModuleFactory() {
		const contextModuleFactory = new ContextModuleFactory(this.resolverFactory);
		this.hooks.contextModuleFactory.call(contextModuleFactory);
		return contextModuleFactory;
	}

	newCompilationParams() {
		const params = {
			normalModuleFactory: this.createNormalModuleFactory(),
			contextModuleFactory: this.createContextModuleFactory()
		};
		return params;
	}

	/**
	 * @param {Callback<Compilation>} callback signals when the compilation finishes
	 * @returns {void}
	 */
	compile(callback) {
		const params = this.newCompilationParams();
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);

			this.hooks.compile.call(params);

			const compilation = this.newCompilation(params);

			const logger = compilation.getLogger("webpack.Compiler");

			logger.time("make hook");
			this.hooks.make.callAsync(compilation, err => {
				logger.timeEnd("make hook");
				if (err) return callback(err);

				logger.time("finish make hook");
				this.hooks.finishMake.callAsync(compilation, err => {
					logger.timeEnd("finish make hook");
					if (err) return callback(err);

					process.nextTick(() => {
						logger.time("finish compilation");
						compilation.finish(err => {
							logger.timeEnd("finish compilation");
							if (err) return callback(err);

							logger.time("seal compilation");
							compilation.seal(err => {
								logger.timeEnd("seal compilation");
								if (err) return callback(err);

								logger.time("afterCompile hook");
								this.hooks.afterCompile.callAsync(compilation, err => {
									logger.timeEnd("afterCompile hook");
									if (err) return callback(err);

									return callback(null, compilation);
								});
							});
						});
					});
				});
			});
		});
	}

	/**
	 * @param {Callback<void>} callback signals when the compiler closes
	 * @returns {void}
	 */
	close(callback) {
		if (this.watching) {
			// When there is still an active watching, close this first
			this.watching.close(err => {
				this.close(callback);
			});
			return;
		}
		this.hooks.shutdown.callAsync(err => {
			if (err) return callback(err);
			// Get rid of reference to last compilation to avoid leaking memory
			// We can't run this._cleanupLastCompilation() as the Stats to this compilation
			// might be still in use. We try to get rid of the reference to the cache instead.
			this._lastCompilation = undefined;
			this._lastNormalModuleFactory = undefined;
			this.cache.shutdown(callback);
		});
	}
}

module.exports = Compiler;
