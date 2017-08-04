/**
 * Relay v1.2.0-rc.1
 */
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule RelayCompilerPublic
	 * @format
	 */

	'use strict';

	//const RelayFileIRParser = require('RelayFileIRParser');
	module.exports = {
	  Compiler: __webpack_require__(15),
	  ConsoleReporter: __webpack_require__(26),
	  //FileIRParser: RelayFileIRParser,
	  FileWriter: __webpack_require__(27),
	  //IRTransforms: RelayIRTransforms,
	  MultiReporter: __webpack_require__(28),
	  Runner: __webpack_require__(24)
	};
	//const RelayIRTransforms = require('RelayIRTransforms');

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("fbjs/lib/invariant");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("graphql");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelaySchemaUtils
	 * 
	 * @format
	 */

	'use strict';

	var _require = __webpack_require__(5),
	    assertAbstractType = _require.assertAbstractType,
	    getNamedType = _require.getNamedType,
	    getNullableType = _require.getNullableType,
	    isType = _require.isType,
	    print = _require.print,
	    typeFromAST = _require.typeFromAST,
	    GraphQLInterfaceType = _require.GraphQLInterfaceType,
	    GraphQLList = _require.GraphQLList,
	    GraphQLObjectType = _require.GraphQLObjectType,
	    GraphQLSchema = _require.GraphQLSchema,
	    GraphQLUnionType = _require.GraphQLUnionType;

	var ID = 'id';
	var ID_TYPE = 'ID';

	/**
	 * Determine if the given type may implement the named type:
	 * - it is the named type
	 * - it implements the named interface
	 * - it is an abstract type and *some* of its concrete types may
	 *   implement the named type
	 */
	function mayImplement(schema, type, typeName) {
	  var unmodifiedType = getRawType(type);
	  return unmodifiedType.toString() === typeName || implementsInterface(unmodifiedType, typeName) || isAbstractType(unmodifiedType) && hasConcreteTypeThatImplements(schema, unmodifiedType, typeName);
	}

	function canHaveSelections(type) {
	  return type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType;
	}

	/**
	 * Implements duck typing that checks whether a type has an id field of the ID
	 * type. This is approximating what we can hopefully do with the __id proposal
	 * a bit more cleanly.
	 *
	 * https://github.com/graphql/graphql-future/blob/master/01%20-%20__id.md
	 */
	function hasID(schema, type) {
	  var unmodifiedType = getRawType(type);
	  __webpack_require__(1)(unmodifiedType instanceof GraphQLObjectType || unmodifiedType instanceof GraphQLInterfaceType, 'RelaySchemaUtils.hasID(): Expected a concrete type or interface, ' + 'got type `%s`.', type);
	  var idType = schema.getType(ID_TYPE);
	  var idField = unmodifiedType.getFields()[ID];
	  return idField && getRawType(idField.type) === idType;
	}

	/**
	 * Determine if a type is abstract (not concrete).
	 *
	 * Note: This is used in place of the `graphql` version of the function in order
	 * to not break `instanceof` checks with Jest. This version also unwraps
	 * non-null/list wrapper types.
	 */
	function isAbstractType(type) {
	  var rawType = getRawType(type);
	  return rawType instanceof GraphQLInterfaceType || rawType instanceof GraphQLUnionType;
	}

	/**
	 * Get the unmodified type, with list/null wrappers removed.
	 */
	function getRawType(type) {
	  return __webpack_require__(39)(getNamedType(type));
	}

	/**
	 * Gets the non-list type, removing the list wrapper if present.
	 */
	function getSingularType(type) {
	  var unmodifiedType = type;
	  while (unmodifiedType instanceof GraphQLList) {
	    unmodifiedType = unmodifiedType.ofType;
	  }
	  return unmodifiedType;
	}

	/**
	 * @public
	 */
	function implementsInterface(type, interfaceName) {
	  return getInterfaces(type).some(function (interfaceType) {
	    return interfaceType.toString() === interfaceName;
	  });
	}

	/**
	 * @private
	 */
	function hasConcreteTypeThatImplements(schema, type, interfaceName) {
	  return isAbstractType(type) && getConcreteTypes(schema, type).some(function (concreteType) {
	    return implementsInterface(concreteType, interfaceName);
	  });
	}

	/**
	 * @private
	 */
	function getConcreteTypes(schema, type) {
	  return schema.getPossibleTypes(assertAbstractType(type));
	}

	/**
	 * @private
	 */
	function getInterfaces(type) {
	  if (type instanceof GraphQLObjectType) {
	    return type.getInterfaces();
	  }
	  return [];
	}

	/**
	 * @public
	 *
	 * Determine if an AST node contains a fragment/operation definition.
	 */
	function isOperationDefinitionAST(ast) {
	  return ast.kind === 'FragmentDefinition' || ast.kind === 'OperationDefinition';
	}

	/**
	 * @public
	 *
	 * Determine if an AST node contains a schema definition.
	 */
	function isSchemaDefinitionAST(ast) {
	  return ast.kind === 'DirectiveDefinition' || ast.kind === 'EnumTypeDefinition' || ast.kind === 'InputObjectTypeDefinition' || ast.kind === 'InterfaceTypeDefinition' || ast.kind === 'ObjectTypeDefinition' || ast.kind === 'ScalarTypeDefinition' || ast.kind === 'TypeExtensionDefinition' || ast.kind === 'UnionTypeDefinition';
	}

	function assertTypeWithFields(type) {
	  __webpack_require__(1)(type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType, 'RelaySchemaUtils: Expected type `%s` to be an object or interface type.', type);
	  return type;
	}

	/**
	 * Helper for calling `typeFromAST()` with a clear warning when the type does
	 * not exist. This enables the pattern `assertXXXType(getTypeFromAST(...))`,
	 * emitting distinct errors for unknown types vs types of the wrong category.
	 */
	function getTypeFromAST(schema, ast) {
	  var type = typeFromAST(schema, ast);
	  __webpack_require__(1)(isType(type), 'RelaySchemaUtils: Unknown type `%s`.', print(ast));
	  return type;
	}

	/**
	 * Given a defitinition AST node, gives us a unique name for that node.
	 * Note: this can be tricky for type extensions: while types always have one
	 * name, type extensions are defined by everything inside them.
	 *
	 * TODO @mmahoney: t16495627 write tests or remove uses of this
	 */
	function definitionName(definition) {
	  switch (definition.kind) {
	    case 'DirectiveDefinition':
	    case 'EnumTypeDefinition':
	    case 'FragmentDefinition':
	    case 'InputObjectTypeDefinition':
	    case 'InterfaceTypeDefinition':
	    case 'ObjectTypeDefinition':
	    case 'ScalarTypeDefinition':
	    case 'UnionTypeDefinition':
	      return definition.name.value;
	    case 'OperationDefinition':
	      return definition.name ? definition.name.value : '';
	    case 'TypeExtensionDefinition':
	      return definition.toString();
	    case 'SchemaDefinition':
	      return 'schema';
	  }
	  throw new Error('Unkown definition kind: ' + definition.kind);
	}

	module.exports = {
	  assertTypeWithFields: assertTypeWithFields,
	  definitionName: definitionName,
	  canHaveSelections: canHaveSelections,
	  getNullableType: getNullableType,
	  getRawType: getRawType,
	  getSingularType: getSingularType,
	  getTypeFromAST: getTypeFromAST,
	  hasID: hasID,
	  implementsInterface: implementsInterface,
	  isAbstractType: isAbstractType,
	  isOperationDefinitionAST: isOperationDefinitionAST,
	  isSchemaDefinitionAST: isSchemaDefinitionAST,
	  mayImplement: mayImplement
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("immutable");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/toConsumableArray");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ASTConvert
	 * 
	 * @format
	 */

	'use strict';

	var _toConsumableArray3 = _interopRequireDefault(__webpack_require__(9));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(6),
	    isOperationDefinitionAST = _require.isOperationDefinitionAST,
	    isSchemaDefinitionAST = _require.isSchemaDefinitionAST;

	var _require2 = __webpack_require__(5),
	    extendSchema = _require2.extendSchema,
	    parse = _require2.parse,
	    visit = _require2.visit;

	function convertASTDocuments(schema, documents, validationRules) {
	  var definitions = definitionsFromDocuments(documents);

	  var astDefinitions = [];
	  documents.forEach(function (doc) {
	    doc.definitions.forEach(function (definition) {
	      if (isOperationDefinitionAST(definition)) {
	        astDefinitions.push(definition);
	      }
	    });
	  });

	  return convertASTDefinitions(schema, definitions, validationRules);
	}

	function convertASTDocumentsWithBase(schema, baseDocuments, documents, validationRules) {
	  var baseDefinitions = definitionsFromDocuments(baseDocuments);
	  var definitions = definitionsFromDocuments(documents);

	  var requiredDefinitions = new Map();
	  var baseMap = new Map();
	  baseDefinitions.forEach(function (definition) {
	    if (isOperationDefinitionAST(definition)) {
	      if (definition.name) {
	        // If there's no name, no reason to put in the map
	        baseMap.set(definition.name.value, definition);
	      }
	    }
	  });

	  var definitionsToVisit = [];
	  definitions.forEach(function (definition) {
	    if (isOperationDefinitionAST(definition)) {
	      definitionsToVisit.push(definition);
	    }
	  });
	  while (definitionsToVisit.length > 0) {
	    var definition = definitionsToVisit.pop();
	    var name = definition.name;
	    if (!name || requiredDefinitions.has(name.value)) {
	      continue;
	    }
	    requiredDefinitions.set(name.value, definition);
	    visit(definition, {
	      FragmentSpread: function FragmentSpread(spread) {
	        var baseDefinition = baseMap.get(spread.name.value);
	        if (baseDefinition) {
	          // We only need to add those definitions not already included
	          // in definitions
	          definitionsToVisit.push(baseDefinition);
	        }
	      }
	    });
	  }

	  var definitionsToConvert = [];
	  requiredDefinitions.forEach(function (definition) {
	    return definitionsToConvert.push(definition);
	  });
	  return convertASTDefinitions(schema, definitionsToConvert, validationRules);
	}

	function convertASTDefinitions(schema, definitions, validationRules) {
	  var operationDefinitions = [];
	  definitions.forEach(function (definition) {
	    if (isOperationDefinitionAST(definition)) {
	      operationDefinitions.push(definition);
	    }
	  });

	  var validationAST = {
	    kind: 'Document',
	    // DocumentNode doesn't accept that a node of type
	    // FragmentDefinitionNode | OperationDefinitionNode is a DefinitionNode
	    definitions: operationDefinitions
	  };
	  // Will throw an error if there are validation issues
	  __webpack_require__(11).validate(validationAST, schema, validationRules);
	  return operationDefinitions.map(function (definition) {
	    return __webpack_require__(29).transform(schema, definition);
	  });
	}

	function definitionsFromDocuments(documents) {
	  var definitions = [];
	  documents.forEach(function (doc) {
	    doc.definitions.forEach(function (definition) {
	      return definitions.push(definition);
	    });
	  });
	  return definitions;
	}

	function transformASTSchema(schema, schemaExtensions) {
	  return schemaExtensions.length > 0 ? extendSchema(schema, parse(schemaExtensions.join('\n'))) : schema;
	}

	function extendASTSchema(baseSchema, documents) {
	  // Should be TypeSystemDefinitionNode
	  var schemaExtensions = [];
	  documents.forEach(function (doc) {
	    // TODO: isSchemaDefinitionAST should %checks, once %checks is available
	    schemaExtensions.push.apply(schemaExtensions, (0, _toConsumableArray3['default'])(doc.definitions.filter(isSchemaDefinitionAST)));
	  });

	  if (schemaExtensions.length <= 0) {
	    return baseSchema;
	  }

	  return extendSchema(baseSchema, {
	    kind: 'Document',
	    // Flow doesn't recognize that TypeSystemDefinitionNode is a subset of
	    // DefinitionNode
	    definitions: schemaExtensions
	  });
	}

	module.exports = {
	  convertASTDocuments: convertASTDocuments,
	  convertASTDocumentsWithBase: convertASTDocumentsWithBase,
	  extendASTSchema: extendASTSchema,
	  transformASTSchema: transformASTSchema
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule GraphQLValidator
	 * @format
	 */

	'use strict';

	var _require = __webpack_require__(5),
	    ArgumentsOfCorrectTypeRule = _require.ArgumentsOfCorrectTypeRule,
	    DefaultValuesOfCorrectTypeRule = _require.DefaultValuesOfCorrectTypeRule,
	    formatError = _require.formatError,
	    FragmentsOnCompositeTypesRule = _require.FragmentsOnCompositeTypesRule,
	    KnownArgumentNamesRule = _require.KnownArgumentNamesRule,
	    KnownTypeNamesRule = _require.KnownTypeNamesRule,
	    LoneAnonymousOperationRule = _require.LoneAnonymousOperationRule,
	    NoFragmentCyclesRule = _require.NoFragmentCyclesRule,
	    NoUnusedVariablesRule = _require.NoUnusedVariablesRule,
	    PossibleFragmentSpreadsRule = _require.PossibleFragmentSpreadsRule,
	    ProvidedNonNullArgumentsRule = _require.ProvidedNonNullArgumentsRule,
	    ScalarLeafsRule = _require.ScalarLeafsRule,
	    UniqueArgumentNamesRule = _require.UniqueArgumentNamesRule,
	    UniqueFragmentNamesRule = _require.UniqueFragmentNamesRule,
	    UniqueInputFieldNamesRule = _require.UniqueInputFieldNamesRule,
	    UniqueOperationNamesRule = _require.UniqueOperationNamesRule,
	    UniqueVariableNamesRule = _require.UniqueVariableNamesRule,
	    validate = _require.validate,
	    VariablesAreInputTypesRule = _require.VariablesAreInputTypesRule,
	    VariablesInAllowedPositionRule = _require.VariablesInAllowedPositionRule;

	function validateOrThrow(document, schema, rules) {
	  var validationErrors = validate(schema, document, rules);
	  if (validationErrors && validationErrors.length > 0) {
	    var formattedErrors = validationErrors.map(formatError);
	    var errorMessages = validationErrors.map(function (e) {
	      return e.source ? e.source.name + ': ' + e.message : e.message;
	    });

	    var error = new Error(__webpack_require__(40).format('You supplied a GraphQL document with validation errors:\n%s', errorMessages.join('\n')));
	    error.validationErrors = formattedErrors;
	    throw error;
	  }
	}

	module.exports = {
	  GLOBAL_RULES: [KnownArgumentNamesRule,
	  // TODO #19327202 Relay Classic generates some fragments in runtime, so Relay
	  // Modern queries might reference fragments unknown in build time
	  //KnownFragmentNamesRule,
	  NoFragmentCyclesRule,
	  // TODO #19327144 Because of graphql.experimental feature
	  // @argumentDefinitions, this validation incorrectly marks some fragment
	  // variables as undefined.
	  // NoUndefinedVariablesRule,
	  // TODO #19327202 Queries generated dynamically with Relay Classic might use
	  // unused fragments
	  // NoUnusedFragmentsRule,
	  NoUnusedVariablesRule,
	  // TODO #19327202 Relay Classic auto-resolves overlapping fields by
	  // generating aliases
	  //OverlappingFieldsCanBeMergedRule,
	  ProvidedNonNullArgumentsRule, UniqueArgumentNamesRule, UniqueFragmentNamesRule, UniqueInputFieldNamesRule, UniqueOperationNamesRule, UniqueVariableNamesRule],
	  LOCAL_RULES: [ArgumentsOfCorrectTypeRule, DefaultValuesOfCorrectTypeRule,
	  // TODO #13818691: make this aware of @fixme_fat_interface
	  // FieldsOnCorrectTypeRule,
	  FragmentsOnCompositeTypesRule, KnownTypeNamesRule,
	  // TODO #17737009: Enable this after cleaning up existing issues
	  // KnownDirectivesRule,
	  LoneAnonymousOperationRule, PossibleFragmentSpreadsRule, ScalarLeafsRule, VariablesAreInputTypesRule, VariablesInAllowedPositionRule],
	  validate: validateOrThrow
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayCodegenWatcher
	 * 
	 * @format
	 */
	'use strict';

	var _asyncToGenerator2 = __webpack_require__(7);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	let queryFiles = (() => {
	  var _ref3 = (0, _asyncToGenerator3.default)(function* (baseDir, expression, filter) {
	    var client = new (__webpack_require__(13))();

	    var _ref = yield Promise.all([client.watchProject(baseDir), getFields(client)]),
	        watchResp = _ref[0],
	        fields = _ref[1];

	    var resp = yield client.command('query', watchResp.root, {
	      expression: expression,
	      fields: fields,
	      relative_root: watchResp.relativePath
	    });
	    client.end();
	    return updateFiles(new Set(), baseDir, filter, resp.files);
	  });

	  return function queryFiles(_x, _x2, _x3) {
	    return _ref3.apply(this, arguments);
	  };
	})();

	let getFields = (() => {
	  var _ref4 = (0, _asyncToGenerator3.default)(function* (client) {
	    var fields = ['name', 'exists'];
	    if (yield client.hasCapability('field-content.sha1hex')) {
	      fields.push('content.sha1hex');
	    }
	    return fields;
	  });

	  return function getFields(_x4) {
	    return _ref4.apply(this, arguments);
	  };
	})();

	// For use when not using Watchman.


	let queryFilepaths = (() => {
	  var _ref5 = (0, _asyncToGenerator3.default)(function* (baseDir, filepaths, filter) {
	    // Construct WatchmanChange objects as an intermediate step before
	    // calling updateFiles to produce file content.
	    var files = filepaths.map(function (filepath) {
	      return {
	        name: filepath,
	        exists: true,
	        'content.sha1hex': null
	      };
	    });
	    return updateFiles(new Set(), baseDir, filter, files);
	  });

	  return function queryFilepaths(_x5, _x6, _x7) {
	    return _ref5.apply(this, arguments);
	  };
	})();

	/**
	 * Provides a simplified API to the watchman API.
	 * Given some base directory and a list of subdirectories it calls the callback
	 * with watchman change events on file changes.
	 */


	let watch = (() => {
	  var _ref6 = (0, _asyncToGenerator3.default)(function* (baseDir, expression, callback) {
	    var client = new (__webpack_require__(13))();
	    var watchResp = yield client.watchProject(baseDir);

	    yield makeSubscription(client, watchResp.root, watchResp.relativePath, expression, callback);
	  });

	  return function watch(_x8, _x9, _x10) {
	    return _ref6.apply(this, arguments);
	  };
	})();

	let makeSubscription = (() => {
	  var _ref7 = (0, _asyncToGenerator3.default)(function* (client, root, relativePath, expression, callback) {
	    client.on('subscription', function (resp) {
	      if (resp.subscription === SUBSCRIPTION_NAME) {
	        callback(resp);
	      }
	    });
	    var fields = yield getFields(client);
	    yield client.command('subscribe', root, SUBSCRIPTION_NAME, {
	      expression: expression,
	      fields: fields,
	      relative_root: relativePath
	    });
	  });

	  return function makeSubscription(_x11, _x12, _x13, _x14, _x15) {
	    return _ref7.apply(this, arguments);
	  };
	})();

	/**
	 * Further simplifies `watch` and calls the callback on every change with a
	 * full list of files that match the conditions.
	 */


	let watchFiles = (() => {
	  var _ref8 = (0, _asyncToGenerator3.default)(function* (baseDir, expression, filter, callback) {
	    var files = new Set();
	    yield watch(baseDir, expression, function (changes) {
	      if (!changes.files) {
	        // Watchmen fires a change without files when a watchman state changes,
	        // for example during an hg update.
	        return;
	      }
	      files = updateFiles(files, baseDir, filter, changes.files);
	      callback(files);
	    });
	  });

	  return function watchFiles(_x16, _x17, _x18, _x19) {
	    return _ref8.apply(this, arguments);
	  };
	})();

	/**
	 * Similar to watchFiles, but takes an async function. The `compile` function
	 * is awaited and not called in parallel. If multiple changes are triggered
	 * before a compile finishes, the latest version is called after the compile
	 * finished.
	 *
	 * TODO: Consider changing from a Promise to abortable, so we can abort mid
	 *       compilation.
	 */


	let watchCompile = (() => {
	  var _ref9 = (0, _asyncToGenerator3.default)(function* (baseDir, expression, filter, compile) {
	    var compiling = false;
	    var needsCompiling = false;
	    var latestFiles = null;

	    watchFiles(baseDir, expression, filter, (() => {
	      var _ref10 = (0, _asyncToGenerator3.default)(function* (files) {
	        needsCompiling = true;
	        latestFiles = files;
	        if (compiling) {
	          return;
	        }
	        compiling = true;
	        while (needsCompiling) {
	          needsCompiling = false;
	          yield compile(latestFiles);
	        }
	        compiling = false;
	      });

	      return function (_x24) {
	        return _ref10.apply(this, arguments);
	      };
	    })());
	  });

	  return function watchCompile(_x20, _x21, _x22, _x23) {
	    return _ref9.apply(this, arguments);
	  };
	})();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SUBSCRIPTION_NAME = 'relay-codegen';

	function updateFiles(files, baseDir, filter, fileChanges) {
	  var fileMap = new Map();
	  files.forEach(function (file) {
	    fileMap.set(file.relPath, file);
	  });

	  fileChanges.forEach(function (_ref2) {
	    var name = _ref2.name,
	        exists = _ref2.exists,
	        hash = _ref2['content.sha1hex'];

	    var file = {
	      relPath: name,
	      hash: hash || hashFile(__webpack_require__(4).join(baseDir, name))
	    };
	    if (exists && filter(file)) {
	      fileMap.set(name, file);
	    } else {
	      fileMap['delete'](name);
	    }
	  });
	  return new Set(fileMap.values());
	}

	function hashFile(filename) {
	  var content = __webpack_require__(2).readFileSync(filename);
	  return __webpack_require__(37).createHash('sha1').update(content).digest('hex');
	}

	module.exports = {
	  queryFiles: queryFiles,
	  queryFilepaths: queryFilepaths,
	  watch: watch,
	  watchFiles: watchFiles,
	  watchCompile: watchCompile
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayWatchmanClient
	 * 
	 * @format
	 */
	'use strict';

	var _asyncToGenerator2 = __webpack_require__(7);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(3));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var RelayWatchmanClient = function () {
	  RelayWatchmanClient.isAvailable = function isAvailable() {
	    return new Promise(function (resolve) {
	      var client = new RelayWatchmanClient();
	      client.on('error', function () {
	        return resolve(false);
	      });
	      client.hasCapability('relative_root').then(resolve, function () {
	        return resolve(false);
	      });
	    });
	  };

	  function RelayWatchmanClient() {
	    (0, _classCallCheck3['default'])(this, RelayWatchmanClient);

	    this._client = new (__webpack_require__(38).Client)();
	  }

	  RelayWatchmanClient.prototype.command = function command() {
	    var _this = this;

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return new Promise(function (resolve, reject) {
	      _this._client.command(args, function (error, response) {
	        if (error) {
	          reject(error);
	        } else {
	          resolve(response);
	        }
	      });
	    });
	  };

	  RelayWatchmanClient.prototype.hasCapability = (() => {
	    var _ref = (0, _asyncToGenerator3.default)(function* (capability) {
	      var resp = yield this.command('list-capabilities');
	      return resp.capabilities.includes(capability);
	    });

	    function hasCapability(_x) {
	      return _ref.apply(this, arguments);
	    }

	    return hasCapability;
	  })();

	  RelayWatchmanClient.prototype.watchProject = (() => {
	    var _ref2 = (0, _asyncToGenerator3.default)(function* (baseDir) {
	      var resp = yield this.command('watch-project', baseDir);
	      if ('warning' in resp) {
	        console.error('Warning:', resp.warning);
	      }
	      return {
	        root: resp.watch,
	        relativePath: resp.relative_path
	      };
	    });

	    function watchProject(_x2) {
	      return _ref2.apply(this, arguments);
	    }

	    return watchProject;
	  })();

	  RelayWatchmanClient.prototype.on = function on(event, callback) {
	    this._client.on(event, callback);
	  };

	  RelayWatchmanClient.prototype.end = function end() {
	    this._client.end();
	  };

	  return RelayWatchmanClient;
	}();

	module.exports = RelayWatchmanClient;

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("fbjs/lib/forEachObject");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule RelayCompiler
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(3));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * A utility class for parsing a corpus of GraphQL documents, transforming them
	 * with a standardized set of transforms, and generating runtime representations
	 * of each definition.
	 */


	// <CodegenNode> is a generic type here,
	// which represents the node type we get from the CodeGenerator's generation function.
	var RelayCompiler = function () {

	  // The context passed in must already have any Relay-specific schema extensions
	  function RelayCompiler(schema, context, transforms, codeGenerator) {
	    (0, _classCallCheck3['default'])(this, RelayCompiler);

	    this._context = context;
	    // some transforms depend on this being the original schema,
	    // not the transformed schema/context's schema
	    this._schema = schema;
	    this._transforms = transforms;
	    this._codeGenerator = codeGenerator;
	  }

	  RelayCompiler.prototype.clone = function clone() {
	    return new RelayCompiler(this._schema, this._context, this._transforms, this._codeGenerator);
	  };

	  RelayCompiler.prototype.context = function context() {
	    return this._context;
	  };

	  RelayCompiler.prototype.addDefinitions = function addDefinitions(definitions) {
	    this._context = this._context.addAll(definitions);
	    return this._context.documents();
	  };

	  // Can only be called once per compiler. Once run, will use cached context
	  // To re-run, clone the compiler.


	  RelayCompiler.prototype.transformedQueryContext = function transformedQueryContext() {
	    var _this = this;

	    if (this._transformedQueryContext) {
	      return this._transformedQueryContext;
	    }
	    this._transformedQueryContext = this._transforms.queryTransforms.reduce(function (ctx, transform) {
	      return transform(ctx, _this._schema);
	    }, this._context);
	    return this._transformedQueryContext;
	  };

	  RelayCompiler.prototype.compile = function compile() {
	    var _this2 = this;

	    var transformContext = function transformContext(ctx, transform) {
	      return transform(ctx, _this2._schema);
	    };
	    var fragmentContext = this._transforms.fragmentTransforms.reduce(transformContext, this._context);
	    var queryContext = this.transformedQueryContext();
	    var printContext = this._transforms.printTransforms.reduce(transformContext, queryContext);
	    var codeGenContext = this._transforms.codegenTransforms.reduce(transformContext, queryContext);

	    var compiledDocuments = new Map();
	    fragmentContext.documents().forEach(function (node) {
	      if (node.kind !== 'Fragment') {
	        return;
	      }
	      var generatedFragment = _this2._codeGenerator(node);
	      compiledDocuments.set(node.name, generatedFragment);
	    });
	    queryContext.documents().forEach(function (node) {
	      if (node.kind !== 'Root') {
	        return;
	      }
	      var name = node.name;
	      // The unflattened query is used for printing, since flattening creates an
	      // invalid query.

	      var text = __webpack_require__(31)(printContext.getRoot(name), printContext).documents().map(__webpack_require__(30).print).join('\n');
	      // The original query (with fragment spreads) is converted to a fragment
	      // for reading out the root data.
	      var sourceNode = fragmentContext.getRoot(name);
	      var rootFragment = buildFragmentForRoot(sourceNode);
	      var generatedFragment = _this2._codeGenerator(rootFragment);
	      // The flattened query is used for codegen in order to reduce the number of
	      // duplicate fields that must be processed during response normalization.
	      var codeGenNode = codeGenContext.getRoot(name);
	      var generatedQuery = _this2._codeGenerator(codeGenNode);

	      var batchQuery = {
	        fragment: generatedFragment,
	        id: null,
	        kind: 'Batch',
	        metadata: node.metadata || {},
	        name: name,
	        query: generatedQuery,
	        text: text
	      };
	      compiledDocuments.set(name, batchQuery);
	    });
	    return compiledDocuments;
	  };

	  return RelayCompiler;
	}();

	/**
	 * Construct the fragment equivalent of a root node.
	 */


	function buildFragmentForRoot(root) {
	  return {
	    argumentDefinitions: root.argumentDefinitions,
	    directives: root.directives,
	    kind: 'Fragment',
	    metadata: null,
	    name: root.name,
	    selections: root.selections,
	    type: root.type
	  };
	}

	module.exports = RelayCompiler;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule RelayCompilerContext
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(3));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(25),
	    createUserError = _require.createUserError;

	var ImmutableList = __webpack_require__(8).List,
	    ImmutableOrderedMap = __webpack_require__(8).OrderedMap,
	    Record = __webpack_require__(8).Record;

	var Document = Record({
	  errors: null,
	  name: null,
	  node: null
	});

	/**
	 * An immutable representation of a corpus of documents being compiled together.
	 * For each document, the context stores the IR and any validation errors.
	 */

	var RelayCompilerContext = function () {
	  function RelayCompilerContext(schema) {
	    (0, _classCallCheck3['default'])(this, RelayCompilerContext);

	    this._documents = new ImmutableOrderedMap();
	    this.schema = schema;
	  }

	  /**
	   * Returns the documents for the context in the order they were added.
	   */


	  RelayCompilerContext.prototype.documents = function documents() {
	    return this._documents.valueSeq().map(function (doc) {
	      return doc.get('node');
	    }).toJS();
	  };

	  RelayCompilerContext.prototype.updateSchema = function updateSchema(schema) {
	    var context = new RelayCompilerContext(schema);
	    context._documents = this._documents;
	    return context;
	  };

	  RelayCompilerContext.prototype.add = function add(node) {
	    __webpack_require__(1)(!this._documents.has(node.name), 'RelayCompilerContext: Duplicate document named `%s`. GraphQL ' + 'fragments and roots must have unique names.', node.name);
	    return this._update(this._documents.set(node.name, new Document({
	      name: node.name,
	      node: node
	    })));
	  };

	  RelayCompilerContext.prototype.addAll = function addAll(nodes) {
	    return nodes.reduce(function (ctx, definition) {
	      return ctx.add(definition);
	    }, this);
	  };

	  RelayCompilerContext.prototype.addError = function addError(name, error) {
	    var record = this._get(name);
	    var errors = record.get('errors');
	    if (errors) {
	      errors = errors.push(error);
	    } else {
	      errors = ImmutableList([error]);
	    }
	    return this._update(this._documents.set(name, record.set('errors', errors)));
	  };

	  RelayCompilerContext.prototype.get = function get(name) {
	    var record = this._documents.get(name);
	    return record && record.get('node');
	  };

	  RelayCompilerContext.prototype.getFragment = function getFragment(name) {
	    var record = this._documents.get(name);
	    var node = record && record.get('node');
	    if (!(node && node.kind === 'Fragment')) {
	      var childModule = name.substring(0, name.lastIndexOf('_'));
	      throw createUserError('Relay cannot find fragment `%s`.' + ' Please make sure the fragment exists in `%s`', name, childModule);
	    }
	    return node;
	  };

	  RelayCompilerContext.prototype.getRoot = function getRoot(name) {
	    var record = this._documents.get(name);
	    var node = record && record.get('node');
	    __webpack_require__(1)(node && node.kind === 'Root', 'RelayCompilerContext: Expected `%s` to be a root, got `%s`.', name, node && node.kind);
	    return node;
	  };

	  RelayCompilerContext.prototype.getErrors = function getErrors(name) {
	    return this._get(name).get('errors');
	  };

	  RelayCompilerContext.prototype.remove = function remove(name) {
	    return this._update(this._documents['delete'](name));
	  };

	  RelayCompilerContext.prototype._get = function _get(name) {
	    var record = this._documents.get(name);
	    __webpack_require__(1)(record, 'RelayCompilerContext: Unknown document `%s`.', name);
	    return record;
	  };

	  RelayCompilerContext.prototype._update = function _update(documents) {
	    var context = new RelayCompilerContext(this.schema);
	    context._documents = documents;
	    return context;
	  };

	  return RelayCompilerContext;
	}();

	module.exports = RelayCompilerContext;

/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayDefaultHandleKey
	 * 
	 * @format
	 */

	'use strict';

	module.exports = {
	  DEFAULT_HANDLE_KEY: ''
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayIRVisitor
	 * 
	 * @format
	 */
	'use strict';

	var visit = __webpack_require__(5).visit;

	var NodeKeys = {
	  Argument: ['value'],
	  Condition: ['condition', 'selections'],
	  Directive: ['args'],
	  Fragment: ['argumentDefinitions', 'directives', 'selections'],
	  FragmentSpread: ['args', 'directives'],
	  InlineFragment: ['directives', 'selections'],
	  LinkedField: ['args', 'directives', 'selections'],
	  Literal: [],
	  LocalArgumentDefinition: [],
	  Root: ['argumentDefinitions', 'directives', 'selections'],
	  RootArgumentDefinition: [],
	  ScalarField: ['args', 'directives'],
	  Variable: []
	};

	function visitIR(root, visitor) {
	  return visit(root, visitor, NodeKeys);
	}

	module.exports = { visit: visitIR };

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("chalk");

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("fbjs/lib/partitionArray");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("process");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule CodegenDirectory
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(3));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * CodegenDirectory is a helper class for scripts that generate code into one
	 * output directory. The purpose is to make it easy to only write files that
	 * have changed and delete files that are no longer generated.
	 * It gives statistics about added/removed/updated/unchanged in the end.
	 * The class also has an option to "validate" which means that no file
	 * operations are performed and only the statistics are created for what would
	 * have happened. If there's anything but "unchanged", someone probably forgot
	 * to run the codegen script.
	 *
	 * Example:
	 *
	 *   const dir = new CodegenDirectory('/some/path/generated');
	 *   // write files in case content changed (less watchman/mtime changes)
	 *   dir.writeFile('OneFile.js', contents);
	 *   dir.writeFile('OtherFile.js', contents);
	 *
	 *   // delete files that are not generated
	 *   dir.deleteExtraFiles();
	 *
	 *   // arrays of file names to print or whatever
	 *   dir.changes.created
	 *   dir.changes.updated
	 *   dir.changes.deleted
	 *   dir.changes.unchanged
	 */
	var CodegenDirectory = function () {
	  function CodegenDirectory(dir) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	    (0, _classCallCheck3['default'])(this, CodegenDirectory);

	    this.onlyValidate = !!options.onlyValidate;
	    if (__webpack_require__(2).existsSync(dir)) {
	      __webpack_require__(1)(__webpack_require__(2).statSync(dir).isDirectory(), 'Expected `%s` to be a directory.', dir);
	    } else if (!this.onlyValidate) {
	      __webpack_require__(2).mkdirSync(dir);
	    }
	    this._files = new Set();
	    this.changes = {
	      deleted: [],
	      updated: [],
	      created: [],
	      unchanged: []
	    };
	    this._dir = dir;
	  }

	  CodegenDirectory.prototype.read = function read(filename) {
	    var filePath = __webpack_require__(4).join(this._dir, filename);
	    if (__webpack_require__(2).existsSync(filePath)) {
	      return __webpack_require__(2).readFileSync(filePath, 'utf8');
	    }
	    return null;
	  };

	  CodegenDirectory.prototype.markUnchanged = function markUnchanged(filename) {
	    this._addGenerated(filename);
	    this.changes.unchanged.push(filename);
	  };

	  /**
	   * Marks a files as updated or out of date without actually writing the file.
	   * This is probably only be useful when doing validation without intention to
	   * actually write to disk.
	   */


	  CodegenDirectory.prototype.markUpdated = function markUpdated(filename) {
	    this._addGenerated(filename);
	    this.changes.updated.push(filename);
	  };

	  CodegenDirectory.prototype.writeFile = function writeFile(filename, content) {
	    this._addGenerated(filename);
	    var filePath = __webpack_require__(4).join(this._dir, filename);
	    if (__webpack_require__(2).existsSync(filePath)) {
	      var existingContent = __webpack_require__(2).readFileSync(filePath, 'utf8');
	      if (existingContent === content) {
	        this.changes.unchanged.push(filename);
	      } else {
	        this._writeFile(filePath, content);
	        this.changes.updated.push(filename);
	      }
	    } else {
	      this._writeFile(filePath, content);
	      this.changes.created.push(filename);
	    }
	  };

	  CodegenDirectory.prototype._writeFile = function _writeFile(filePath, content) {
	    if (!this.onlyValidate) {
	      __webpack_require__(2).writeFileSync(filePath, content, 'utf8');
	    }
	  };

	  /**
	   * Deletes all non-generated files, except for invisible "dot" files (ie.
	   * files with names starting with ".").
	   */


	  CodegenDirectory.prototype.deleteExtraFiles = function deleteExtraFiles() {
	    var _this = this;

	    __webpack_require__(2).readdirSync(this._dir).forEach(function (actualFile) {
	      if (!_this._files.has(actualFile) && !/^\./.test(actualFile)) {
	        if (!_this.onlyValidate) {
	          try {
	            __webpack_require__(2).unlinkSync(__webpack_require__(4).join(_this._dir, actualFile));
	          } catch (e) {
	            throw new Error('CodegenDirectory: Failed to delete `' + actualFile + '` in `' + _this._dir + '`.');
	          }
	        }
	        _this.changes.deleted.push(actualFile);
	      }
	    });
	  };

	  CodegenDirectory.prototype.getPath = function getPath(filename) {
	    return __webpack_require__(4).join(this._dir, filename);
	  };

	  CodegenDirectory.prototype._addGenerated = function _addGenerated(filename) {
	    __webpack_require__(1)(!this._files.has(filename), 'CodegenDirectory: Tried to generate `%s` twice in `%s`.', filename, this._dir);
	    this._files.add(filename);
	  };

	  return CodegenDirectory;
	}();

	module.exports = CodegenDirectory;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayCodeGenerator
	 * 
	 * @format
	 */

	'use strict';

	var _toConsumableArray3 = _interopRequireDefault(__webpack_require__(9));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(5),
	    GraphQLList = _require.GraphQLList;

	var getRawType = __webpack_require__(6).getRawType,
	    isAbstractType = __webpack_require__(6).isAbstractType,
	    getNullableType = __webpack_require__(6).getNullableType;

	/* eslint-disable no-redeclare */


	/**
	 * @public
	 *
	 * Converts a Relay IR node into a plain JS object representation that can be
	 * used at runtime.
	 */
	function generate(node) {
	  __webpack_require__(1)(['Root', 'Fragment'].indexOf(node.kind) >= 0, 'RelayCodeGenerator: Unknown AST kind `%s`. Source: %s.', node.kind, getErrorMessage(node));
	  return __webpack_require__(18).visit(node, RelayCodeGenVisitor);
	}
	/* eslint-enable no-redeclare */

	var RelayCodeGenVisitor = {
	  leave: {
	    Root: function Root(node) {
	      return {
	        argumentDefinitions: node.argumentDefinitions,
	        kind: 'Root',
	        name: node.name,
	        operation: node.operation,
	        selections: flattenArray(node.selections)
	      };
	    },
	    Fragment: function Fragment(node) {
	      return {
	        argumentDefinitions: node.argumentDefinitions,
	        kind: 'Fragment',
	        metadata: node.metadata || null,
	        name: node.name,
	        selections: flattenArray(node.selections),
	        type: node.type.toString()
	      };
	    },
	    LocalArgumentDefinition: function LocalArgumentDefinition(node) {
	      return {
	        kind: 'LocalArgument',
	        name: node.name,
	        type: node.type.toString(),
	        defaultValue: node.defaultValue
	      };
	    },
	    RootArgumentDefinition: function RootArgumentDefinition(node) {
	      return {
	        kind: 'RootArgument',
	        name: node.name,
	        type: node.type ? node.type.toString() : null
	      };
	    },
	    Condition: function Condition(node, key, parent, ancestors) {
	      __webpack_require__(1)(node.condition.kind === 'Variable', 'RelayCodeGenerator: Expected static `Condition` node to be ' + 'pruned or inlined. Source: %s.', getErrorMessage(ancestors[0]));
	      return {
	        kind: 'Condition',
	        passingValue: node.passingValue,
	        condition: node.condition.variableName,
	        selections: flattenArray(node.selections)
	      };
	    },
	    FragmentSpread: function FragmentSpread(node) {
	      return {
	        kind: 'FragmentSpread',
	        name: node.name,
	        args: valuesOrNull(sortByName(node.args))
	      };
	    },
	    InlineFragment: function InlineFragment(node) {
	      return {
	        kind: 'InlineFragment',
	        type: node.typeCondition.toString(),
	        selections: flattenArray(node.selections)
	      };
	    },
	    LinkedField: function LinkedField(node) {
	      var handles = node.handles && node.handles.map(function (handle) {
	        return {
	          kind: 'LinkedHandle',
	          alias: node.alias,
	          args: valuesOrNull(sortByName(node.args)),
	          handle: handle.name,
	          name: node.name,
	          key: handle.key,
	          filters: handle.filters
	        };
	      }) || [];
	      var type = getRawType(node.type);
	      return [{
	        kind: 'LinkedField',
	        alias: node.alias,
	        args: valuesOrNull(sortByName(node.args)),
	        concreteType: !isAbstractType(type) ? type.toString() : null,
	        name: node.name,
	        plural: isPlural(node.type),
	        selections: flattenArray(node.selections),
	        storageKey: getStorageKey(node.name, node.args)
	      }].concat((0, _toConsumableArray3['default'])(handles));
	    },
	    ScalarField: function ScalarField(node) {
	      var handles = node.handles && node.handles.map(function (handle) {
	        return {
	          kind: 'ScalarHandle',
	          alias: node.alias,
	          args: valuesOrNull(sortByName(node.args)),
	          handle: handle.name,
	          name: node.name,
	          key: handle.key,
	          filters: handle.filters
	        };
	      }) || [];
	      return [{
	        kind: 'ScalarField',
	        alias: node.alias,
	        args: valuesOrNull(sortByName(node.args)),
	        name: node.name,
	        selections: valuesOrUndefined(flattenArray(node.selections)),
	        storageKey: getStorageKey(node.name, node.args)
	      }].concat((0, _toConsumableArray3['default'])(handles));
	    },
	    Variable: function Variable(node, key, parent) {
	      return {
	        kind: 'Variable',
	        name: parent.name,
	        variableName: node.variableName,
	        type: parent.type ? parent.type.toString() : null
	      };
	    },
	    Literal: function Literal(node, key, parent) {
	      return {
	        kind: 'Literal',
	        name: parent.name,
	        value: node.value,
	        type: parent.type ? parent.type.toString() : null
	      };
	    },
	    Argument: function Argument(node, key, parent, ancestors) {
	      __webpack_require__(1)(['Variable', 'Literal'].indexOf(node.value.kind) >= 0, 'RelayCodeGenerator: Complex argument values (Lists or ' + 'InputObjects with nested variables) are not supported, argument ' + '`%s` had value `%s`. Source: %s.', node.name, __webpack_require__(33)(node.value), getErrorMessage(ancestors[0]));
	      return node.value.value !== null ? node.value : null;
	    }
	  }
	};

	function isPlural(type) {
	  return getNullableType(type) instanceof GraphQLList;
	}

	function valuesOrUndefined(array) {
	  return !array || array.length === 0 ? undefined : array;
	}

	function valuesOrNull(array) {
	  return !array || array.length === 0 ? null : array;
	}

	function flattenArray(array) {
	  return array ? Array.prototype.concat.apply([], array) : [];
	}

	function sortByName(array) {
	  return array instanceof Array ? array.sort(function (a, b) {
	    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
	  }) : array;
	}

	function getErrorMessage(node) {
	  return 'document ' + node.name;
	}

	/**
	 * Computes storage key if possible.
	 *
	 * Storage keys which can be known ahead of runtime are:
	 *
	 * - Fields that do not take arguments.
	 * - Fields whose arguments are all statically known (ie. literals) at build
	 *   time.
	 */
	function getStorageKey(fieldName, args) {
	  if (!args || !args.length) {
	    return null;
	  }
	  var isLiteral = true;
	  var preparedArgs = {};
	  args.forEach(function (arg) {
	    if (arg.kind !== 'Literal') {
	      isLiteral = false;
	    } else {
	      preparedArgs[arg.name] = arg.value;
	    }
	  });
	  return isLiteral ? __webpack_require__(32)(fieldName, preparedArgs) : null;
	}

	module.exports = { generate: generate };

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayCodegenRunner
	 * 
	 * @format
	 */

	'use strict';

	var _asyncToGenerator2 = __webpack_require__(7);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(3));

	var _toConsumableArray3 = _interopRequireDefault(__webpack_require__(9));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(8),
	    ImmutableMap = _require.Map;

	/* eslint-disable no-console-disallow */

	var RelayCodegenRunner = function () {
	  // parser => writers that are affected by it
	  function RelayCodegenRunner(options) {
	    var _this = this;

	    (0, _classCallCheck3['default'])(this, RelayCodegenRunner);
	    this.parsers = {};

	    this.parserConfigs = options.parserConfigs;
	    this.writerConfigs = options.writerConfigs;
	    this.onlyValidate = options.onlyValidate;
	    this._reporter = options.reporter;

	    this.parserWriters = {};
	    for (var _parser in options.parserConfigs) {
	      this.parserWriters[_parser] = new Set();
	    }

	    var _loop = function _loop(_writer) {
	      var config = options.writerConfigs[_writer];
	      config.baseParsers && config.baseParsers.forEach(function (parser) {
	        return _this.parserWriters[parser].add(_writer);
	      });
	      _this.parserWriters[config.parser].add(_writer);
	    };

	    for (var _writer in options.writerConfigs) {
	      _loop(_writer);
	    }
	  }

	  RelayCodegenRunner.prototype.compileAll = (() => {
	    var _ref = (0, _asyncToGenerator3.default)(function* () {
	      // reset the parsers
	      this.parsers = {};
	      for (var parserName in this.parserConfigs) {
	        try {
	          yield this.parseEverything(parserName);
	        } catch (e) {
	          this._reporter.reportError('RelayCodegenRunner.compileAll', e);
	          return 'ERROR';
	        }
	      }

	      var hasChanges = false;
	      for (var writerName in this.writerConfigs) {
	        var result = yield this.write(writerName);
	        if (result === 'ERROR') {
	          return 'ERROR';
	        }
	        if (result === 'HAS_CHANGES') {
	          hasChanges = true;
	        }
	      }
	      return hasChanges ? 'HAS_CHANGES' : 'NO_CHANGES';
	    });

	    function compileAll() {
	      return _ref.apply(this, arguments);
	    }

	    return compileAll;
	  })();

	  RelayCodegenRunner.prototype.compile = (() => {
	    var _ref2 = (0, _asyncToGenerator3.default)(function* (writerName) {
	      var _this2 = this;

	      var writerConfig = this.writerConfigs[writerName];

	      var parsers = [writerConfig.parser];
	      if (writerConfig.baseParsers) {
	        writerConfig.baseParsers.forEach(function (parser) {
	          return parsers.push(parser);
	        });
	      }
	      // Don't bother resetting the parsers
	      yield Promise.all(parsers.map(function (parser) {
	        return _this2.parseEverything(parser);
	      }));

	      return yield this.write(writerName);
	    });

	    function compile(_x) {
	      return _ref2.apply(this, arguments);
	    }

	    return compile;
	  })();

	  RelayCodegenRunner.prototype.getDirtyWriters = (() => {
	    var _ref3 = (0, _asyncToGenerator3.default)(function* (filePaths) {
	      var _this3 = this;

	      var dirtyWriters = new Set();

	      // Check if any files are in the output
	      for (var configName in this.writerConfigs) {
	        var config = this.writerConfigs[configName];
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	          for (var _iterator = filePaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var _filePath = _step.value;

	            if (config.isGeneratedFile(_filePath)) {
	              dirtyWriters.add(configName);
	            }
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator['return']) {
	              _iterator['return']();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }

	      var client = new (__webpack_require__(13))();

	      // Check for files in the input
	      yield Promise.all(Object.keys(this.parserConfigs).map((() => {
	        var _ref4 = (0, _asyncToGenerator3.default)(function* (parserConfigName) {
	          var config = _this3.parserConfigs[parserConfigName];
	          var dirs = yield client.watchProject(config.baseDir);

	          var relativeFilePaths = filePaths.map(function (filePath) {
	            return __webpack_require__(4).relative(config.baseDir, filePath);
	          });

	          var query = {
	            expression: ['allof', config.watchmanExpression, ['name', relativeFilePaths, 'wholename']],
	            fields: ['exists'],
	            relative_root: dirs.relativePath
	          };

	          var result = yield client.command('query', dirs.root, query);
	          if (result.files.length > 0) {
	            _this3.parserWriters[parserConfigName].forEach(function (writerName) {
	              return dirtyWriters.add(writerName);
	            });
	          }
	        });

	        return function (_x3) {
	          return _ref4.apply(this, arguments);
	        };
	      })()));

	      client.end();
	      return dirtyWriters;
	    });

	    function getDirtyWriters(_x2) {
	      return _ref3.apply(this, arguments);
	    }

	    return getDirtyWriters;
	  })();

	  RelayCodegenRunner.prototype.parseEverything = (() => {
	    var _ref5 = (0, _asyncToGenerator3.default)(function* (parserName) {
	      if (this.parsers[parserName]) {
	        // no need to parse
	        return;
	      }

	      var parserConfig = this.parserConfigs[parserName];
	      this.parsers[parserName] = parserConfig.getParser(parserConfig.baseDir);
	      var filter = parserConfig.getFileFilter ? parserConfig.getFileFilter(parserConfig.baseDir) : anyFileFilter;

	      if (parserConfig.filepaths && parserConfig.watchmanExpression) {
	        throw new Error('Provide either `watchmanExpression` or `filepaths` but not both.');
	      }

	      var files = void 0;
	      if (parserConfig.watchmanExpression) {
	        files = yield __webpack_require__(12).queryFiles(parserConfig.baseDir, parserConfig.watchmanExpression, filter);
	      } else if (parserConfig.filepaths) {
	        files = yield __webpack_require__(12).queryFilepaths(parserConfig.baseDir, parserConfig.filepaths, filter);
	      } else {
	        throw new Error('Either `watchmanExpression` or `filepaths` is required to query files');
	      }
	      this.parseFileChanges(parserName, files);
	    });

	    function parseEverything(_x4) {
	      return _ref5.apply(this, arguments);
	    }

	    return parseEverything;
	  })();

	  RelayCodegenRunner.prototype.parseFileChanges = function parseFileChanges(parserName, files) {
	    var tStart = Date.now();
	    var parser = this.parsers[parserName];
	    // this maybe should be await parser.parseFiles(files);
	    parser.parseFiles(files);
	    var tEnd = Date.now();
	    console.log('Parsed %s in %s', parserName, toSeconds(tStart, tEnd));
	  };

	  // We cannot do incremental writes right now.
	  // When we can, this could be writeChanges(writerName, parserName, parsedDefinitions)


	  RelayCodegenRunner.prototype.write = (() => {
	    var _ref6 = (0, _asyncToGenerator3.default)(function* (writerName) {
	      var _this4 = this;

	      try {
	        var combineChanges = function combineChanges(accessor) {
	          var combined = [];
	          __webpack_require__(1)(outputDirectories, 'RelayCodegenRunner: Expected outputDirectories to be set');
	          var _iteratorNormalCompletion2 = true;
	          var _didIteratorError2 = false;
	          var _iteratorError2 = undefined;

	          try {
	            for (var _iterator2 = outputDirectories.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	              var dir = _step2.value;

	              combined.push.apply(combined, (0, _toConsumableArray3['default'])(accessor(dir.changes)));
	            }
	          } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                _iterator2['return']();
	              }
	            } finally {
	              if (_didIteratorError2) {
	                throw _iteratorError2;
	              }
	            }
	          }

	          return combined;
	        };

	        console.log('\nWriting %s', writerName);
	        var tStart = Date.now();
	        var _writerConfigs$writer = this.writerConfigs[writerName],
	            _getWriter = _writerConfigs$writer.getWriter,
	            _parser2 = _writerConfigs$writer.parser,
	            _baseParsers = _writerConfigs$writer.baseParsers,
	            _isGeneratedFile = _writerConfigs$writer.isGeneratedFile;


	        var _baseDocuments = ImmutableMap();
	        if (_baseParsers) {
	          _baseParsers.forEach(function (baseParserName) {
	            _baseDocuments = _baseDocuments.merge(_this4.parsers[baseParserName].documents());
	          });
	        }

	        // always create a new writer: we have to write everything anyways
	        var _documents = this.parsers[_parser2].documents();
	        var _schema = this.parserConfigs[_parser2].getSchema();
	        var _writer2 = _getWriter(this.onlyValidate, _schema, _documents, _baseDocuments);

	        var outputDirectories = yield _writer2.writeAll();

	        var tWritten = Date.now();

	        var created = combineChanges(function (_) {
	          return _.created;
	        });
	        var updated = combineChanges(function (_) {
	          return _.updated;
	        });
	        var deleted = combineChanges(function (_) {
	          return _.deleted;
	        });
	        var unchanged = combineChanges(function (_) {
	          return _.unchanged;
	        });

	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	          for (var _iterator3 = outputDirectories.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	            var dir = _step3.value;

	            var all = [].concat((0, _toConsumableArray3['default'])(dir.changes.created), (0, _toConsumableArray3['default'])(dir.changes.updated), (0, _toConsumableArray3['default'])(dir.changes.deleted), (0, _toConsumableArray3['default'])(dir.changes.unchanged));

	            var _iteratorNormalCompletion4 = true;
	            var _didIteratorError4 = false;
	            var _iteratorError4 = undefined;

	            try {
	              for (var _iterator4 = all[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var filename = _step4.value;

	                var _filePath2 = dir.getPath(filename);
	                __webpack_require__(1)(_isGeneratedFile(_filePath2), 'RelayCodegenRunner: %s returned false for isGeneratedFile, ' + 'but was in generated directory', _filePath2);
	              }
	            } catch (err) {
	              _didIteratorError4 = true;
	              _iteratorError4 = err;
	            } finally {
	              try {
	                if (!_iteratorNormalCompletion4 && _iterator4['return']) {
	                  _iterator4['return']();
	                }
	              } finally {
	                if (_didIteratorError4) {
	                  throw _iteratorError4;
	                }
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError3 = true;
	          _iteratorError3 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	              _iterator3['return']();
	            }
	          } finally {
	            if (_didIteratorError3) {
	              throw _iteratorError3;
	            }
	          }
	        }

	        if (this.onlyValidate) {
	          printFiles('Missing', created);
	          printFiles('Out of date', updated);
	          printFiles('Extra', deleted);
	        } else {
	          printFiles('Created', created);
	          printFiles('Updated', updated);
	          printFiles('Deleted', deleted);
	          console.log('Unchanged: %s files', unchanged.length);
	        }

	        console.log('Written %s in %s', writerName, toSeconds(tStart, tWritten));

	        return created.length + updated.length + deleted.length > 0 ? 'HAS_CHANGES' : 'NO_CHANGES';
	      } catch (e) {
	        this._reporter.reportError('RelayCodegenRunner.write', e);
	        return 'ERROR';
	      }
	    });

	    function write(_x5) {
	      return _ref6.apply(this, arguments);
	    }

	    return write;
	  })();

	  RelayCodegenRunner.prototype.watchAll = (() => {
	    var _ref7 = (0, _asyncToGenerator3.default)(function* () {
	      // get everything set up for watching
	      yield this.compileAll();

	      for (var parserName in this.parserConfigs) {
	        yield this.watch(parserName);
	      }
	    });

	    function watchAll() {
	      return _ref7.apply(this, arguments);
	    }

	    return watchAll;
	  })();

	  RelayCodegenRunner.prototype.watch = (() => {
	    var _ref8 = (0, _asyncToGenerator3.default)(function* (parserName) {
	      var _this5 = this;

	      var parserConfig = this.parserConfigs[parserName];

	      if (!parserConfig.watchmanExpression) {
	        throw new Error('`watchmanExpression` is required to watch files');
	      }

	      // watchCompile starts with a full set of files as the changes
	      // But as we need to set everything up due to potential parser dependencies,
	      // we should prevent the first watch callback from doing anything.
	      var firstChange = true;

	      yield __webpack_require__(12).watchCompile(parserConfig.baseDir, parserConfig.watchmanExpression, parserConfig.getFileFilter ? parserConfig.getFileFilter(parserConfig.baseDir) : anyFileFilter, (() => {
	        var _ref9 = (0, _asyncToGenerator3.default)(function* (files) {
	          __webpack_require__(1)(_this5.parsers[parserName], 'Trying to watch an uncompiled parser config: %s', parserName);
	          if (firstChange) {
	            firstChange = false;
	            return;
	          }
	          var dependentWriters = [];
	          _this5.parserWriters[parserName].forEach(function (writer) {
	            return dependentWriters.push(writer);
	          });

	          try {
	            if (!_this5.parsers[parserName]) {
	              // have to load the parser and make sure all of its dependents are set
	              yield _this5.parseEverything(parserName);
	            } else {
	              _this5.parseFileChanges(parserName, files);
	            }
	            yield Promise.all(dependentWriters.map(function (writer) {
	              return _this5.write(writer);
	            }));
	          } catch (error) {
	            _this5._reporter.reportError('RelayCodegenRunner.watch', error);
	          }
	          console.log('Watching for changes to %s...', parserName);
	        });

	        return function (_x7) {
	          return _ref9.apply(this, arguments);
	        };
	      })());
	      console.log('Watching for changes to %s...', parserName);
	    });

	    function watch(_x6) {
	      return _ref8.apply(this, arguments);
	    }

	    return watch;
	  })();

	  return RelayCodegenRunner;
	}();

	function anyFileFilter(file) {
	  return true;
	}

	function toSeconds(t0, t1) {
	  return ((t1 - t0) / 1000).toFixed(2) + 's';
	}

	function printFiles(label, files) {
	  if (files.length > 0) {
	    console.log(label + ':');
	    files.forEach(function (file) {
	      console.log(' - ' + file);
	    });
	  }
	}

	module.exports = RelayCodegenRunner;

