/*
 * (C) Copyright 2016 o2r project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
'use strict';

var override = require('../config/custom-mime.json');
var Mimos = require('mimos');
var mime = new Mimos({ override });

/**
 * Function to rewrite the basepath of a directory-tree listing.
 * It will recursively remove a number trunc of chars from the
 * beginning of tree.path and replace them with the string newpath.
 *
 * Also adds MIME type information to entries that are not folders (i. e.
 * have no children array).
 *
 * @param {json} tree file directory tree
 * @param {int} trunc number of chars to remove from the beginning of tree.path
 * @param {character} newpath replacement characters for removed chars
 * @return {json} the rewritten directory tree
 */
function rewriteTree(tree, trunc, newpath) {
  tree.origPath = tree.path; // must be deleted later!
  tree.path = tree.path.substring(trunc);
  tree.path = newpath + tree.path;
  if (tree.children) {
    tree.children.map(child => {
      return rewriteTree(child, trunc, newpath);
    });

    return finish(tree);
  } else {
    var mimetype = mime.path(tree.path).type;
    tree.type = mimetype;

    //if (mimetype === 'application/pdf' && config.bagtainer.tree.count_pdf_pages) {
    //  var data = new Uint8Array(fs.readFileSync(tree.origPath));
    //  pdfjs.getDocument(data).then(function (doc) {
    //    tree.pages = doc.numPages;
    //    return finish(tree);
    //  });
    //} else {
    //  return finish(tree);
    //}

    return finish(tree);
  }
}

function finish(tree) {
  delete tree.origPath;
  return tree;
}

module.exports = rewriteTree;
