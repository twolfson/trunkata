# trunkata [![Donate on Gittip](http://badgr.co/gittip/twolfson.png)](https://www.gittip.com/twolfson/)

Truncation utility which preserves HTML content and can truncate by lines.

This library was created to solve truncating HTML at line breaks. This is preferred since browsers are inconsistent with font-sizes and where they choose to break, making words and character indexes useless.

[![browser support](https://ci.testling.com/twolfson/trunkata.png)](https://ci.testling.com/twolfson/trunkata)

## Getting Started
`trunkata` is available via the following:

- [npm][npm], `npm install trunkata`
- [bower][bower], `bower install trunkata`
- [component][component], `component install trunkata`
- [Download via HTTP][download]

[npm]: http://npmjs.org/
[bower]: http://bower.io/
[component]: http://component.io/
[download]: https://raw.github.com/twolfson/trunkata/master/dist/trunkata.js

For `npm` and `component`, you can load it in as follows:
```javascript
var trunkata = require('trunkata');
```

For `bower` and `http`, you can use vanilla JS
```html
<script src="components/trunkata.js"></script>
window.trunkata;
```

or you can use [AMD][amd]

[amd]: http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition

```js
require(['trunkata'], funtion (trunkata) { /* code */ });
```

or [CommonJS][commonjs] syntax (see `npm`/`component` section).

[commonjs]: http://wiki.commonjs.org/wiki/Modules/1.0

Once you have the module loaded, you can get the `trunkata` of any node in the DOM.

```javascript
// Truncate a paragraph
var p = document.createElement('p');
p.innerHTML = 'Lorem ipsum Non amet nulla amet deserunt commodo quis Ut cillum occaecat aliqua eu laboris ex in et quis laboris proident dolor pariatur aute ullamco laboris adipisicing reprehenderit sed non enim occaecat dolor aute id non quis dolor consequat velit exercitation mollit nostrud sint sunt occaecat sunt elit tempor ex aute aliqua tempor cupidatat sed esse dolore ea incididunt nulla in sint ad deserunt veniam veniam nisi deserunt ex dolore consequat ut exercitation pariatur exercitation aliquip aliquip eu do occaecat nisi in est fugiat sint qui pariatur dolore laboris cupidatat cupidatat eiusmod aliqua fugiat in dolor sed in pariatur cupidatat do esse dolor in Ut Ut nisi proident anim nisi in eiusmod cillum fugiat labore cillum velit veniam mollit sit aute commodo dolor ut aute exercitation cupidatat occaecat nostrud aute Ut in magna nisi labore officia eu consectetur labore labore dolor in consectetur occaecat quis incididunt sed Duis irure adipisicing proident officia commodo dolore deserunt id in elit amet exercitation Excepteur Ut magna officia aute do ut voluptate Excepteur aliquip proident incididunt amet sit id enim.';
document.body.appendChild(p);
trunkata(p);
p.innerHTML; // Lorem ipsum Non amet nulla...

// Truncate a paragraph containing links
var p = document.createElement('p');
p.innerHTML = 'Lorem <a href="http://github.com/">ipsum Non amet nulla amet deserunt commodo quis Ut cillum occaecat aliqua eu laboris ex in et quis laboris proident dolor pariatur aute ullamco laboris adipisicing</a> reprehenderit sed non enim occaecat dolor aute id non quis dolor consequat velit exercitation mollit nostrud sint sunt occaecat sunt elit tempor ex aute aliqua tempor cupidatat sed esse dolore ea incididunt nulla in sint ad deserunt veniam veniam nisi deserunt ex dolore consequat ut exercitation pariatur exercitation aliquip aliquip eu do occaecat nisi in est fugiat sint qui pariatur dolore laboris cupidatat cupidatat eiusmod aliqua fugiat in dolor sed in pariatur cupidatat do esse dolor in Ut Ut nisi proident anim nisi in eiusmod cillum fugiat labore cillum velit veniam mollit sit aute commodo dolor ut aute exercitation cupidatat occaecat nostrud aute Ut in magna nisi labore officia eu consectetur labore labore dolor in consectetur occaecat quis incididunt sed Duis irure adipisicing proident officia commodo dolore deserunt id in elit amet exercitation Excepteur Ut magna officia aute do ut voluptate Excepteur aliquip proident incididunt amet sit id enim.';
document.body.appendChild(p);
trunkata(p);
p.innerHTML; // Lorem <a href="http://github.com">ipsum Non amet nulla...</a>

// Truncate a paragraph containing links down to 3 lines
p.innerHTML = 'Lorem <a href="http://github.com/">ipsum Non amet nulla amet deserunt commodo quis Ut cillum occaecat aliqua eu laboris ex in et quis laboris proident dolor pariatur aute ullamco laboris adipisicing</a> reprehenderit sed non enim occaecat dolor aute id non quis dolor consequat velit exercitation mollit nostrud sint sunt occaecat sunt elit tempor ex aute aliqua tempor cupidatat sed esse dolore ea incididunt nulla in sint ad deserunt veniam veniam nisi deserunt ex dolore consequat ut exercitation pariatur exercitation aliquip aliquip eu do occaecat nisi in est fugiat sint qui pariatur dolore laboris cupidatat cupidatat eiusmod aliqua fugiat in dolor sed in pariatur cupidatat do esse dolor in Ut Ut nisi proident anim nisi in eiusmod cillum fugiat labore cillum velit veniam mollit sit aute commodo dolor ut aute exercitation cupidatat occaecat nostrud aute Ut in magna nisi labore officia eu consectetur labore labore dolor in consectetur occaecat quis incididunt sed Duis irure adipisicing proident officia commodo dolore deserunt id in elit amet exercitation Excepteur Ut magna officia aute do ut voluptate Excepteur aliquip proident incididunt amet sit id enim.';
document.body.appendChild(p);
trunkata(p, {lines: 3});
p.innerHTML; // Lorem <a href="http://github.com">laboris ex in et quis laboris proident dolor pariatur aute ullamco laboris adipisicing</a> reprehenderit sed non enim occaecat dolor aute id non quis dolor consequat velit...
```

## Documentation
`trunkata` provides a single function.

```js
trunkata(node);
trunkata(node, options);
/**
 * Truncate a node down to a specific amount of lines
 * @param {HTMLElement} root Element to truncate. This *must* be in the DOM.
 * @param {Object} [options] Options to alter the behavior of trunkata
 * @param {Number} [options.lines] How many lines to truncate to
 * @returns {HTMLElement} Returns the truncated element. All modifications are done in-place.
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.
