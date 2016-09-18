"use strict";

var assert = require("assert");

var RBTREE_COLOR_RED = 0;
var RBTREE_COLOR_BLACK = 1;

/* Creates a node in a red-black tree.
 */
function RBTreeNode(parent, key, value) {
  this._parent = parent;
  this._left = null;
  this._right = null;
  this._color = RBTREE_COLOR_RED;
  this._key = key;
  this._value = value;
}

/* Returns the in-order successor of this node. If this node has no in-order
 * successor, returns null instead.
 */
Object.defineProperty(RBTreeNode.prototype, "succ", {
  configurable: true,
  enumerable: true,
  get: function () {
    var node = this._right;
    if (node !== null) {
      while (node._left !== null) {
        node = node._left;
      }
      return node;
    }
    else {
      var node = this;
      var parent = node._parent;
      while (parent !== null && parent._right === node) {
        node = parent;
        parent = node._parent;
      }
      return parent;
    }
  }
});

/* Returns the in-order predecessor of this node. If this node has no in-order
 * predecessor, returns null instead.
 */
Object.defineProperty(RBTreeNode.prototype, "pred", {
  configurable: true,
  enumerable: true,
  get: function () {
    var node = this._left;
    if (node !== null) {
      while (node._right !== null) {
        node = node._right;
      }
      return node;
    }
    else {
      var node = this;
      var parent = node._parent;
      while (parent !== null && parent._left === node) {
        node = parent;
        parent = node._parent;
      }
      return parent;
    }
  }
});

/* Returns the key of this node.
 */
Object.defineProperty(RBTreeNode.prototype, "key", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this._key;
  }
});

/* Returns the value of this node.
 */
Object.defineProperty(RBTreeNode.prototype, "value", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this._value;
  }
});

/* Assert that this is a valid red-black tree node. Should only be used in
 * tests.
 */
RBTreeNode.prototype.validate = function () {
  var left = this._left;
  var leftCount = 1;
  if (left !== null) {
    if (this._color === RBTREE_COLOR_RED) {
      // The left child of a red node should be black.
      assert.strictEqual(left._color, RBTREE_COLOR_BLACK);
    }
    left.validate();
  }
  var right = this._right;
  var rightCount = 1;
  if (right !== null) {
    if (this._color === RBTREE_COLOR_RED) {
      // The right child of a red node should be black.
      assert.strictEqual(left._color, RBTREE_COLOR_BLACK);
    }
    right.validate();
  }
  // All paths from this node to a leaf contain the same number of black nodes.
  assert.strictEqual(leftCount, rightCount);
  var count = leftCount;
  if (this._color === RBTREE_COLOR_BLACK) {
    count += 1;
  }
  return count;
};

/* Creates a red-black tree with the given `compare` function.
 *
 * A red-black tree is a binary search tree for which the following properties
 * hold:
 * 1. A node is either red or black.
 * 2. The root is black.
 * 3. All leaves are black.
 * 4. The children of a red node are black.
 * 5. All paths from a node to a leaf contain the same number of black nodes.
 *
 * As long as these properties are satisfied, the path from the root to the
 * farthest leaf is at most twice as long as the path from the root to the
 * nearest leaf, so that the tree remains approximately balanced.
 */
function RBTree(compare) {
  this._root = null;
  this._compare = compare;
}

/* Returns true if this tree is empty. Otherwise, returns false instead.
 */
Object.defineProperty(RBTree.prototype, "empty", {
  configurable: true,
  enumerable: true,
  get: function () {
    return this._root === null;
  }
});

/* Returns the node with the smallest key in this tree. If this tree is empty,
 * returns null instead.
 */
Object.defineProperty(RBTree.prototype, "min", {
  configurable: true,
  enumerable: true,
  get: function () {
    var node = this._root;
    if (node !== null) {
      while (node._left !== null) {
        node = node._left;
      }
    }
    return node;
  }
});

/* Returns the node with the largest key in this tree. If this tree is empty,
 * returns null instead.
 */
Object.defineProperty(RBTree.prototype, "max", {
  configurable: true,
  enumerable: true,
  get: function () {
    var node = this._root;
    if (node !== null) {
      while (node._right !== null) {
        node = node._right;
      }
    }
    return node;
  }
});

/* Returns the node with the given `key` in this tree. If no such node exists,
 * returns null instead.
 */
RBTree.prototype.find = function (key) {
  var node = this._root;
  while (node !== null) {
    var result = this._compare(key, node._key);
    if (result === 0) {
      break;
    }
    if (result < 0) {
      node = node._left;
    }
    else {
      node = node._right;
    }
  }
  return node;
};

