/*
 * trunkata
 * https://github.com/twolfson/trunkata
 *
 * Copyright (c) 2012 Todd Wolfson
 * Licensed under the MIT, GPL licenses.
 */

(function($) {
  var slice = [].slice;
  // TODO: Will we composite truncations together? (e.g. {lines: 3, words: 2} would add them together? or would we choose which occurs first/last?)
  // TODO: Save original text to data-trunkata-text -- this should be the immediate set of children of $item
  // TODO: Custom comparator (over lines/words)
  // TODO: Cusotm value -- e.g. &raquo; over &hellip;
  // TODO: Eventually implement trunk8's left, center, right x_x
  // TODO: trunkata('reset')
  // TODO: Manage default options via $.trunkata?
  // TODO: More comparators -- width, height

  // TODO: Expose
  function getCSSValue($elt, prop) {
    var propPx = $elt.css(prop),
        retVal = parseInt(propPx, 10);

    // If the property is 'line-height' and the value 'normal', set it to '1'
    if (prop === 'line-height' && propPx === 'normal') {
      $elt.css(prop, 1);
      propPx = $elt.css(prop);
      retVal = parseInt(propPx, 10);
    }

    return retVal;
  }

  // TODO: Expose
  function getLineComparator($item, maxLines) {
    // Get the line-height statistics now
    var lineHeight = getCSSValue($item, 'line-height'),
        maxHeight = lineHeight * maxLines;

    // Generate a comparator function
    function lineComparator() {
      var height = getCSSValue($item, 'height'),
          isPassing = height <= maxHeight;
      return isPassing;
    }
    return lineComparator;
  }

  function getWordComparator($item, maxWords) {
    // Generate a comparator function
    function wordComparator() {
      var text = $item.text(),
          words = text.split(/\s+/),
          isPassing = words.length <= maxWords;
      return isPassing;
    }
    return wordComparator;
  }

  function collectContents($elts) {
    var $collection = $();

    // Iterate over each of the elements
    $elts.each(function () {
      // jQueyr-ify the elemet
      var $elt = $(this);

      // Add it to the collection
      $collection = $collection.add($elt);

      // Walk down its children
      var $children = $elt.children();
      // var $children = $elt.contents();

      // Add them to the list
      var $subcollection = collectContents($children);
      $collection = $collection.add($subcollection);
    });

    // Return the collection
    return $collection;
  }

  // TODO: Expose me
  // Binary search algorithm from http://www.nczonline.net/blog/2009/09/01/computer-science-in-javascript-binary-search/
  // Copyright 2009 Nicholas C. Zakas. All rights reserved.
  // MIT-Licensed, see source file
  // Modifications by Todd Wolfson
  /**
   * Helper function to get binary search functions
   * @param {Function} comparator Comparator that returns 0 when equal, -1 when less than, 1 when greater than
   */
  function binarySearch(items, value, comparator) {
      var startIndex  = 0,
          stopIndex   = items.length - 1,
          middle      = Math.floor((stopIndex + startIndex)/2);

      while(comparator(value, items[middle]) !== 0 && startIndex < stopIndex){

          //adjust search area
          if (comparator(value, items[middle]) < 0){
              stopIndex = middle - 1;
          } else if (comparator(value, items[middle]) > 0){
              startIndex = middle + 1;
          }

          //recalculate middle
          middle = Math.floor((stopIndex + startIndex)/2);
      }

      //make sure it's the right value
      return comparator(value, items[middle]) !== 0 ? -1 : middle;
  }

  function trunkata(item) {
    var $item = $(item),
        $children = $item.contents(),
        $childrenClones = $children.clone(true, true);
    this.$item = $item;
    this.$children = $children;
    this.$childrenClones = $childrenClones;
  }
  trunkata.collectContents = collectContents;
  var trunkataProto = {
    'reset': function () {
      // Get the children clones and clone them again
      var $item = this.$item,
          $childrenClones = this.$childrenClones,
          $newChildren = $childrenClones.clone(true, true);

      // Empty out the item and add the new childrem
      $item.empty().append($newChildren);

      // Return this
      return this;
    },
    'collectContents': function () {
      // Get the children (including text and comment nodes)
       var $item = this.$item,
           $children = $item.children(),
           // $children = $item.contents(),
           $collection = collectContents($children);

      return $collection;
    },
    /**
     * Truncate your DOM with proper form
     * @param {Object} params Parameters to use for truncating
     * @param {Number} [params.lines=1]  Truncate item until we are at most `params.lines` tall.
     * @param {Number} [params.words] If provided (and lines is not), truncate elements until we have `params.words` left.
     * @returns {this}
     */
    'trunkata': function (params) {
      var $item = this.$item,
          that = this;

      // Fallback params
      params = params || {'lines': 1};

      // TODO: Logic for different comparators
      // TODO: Make 'getComparator' exposable function
      // TODO: Rename underOneLine -_-
      var lines = params.lines,
          words = params.words;
      if (lines !== undefined) {
        underOneLine = getLineComparator($item, lines);
      } else if (words !== undefined) {
        underOneLine = getWordComparator($item, words);
      } else {
        underOneLine = getLineComparator($item, 1);
      }

      // TODO: Use utility method (options/params) to save params for later?

      // TODO: If we are passing, don't do anything

      // // Depth-first traversal and collect each child
      // var $origCollection = this.collectContents();

      function collectTree() {
        // Do a reverse DFT but this time outside of jQuery (this is exclusively for the length)
        var elts = [];
        function recurse2(elt) {
          // Keep on diving
          var item = elt,
              children = elt.childNodes,
              i = children.length;
          while (i--) {
            recurse2(children[i]);
          }

          // Add the elt to the array
          elts.push(elt);
        }

        // Start iterating over the elemtns in reverse
        var item = $item[0],
            children = item.childNodes,
            i = children.length;
        while (i--) {
          recurse2(children[i]);
        }

        // Return our collection
        return elts;
      }
      var elts = collectTree();

      function resetAndCollect() {
        that.reset();
        elts = collectTree();
      }

      function resetCollectAndEat(index) {
        resetAndCollect();

        var i = 0,
            len = index,
            elt;

        // REMEMBER: THIS IS A REVERSE DFS TREE SO WE ARE GOING LEAF -> ROOT
        for (; i < len; i++) {
          elt = elts[i];
          elt.parentNode.removeChild(elt);
        }
      }

      // Traverse depth-first reverse
      function comparator(index) {
        // Reset collect and each up to index
        resetCollectAndEat(index);

        // Find the element we are truncating
        var elt = elts[index];

        // Remove myself
        elt.parentNode.removeChild(elt);

        // Return passing status
        var isPassing = underOneLine();
        return isPassing;
      }

      // If we are not passing
      var isPassing = underOneLine();
      if (!isPassing) {
        // NOTE: Since we have a reverse loop -- lowest is best
        var start = 0,
            stop = elts.length - 1,
            mid = Math.floor((start + stop)/2),
            passes;
        while (start < stop) {
          passes = comparator(mid);

          // If mid passes, move stop to here
          if (passes) {
            stop = mid;
          } else {
          // Otherwise, move start to mid + 1
            start = mid + 1;
          }

          // Recalculate middle
          mid = Math.floor((start + stop)/2);
        }

        var k = Math.min(start, stop);

        // Find the last text node (inclusive) before our good index (remember: leaf -> root is how our array is)
        var whenRemovedIsPassing = k,
            elt,
            m = whenRemovedIsPassing + 1;
        while (m--) {
          elt = elts[m];
          if (elt.nodeType === 3) {
            break;
          }
        }

        // If there was a text node
        var mWasUsed = false;
        if (m >= 0) {
          // Reset and eat to this index
          resetCollectAndEat(m);

          elt = elts[m];

          // If this is a text node, truncate myself (binary search)
          // TODO: Allow any kind of 'fillText' (not just hellip)
          var str = elt.nodeValue,
              words = str.split(' '),
              j = words.length;

          // Temporarily append an ellipsis
          var ellipsis = document.createElement('span');
          ellipsis.className = 'trunkata-ellipsis';
          ellipsis.innerHTML = '&hellip;';
          elt.parentNode.appendChild(ellipsis);

          // Binary search for best amount of words
          start = 0;
          stop = words.length - 1;
          mid = Math.ceil((start + stop)/2);
          var wordStr;
          while (start < stop) {
            // Collect the word, remove and whitespace punctuation from the end
            wordStr = words.slice(0, mid).join(' ');
            wordStr = wordStr.replace(/[\s,;:!\?]+$/, '');
            elt.nodeValue = wordStr;

            // If we are under a line, start here
            if (underOneLine()) {
              start = mid;
            } else {
            // Otherwise, we are over a line and I want to be under this many words (mid - 1)
              stop = mid - 1;
            }

            // Recalculate middle
            mid = Math.ceil((start + stop)/2);
          }

          // If mid is not 0, mark mWasUsed
          if (mid > 0) {
            mWasUsed = true;
          }
        }

        // If mWasNotUsed, reset and eat to goodIndex
        if (!mWasUsed) {
          resetCollectAndEat(whenRemovedIsPassing);
        }
      }


      // Thank you, have a nice day!
      return this;
    },
    'truncate': function () {
      var args = slice.call(arguments);
      return this.trunkata.apply(this, arguments);
    }
  };
  trunkata.prototype = trunkataProto;

  function trunkataEach(method) {
    var args;
    // If the method is not a string, fallback to 'trunkata' and slice all the arguments
    if (typeof method !== 'string') {
      args = slice.call(arguments);
      method = 'trunkata';
    } else {
    // Otherwise, slice everything except method
      args = slice.call(arguments, 1);
    }

    // Iterate over the collection
    return this.each(function () {
      // Retrieve the trunkata instance
      var $this = $(this),
          $trunkata = $this.data('_trunkata');

      // If there is no trunkata, create one
      if (!$trunkata) {
        $trunkata = new trunkata(this);
        $this.data('_trunkata', $trunkata);
      }

      // Apply and return the method
      return trunkataProto[method].apply($trunkata, args);
    });
  }

  // Expose trunkata to jQuery
  $.fn.trunkata = trunkataEach;

}(jQuery));