/***/ },
/* 25 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayCompilerUserError
	 * 
	 * @format
	 */

	'use strict';

	var createUserError = function createUserError(format) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  var index = 0;
	  var formatted = format.replace(/%s/g, function (match) {
	    return args[index++];
	  });
	  var err = new Error(formatted);
	  err.isRelayUserError = true;
	  return err;
	};

	module.exports = { createUserError: createUserError };

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayConsoleReporter
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(3));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var RelayConsoleReporter = function () {
	  function RelayConsoleReporter(options) {
	    (0, _classCallCheck3['default'])(this, RelayConsoleReporter);

	    this._verbose = options.verbose;
	  }

	  RelayConsoleReporter.prototype.reportError = function reportError(caughtLocation, error) {
	    __webpack_require__(21).stdout.write(__webpack_require__(19).red('ERROR:' + '\n' + error.message + '\n'));
	    if (this._verbose) {
	      var frames = error.stack.match(/^ {4}at .*$/gm);
	      if (frames) {
	        __webpack_require__(21).stdout.write(__webpack_require__(19).gray('From: ' + caughtLocation + '\n' + frames.join('\n') + '\n'));
	      }
	    }
	  };

	  return RelayConsoleReporter;
	}();

	module.exports = RelayConsoleReporter;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayFileWriter
	 * 
	 * @format
	 */

	'use strict';

	var _asyncToGenerator2 = __webpack_require__(7);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(3));

	var _toConsumableArray3 = _interopRequireDefault(__webpack_require__(9));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; } //
	//
	//
	//
	//const RelayFlowGenerator = require('RelayFlowGenerator');
	//const RelayValidator = require('RelayValidator');
	//

	//
	//
	//const printFlowTypes = require('printFlowTypes');
	//const writeLegacyFlowFile = require('./writeLegacyFlowFile');


	//

	var _require = __webpack_require__(23),
	    generate = _require.generate;

	var _require2 = __webpack_require__(6),
	    isOperationDefinitionAST = _require2.isOperationDefinitionAST; //


	var _require3 = __webpack_require__(8),
	    ImmutableMap = _require3.Map; //

	//
	//
	//
	//

	/* eslint-disable no-console-disallow */

	var RelayFileWriter = function () {
	  function RelayFileWriter(options) {
	    (0, _classCallCheck3['default'])(this, RelayFileWriter);
	    var config = options.config,
	        onlyValidate = options.onlyValidate,
	        baseDocuments = options.baseDocuments,
	        documents = options.documents,
	        schema = options.schema;

	    this._baseDocuments = baseDocuments || ImmutableMap();
	    this._baseSchema = schema;
	    this._config = config;
	    this._documents = documents;
	    this._onlyValidate = onlyValidate;

	    validateConfig(this._config);
	  }

	  RelayFileWriter.prototype.writeAll = (() => {
	    var _ref = (0, _asyncToGenerator3.default)(function* () {
	      var _this = this;

	      var tStart = Date.now();

	      // Can't convert to IR unless the schema already has Relay-local extensions
	      var transformedSchema = __webpack_require__(10).transformASTSchema(this._baseSchema, this._config.schemaExtensions);
	      var extendedSchema = __webpack_require__(10).extendASTSchema(transformedSchema, this._baseDocuments.merge(this._documents).valueSeq().toArray());

	      // Build a context from all the documents
	      var baseDefinitionNames = new Set();
	      this._baseDocuments.forEach(function (doc) {
	        doc.definitions.forEach(function (def) {
	          if (isOperationDefinitionAST(def) && def.name) {
	            baseDefinitionNames.add(def.name.value);
	          }
	        });
	      });
	      var definitionDirectories = new Map();
	      var allOutputDirectories = new Map();
	      var addCodegenDir = function addCodegenDir(dirPath) {
	        var codegenDir = new (__webpack_require__(22))(dirPath, {
	          onlyValidate: _this._onlyValidate
	        });
	        allOutputDirectories.set(dirPath, codegenDir);
	        return codegenDir;
	      };

	      var configOutputDirectory = void 0;
	      if (this._config.outputDir) {
	        configOutputDirectory = addCodegenDir(this._config.outputDir);
	      } else {
	        this._documents.forEach(function (doc, filePath) {
	          doc.definitions.forEach(function (def) {
	            if (isOperationDefinitionAST(def) && def.name) {
	              definitionDirectories.set(def.name.value, __webpack_require__(4).join(_this._config.baseDir, __webpack_require__(4).dirname(filePath)));
	            }
	          });
	        });
	      }

	      var definitions = __webpack_require__(10).convertASTDocumentsWithBase(extendedSchema, this._baseDocuments.valueSeq().toArray(), this._documents.valueSeq().toArray(),
	      // Verify using local and global rules, can run global verifications here
	      // because all files are processed together
	      [].concat((0, _toConsumableArray3['default'])(__webpack_require__(11).LOCAL_RULES), (0, _toConsumableArray3['default'])(__webpack_require__(11).GLOBAL_RULES)));

	      var compilerContext = new (__webpack_require__(16))(extendedSchema);
	      var compiler = new (__webpack_require__(15))(this._baseSchema, compilerContext, this._config.compilerTransforms, generate);

	      var getGeneratedDirectory = function getGeneratedDirectory(definitionName) {
	        if (configOutputDirectory) {
	          return configOutputDirectory;
	        }
	        var definitionDir = definitionDirectories.get(definitionName);
	        __webpack_require__(1)(definitionDir, 'RelayFileWriter: Could not determine source directory for definition: %s', definitionName);
	        var generatedPath = __webpack_require__(4).join(definitionDir, '__generated__');
	        var cachedDir = allOutputDirectories.get(generatedPath);
	        if (!cachedDir) {
	          cachedDir = addCodegenDir(generatedPath);
	        }
	        return cachedDir;
	      };

	      compiler.addDefinitions(definitions);

	      // const transformedFlowContext = RelayFlowGenerator.flowTransforms.reduce(
	      //   (ctx, transform) => transform(ctx, extendedSchema),
	      //   compiler.context(),
	      // );
	      var transformedQueryContext = compiler.transformedQueryContext();
	      var compiledDocumentMap = compiler.compile();

	      var tCompiled = Date.now();
	      ////
	      // compiledDocumentMap.forEach(compiledDocument => {
	      //   console.log(compiledDocument);
	      // });

	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = compiledDocumentMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var _step$value = _step.value,
	              key = _step$value[0],
	              value = _step$value[1];

	          console.log("\nkey:\n");
	          console.log(key);
	          console.log("\nvalue:\n");
	          //console.log(value);
	          if (value.text) {
	            console.log(value.text);
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator['return']) {
	            _iterator['return']();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      var tGenerated = void 0;
	      try {
	        yield Promise.all(transformedQueryContext.documents().map((() => {
	          var _ref2 = (0, _asyncToGenerator3.default)(function* (node) {
	            if (baseDefinitionNames.has(node.name)) {
	              // don't add definitions that were part of base context
	              return;
	            }
	            // if (
	            //   this._config.fragmentsWithLegacyFlowTypes &&
	            //   this._config.fragmentsWithLegacyFlowTypes.has(node.name)
	            // ) {
	            //   const legacyFlowTypes = printFlowTypes(node);
	            //   if (legacyFlowTypes) {
	            //     writeLegacyFlowFile(
	            //       getGeneratedDirectory(node.name),
	            //       node.name,
	            //       legacyFlowTypes,
	            //       this._config.platform,
	            //     );
	            //   }
	            // }

	            // const flowTypes = RelayFlowGenerator.generate(
	            //   node,
	            //   this._config.inputFieldWhiteListForFlow,
	            // );
	            var flowTypes = null;

	            var compiledNode = compiledDocumentMap.get(node.name);
	            __webpack_require__(1)(compiledNode, 'RelayCompiler: did not compile definition: %s', node.name);
	            yield __webpack_require__(35)(getGeneratedDirectory(compiledNode.name), getGeneratedNode(compiledNode),
	            //this._config.formatModule,
	            //flowTypes,
	            _this._config.persistQuery, _this._config.platform, _this._config.relayRuntimeModule || 'relay-runtime');
	          });

	          return function (_x) {
	            return _ref2.apply(this, arguments);
	          };
	        })()));
	        tGenerated = Date.now();

	        if (this._config.generateExtraFiles) {
	          var configDirectory = this._config.outputDir;
	          __webpack_require__(1)(configDirectory, 'RelayFileWriter: cannot generate extra files without specifying ' + ' an outputDir in the config.');

	          this._config.generateExtraFiles(function (dir) {
	            var outputDirectory = dir || configDirectory;
	            var outputDir = allOutputDirectories.get(outputDirectory);
	            if (!outputDir) {
	              outputDir = addCodegenDir(outputDirectory);
	            }
	            return outputDir;
	          }, transformedQueryContext);
	        }

	        // clean output directories
	        allOutputDirectories.forEach(function (dir) {
	          dir.deleteExtraFiles();
	        });
	      } catch (error) {
	        tGenerated = Date.now();
	        var details = void 0;
	        try {
	          details = JSON.parse(error.message);
	        } catch (_) {}
	        if (details && details.name === 'GraphQL2Exception' && details.message) {
	          console.log('ERROR writing modules:\n' + details.message);
	        } else {
	          console.log('Error writing modules:\n' + error.toString());
	        }
	        return allOutputDirectories;
	      }

	      var tExtra = Date.now();
	      console.log('Writer time: %s [%s compiling, %s generating, %s extra]', toSeconds(tStart, tExtra), toSeconds(tStart, tCompiled), toSeconds(tCompiled, tGenerated), toSeconds(tGenerated, tExtra));
	      return allOutputDirectories;
	    });

	    function writeAll() {
	      return _ref.apply(this, arguments);
	    }

	    return writeAll;
	  })();

	  return RelayFileWriter;
	}();

	function getGeneratedNode(compiledNode) {
	  __webpack_require__(1)(typeof compiledNode === 'object' && compiledNode !== null && (compiledNode.kind === 'Fragment' || compiledNode.kind === 'Batch'), 'getGeneratedNode: Expected a GeneratedNode, got `%s`.', JSON.stringify(compiledNode));
	  return compiledNode;
	}

	function toSeconds(t0, t1) {
	  return ((t1 - t0) / 1000).toFixed(2) + 's';
	}

	function validateConfig(config) {
	  if (config.buildCommand) {
	    process.stderr.write('WARNING: RelayFileWriter: For RelayFileWriter to work you must ' + 'replace config.buildCommand with config.formatModule.\n');
	  }
	}

	module.exports = RelayFileWriter;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayMultiReporter
	 * 
	 * @format
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(3));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var RelayMultiReporter = function () {
	  function RelayMultiReporter() {
	    (0, _classCallCheck3['default'])(this, RelayMultiReporter);

	    for (var _len = arguments.length, reporters = Array(_len), _key = 0; _key < _len; _key++) {
	      reporters[_key] = arguments[_key];
	    }

	    this._reporters = reporters;
	  }

	  RelayMultiReporter.prototype.reportError = function reportError(caughtLocation, error) {
	    this._reporters.forEach(function (reporter) {
	      reporter.reportError(caughtLocation, error);
	    });
	  };

	  return RelayMultiReporter;
	}();

	module.exports = RelayMultiReporter;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayParser
	 * 
	 * @format
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(36));

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(3));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(17),
	    DEFAULT_HANDLE_KEY = _require.DEFAULT_HANDLE_KEY;

	var _require2 = __webpack_require__(6),
	    getNullableType = _require2.getNullableType,
	    getRawType = _require2.getRawType,
	    getTypeFromAST = _require2.getTypeFromAST,
	    isOperationDefinitionAST = _require2.isOperationDefinitionAST;

	var _require3 = __webpack_require__(5),
	    assertAbstractType = _require3.assertAbstractType,
	    assertCompositeType = _require3.assertCompositeType,
	    assertInputType = _require3.assertInputType,
	    assertOutputType = _require3.assertOutputType,
	    extendSchema = _require3.extendSchema,
	    getNamedType = _require3.getNamedType,
	    GraphQLEnumType = _require3.GraphQLEnumType,
	    GraphQLInputObjectType = _require3.GraphQLInputObjectType,
	    GraphQLInterfaceType = _require3.GraphQLInterfaceType,
	    GraphQLList = _require3.GraphQLList,
	    GraphQLObjectType = _require3.GraphQLObjectType,
	    GraphQLScalarType = _require3.GraphQLScalarType,
	    GraphQLUnionType = _require3.GraphQLUnionType,
	    isAbstractType = _require3.isAbstractType,
	    isLeafType = _require3.isLeafType,
	    isTypeSubTypeOf = _require3.isTypeSubTypeOf,
	    parse = _require3.parse,
	    parseType = _require3.parseType,
	    SchemaMetaFieldDef = _require3.SchemaMetaFieldDef,
	    Source = _require3.Source,
	    TypeMetaFieldDef = _require3.TypeMetaFieldDef,
	    TypeNameMetaFieldDef = _require3.TypeNameMetaFieldDef;

	var ARGUMENT_DEFINITIONS = 'argumentDefinitions';
	var ARGUMENTS = 'arguments';

	/**
	 * @internal
	 *
	 * This directive is not intended for use by developers directly. To set a field
	 * handle in product code use a compiler plugin.
	 */
	var CLIENT_FIELD = '__clientField';
	var CLIENT_FIELD_HANDLE = 'handle';
	var CLIENT_FIELD_KEY = 'key';
	var CLIENT_FIELD_FILTERS = 'filters';

	var INCLUDE = 'include';
	var SKIP = 'skip';
	var IF = 'if';

	function parseRelay(schema, text, filename) {
	  var ast = parse(new Source(text, filename));
	  var nodes = [];
	  schema = extendSchema(schema, ast);
	  ast.definitions.forEach(function (definition) {
	    if (isOperationDefinitionAST(definition)) {
	      nodes.push(transform(schema, definition));
	    }
	  });
	  return nodes;
	}

	/**
	 * Transforms a raw GraphQL AST into a simpler representation with type
	 * information.
	 */
	function transform(schema, definition) {
	  var parser = new RelayParser(schema, definition);
	  return parser.transform();
	}

	var RelayParser = function () {
	  function RelayParser(schema, definition) {
	    (0, _classCallCheck3['default'])(this, RelayParser);

	    this._definition = definition;
	    this._referencedVariables = {};
	    this._schema = schema;
	  }

	  RelayParser.prototype._getErrorContext = function _getErrorContext() {
	    var message = 'document `' + getName(this._definition) + '`';
	    if (this._definition.loc && this._definition.loc.source) {
	      message += ' file: `' + this._definition.loc.source.name + '`';
	    }
	    return message;
	  };

	  RelayParser.prototype._recordVariableReference = function _recordVariableReference(name, type) {
	    var prevType = this._referencedVariables[name];
	    if (type && prevType) {
	      __webpack_require__(1)(this._referencedVariables[name] == null || isTypeSubTypeOf(this._schema, this._referencedVariables[name], type), 'RelayParser: Variable `$%s` was used in locations expecting ' + 'the conflicting types `%s` and `%s`. Source: %s.', name, prevType, type, this._getErrorContext());
	    }
	    this._referencedVariables[name] = prevType || type;
	  };

	  RelayParser.prototype.transform = function transform() {
	    switch (this._definition.kind) {
	      case 'OperationDefinition':
	        return this._transformOperation(this._definition);
	      case 'FragmentDefinition':
	        return this._transformFragment(this._definition);
	      default:
	        __webpack_require__(1)(false, 'RelayParser: Unknown AST kind `%s`. Source: %s.', this._definition.kind, this._getErrorContext());
	    }
	  };

	  RelayParser.prototype._transformFragment = function _transformFragment(fragment) {
	    var _this = this;

	    var argumentDefinitions = this._buildArgumentDefinitions(fragment);
	    var directives = this._transformDirectives((fragment.directives || []).filter(function (directive) {
	      return getName(directive) !== ARGUMENT_DEFINITIONS;
	    }));
	    var type = assertCompositeType(getTypeFromAST(this._schema, fragment.typeCondition));
	    var selections = this._transformSelections(fragment.selectionSet, type);
	    __webpack_require__(14)(this._referencedVariables, function (variableType, name) {
	      var localArgument = argumentDefinitions.find(function (argDef) {
	        return argDef.name === name;
	      });
	      if (localArgument) {
	        __webpack_require__(1)(variableType == null || isTypeSubTypeOf(_this._schema, localArgument.type, variableType), 'RelayParser: Variable `$%s` was defined as type `%s`, but used in a ' + 'location that expects type `%s`. Source: %s.', name, localArgument.type, variableType, _this._getErrorContext());
	      } else {
	        argumentDefinitions.push({
	          kind: 'RootArgumentDefinition',
	          metadata: null,
	          name: name,
	          type: variableType
	        });
	      }
	    });
	    return {
	      kind: 'Fragment',
	      directives: directives,
	      metadata: null,
	      name: getName(fragment),
	      selections: selections,
	      type: type,
	      argumentDefinitions: argumentDefinitions
	    };
	  };

	  /**
	   * Polyfills suport for fragment variable definitions via the
	   * @argumentDefinitions directive. Returns the equivalent AST
	   * to the `argumentDefinitions` property on queries/mutations/etc.
	   */


	  RelayParser.prototype._buildArgumentDefinitions = function _buildArgumentDefinitions(fragment) {
	    var _this2 = this;

	    var variableDirectives = (fragment.directives || []).filter(function (directive) {
	      return getName(directive) === ARGUMENT_DEFINITIONS;
	    });
	    if (!variableDirectives.length) {
	      return [];
	    }
	    __webpack_require__(1)(variableDirectives.length === 1, 'RelayParser: Directive %s may be defined at most once on fragment ' + '`%s`. Source: %s.', ARGUMENT_DEFINITIONS, getName(fragment), this._getErrorContext());
	    var variableDirective = variableDirectives[0];
	    // $FlowIssue: refining directly on `variableDirective.arguments` doesn't
	    // work, below accesses all report arguments could still be null/undefined.
	    var args = variableDirective.arguments;
	    if (variableDirective == null || !Array.isArray(args)) {
	      return [];
	    }
	    __webpack_require__(1)(args.length, 'RelayParser: Directive %s requires arguments: remove the directive to ' + 'skip defining local variables for this fragment `%s`. Source: %s.', ARGUMENT_DEFINITIONS, getName(fragment), this._getErrorContext());
	    return args.map(function (arg) {
	      var argName = getName(arg);
	      var argValue = _this2._transformValue(arg.value);
	      __webpack_require__(1)(argValue.kind === 'Literal', 'RelayParser: Expected definition for variable `%s` to be an object ' + 'with the following shape: `{type: string, defaultValue?: mixed}`, got ' + '`%s`. Source: %s.', argValue, _this2._getErrorContext());
	      var value = argValue.value;
	      __webpack_require__(1)(!Array.isArray(value) && typeof value === 'object' && value !== null && typeof value.type === 'string', 'RelayParser: Expected definition for variable `%s` to be an object ' + 'with the following shape: `{type: string, defaultValue?: mixed}`, got ' + '`%s`. Source: %s.', argName, argValue, _this2._getErrorContext());
	      var typeAST = parseType(value.type);
	      var type = assertInputType(getTypeFromAST(_this2._schema, typeAST));
	      return {
	        kind: 'LocalArgumentDefinition',
	        defaultValue: value.defaultValue != null ? value.defaultValue : null,
	        metadata: null,
	        name: argName,
	        type: type
	      };
	    });
	  };

	  RelayParser.prototype._transformOperation = function _transformOperation(definition) {
	    var name = getName(definition);
	    var argumentDefinitions = this._transformArgumentDefinitions(definition.variableDefinitions || []);
	    var directives = this._transformDirectives(definition.directives || []);
	    var type = void 0;
	    var operation = void 0;
	    switch (definition.operation) {
	      case 'query':
	        operation = 'query';
	        type = assertCompositeType(this._schema.getQueryType());
	        break;
	      case 'mutation':
	        operation = 'mutation';
	        type = assertCompositeType(this._schema.getMutationType());
	        break;
	      case 'subscription':
	        operation = 'subscription';
	        type = assertCompositeType(this._schema.getSubscriptionType());
	        break;
	      default:
	        __webpack_require__(1)(false, 'RelayParser: Unknown AST kind `%s`. Source: %s.', definition.operation, this._getErrorContext());
	    }
	    __webpack_require__(1)(definition.selectionSet, 'RelayParser: Expected %s `%s` to have selections. Source: %s.', operation, name, this._getErrorContext());
	    var selections = this._transformSelections(definition.selectionSet, type);
	    return {
	      kind: 'Root',
	      operation: operation,
	      metadata: null,
	      name: name,
	      argumentDefinitions: argumentDefinitions,
	      directives: directives,
	      selections: selections,
	      type: type
	    };
	  };

	  RelayParser.prototype._transformArgumentDefinitions = function _transformArgumentDefinitions(argumentDefinitions) {
	    var _this3 = this;

	    return argumentDefinitions.map(function (def) {
	      var name = getName(def.variable);
	      var type = assertInputType(getTypeFromAST(_this3._schema, def.type));
	      var defaultLiteral = def.defaultValue ? _this3._transformValue(def.defaultValue) : null;
	      __webpack_require__(1)(defaultLiteral === null || defaultLiteral.kind === 'Literal', 'RelayParser: Expected null or Literal default value, got: `%s`. ' + 'Source: %s.', defaultLiteral && defaultLiteral.kind, _this3._getErrorContext());
	      return {
	        kind: 'LocalArgumentDefinition',
	        metadata: null,
	        name: name,
	        defaultValue: defaultLiteral ? defaultLiteral.value : null,
	        type: type
	      };
	    });
	  };

	  RelayParser.prototype._transformSelections = function _transformSelections(selectionSet, parentType) {
	    var _this4 = this;

	    return selectionSet.selections.map(function (selection) {
	      var node = void 0;
	      if (selection.kind === 'Field') {
	        node = _this4._transformField(selection, parentType);
	      } else if (selection.kind === 'FragmentSpread') {
	        node = _this4._transformFragmentSpread(selection, parentType);
	      } else if (selection.kind === 'InlineFragment') {
	        node = _this4._transformInlineFragment(selection, parentType);
	      } else {
	        __webpack_require__(1)(false, 'RelayParser: Unexpected AST kind `%s`. Source: %s.', selection.kind, _this4._getErrorContext());
	      }

	      var _splitConditions2 = _this4._splitConditions(node.directives),
	          conditions = _splitConditions2[0],
	          directives = _splitConditions2[1];

	      var conditionalNodes = applyConditions(conditions,
	      // $FlowFixMe(>=0.28.0)
	      [(0, _extends3['default'])({}, node, { directives: directives })]);
	      __webpack_require__(1)(conditionalNodes.length === 1, 'RelayParser: Expected exactly one conditional node, got `%s`. ' + 'Source: %s.', conditionalNodes.length, _this4._getErrorContext());
	      return conditionalNodes[0];
	    });
	  };

	  RelayParser.prototype._transformInlineFragment = function _transformInlineFragment(fragment, parentType) {
	    var typeCondition = assertCompositeType(fragment.typeCondition ? getTypeFromAST(this._schema, fragment.typeCondition) : parentType);
	    var directives = this._transformDirectives(fragment.directives || []);
	    var selections = this._transformSelections(fragment.selectionSet, typeCondition);
	    return {
	      kind: 'InlineFragment',
	      directives: directives,
	      metadata: null,
	      selections: selections,
	      typeCondition: typeCondition
	    };
	  };

	  RelayParser.prototype._transformFragmentSpread = function _transformFragmentSpread(fragment, parentType) {
	    var _this5 = this;

	    var fragmentName = getName(fragment);

	    var _partitionArray = __webpack_require__(20)(fragment.directives || [], function (directive) {
	      return getName(directive) !== ARGUMENTS;
	    }),
	        otherDirectives = _partitionArray[0],
	        argumentDirectives = _partitionArray[1];

	    __webpack_require__(1)(argumentDirectives.length <= 1, 'RelayParser: Directive %s may be used at most once in fragment ' + 'spread `...%s`. Source: %s.', ARGUMENTS, fragmentName, this._getErrorContext());
	    var args = void 0;
	    if (argumentDirectives.length) {
	      args = (argumentDirectives[0].arguments || []).map(function (arg) {
	        var argValue = arg.value;
	        __webpack_require__(1)(argValue.kind === 'Variable', 'RelayParser: All @arguments() args must be variables, got %s. ' + 'Source: %s.', argValue.kind, _this5._getErrorContext());

	        return {
	          kind: 'Argument',
	          metadata: null,
	          name: getName(arg),
	          value: _this5._transformVariable(argValue),
	          type: null // TODO: can't get type until referenced fragment is defined
	        };
	      });
	    }
	    var directives = this._transformDirectives(otherDirectives);
	    return {
	      kind: 'FragmentSpread',
	      args: args || [],
	      metadata: null,
	      name: fragmentName,
	      directives: directives
	    };
	  };

	  RelayParser.prototype._transformField = function _transformField(field, parentType) {
	    var name = getName(field);
	    var fieldDef = getFieldDefinition(this._schema, parentType, name, field);
	    __webpack_require__(1)(fieldDef, 'RelayParser: Unknown field `%s` on type `%s`. Source: %s.', name, parentType, this._getErrorContext());
	    var alias = field.alias ? field.alias.value : null;
	    var args = this._transformArguments(field.arguments || [], fieldDef.args);

	    var _partitionArray2 = __webpack_require__(20)(field.directives || [], function (directive) {
	      return getName(directive) !== CLIENT_FIELD;
	    }),
	        otherDirectives = _partitionArray2[0],
	        clientFieldDirectives = _partitionArray2[1];

	    var directives = this._transformDirectives(otherDirectives);
	    var type = assertOutputType(fieldDef.type);
	    var handles = this._transformHandle(name, args, clientFieldDirectives);
	    if (isLeafType(getNamedType(type))) {
	      __webpack_require__(1)(!field.selectionSet || !field.selectionSet.selections || !field.selectionSet.selections.length, 'RelayParser: Expected no selections for scalar field `%s` on type ' + '`%s`. Source: %s.', name, this._getErrorContext());
	      return {
	        kind: 'ScalarField',
	        alias: alias,
	        args: args,
	        directives: directives,
	        handles: handles,
	        metadata: null,
	        name: name,
	        type: assertScalarFieldType(type)
	      };
	    } else {
	      var selections = field.selectionSet ? this._transformSelections(field.selectionSet, type) : null;
	      __webpack_require__(1)(selections && selections.length, 'RelayParser: Expected at least one selection for non-scalar field ' + '`%s` on type `%s`. Source: %s.', name, type, this._getErrorContext());
	      return {
	        kind: 'LinkedField',
	        alias: alias,
	        args: args,
	        directives: directives,
	        handles: handles,
	        metadata: null,
	        name: name,
	        selections: selections,
	        type: type
	      };
	    }
	  };

	  RelayParser.prototype._transformHandle = function _transformHandle(fieldName, fieldArgs, clientFieldDirectives) {
	    var _this6 = this;

	    var handles = void 0;
	    clientFieldDirectives.forEach(function (clientFieldDirective) {
	      var handleArgument = (clientFieldDirective.arguments || []).find(function (arg) {
	        return getName(arg) === CLIENT_FIELD_HANDLE;
	      });
	      if (handleArgument) {
	        var _name = null;
	        var key = DEFAULT_HANDLE_KEY;
	        var filters = null;
	        var maybeHandle = _this6._transformValue(handleArgument.value);
	        __webpack_require__(1)(maybeHandle.kind === 'Literal' && typeof maybeHandle.value === 'string', 'RelayParser: Expected the %s argument to @%s to be a literal ' + 'string, got `%s` on field `%s`. Source: %s.', CLIENT_FIELD_HANDLE, CLIENT_FIELD, maybeHandle, fieldName, _this6._getErrorContext());
	        _name = maybeHandle.value;

	        var keyArgument = (clientFieldDirective.arguments || []).find(function (arg) {
	          return getName(arg) === CLIENT_FIELD_KEY;
	        });
	        if (keyArgument) {
	          var maybeKey = _this6._transformValue(keyArgument.value);
	          __webpack_require__(1)(maybeKey.kind === 'Literal' && typeof maybeKey.value === 'string', 'RelayParser: Expected %s argument to @%s to be a literal ' + 'string, got `%s` on field `%s`. Source: %s.', CLIENT_FIELD_KEY, CLIENT_FIELD, maybeKey, fieldName, _this6._getErrorContext());
	          key = maybeKey.value;
	        }
	        var filtersArgument = (clientFieldDirective.arguments || []).find(function (arg) {
	          return getName(arg) === CLIENT_FIELD_FILTERS;
	        });
	        if (filtersArgument) {
	          var maybeFilters = _this6._transformValue(filtersArgument.value);
	          __webpack_require__(1)(maybeFilters.kind === 'Literal' && Array.isArray(maybeFilters.value) && maybeFilters.value.every(function (filter) {
	            return fieldArgs.some(function (fieldArg) {
	              return fieldArg.name === filter;
	            });
	          }), 'RelayParser: Expected %s argument to @%s to be an array of ' + 'argument names on field `%s`, but get %s. Source: %s.', CLIENT_FIELD_FILTERS, CLIENT_FIELD, fieldName, maybeFilters, _this6._getErrorContext());
	          // $FlowFixMe
	          filters = maybeFilters.value;
	        }
	        handles = handles || [];
	        handles.push({ name: _name, key: key, filters: filters });
	      }
	    });
	    return handles;
	  };

	  RelayParser.prototype._transformDirectives = function _transformDirectives(directives) {
	    var _this7 = this;

	    return directives.map(function (directive) {
	      var name = getName(directive);
	      var directiveDef = _this7._schema.getDirective(name);
	      __webpack_require__(1)(directiveDef, 'RelayParser: Unknown directive `@%s`. Source: %s.', name, _this7._getErrorContext());
	      var args = _this7._transformArguments(directive.arguments || [], directiveDef.args);
	      return {
	        kind: 'Directive',
	        metadata: null,
	        name: name,
	        args: args
	      };
	    });
	  };

	  RelayParser.prototype._transformArguments = function _transformArguments(args, argumentDefinitions) {
	    var _this8 = this;

	    return args.map(function (arg) {
	      var argName = getName(arg);
	      var argDef = argumentDefinitions.find(function (def) {
	        return def.name === argName;
	      });
	      __webpack_require__(1)(argDef, 'RelayParser: Unknown argument `%s`. Source: %s.', argName, _this8._getErrorContext());
	      var value = _this8._transformValue(arg.value, argDef.type);
	      return {
	        kind: 'Argument',
	        metadata: null,
	        name: argName,
	        value: value,
	        type: argDef.type
	      };
	    });
	  };

	  RelayParser.prototype._splitConditions = function _splitConditions(mixedDirectives) {
	    var _this9 = this;

	    var conditions = [];
	    var directives = [];
	    mixedDirectives.forEach(function (directive) {
	      if (directive.name === INCLUDE || directive.name === SKIP) {
	        var passingValue = directive.name === INCLUDE;
	        var arg = directive.args[0];
	        __webpack_require__(1)(arg && arg.name === IF, 'RelayParser: Expected an `if` argument to @%s. Source: %s.', directive.name, _this9._getErrorContext());
	        __webpack_require__(1)(arg.value.kind === 'Variable' || arg.value.kind === 'Literal', 'RelayParser: Expected the `if` argument to @%s to be a variable. ' + 'Source: %s.', directive.name, _this9._getErrorContext());
	        conditions.push({
	          kind: 'Condition',
	          condition: arg.value,
	          metadata: null,
	          passingValue: passingValue,
	          selections: []
	        });
	      } else {
	        directives.push(directive);
	      }
	    });
	    var sortedConditions = [].concat(conditions).sort(function (a, b) {
	      if (a.condition.kind === 'Variable' && b.condition.kind === 'Variable') {
	        return a.condition.variableName < b.condition.variableName ? -1 : a.condition.variableName > b.condition.variableName ? 1 : 0;
	      } else {
	        // sort literals earlier, variables later
	        return a.condition.kind === 'Variable' ? 1 : b.condition.kind === 'Variable' ? -1 : 0;
	      }
	    });
	    return [sortedConditions, directives];
	  };

	  RelayParser.prototype._transformVariable = function _transformVariable(ast, type) {
	    var variableName = getName(ast);
	    this._recordVariableReference(variableName, type);
	    return {
	      kind: 'Variable',
	      metadata: null,
	      variableName: variableName
	    };
	  };

	  /**
	   * Transforms AST values into IR values, extracting the literal JS values of any
	   * subtree of the AST that does not contain a variable.
	   */


	  RelayParser.prototype._transformValue = function _transformValue(ast, type) {
	    var _this10 = this;

	    switch (ast.kind) {
	      case 'IntValue':
	        return {
	          kind: 'Literal',
	          metadata: null,
	          value: parseInt(ast.value, 10)
	        };
	      case 'FloatValue':
	        return {
	          kind: 'Literal',
	          metadata: null,
	          value: parseFloat(ast.value)
	        };
	      case 'StringValue':
	      case 'BooleanValue':
	      case 'EnumValue':
	        return {
	          kind: 'Literal',
	          metadata: null,
	          value: ast.value
	        };
	      case 'ListValue':
	        var itemType = void 0;
	        if (type) {
	          var listType = getNullableType(type);
	          // The user entered a list, a `type` was expected; this is only valid
	          // if `type` is a List.
	          __webpack_require__(1)(listType instanceof GraphQLList, 'RelayParser: Expected a value matching type `%s`, but ' + 'got a list value. Source: %s.', type, this._getErrorContext());
	          itemType = assertInputType(listType.ofType);
	        }
	        var literalList = [];
	        var items = [];
	        var areAllItemsScalar = true;
	        ast.values.forEach(function (item) {
	          var itemValue = _this10._transformValue(item, itemType);
	          if (itemValue.kind === 'Literal') {
	            literalList.push(itemValue.value);
	          }
	          items.push(itemValue);
	          areAllItemsScalar = areAllItemsScalar && itemValue.kind === 'Literal';
	        });
	        if (areAllItemsScalar) {
	          return {
	            kind: 'Literal',
	            metadata: null,
	            value: literalList
	          };
	        } else {
	          return {
	            kind: 'ListValue',
	            metadata: null,
	            items: items
	          };
	        }
	      case 'ObjectValue':
	        var literalObject = {};
	        var fields = [];
	        var areAllFieldsScalar = true;
	        ast.fields.forEach(function (field) {
	          var fieldName = getName(field);
	          var fieldType = void 0;
	          if (type) {
	            var objectType = getNullableType(type);
	            // The user entered an object, a `type` was expected; this is only
	            // valid if `type` is an Object.
	            __webpack_require__(1)(objectType instanceof GraphQLInputObjectType, 'RelayParser: Expected a value matching type `%s`, but ' + 'got an object value. Source: %s.', type, _this10._getErrorContext());
	            var fieldConfig = objectType.getFields()[fieldName];
	            __webpack_require__(1)(fieldConfig, 'RelayParser: Unknown field `%s` on type `%s`. Source: %s.', fieldName, type, _this10._getErrorContext());
	            fieldType = assertInputType(fieldConfig.type);
	          }
	          var fieldValue = _this10._transformValue(field.value, fieldType);
	          if (fieldValue.kind === 'Literal') {
	            literalObject[field.name.value] = fieldValue.value;
	          }
	          fields.push({
	            kind: 'ObjectFieldValue',
	            metadata: null,
	            name: fieldName,
	            value: fieldValue
	          });
	          areAllFieldsScalar = areAllFieldsScalar && fieldValue.kind === 'Literal';
	        });
	        if (areAllFieldsScalar) {
	          return {
	            kind: 'Literal',
	            metadata: null,
	            value: literalObject
	          };
	        } else {
	          return {
	            kind: 'ObjectValue',
	            metadata: null,
	            fields: fields
	          };
	        }
	      case 'Variable':
	        return this._transformVariable(ast, type);
	      // eslint-disable: no-fallthrough
	      default:
	        __webpack_require__(1)(false, 'RelayParser: Unknown ast kind: %s. Source: %s.', ast.kind, this._getErrorContext());
	      // eslint-enable
	    }
	  };

	  return RelayParser;
	}();

	function isScalarFieldType(type) {
	  var namedType = getNamedType(type);
	  return namedType instanceof GraphQLScalarType || namedType instanceof GraphQLEnumType;
	}

	function assertScalarFieldType(type) {
	  __webpack_require__(1)(isScalarFieldType(type), 'Expected %s to be a Scalar Field type.', type);
	  return type;
	}

	function applyConditions(conditions, selections) {
	  var nextSelections = selections;
	  conditions.forEach(function (condition) {
	    nextSelections = [(0, _extends3['default'])({}, condition, {
	      selections: nextSelections
	    })];
	  });
	  return nextSelections;
	}

	function getName(ast) {
	  var name = ast.name ? ast.name.value : null;
	  __webpack_require__(1)(typeof name === 'string', 'RelayParser: Expected ast node `%s` to have a name.', ast);
	  return name;
	}

	/**
	 * Find the definition of a field of the specified type.
	 */
	function getFieldDefinition(schema, parentType, fieldName, fieldAST) {
	  var type = getRawType(parentType);
	  var isQueryType = type === schema.getQueryType();
	  var hasTypeName = type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType;

	  var schemaFieldDef = void 0;
	  if (isQueryType && fieldName === SchemaMetaFieldDef.name) {
	    schemaFieldDef = SchemaMetaFieldDef;
	  } else if (isQueryType && fieldName === TypeMetaFieldDef.name) {
	    schemaFieldDef = TypeMetaFieldDef;
	  } else if (hasTypeName && fieldName === TypeNameMetaFieldDef.name) {
	    schemaFieldDef = TypeNameMetaFieldDef;
	  } else if (type instanceof GraphQLInterfaceType || type instanceof GraphQLObjectType) {
	    schemaFieldDef = type.getFields()[fieldName];
	  }

	  if (!schemaFieldDef) {
	    schemaFieldDef = getClassicFieldDefinition(schema, type, fieldName, fieldAST);
	  }

	  return schemaFieldDef || null;
	}

	function getClassicFieldDefinition(schema, type, fieldName, fieldAST) {
	  if (isAbstractType(type) && fieldAST && fieldAST.directives && fieldAST.directives.some(function (directive) {
	    return getName(directive) === 'fixme_fat_interface';
	  })) {
	    var possibleTypes = schema.getPossibleTypes(assertAbstractType(type));
	    var schemaFieldDef = void 0;

	    var _loop = function _loop(ii) {
	      var possibleField = possibleTypes[ii].getFields()[fieldName];
	      if (possibleField) {
	        // Fat interface fields can have differing arguments. Try to return
	        // a field with matching arguments, but still return a field if the
	        // arguments do not match.
	        schemaFieldDef = possibleField;
	        if (fieldAST && fieldAST.arguments) {
	          var argumentsAllExist = fieldAST.arguments.every(function (argument) {
	            return possibleField.args.find(function (argDef) {
	              return argDef.name === getName(argument);
	            });
	          });
	          if (argumentsAllExist) {
	            return 'break';
	          }
	        }
	      }
	    };

	    for (var ii = 0; ii < possibleTypes.length; ii++) {
	      var _ret = _loop(ii);

	      if (_ret === 'break') break;
	    }
	    return schemaFieldDef;
	  }
	}

	module.exports = {
	  parse: parseRelay,
	  transform: transform
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule RelayPrinter
	 * @format
	 */

	'use strict';

	var _require = __webpack_require__(17),
	    DEFAULT_HANDLE_KEY = _require.DEFAULT_HANDLE_KEY;

	var _require2 = __webpack_require__(5),
	    GraphQLEnumType = _require2.GraphQLEnumType,
	    GraphQLInputObjectType = _require2.GraphQLInputObjectType,
	    GraphQLList = _require2.GraphQLList,
	    GraphQLNonNull = _require2.GraphQLNonNull;

	var INDENT = '  ';

	/**
	 * Converts a Relay IR node into a GraphQL string. Custom Relay
	 * extensions (directives) are not supported; to print fragments with
	 * variables or fragment spreads with arguments, transform the node
	 * prior to printing.
	 */
	function print(node) {
	  if (node.kind === 'Fragment') {
	    return 'fragment ' + node.name + ' on ' + String(node.type) + printFragmentArgumentDefinitions(node.argumentDefinitions) + printDirectives(node.directives) + printSelections(node, '') + '\n';
	  } else if (node.kind === 'Root') {
	    return node.operation + ' ' + node.name + printArgumentDefinitions(node.argumentDefinitions) + printDirectives(node.directives) + printSelections(node, '') + '\n';
	  } else {
	    __webpack_require__(1)(false, 'RelayPrinter: Unsupported IR node `%s`.', node.kind);
	  }
	}

	function printSelections(node, indent, parentCondition) {
	  var selections = node.selections;
	  if (selections == null) {
	    return '';
	  }
	  var printed = selections.map(function (selection) {
	    return printSelection(selection, indent, parentCondition);
	  });
	  return printed.length ? ' {\n' + (indent + INDENT) + printed.join('\n' + indent + INDENT) + '\n' + indent + '}' : '';
	}

	function printSelection(selection, indent, parentCondition) {
	  parentCondition = parentCondition || '';
	  var str = '';
	  if (selection.kind === 'LinkedField') {
	    if (selection.alias != null) {
	      str += selection.alias + ': ';
	    }
	    str += selection.name;
	    str += printArguments(selection.args);
	    str += parentCondition;
	    str += printDirectives(selection.directives);
	    str += printHandles(selection);
	    str += printSelections(selection, indent + INDENT);
	  } else if (selection.kind === 'ScalarField') {
	    if (selection.alias != null) {
	      str += selection.alias + ': ';
	    }
	    str += selection.name;
	    str += printArguments(selection.args);
	    str += parentCondition;
	    str += printDirectives(selection.directives);
	    str += printHandles(selection);
	  } else if (selection.kind === 'InlineFragment') {
	    str += '... on ' + selection.typeCondition.toString();
	    str += parentCondition;
	    str += printDirectives(selection.directives);
	    str += printSelections(selection, indent + INDENT);
	  } else if (selection.kind === 'FragmentSpread') {
	    str += '...' + selection.name;
	    str += parentCondition;
	    str += printFragmentArguments(selection.args);
	    str += printDirectives(selection.directives);
	  } else if (selection.kind === 'Condition') {
	    var value = printValue(selection.condition);
	    // For Flow
	    __webpack_require__(1)(value != null, 'RelayPrinter: Expected a variable for condition, got a literal `null`.');
	    var condStr = selection.passingValue ? ' @include' : ' @skip';
	    condStr += '(if: ' + value + ')';
	    condStr += parentCondition;
	    // For multi-selection conditions, pushes the condition down to each
	    var subSelections = selection.selections.map(function (sel) {
	      return printSelection(sel, indent, condStr);
	    });
	    str += subSelections.join('\n' + INDENT);
	  } else {
	    __webpack_require__(1)(false, 'RelayPrinter: Unknown selection kind `%s`.', selection.kind);
	  }
	  return str;
	}

	function printArgumentDefinitions(argumentDefinitions) {
	  var printed = argumentDefinitions.map(function (def) {
	    var str = '$' + def.name + ': ' + def.type.toString();
	    if (def.defaultValue != null) {
	      str += ' = ' + printLiteral(def.defaultValue, def.type);
	    }
	    return str;
	  });
	  return printed.length ? '(\n' + INDENT + printed.join('\n' + INDENT) + '\n)' : '';
	}

	function printFragmentArgumentDefinitions(argumentDefinitions) {
	  var printed = void 0;
	  argumentDefinitions.forEach(function (def) {
	    if (def.kind !== 'LocalArgumentDefinition') {
	      return;
	    }
	    printed = printed || [];
	    var str = def.name + ': {type: "' + def.type.toString() + '"';
	    if (def.defaultValue != null) {
	      str += ', defaultValue: ' + printLiteral(def.defaultValue, def.type);
	    }
	    str += '}';
	    printed.push(str);
	  });
	  return printed && printed.length ? ' @argumentDefinitions(\n' + INDENT + printed.join('\n' + INDENT) + '\n)' : '';
	}

	function printHandles(field) {
	  if (!field.handles) {
	    return '';
	  }
	  var printed = field.handles.map(function (handle) {
	    // For backward compatibility and also because this module is shared by ComponentScript.
	    var key = handle.key === DEFAULT_HANDLE_KEY ? '' : ', key: "' + handle.key + '"';
	    var filters = handle.filters == null ? '' : ', filters: ' + JSON.stringify(handle.filters.sort());
	    return '@__clientField(handle: "' + handle.name + '"' + key + filters + ')';
	  });
	  return printed.length ? ' ' + printed.join(' ') : '';
	}

	function printDirectives(directives) {
	  var printed = directives.map(function (directive) {
	    return '@' + directive.name + printArguments(directive.args);
	  });
	  return printed.length ? ' ' + printed.join(' ') : '';
	}

	function printFragmentArguments(args) {
	  var printedArgs = printArguments(args);
	  if (!printedArgs.length) {
	    return '';
	  }
	  return ' @arguments' + printedArgs;
	}

	function printArguments(args) {
	  var printed = [];
	  args.forEach(function (arg) {
	    var printedValue = printValue(arg.value, arg.type);
	    if (printedValue != null) {
	      printed.push(arg.name + ': ' + printedValue);
	    }
	  });
	  return printed.length ? '(' + printed.join(', ') + ')' : '';
	}

	function printValue(value, type) {
	  if (value.kind === 'Variable') {
	    return '$' + value.variableName;
	  } else if (value.kind === 'ObjectValue') {
	    __webpack_require__(1)(type instanceof GraphQLInputObjectType, 'RelayPrinter: Need an InputObject type to print objects.');

	    var typeFields = type.getFields();
	    var pairs = value.fields.map(function (field) {
	      var innerValue = printValue(field.value, typeFields[field.name].type);
	      return innerValue == null ? null : field.name + ': ' + innerValue;
	    }).filter(Boolean);

	    return '{' + pairs.join(', ') + '}';
	  } else if (value.kind === 'ListValue') {
	    __webpack_require__(1)(type instanceof GraphQLList, 'RelayPrinter: Need a type in order to print arrays.');
	    var innerType = type.ofType;
	    return '[' + value.items.map(function (i) {
	      return printValue(i, innerType);
	    }).join(', ') + ']';
	  } else if (value.value != null) {
	    return printLiteral(value.value, type);
	  } else {
	    return null;
	  }
	}

	function printLiteral(value, type) {
	  if (type instanceof GraphQLNonNull) {
	    type = type.ofType;
	  }
	  if (type instanceof GraphQLEnumType) {
	    __webpack_require__(1)(typeof value === 'string', 'RelayPrinter: Expected value of type %s to be a string, got `%s`.', type.name, value);
	    return value;
	  }
	  if (Array.isArray(value)) {
	    __webpack_require__(1)(type instanceof GraphQLList, 'RelayPrinter: Need a type in order to print arrays.');
	    var itemType = type.ofType;
	    return '[' + value.map(function (item) {
	      return printLiteral(item, itemType);
	    }).join(', ') + ']';
	  } else if (typeof value === 'object' && value) {
	    var fields = [];
	    __webpack_require__(1)(type instanceof GraphQLInputObjectType, 'RelayPrinter: Need an InputObject type to print objects.');
	    var typeFields = type.getFields();
	    __webpack_require__(14)(value, function (val, key) {
	      fields.push(key + ': ' + printLiteral(val, typeFields[key].type));
	    });
	    return '{' + fields.join(', ') + '}';
	  } else {
	    return JSON.stringify(value);
	  }
	}

	module.exports = { print: print };

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule filterContextForNode
	 * 
	 * @format
	 */

	'use strict';

	var _require = __webpack_require__(18),
	    visit = _require.visit;

	/**
	 * Returns a RelayCompilerContext containing only the documents referenced
	 * by and including the provided node.
	 */
	function filterContextForNode(node, context) {
	  var queue = [node];
	  var filteredContext = new (__webpack_require__(16))(context.schema).add(node);
	  var visitorConfig = {
	    FragmentSpread: function FragmentSpread(fragmentSpread) {
	      var name = fragmentSpread.name;

	      if (!filteredContext.get(name)) {
	        var fragment = context.getFragment(name);
	        filteredContext = filteredContext.add(fragment);
	        queue.push(fragment);
	      }
	    }
	  };
	  while (queue.length) {
	    visit(queue.pop(), visitorConfig);
	  }
	  return filteredContext;
	}

	module.exports = filterContextForNode;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule formatStorageKey
	 * 
	 * @format
	 */

	'use strict';

	/**
	 * Given a `fieldName` (eg. "foo") and an object representing arguments and
	 * values (eg. `{first: 10, orberBy: "name"}`) returns a unique storage key
	 * (ie. `foo{"first":10,"orderBy":"name"}`).
	 */
	function formatStorageKey(fieldName, argsWithValues) {
	  if (!argsWithValues) {
	    return fieldName;
	  }
	  var filtered = null;
	  __webpack_require__(14)(argsWithValues, function (value, argName) {
	    if (value != null) {
	      if (!filtered) {
	        filtered = {};
	      }
	      filtered[argName] = value;
	    }
	  });
	  return fieldName + (filtered ? __webpack_require__(34)(filtered) : '');
	}

	module.exports = formatStorageKey;

/***/ },
/* 33 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule prettyStringify
	 * @format
	 */

	'use strict';

	/**
	 * Simple wrapper for `JSON.stringify` that adds whitespace to aid readability:
	 *
	 * ```
	 * const object = {a: 1, b 2};
	 *
	 * JSON.stringify(object);  // {"a":1,"b":2}
	 *
	 * prettyStringify(object); // {
	 *                          //   "a": 1,
	 *                          //   "b": 2
	 *                          // }
	 * ```
	 */

	function prettyStringify(stringifiable) {
	  return JSON.stringify(stringifiable, null, 2);
	}

	module.exports = prettyStringify;

