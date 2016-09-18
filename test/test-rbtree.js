"use strict";

var RBTree = require("../lib/rbtree").RBTree;
var assert = require("assert");

function compare(a, b) {
  return a - b;
}

function shuffle(values) {
  var length = values.length;
  for (var index = 0; index < length - 1; index += 1) {
    var other = index + Math.floor(Math.random() * (length - index))
    var value = values[index];
    values[index] = values[other];
    values[other] = value;
  }
}

describe("RBTree", function () {
  describe("find", function () {
    it("should return the correct node", function () {
      var length = 1000;
      var tree = new RBTree(compare);
      var keys = new Array();
      for (var index = 0; index < length; index += 1) {
        var node = tree.insert(Math.round(Math.random() * length));
        if (node !== null) {
          keys.push(key);
        }
      }
      for (var index = 0; index < length; index += 1) {
        var key = Math.round(Math.random() * length);
        var node = tree.find(key);
        if (node === null) {
          assert.ok(keys.indexOf(key) < 0);
        }
        else {
          assert.strictEqual(node.key, key);
        }
      }
    });
  });
  describe("lower", function () {
    it("should return the correct node", function () {
      var length = 1000;
      var tree = new RBTree(compare);
      for (var index = 0; index < length; index += 1) {
        tree.insert(Math.round(Math.random() * length));
      }
      for (var index = 0; index < length; index += 1) {
        var key = Math.round(Math.random() * length);
        var node = tree.lower(key);
        if (node === null) {
          assert.ok(key < tree.min.key);
        }
        else {
          assert.ok(node.key <= key);
          var succ = node.succ;
          if (succ === null) {
            assert.ok(tree.max.key <= key);
          }
          else {
            assert.ok(key < succ.key);
          }
        }
      }
    });
  }),
  describe("upper", function () {
    it("should return the correct node", function () {
      var length = 1000;
      var tree = new RBTree(compare);
      for (var index = 0; index < length; index += 1) {
        tree.insert(Math.round(Math.random() * length));
      }
      for (var index = 0; index < length; index += 1) {
        var key = Math.round(Math.random() * length);
        var node = tree.upper(key);
        if (node === null) {
          assert.ok(tree.max.key < key);
        }
        else {
          assert.ok(key <= node.key);
          var pred = node.pred;
          if (pred === null) {
            assert.ok(key <= tree.max.key);
          }
          else {
            assert.ok(pred.key < key);
          }
        }
      }
    });
  }),
  describe("insert", function () {
    it("should preserve the properties of the tree", function () {
      var length = 1000;
      var keys = new Array(length);
      var values = new Array(length);
      for (var index = 0; index < length; index += 1) {
        keys[index] = index;
        values[index] = index;
      }
      shuffle(keys);
      shuffle(values);
      var tree = new RBTree(compare);
      assert.ok(tree.empty);
      for (var index = 0; index < length; index += 1) {
        var key = keys[index];
        tree.insert(key, values[key]);
        tree.validate();
      }
      assert.ok(!tree.empty);
      var node = tree.min;
      for (var index = 0; index < length; index += 1) {
        var key = node.key;
        assert.strictEqual(node.key, index);
        assert.strictEqual(node.value, values[key]);
        node = node.succ;
      }
      var node = tree.max;
      for (var index = length - 1; index >= 0 ; index -= 1) {
        var key = node.key;
        assert.strictEqual(key, index);
        assert.strictEqual(node.value, values[key]);
        node = node.pred;
      }
    });
  });
  describe("remove", function () {
    it("should preserve the properties of the tree", function () {
      var length = 1000;
      var keys = new Array(length);
      var values = new Array(length);
      for (var index = 0; index < length; index += 1) {
        keys[index] = index;
        values[index] = index;
      }
      shuffle(keys);
      shuffle(values);
      var tree = new RBTree(compare);
      for (var index = 0; index < length; index += 1) {
        var key = keys[index];
        tree.insert(key, values[key]);
      }
      keys.sort(compare);
      while (length > 0) {
        assert.ok(!tree.empty);
        var index = Math.floor(Math.random() * length);
        var key = keys[index];
        keys.splice(index, 1);
        tree.remove(tree.find(key));
        tree.validate();
        var node = tree.min;
        length -= 1;
        for (var index = 0; index < length; index += 1) {
          var key = node.key;
          assert.strictEqual(key, keys[index]);
          assert.strictEqual(node.value, values[key]);
          node = node.succ;
        }
        var node = tree.max;
        for (var index = length - 1; index >= 0 ; index -= 1) {
          var key = node.key;
          assert.strictEqual(key, keys[index]);
          assert.strictEqual(node.value, values[key]);
          node = node.pred;
        }
      }
      assert.ok(tree.empty);
    });
  });
  describe("swap", function () {
    it("should swap a pair of nodes in the tree.", function () {
      var length = 1000;
      var tree = new RBTree(compare);
      var nodes = [];
      for (var index = 0; index < length; index += 1) {
        nodes[index] = tree.insert(index);
      }
      for (var index = 0; index < length; index += 1) {
        var index1 = Math.floor(Math.random() * length);
        var index2 = Math.floor(Math.random() * length);
        tree.swap(nodes[index1], nodes[index2]);
        var node = nodes[index1];
        nodes[index1] = nodes[index2];
        nodes[index2] = node;
      }
      var node = tree.min;
      for (var index = 0; index < length; index += 1) {
        assert.strictEqual(node, nodes[index]);
        node = node.succ;
      }
    });
  });
  describe("reverse", function () {
    it("should reverse the order of a range of nodes in the tree", function () {
      var length = 1000;
      var tree = new RBTree(compare);
      for (var index = 0; index < length; index += 1) {
        tree.insert(index);
      }
      var index1 = Math.floor(Math.random() * length);
      var index2 = Math.floor(Math.random() * length);
      if (index2 < index1) {
        var index = index1;
        index1 = index2;
        index2 = index;
      }
      tree.reverse(tree.find(index1), tree.find(index2));
      var node = tree.min;
      for (var index = 0; index < index1; index += 1) {
        assert.strictEqual(node.key, index);
        node = node.succ;
      }
      for (var index = index2; index >= index1; index -= 1) {
        assert.strictEqual(node.key, index);
        node = node.succ;
      }
      for (var index = index2 + 1; index < length; index += 1) {
        assert.strictEqual(node.key, index);
        node = node.succ;
      }
    });
  });
});
