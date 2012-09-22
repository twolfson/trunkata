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

  function lineComparator(maxLines) {
    function lineCompFn() {
      var $item = this.$item;
      // if
    }
  return lineCompFn;
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

  // TODO: Expose
  function getCSSValue($elt, prop) {
    var propPx = $elt.css(prop),
        retVal = parseInt(propPx, 10);
    return retVal;
  }

  function trunkata(item) {
    var $item = $(item);
    this.$item = $item;
  }
  trunkata.collectContents = collectContents;
  var trunkataProto = {
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
          $children = $item.children();
          // $children = $item.contents();

      // TODO: Use utility method (options/params) to save params for later?

      // TODO: If we have been here before, reset the item's children
      // TODO: What about the children's children? ;_; -- namely TextNodes as children
      // TODO: Solution -> Use the same closing algorithm as before but with the original set ;)

      // TODO: If we are passing, don't do anything

      // Depth-first traversal and collect each child
      var $origCollection = this.collectContents();
console.log($origCollection);
      // Clone the collection
      $collection = $origCollection.clone(true, true);

      // TODO: This is temporary but useful for 'getting it work' first
      var lineHeight = getCSSValue($item, 'line-height'),
          height = getCSSValue($item, 'height');

      function getThinCollection() {
        var $retVal = $origCollection.clone(true, true),
            item,
            i = $retVal.length;

        // Loop over the $retVal in reverse
        while (i--) {
          item = $retVal[i];

          // If the item is not in our current collection, remove it (nice because it is reverse depth-first)
          if (!$collection.is(item)) {
console.log(item);
            item.parentNode.removeChild(item);
          }
        }

        // Return our $retVal
        return $retVal;
      }

      // TODO: In comparator speak, this would be -1 or 0
      // TODO: If we meet our requirements, stop
      while (true) {
          // Replace the $elt's children with our children
          $item.empty().append(getThinCollection());
          height = getCSSValue($item, 'height');
console.log(height, lineHeight);
          // If we are at our line-height, stop
          if (height <= lineHeight) {
            break;
          }

          // Otherwise, slice collection by 1
          $collection = $collection.slice(0, -1);
          break;
      }

      console.log($collection);

//       // TODO: Do a binary search where the right-most node (outermost-leaf) has an extra TextNode -- &hellip;
//       var indicies = $collection.map(function (i) {
//         return i;
//       });
//       var index = binarySearch(indicies, {lines: 1}, function (params, index) {
//         // Slice our collection, replace $item's contents and get the line-height
//         var $slice = $collection.slice(index);
// // TODO: Need to coerce to children only junk
//         $item.empty().append($slice);

//         var lineHeight = $item.css('line-height'),
//             height = $item.css('height');
//         console.log(lineHeight, height);

//         var retVal = -1;
//         // If we are on the line-height, return 0? -- no it should be 'a maximum but not *the* maximum'
//         if (lineHeight === height) {
//           retVal = 0;
//         } else if (lineHeight > height) {
//           retVal = 1;
//         }

//         // Return retVal
//         return retVal;
//       });

      // TODO: THIS IS NOT PROPER -- WE SHOULD TAKE THE NEXT CELL AND TRY CHOPPING TEXT DOWN TO SEE IF IT FITS
      // TODO: Collect all of the immediate children of $item as $children
      // TODO: Take the nodes after, if it is not an immediate child of $item, remove it from its parent. if it is an immediate child, remove it and skip over any future nodes that are not immediate children (since they are automatically removed)

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
      method = 'trunkata';
      args = slice.call(arguments);
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
