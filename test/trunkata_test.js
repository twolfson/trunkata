var trunkata = require('../lib/trunkata.js'),
    expect = require('chai').expect;

describe('A short string <div>', function () {
  before(function () {
    // Create our content
    var input = 'abc',
        node = document.createElement('div');
    node.innerHTML = input;

    // Save for later
    this.input = input;
    this.node = node;
  });

  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('is unchanged', function () {
      expect(this.node.innerHTML).to.equal(this.input);
    });
  });
});

describe.skip('A long string <div>', function () {
  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('is truncated', function () {
      expect(this.node.innerHTML).to.equal(this.input);
    });

    // TODO: More appropriately test event bindings of child nodes and parent node
    it('is the same node', function () {
      // TODO: Capture child nodes of div?
    });
  });
});
