// Load in lib and dependencies
var trunkata = require('../lib/trunkata.js'),
    expect = require('chai').expect,
    fs = require('fs'),
    domify = require('domify');

// Set up helper action
function fixtureNode() {
  before(function () {
    // Create our content
    var node = domify('<div class="test-div">' + this.input + '</div>');
    document.body.appendChild(node);

    // Save for later
    this.node = node;
  });
  after(function () {
    // document.body.removeChild(this.node);
  });
}

// Basic tests
describe('A short string <div>', function () {
  before(function () {
    this.input = fs.readFileSync(__dirname + '/test_files/short_string.html', 'utf8');
  });
  fixtureNode();

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
    this.input = fs.readFileSync(__dirname + '/test_files/long_string.html', 'utf8');
  });
  fixtureNode();

  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('is truncated', function () {
      expect(this.node.innerHTML.length).to.be.lessThan(this.input.length);
    });
  });
});

// Intermediate tests
describe('A short and long <div>', function () {
  before(function () {
    this.input = fs.readFileSync(__dirname + '/test_files/short_long.html', 'utf8');
  });
  fixtureNode();

  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('removes the second child OR the second child is empty', function () {
      var childNodes = this.node.childNodes,
          secondChild = childNodes[1],
          passed = secondChild ? secondChild.innerHTML === '' : true;
      expect(passed).to.equal(true);
    });

    it('leaves first child alone', function () {
      expect(this.node.childNodes[0].innerHTML).to.equal('abc');
    });
  });
});

describe('A long and short <div>', function () {
  before(function () {
    this.input = fs.readFileSync(__dirname + '/test_files/long_short.html', 'utf8');
  });
  fixtureNode();

  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('removes the second child', function () {
      expect(this.node.childNodes.length).to.equal(1);
    });

    it('is truncated', function () {
      var longInput = fs.readFileSync(__dirname + '/test_files/long_string.html', 'utf8');
      expect(this.node.innerHTML.length).to.be.lessThan(longInput.length);
    });
  });
});

describe('Linked text', function () {
  before(function () {
    this.input = fs.readFileSync(__dirname + '/test_files/linked.html', 'utf8');
  });
  fixtureNode();

  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('is truncated', function () {
      expect(this.node.innerHTML.length).to.be.lessThan(this.input.length);
    });

    it('keeps the link intact', function () {
      expect(this.node.innerHTML).to.contain('<a href="http://github.com/">Non amet</a>');
    });
  });
});

describe('Long linked text', function () {
  before(function () {
    this.input = fs.readFileSync(__dirname + '/test_files/long_linked.html', 'utf8');
  });
  fixtureNode();

  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('is truncated', function () {
      expect(this.node.innerHTML.length).to.be.lessThan(this.input.length);
    });

    it('keeps the link intact', function () {
      expect(this.node.innerHTML).to.contain('<a href="http://github.com/">Non');
    });

    it('has no trailing non-link ellipsis', function () {
      // Verify the last node is a link node
      var childNodes = this.node.childNodes,
          nodeName = childNodes[childNodes.length - 1].nodeName.toUpperCase();
      expect(nodeName).to.equal('A');
    });
  });
});

describe('Three short texts', function () {
  before(function () {
    this.input = fs.readFileSync(__dirname + '/test_files/three_shorts.html', 'utf8');
  });
  fixtureNode();

  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('is truncated', function () {
      expect(this.node.innerHTML.length).to.be.lessThan(this.input.length);
    });

    it('has at most 2 children', function () {
      expect(this.node.childNodes.length).to.be.lessThan(3);
    });
  });
});

describe('Text with line breaks', function () {
  before(function () {
    this.input = fs.readFileSync(__dirname + '/test_files/line_breaks.html', 'utf8');
  });
  fixtureNode();

  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('is truncated', function () {
      expect(this.node.innerHTML.length).to.be.lessThan(this.input.length);
    });

    it('has the exclusively first line content', function () {
      expect(this.node.innerHTML).to.match(/^<div>abc(<br\/?>)?<\/div>$/);
    });
  });
});

// TODO: Test event bindings of children are not lost
