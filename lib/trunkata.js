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