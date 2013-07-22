(function(e){if("function"==typeof bootstrap)bootstrap("trunkata",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeTrunkata=e}else"undefined"!=typeof window?window.trunkata=e():global.trunkata=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
// Load in dependencies
var lineHeight = require('line-height');

// Define trunkata
function trunkata(root, options) {
  // Fallback options
  options = options || {};

  // Determine the line height of the root and current height
  var lnHeight = lineHeight(root),
      // https://github.com/jquery/jquery/blob/1f67d07c60c37e60052db37fc03d42af482c2d03/src/css.js#L374-L380
      height = root.offsetHeight;

  // TODO: Allow for `height` option (function) which skips over `line-height * lines` computation
  // If the height is over the maximum height, time to optimize
  var maxLines = options.lines || 1,
      maxHeight = lnHeight * maxLines;
  if (height > maxHeight) {
    // TODO: Use a binary search module
    // TODO: Find out how many words we have and treat it as a linear array
    // TODO: Optimization, create a map of when each child starts in the word map so we can jump to them faster

    // DEV: Poor speed run-time first
    // TODO: Go to the last descedendant (all the way down the tree) of the last child, start breaking off words, if none removed there, then go up to next child
    // Collect all nodes in a depth-first traversal
    /*
       A--\
      / \  \
      B  E  F
     / \     \
    C   D     G

    to

    [A,B,C,D,E,F,G]
    */
    // TODO: Definitely break this out and test it
    var stack = [root],
        node,
        depthTree = [];
    while (stack.length) {
      node = stack.shift();
      depthTree.push(node);

      var k = node.childNodes.length;
      while (k--) {
        stack.unshift(node.childNodes[k]);
      }
    }

    // TODO: There should be a binary search here
    // Starting from the farthest leaf
    var i = depthTree.length - 1,
        success = false;
    for (; i >= 1; i--) {
      // If the node is a text node
      node = depthTree[i];
      if (node.nodeType === 3) {
        // Break down the text into words
        // TODO: Deal with punctuation
        // TODO: I feel like this part could (and should) be handled by another module -- i.e. a whilst check loop + punctation intelligence
        var content = node.nodeValue,
            words = content.split(' ');

        // In a linear fashion
        // TODO: Binary search the string
        var j = words.length;
        while (j--) {
          // Join together the words with an ellipsis
          var checkContent = words.slice(0, j).join(' ') + '…';
          node.nodeValue = checkContent;

          // If the words fit, announce success and leave
          if (root.offsetHeight <= maxHeight) {
            success = true;
            break;
          }
        }
      }

      // If we were unsuccessful thus far (for both text nodes and normal nodes), remove the node
      if (!success) {
        // Remove the child from the parent node
        node.parentNode.removeChild(node);

        // Check height and set success if applicable
        if (root.offsetHeight <= maxHeight) {
          success = true;
        }
      }

      // If we are successful
      if (success) {
        break;
      }
    }
  }

  // Return the modified root
  return root;
}

// Export trunkata
module.exports = trunkata;
},{"line-height":2}],2:[function(require,module,exports){
// Load in dependencies
var computedStyle = require('computed-style');

/**
 * Calculate the `line-height` of a given node
 * @param {HTMLElement} node Element to calculate line height of. Must be in the DOM.
 * @returns {Number} `line-height` of the element in pixels
 */
function lineHeight(node) {
  // Grab the line-height via style
  var lnHeightStr = computedStyle(node, 'line-height'),
      lnHeight = parseFloat(lnHeightStr, 10);

  // If the lineHeight did not contain a unit (i.e. it was numeric), convert it to ems (e.g. '2.3' === '2.3em')
  if (lnHeightStr === lnHeight + '') {
    // Save the old lineHeight style and update the em unit to the element
    var _lnHeightStyle = node.style.lineHeight;
    node.style.lineHeight = lnHeightStr + 'em';

    // Calculate the em based height
    lnHeightStr = computedStyle(node, 'line-height');
    lnHeight = parseFloat(lnHeightStr, 10);

    // Revert the lineHeight style
    if (_lnHeightStyle) {
      node.style.lineHeight = _lnHeightStyle;
    } else {
      delete node.style.lineHeight;
    }
  }

  // If the lineHeight is in `pt`, convert it to pixels (4px for 3pt)
  // DEV: `em` units are converted to `pt` in IE6
  // Conversion ratio from https://developer.mozilla.org/en-US/docs/Web/CSS/length
  if (lnHeightStr.indexOf('pt') !== -1) {
    lnHeight *= 4;
    lnHeight /= 3;
  } else if (lnHeightStr.indexOf('mm') !== -1) {
  // Otherwise, if the lineHeight is in `mm`, convert it to pixels (96px for 25.4mm)
    lnHeight *= 96;
    lnHeight /= 25.4;
  } else if (lnHeightStr.indexOf('cm') !== -1) {
  // Otherwise, if the lineHeight is in `cm`, convert it to pixels (96px for 2.54cm)
    lnHeight *= 96;
    lnHeight /= 2.54;
  } else if (lnHeightStr.indexOf('in') !== -1) {
  // Otherwise, if the lineHeight is in `in`, convert it to pixels (96px for 1in)
    lnHeight *= 96;
  } else if (lnHeightStr.indexOf('pc') !== -1) {
  // Otherwise, if the lineHeight is in `pc`, convert it to pixels (12pt for 1pc)
    lnHeight *= 16;
  }

  // Continue our computation
  lnHeight = Math.round(lnHeight);

  // If the line-height is "normal", calculate by font-size
  if (lnHeightStr === 'normal') {
    // Create a temporary node
    var nodeName = node.nodeName,
        _node = document.createElement(nodeName);
    _node.innerHTML = '&nbsp;';

    // Set the font-size of the element
    var fontSizeStr = computedStyle(node, 'font-size');
    _node.style.fontSize = fontSizeStr;

    // Append it to the body
    var body = document.body;
    body.appendChild(_node);

    // Assume the line height of the element is the height
    var height = _node.offsetHeight;
    lnHeight = height;

    // Remove our child from the DOM
    body.removeChild(_node);
  }

  // Return the calculated height
  return lnHeight;
}

// Export lineHeight
module.exports = lineHeight;
},{"computed-style":3}],3:[function(require,module,exports){
// This code has been refactored for 140 bytes
// You can see the original here: https://github.com/twolfson/computedStyle/blob/04cd1da2e30fa45844f95f5cb1ac898e9b9ef050/lib/computedStyle.js
var computedStyle = function (el, prop, getComputedStyle) {
  getComputedStyle = window.getComputedStyle;

  // In one fell swoop
  return (
    // If we have getComputedStyle
    getComputedStyle ?
      // Query it
      // TODO: From CSS-Query notes, we might need (node, null) for FF
      getComputedStyle(el) :

    // Otherwise, we are in IE and use currentStyle
      el.currentStyle
  )[
    // Switch to camelCase for CSSOM
    // DEV: Grabbed from jQuery
    // https://github.com/jquery/jquery/blob/1.9-stable/src/css.js#L191-L194
    // https://github.com/jquery/jquery/blob/1.9-stable/src/core.js#L593-L597
    prop.replace(/-(\w)/gi, function (word, letter) {
      return letter.toUpperCase()
    })
  ]
}

module.exports = computedStyle;
},{}]},{},[1])(1)
});
;