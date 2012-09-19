/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  // Skeleton
  var SKELETON = {
    'A short sentence': {
      'trunkata\'d': {
        'is not affected': {}
      }
    },
    'A long sentence': {
      'trunkata\'d to 150 words': {
        'is at most 150 words long': {}
      }
    },
    'A multi-line paragraph': {
      'trunkata\'d to 2 lines': {
        'is at most 2 lines': {}
      }
    },
    'A multi-child div': {
      'trunkata\'d to 2 lines': {
        'is at most 2 lines': {}
      }
    }
  };

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('jquery#trunkata', {});

  // Set up test area
  var $testArea = $('#TEST_AREA');
  $testArea.addParagraph = function (str) {
    var $p = $('<p>' + str + '</p>');
    $testArea.append($p);
    return this;
  };

  // Helper method for before/after
  function wrap(fn) {
    $testArea.empty();
    return fn();
  }

  test('A short sentence trunkata\'d' /* is not affected */, 1, wrap(function () {
    // A short sentence
    var sentence = 'Hello world!';
    $testArea.addParagraph(sentence);

    // trunkata'd
    $testArea.trunkata();

    // is not affected
    strictEqual($testArea.text(), sentence, 'is not affected');
  }));

  test('is awesome', 1, function() {
    strictEqual(this.elems.awesome().text(), 'awesomeawesomeawesome', 'should be thoroughly awesome');
  });

  module('jQuery.awesome');

  test('is awesome', 1, function() {
    strictEqual($.awesome(), 'awesome', 'should be thoroughly awesome');
  });

  module(':awesome selector', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is awesome', 1, function() {
    // Use deepEqual & .get() when comparing jQuery objects.
    deepEqual(this.elems.filter(':awesome').get(), this.elems.last().get(), 'knows awesome when it sees it');
  });

}(jQuery));