/***/ },
/* 34 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule stableJSONStringify
	 * @format
	 */

	'use strict';

	/**
	 * Simple recursive stringifier that produces a stable JSON string suitable for
	 * use as a cache key. Does not handle corner-cases such as circular references
	 * or exotic types.
	 */

	function stableJSONStringify(obj) {
	  if (Array.isArray(obj)) {
	    var result = [];
	    for (var ii = 0; ii < obj.length; ii++) {
	      var value = obj[ii] !== undefined ? obj[ii] : null;
	      result.push(stableJSONStringify(value));
	    }
	    return '[' + result.join(',') + ']';
	  } else if (typeof obj === 'object' && obj) {
	    var _result = [];
	    var keys = Object.keys(obj);
	    keys.sort();
	    for (var _ii = 0; _ii < keys.length; _ii++) {
	      var key = keys[_ii];
	      var _value = stableJSONStringify(obj[key]);
	      _result.push('"' + key + '":' + _value);
	    }
	    return '{' + _result.join(',') + '}';
	  } else {
	    return JSON.stringify(obj);
	  }
	}

	module.exports = stableJSONStringify;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule writeRelayGeneratedFile
	 * 
	 * @format
	 */

	'use strict';

	var _asyncToGenerator2 = __webpack_require__(7);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	//

	//


	/**
	 * Generate a module for the given document name/text.
	 */
	//
	let writeRelayGeneratedFile = (() => {
	  var _ref = (0, _asyncToGenerator3.default)(function* (codegenDir, generatedNode,
	  // formatModule: FormatModule,
	  persistQuery, platform, relayRuntimeModule) {
	    var moduleName = generatedNode.name + '.graphql';
	    var platformName = platform ? moduleName + '.' + platform : moduleName;
	    //const filename = platformName + '.js';
	    var filename = platformName;
	    var flowTypeName = generatedNode.kind === 'Batch' ? 'ConcreteBatch' : 'ConcreteFragment';
	    var devOnlyProperties = {};

	    var text = null;
	    var hash = null;
	    if (generatedNode.kind === 'Batch') {
	      text = generatedNode.text;
	      __webpack_require__(1)(text, 'codegen-runner: Expected query to have text before persisting.');
	      codegenDir.writeFile(filename, text);
	      // const oldContent = codegenDir.read(filename);
	      // // Hash the concrete node including the query text.
	      // const hasher = crypto.createHash('md5');
	      // hasher.update('cache-breaker-1');
	      // hasher.update(JSON.stringify(generatedNode));
	      // if (flowText) {
	      //   hasher.update(flowText);
	      // }
	      // if (persistQuery) {
	      //   hasher.update('persisted');
	      // }
	      // hash = hasher.digest('hex');
	      // if (hash === extractHash(oldContent)) {
	      //   codegenDir.markUnchanged(filename);
	      //   return null;
	      // }
	      // if (codegenDir.onlyValidate) {
	      //   codegenDir.markUpdated(filename);
	      //   return null;
	      // }
	      // if (persistQuery) {
	      //   generatedNode = {
	      //     ...generatedNode,
	      //     text: null,
	      //     id: await persistQuery(text),
	      //   };

	      //   devOnlyProperties.text = text;
	    }
	  });

	  return function writeRelayGeneratedFile(_x, _x2, _x3, _x4, _x5) {
	    return _ref.apply(this, arguments);
	  };
	})();

	// const moduleText = formatModule({
	//   moduleName,
	//   documentType: flowTypeName,
	//   docText: text,
	//   flowText,
	//   hash: hash ? `@relayHash ${hash}` : null,
	//   concreteText: prettyStringify(generatedNode),
	//   devTextGenerator: makeDevTextGenerator(devOnlyProperties),
	//   relayRuntimeModule,
	// });

	//codegenDir.writeFile(filename, moduleText);
	//return generatedNode;
	//}

	// function makeDevTextGenerator(devOnlyProperties: Object) {
	//   return objectName => {
	//     const assignments = Object.keys(devOnlyProperties).map(key => {
	//       const value = devOnlyProperties[key];
	//       const stringifiedValue =
	//         value === undefined ? 'undefined' : JSON.stringify(value);

	//       return `  ${objectName}['${key}'] = ${stringifiedValue};`;
	//     });

	//     if (!assignments.length) {
	//       return '';
	//     }

	//     return `

	// if (__DEV__) {
	// ${assignments.join('\n')}
	// }
	// `;
	//   };
	// }

	// function extractHash(text: ?string): ?string {
	//   if (!text) {
	//     return null;
	//   }
	//   if (/<<<<<|>>>>>/.test(text)) {
	//     // looks like a merge conflict
	//     return null;
	//   }
	//   const match = text.match(/@relayHash (\w{32})\b/m);
	//   return match && match[1];
	// }

	//


	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = writeRelayGeneratedFile;

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/extends");

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = require("fb-watchman");

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = require("fbjs/lib/nullthrows");

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ }
/******/ ]);