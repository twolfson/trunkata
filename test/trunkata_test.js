var trunkata = require('../lib/trunkata.js'),
    expect = require('chai').expect;

describe('A short string <div>', function () {
  before(function () {
    // Create our content
    var input = 'abc',
        node = document.createElement('div');
    node.innerHTML = input;
    document.body.appendChild(node);

    // Save for later
    this.input = input;
    this.node = node;
  });
  after(function () {
    document.body.removeChild(this.node);
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

describe('A long string <div>', function () {
  before(function () {
    // Create our content
    var input = 'Lorem ipsum Non amet nulla amet deserunt commodo quis Ut cillum occaecat aliqua eu laboris ex in et quis laboris proident dolor pariatur aute ullamco laboris adipisicing reprehenderit sed non enim occaecat dolor aute id non quis dolor consequat velit exercitation mollit nostrud sint sunt occaecat sunt elit tempor ex aute aliqua tempor cupidatat sed esse dolore ea incididunt nulla in sint ad deserunt veniam veniam nisi deserunt ex dolore consequat ut exercitation pariatur exercitation aliquip aliquip eu do occaecat nisi in est fugiat sint qui pariatur dolore laboris cupidatat cupidatat eiusmod aliqua fugiat in dolor sed in pariatur cupidatat do esse dolor in Ut Ut nisi proident anim nisi in eiusmod cillum fugiat labore cillum velit veniam mollit sit aute commodo dolor ut aute exercitation cupidatat occaecat nostrud aute Ut in magna nisi labore officia eu consectetur labore labore dolor in consectetur occaecat quis incididunt sed Duis irure adipisicing proident officia commodo dolore deserunt id in elit amet exercitation Excepteur Ut magna officia aute do ut voluptate Excepteur aliquip proident incididunt amet sit id enim.',
        node = document.createElement('div');
    node.innerHTML = input;
    document.body.appendChild(node);

    // Save for later
    this.input = input;
    this.node = node;
  });
  after(function () {
    document.body.removeChild(this.node);
  });

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
