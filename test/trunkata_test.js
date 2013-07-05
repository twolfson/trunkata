var trunkata = require('../lib/trunkata.js'),
    expect = require('chai').expect,
    fs = require('fs'),
    domify = require('domify');

describe('A short string <div>', function () {
  before(function () {
    // Create our content
    var input = fs.readFileSync(__dirname + '/test_files/short_string.html', 'utf8'),
        node = domify('<div class="test-div">' + input + '</div>');
    document.body.appendChild(node);

    // Save for later
    this.input = input;
    this.node = node;
  });
  // after(function () {
  //   document.body.removeChild(this.node);
  // });

  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('is unchanged', function () {
      expect(this.node.innerHTML).to.equal(this.input);
    });
  });
});

describe('A long string <div>', function () {
  before(function () {
    // Create our content
    var input = fs.readFileSync(__dirname + '/test_files/long_string.html', 'utf8'),
        node = domify('<div class="test-div">' + input + '</div>');
    document.body.appendChild(node);

    // Save for later
    this.input = input;
    this.node = node;
  });
  // after(function () {
  //   document.body.removeChild(this.node);
  // });

  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('is truncated', function () {
      expect(this.node.innerHTML.length).to.be.lessThan(this.input.length);
    });

    // TODO: More appropriately test event bindings of child nodes and parent node
    it('is the same node', function () {
      // TODO: Capture child nodes of div?
    });
  });
});
