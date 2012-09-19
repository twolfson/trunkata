/*
 * trunkata
 * https://github.com/twolfson/trunkata
 *
 * Copyright (c) 2012 Todd Wolfson
 * Licensed under the MIT, GPL licenses.
 */

(function($) {
  // TODO: Will we composite truncations together? (e.g. {lines: 3, words: 2} would add them together? or would we choose which occurs first/last?)
  // TODO: Move this to jQuery module style -- $item.trunkata('truncate', {'words': 3}); -- or don't ;)
  // TODO: Save original text to data-trunkata-text
  // TODO: Custom comparator (over lines/words)
  // TODO: Cusotm value -- e.g. &raquo; over &hellip;
  // TODO: Eventually implement trunk8's left, center, right x_x
  // TODO: trunkata('reset')
  function trunkata(item) {
    var $item = $(item);

    // TODO: If we have been here before, reset the item's children

    // TODO: If we are passing, don't do anything

    // TODO: Depth-first traversal and collect each child
    // TODO: Do a binary search where the right-most node (outermost-leaf) has an extra TextNode -- &hellip;
    // TODO: THIS IS NOT PROPER -- WE SHOULD TAKE THE NEXT CELL AND TRY CHOPPING TEXT DOWN TO SEE IF IT FITS
    // TODO: Collect all of the immediate children of $item as $children
    // TODO: Take the nodes after, if it is not an immediate child of $item, remove it from its parent. if it is an immediate child, remove it and skip over any future nodes that are not immediate children (since they are automatically removed)
    // TODO: Thank you, have a nice day!
  }

  function trunkataEach() {
    return this.each(function () {
      return trunkata(this);
    });
  }

  // Expose trunkata to jQuery
  $.fn.trunkata = trunkataEach;

}(jQuery));
