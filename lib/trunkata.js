// TODO: Use a binary search module
var computedStyle = require('computed-style');
function trunkata(node, options) {
  // Fallback options
  options = options || {};

  // Determine the line height of the node and current height
  var lineHeightStr = computedStyle(node, 'line-height'),
      lineHeight = parseInt(lineHeightStr, 10),
      height = node.offsetHeight;

  // TODO: Deal with `lines` option
  // If the height is over the line height, time to optimize
  if (height > lineHeight) {
    console.log('time to search');
  }

  // Return the modified node
  return node;
}

// Export trunkata
module.exports = trunkata;