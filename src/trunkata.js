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
  function trunkata(item) {
    var $item = $(item);
    this.$item = $item;

    // TODO: If we have been here before, reset the item's children

    // TODO: If we are passing, don't do anything

    // TODO: Depth-first traversal and collect each child
    // TODO: Do a binary search where the right-most node (outermost-leaf) has an extra TextNode -- &hellip;
    // TODO: THIS IS NOT PROPER -- WE SHOULD TAKE THE NEXT CELL AND TRY CHOPPING TEXT DOWN TO SEE IF IT FITS
    // TODO: Collect all of the immediate children of $item as $children
    // TODO: Take the nodes after, if it is not an immediate child of $item, remove it from its parent. if it is an immediate child, remove it and skip over any future nodes that are not immediate children (since they are automatically removed)
    // TODO: Thank you, have a nice day!
  }
  var trunkataProto = {
    'trunkata': function () {
      var $item = this.$item;
      // if ($item.html().indexOf('Hello') === -1) {
      //   $item.html('abba');
      // }
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