/* Returns the node with the largest key that is smaller than or equal to the
 * given `key` in this tree. If no such node exists, returns null instead.
 */
RBTree.prototype.lower = function (key) {
  var node = this._root;
  if (node === null) {
    return null;
  }
  for (;;) {
    var result = this._compare(key, node._key);
    if (result === 0) {
      return node;
    }
    if (result < 0) {
      var left = node._left;
      if (left === null) {
        return node.pred;
      }
      node = left;
    }
    else {
      var right = node._right;
      if (right === null) {
        return node;
      }
      node = right;
    }
  }
};

/* Returns the node with the smallest key that is larger than or equal to the
 * given `key` in this tree. If no such node exists, returns null instead.
 */
RBTree.prototype.upper = function (key) {
  var node = this._root;
  if (node === null) {
    return null;
  }
  for (;;) {
    var result = this._compare(key, node._key);
    if (result === 0) {
      return node;
    }
    if (result < 0) {
      var left = node._left;
      if (left === null) {
        return node;
      }
      node = left;
    }
    else {
      var right = node._right;
      if (right === null) {
        return node.succ;
      }
      node = right;
    }
  }
};

/* Creates a node with the given `key` and `value`, and inserts it in this tree.
 * Returns the inserted node. If a node with the given `key` already exists,
 * updates its value, and returns the existing node instead.
 */
RBTree.prototype.insert = function (key, value) {
  var node = this._root;
  if (node === null) {
    node = new RBTreeNode(null, key, value);
    this._root = node;
  }
  else {
    for (;;) {
      var result = this._compare(key, node._key);
      if (result === 0) {
        node._value = value;
        return node;
      }
      var parent = node;
      if (result < 0) {
        node = node._left;
        if (node === null) {
          node = new RBTreeNode(parent, key, value);
          parent._left = node;
          break;
        }
      }
      else {
        node = node._right;
        if (node === null) {
          node = new RBTreeNode(parent, key, value);
          parent._right = node;
          break;
        }
      }
    }
  }
  this._fixupInsert(node);
  return node;
};

/* Removes the given `node` from this tree.
 */
RBTree.prototype.remove = function (node) {
  // Remove the node.
  var rebalance = null;
  if (node._left === null) {
    // Case 1: The node to be removed has at most one right child. In this
    // case, we replace the node to be removed with its right child.
    var right = node._right;
    this._replaceNode(node, right);
    if (right !== null) {
      right._parent = node._parent;
      right._color = RBTREE_COLOR_BLACK;
    }
    else if (node._color === RBTREE_COLOR_BLACK) {
      // Both the node to be removed and its replacement are black, so we have
      // to rebalance.
      rebalance = node._parent;
    }
  }
  else if (node._right === null) {
    // Case 2: The node to be removed has one left child. In this case, we
    // replace the node to be removed with its left child.
    var left = node._left;
    this._replaceNode(node, left);
    left._parent = node._parent;
    left._color = RBTREE_COLOR_BLACK;
  }
  else {
    // Case 3: The node to be removed has two children. In this case, we replace
    // the node to be removed with its in-order successor.
    var succ = node._right;
    var parent = succ;
    var right = succ._right;
    if (succ._left !== null) {
      do {
        parent = succ;
        succ = succ._left;
      }
      while (succ._left !== null);
      right = succ._right;
      parent._left = right;
      succ._right = node._right;
      node._right._parent = succ;
    }
    if (right !== null) {
      right._parent = parent;
      right._color = RBTREE_COLOR_BLACK;
    }
    else if (succ._color === RBTREE_COLOR_BLACK) {
      // Both the node to be removed and its replacement are black, so we have
      // to rebalance.
      rebalance = parent;
    }
    this._replaceNode(node, succ);
    succ._parent = node._parent;
    succ._color = node._color;
    succ._left = node._left;
    node._left._parent = succ;
  }
  if (rebalance !== null) {
    this._fixupRemove(rebalance);
  }
};

/* Swaps the given pair of nodes (`node1`, `node2`) in this tree.
 */
RBTree.prototype.swap = function (node1, node2) {
  if (node1 === node2) {
    return;
  }
  if (node1._parent === node2._parent) {
    var parent = node1._parent;
    if (parent._left === node1) {
      parent._left = node2;
      parent._right = node1;
    }
    else {
      parent._right = node2;
      parent._left = node1;
    }
  }
  else {
    this._replaceNode(node2, node1);
    this._replaceNode(node1, node2);
  }
  var parent = node1._parent;
  node1._parent = node2._parent;
  node2._parent = parent;
  var left = node1._left;
  node1._left = node2._left;
  if (node1._left !== null) {
    node1._left._parent = node1;
  }
  node2._left = left;
  if (node2._left !== null) {
    node2._left._parent = node2;
  }
  var right = node1._right;
  node1._right = node2._right;
  if (node1._right !== null) {
    node1._right._parent = node1;
  }
  node2._right = right;
  if (node2._right !== null) {
    node2._right._parent = node2;
  }
  var color = node1._color;
  node1._color = node2._color;
  node2._color = color;
};

