// Load in lib and dependencies
var trunkata = require('../lib/trunkata.js'),
    fs = require('fs'),
    assert = require('proclaim'),
    domify = require('domify');

// Define a lessThan
assert.lessThan = function (a, b) {
  assert.ok(a < b, 'Expected: < ' + b + ', Actual: ' + a);
};

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
      assert.strictEqual(this.node.innerHTML, this.input);
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
      assert.lessThan(this.node.innerHTML.length, this.input.length);
    });

    it('ends with an ellipsis', function () {
      assert.strictEqual(this.node.innerHTML.slice(-1), '…');
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
      assert.ok(passed);
    });

    it('leaves first child alone', function () {
      assert.strictEqual(this.node.childNodes[0].innerHTML, 'abc');
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
      assert.strictEqual(this.node.childNodes.length, 1);
    });

    it('is truncated', function () {
      var longInput = fs.readFileSync(__dirname + '/test_files/long_string.html', 'utf8');
      assert.lessThan(this.node.innerHTML.length, longInput.length);
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
      assert.lessThan(this.node.innerHTML.length, this.input.length);
    });

    it('keeps the link intact', function () {
      // DEV: Lower case is required for IE6 (<A href=...)
      assert.includes(this.node.innerHTML.toLowerCase(), '<a href="http://github.com/">non amet</a>');
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
      assert.lessThan(this.node.innerHTML.length, this.input.length);
    });

    it('keeps the link intact', function () {
      // DEV: Lower case is required for IE6 (<A href=...)
      assert.includes(this.node.innerHTML.toLowerCase(), '<a href="http://github.com/">non');
    });

    it('has no trailing non-link ellipsis', function () {
      // Verify the last node is a link node
      var childNodes = this.node.childNodes,
          nodeName = childNodes[childNodes.length - 1].nodeName.toUpperCase();
      assert.strictEqual(nodeName, 'A');
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
      assert.lessThan(this.node.innerHTML.length, this.input.length);
    });

    it('has at most 2 children', function () {
      assert.lessThan(this.node.childNodes.length, 3);
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
      assert.lessThan(this.node.innerHTML.length, this.input.length);
    });

    it('has the exclusively first line content', function () {
      // DEV: Lower case is required for IE6 (<DIV>...)
      assert.match(this.node.innerHTML.toLowerCase(), /^<div>abc(<br\/?>)?<\/div>$/);
    });
  });

});

describe('Text with at least 3 line breaks', function () {
  before(function () {
    this.input = fs.readFileSync(__dirname + '/test_files/line_breaks.html', 'utf8');
  });
  fixtureNode();

  describe('when truncated to 2 lines', function () {
    before(function () {
      trunkata(this.node, {lines: 2});
    });

    it('is truncated', function () {
      assert.lessThan(this.node.innerHTML.length, this.input.length);
    });

    it('has the exclusively first line content', function () {
      // DEV: Lower case is required for IE6 (<DIV>...)
      assert.match(this.node.innerHTML.toLowerCase(), /^<div>abc<br\/?>abc(<br\/?>)?<\/div>$/);
    });
  });
});

// Advanced tests
describe('Content with childNodes', function () {
  before(function () {
    this.input = fs.readFileSync(__dirname + '/test_files/linked.html', 'utf8');
  });
  fixtureNode();
  before(function () {
    // Save a reference to the child node
    this.childNode = this.node.childNodes[0];
  });

  it('has a childNode which is a link', function () {
    var nodeName = this.childNode.nodeName.toUpperCase();
    assert.strictEqual(nodeName, 'A');
  });

  describe('when truncated', function () {
    before(function () {
      trunkata(this.node);
    });

    it('is truncated', function () {
      assert.lessThan(this.node.innerHTML.length, this.input.length);
    });

    // DEV: Alternatively, test event bindings of children are not lost
    it('the child node is the same', function () {
      assert.strictEqual(this.node.childNodes[0], this.childNode);
    });
  });
});
