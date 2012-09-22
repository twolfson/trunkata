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
    'A div with multiple child paragraphs': {
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
  var $testArea = null,
      LIPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ligula justo, viverra sed consequat ut, facilisis vel tortor. Nunc et aliquam tortor. Nunc vulputate odio ut lectus volutpat vehicula. In blandit tempus erat ut mattis. Suspendisse malesuada, sapien nec pharetra viverra, nulla neque laoreet lorem, quis dapibus odio erat vel felis. Pellentesque ac nibh eros, dictum placerat turpis. Aenean vel metus nec erat varius cursus vitae sit amet augue. Donec porttitor, urna at volutpat lobortis, urna sem vehicula urna, at euismod felis turpis eget lectus. Vivamus ac dui condimentum neque hendrerit ullamcorper. Donec eu lorem vitae magna lobortis tempor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi non lacus orci. In est tortor, malesuada at varius a, tincidunt a quam. Cras molestie pellentesque sollicitudin.',
      testAreaCounter = 0;
  function requireTestArea() {
    // if (!$testArea || !$testArea.length) {
      // $testArea = $('#TEST_AREA');
      testAreaCounter += 1;
      $testArea = $('#TEST_AREA' + testAreaCounter);
      $testArea.addParagraph = function (str) {
        var $p = $('<p>' + str + '</p>');
        $testArea.append($p);
        return this;
      };
    // }
    return $testArea;
  }

  // Helper method for before
  function before() {
    requireTestArea();
    $testArea.empty();
  }

  function getNumericProperty($elt, prop) {
    var propPx = $elt.css(prop),
        retVal = parseInt(propPx, 10); /* no need for +propPx.replace, woot! */
    return retVal;
  }

  // test('A short sentence trunkata\'d' /* is not affected */, 1, wrap(function () {
  test('A short sentence trunkata\'d' /* is not affected */, 1, function () { before();
    // A short sentence
    var sentence = 'Hello world!';
    $testArea.addParagraph(sentence);

    // trunkata'd
    $testArea.trunkata();

    // is not affected
    strictEqual($testArea.text(), sentence, 'is not affected');
  });

  test('A long sentence' + 'trunkata\'d to 150 words' /* 'is at most 150 words long' */, 1, function () { before();
    // A long sentence
    var sentence = LIPSUM;
    $testArea.addParagraph(sentence);

    // trunkata'd to 150 words
    $testArea.trunkata({'words': 150});

    // is at most 150 words long
    ok($testArea.text().length <= 150, 'is at most 150 words long');
  });

  test('A multi-line paragraph' + 'trunkata\'d to 2 lines' /* 'is at most 2 lines' */, 1, function () {  before();
    // A multi-line sentence
    var sentence = LIPSUM + LIPSUM;
    $testArea.addParagraph(sentence);

    // trunkata'd to 2 lines
    $testArea.trunkata({'lines': 2});

    // is at most 2 lines
    var lineHeight = getNumericProperty($testArea, 'line-height'),
        twoLines = lineHeight * 2,
        height = getNumericProperty($testArea, 'height');
    ok(height <= twoLines, 'is at most 2 lines');
  });

  test('A div with multiple child paragraphs' + 'trunkata\'d to 2 lines' /* 'is at most 2 lines' */, 1, function () { before();
    // A div with multiple child paragraphs
    var sentence = LIPSUM + LIPSUM;
    $testArea.addParagraph(sentence);
    $testArea.addParagraph(sentence);
    $testArea.addParagraph(sentence);

    // trunkata'd to 2 lines
    $testArea.trunkata({'lines': 2});

    // is at most 2 lines
    var lineHeight = getNumericProperty($testArea, 'line-height'),
        twoLines = lineHeight * 2,
        height = getNumericProperty($testArea, 'height');
    ok(height <= twoLines, 'is at most 2 lines');
  });

}(jQuery));