/* Reverses the order of the given range of nodes [`first`, `last`] in this
 * tree.
 */
RBTree.prototype.reverse = function (first, last) {
  while (first !== last) {
    var succ = first.succ;
    var pred = last.pred;
    this.swap(first, last);
    last = pred;
    if (first === last) {
      break;
    }
    first = succ;
  }
};

/* Assert that this is a valid red-black tree. Should be used in tests only.
 */
RBTree.prototype.validate = function () {
  var root = this._root;
  if (root !== null) {
    // The root should be black.
    assert.strictEqual(root._color, RBTREE_COLOR_BLACK);
    root.validate();
  }
};

RBTree.prototype._fixupInsert = function (node) {
  for (;;) {
    var parent = node._parent;
    if (parent === null) {
      // Case 1: The current node is the root. In this case, we repaint the
      // current node black.
      node._color = RBTREE_COLOR_BLACK;
      break;
    }
    if (parent._color === RBTREE_COLOR_BLACK) {
      // Case 2: The parent of the current node is black.
      break;
    }
    var grandparent = parent._parent;
    if (parent === grandparent._left) {
      var uncle = grandparent._right;
      if (uncle !== null && uncle._color === RBTREE_COLOR_RED) {
        // Case 3a: The parent and the uncle of the current node are red. In
        // this case, we repaint the parent and the uncle of the current node
        // black, and the grandparent of the current node red.
        //
        // After this case has been handled, the grandparent of the current node
        // may violate either the property that the root is black, or the
        // property that the children of a red node are black. To fix this, we
        // continue with the grandparent of the current node.
        parent._color = RBTREE_COLOR_BLACK;
        uncle._color = RBTREE_COLOR_BLACK;
        grandparent._color = RBTREE_COLOR_RED;
        node = grandparent;
        continue;
      }
      if (node === parent._right) {
        // Case 4a: The parent of the current node is red, but the uncle of the
        // current node is black. Moreover, the current node is the right child
        // of its parent, and the parent of the current node is the left child
        // of its parent. In this case, we rotate left on the parent of the
        // current node.
        //
        // After this case has been handled, the property that the children of a
        // red node are black is still violated. However, since the current node
        // is now the right child of its parent, we can fix this by falling
        // through to case 5a.
        this._rotateLeft(parent);
        node = parent;
        parent = node._parent;
        grandparent = parent._parent;
      }
      // Case 5a: The parent of the current node is red, and the uncle of the
      // current node is black. Moreover, the current node is the left child of
      // its parent, and the parent of the current node is the right child of
      // its parent. In this case, we swap the colors of the parent and the
      // grandparent of the current node, and then rotate right on the
      // grandparent of the current node.
      parent._color = RBTREE_COLOR_BLACK;
      grandparent._color = RBTREE_COLOR_RED;
      this._rotateRight(grandparent);
      break;
    }
    else {
      // Cases 3-5b are equivalent to cases 3-5a, except that left and right are
      // reversed.
      var uncle = grandparent._left;
      if (uncle !== null && uncle._color === RBTREE_COLOR_RED) {
        // Case 3b
        parent._color = RBTREE_COLOR_BLACK;
        uncle._color = RBTREE_COLOR_BLACK;
        grandparent._color = RBTREE_COLOR_RED;
        node = grandparent;
        continue;
      }
      if (node === parent._left) {
        // Case 4b
        this._rotateRight(parent);
        node = parent;
        parent = node._parent;
        grandparent = parent._parent;
      }
      // Case 5b
      parent._color = RBTREE_COLOR_BLACK;
      grandparent._color = RBTREE_COLOR_RED;
      this._rotateLeft(grandparent);
      break;
    }
  }
};

