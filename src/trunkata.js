/*
 * trunkata
 * https://github.com/twolfson/trunkata
 *
 * Copyright (c) 2012 Todd Wolfson
 * Licensed under the MIT, GPL licenses.
 */

(function($) {
  function trunkata(item) {
    var $item = $(item);
    if ($item.html().indexOf('Hello') === -1) {
      $item.html('abba');
    }
  }

  function trunkataEach() {
    return this.each(function () {
      return trunkata(this);
    });
  }

  // Expose trunkata to jQuery
  $.fn.trunkata = trunkataEach;

}(jQuery));
