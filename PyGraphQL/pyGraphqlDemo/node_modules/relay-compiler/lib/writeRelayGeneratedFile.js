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

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

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
      require('fbjs/lib/invariant')(text, 'codegen-runner: Expected query to have text before persisting.');
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