RBTree.prototype._fixupRemove = function (parent) {
  var node = null;
  for (;;) {
    if (parent === null) {
      // Case 1: The current node is the root.
      break;
    }
    var sibling = parent._right;
    if (node !== sibling) {
      if (sibling._color === RBTREE_COLOR_RED) {
        // Case 2a: The sibling of the current node is red. In this case, we
        // swap the colors of the parent and the sibling of the current node,
        // and then rotate left on the parent of the current node.
        parent._color = RBTREE_COLOR_RED;
        sibling._color = RBTREE_COLOR_BLACK;
        this._rotateLeft(parent);
        sibling = parent._right;
      }
      var right = sibling._right;
      if (right === null || right._color === RBTREE_COLOR_BLACK) {
        var left = sibling._left;
        if (left === null || left._color === RBTREE_COLOR_BLACK) {
          sibling._color = RBTREE_COLOR_RED;
          if (parent._color === RBTREE_COLOR_RED) {
            // Case 3a: The parent of the current node is red, but the sibling
            // of the current node and the children of the sibling of the
            // current node are black. In this case, we swap the colors of the
            // parent and the sibling of the current node.
            parent._color = RBTREE_COLOR_BLACK;
            break;
          }
          // Case 4a: The parent, the sibling, and the children of the sibling
          // of the current node are black. In this case, we repaint the sibling
          // of the current node red.
          //
          // After this case has been handled, the property that all paths from
          // a node to a leaf contain the same number of black nodes is still
          // violated. To fix this, we continue with the parent of the current
          // node.
          node = parent;
          parent = node._parent;
          continue;
        }
        // Case 5a: The sibling of the current node and the right child of the
        // sibling of the current node are black, but the left child of the
        // sibling of the current node is red. In this case, we swap the colors
        // of the sibling of the current node and the left child of the sibling
        // of the current node, and then rotate right at the sibling of the
        // current node.
        //
        // After this case has been handled, the property that all paths from a
        // node to a leaf contain the same number of black nodes may still be
        // violated. However, since the current node now has a sibling whose
        // right child is red, we can fix this by falling through to case 6a.
        sibling._color = RBTREE_COLOR_RED;
        left._color = RBTREE_COLOR_BLACK;
        this._rotateRight(sibling);
        sibling = parent._right;
        right = sibling._right;
      }
      // Case 6a: The sibling of the current node is black, but the right child
      // of the sibling of the current node is red. In this case, swe swap the
      // colors of the parent and the sibling of the current node, repaint the
      // right child of the sibling of the current node red, and then rotate
      // left at the parent of the current node.
      sibling._color = parent._color;
      parent._color = RBTREE_COLOR_BLACK;
      right._color = RBTREE_COLOR_BLACK;
      this._rotateLeft(parent);
      break;
    }
    else {
      // Cases 2-6b are equivalent to cases 2-6a, except that left and right are
      // reversed.
      sibling = parent._left;
      if (sibling._color === RBTREE_COLOR_RED) {
        // Case 2b
        parent._color = RBTREE_COLOR_RED;
        sibling._color = RBTREE_COLOR_BLACK;
        this._rotateRight(parent);
        sibling = parent._left;
      }
      var left = sibling._left;
      if (left === null || left._color === RBTREE_COLOR_BLACK) {
        var right = sibling._right;
        if (right === null || right._color === RBTREE_COLOR_BLACK) {
          sibling._color = RBTREE_COLOR_RED;
          if (parent._color === RBTREE_COLOR_RED) {
            // Case 3b
            parent._color = RBTREE_COLOR_BLACK;
            break;
          }
          // Case 4b
          node = parent;
          parent = node._parent;
          continue;
        }
        // Case 5b
        sibling._color = RBTREE_COLOR_RED;
        right._color = RBTREE_COLOR_BLACK;
        this._rotateLeft(sibling);
        sibling = parent._left;
        left = sibling._left;
      }
      // Case 6b
      sibling._color = parent._color;
      parent._color = RBTREE_COLOR_BLACK;
      left._color = RBTREE_COLOR_BLACK;
      this._rotateRight(parent);
      break;
    }
  }
};

RBTree.prototype._rotateLeft = function (node) {
  var pivot = node._right;
  node._right = pivot._left;
  if (node._right !== null) {
    node._right._parent = node;
  }
  this._replaceNode(node, pivot);
  pivot._parent = node._parent;
  pivot._left = node;
  node._parent = pivot;
};

RBTree.prototype._rotateRight = function (node) {
  var pivot = node._left;
  node._left = pivot._right;
  if (node._left !== null) {
    node._left._parent = node;
  }
  this._replaceNode(node, pivot);
  pivot._parent = node._parent;
  pivot._right = node;
  node._parent = pivot;
};

RBTree.prototype._replaceNode = function (node, replacement) {
  var parent = node._parent;
  if (parent === null) {
    this._root = replacement;
  }
  else if (parent._left === node) {
    parent._left = replacement;
  }
  else {
    parent._right = replacement;
  }
};

exports.RBTree = RBTree;
