# Rules of code structure

## Source files for client side
* Source files for client are located in `src/client`
* Everything is there together: HTML, JS, CSS, Plovr configuration, whatever you need
* Directory names are in lower case matching regexp `^[a-z][a-z0-9]*$`
* File names are in lower case matching regexp `^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$`
* File names correspond with location in directory tree inside `src/client`
 * Example: All files inside `src/client/my/first/app` directory start with `my.first.app` string
 * Yes, it is terrible redundancy. The reason is clear arrangement in your editor that usually show just filename in tab. If you have many files named `view.js`, you can simply become lost.
* If you use **dir-relative or file-relative path** inside JS file, **always use one string literal starting with `./` and containing complete path and filename**
  * This is good: `var imgPath = './my.first.app.logo.png';`
  * This is bad: `var imgPath = 'my.first.app.logo.png';`
  * This is bad: `var imgPath = './my.first.app.logo' + '.png';`
  * Because of this, ol3ds can simply replace all relative paths with absolute, which is necessary for HTML5 pushState.
* Every `*.js` inside `src/client` directory is ready for compilation using Closure Compiler's advanced mode. Exceptions:
  * `*.externs.js` is excluded from compilation, it shoud be treated as [externs files](https://developers.google.com/closure/compiler/docs/api-tutorial3).
* Namespace provided by `goog.provide` correspond with file name, case-insensitive
 * Example: All namespaces inside `my.first.app.js` file start with `my.first.app`, `my.first.App`, `my.first.APP`, `my.first.app_`, `my.first.App_`, or `my.first.APP_` string

### Plovr
* Every `*.plovr.json` is configuration file for Plovr
* Every HTML file may refer to one Plovr config with the same name.
* Reference to Plovr config is done by file name, not by `http://plovrserver/compile?id=...`
  * Example: Inside `example.ol3.index.html` you can find `<script src="example.ol3.index.plovr.json" type="text/javascript"></script>`
* If there is a file `*.dev.plovr.json`, it is a plovr configuration used for dev process.
  * Do not use link to `*.dev.plovr.json` inside HTML. Use link to main `*.plovr.json` and ol3ds will make the replacement automatically.
* Extern files (`*.externs.js`) are not precompiled, but it must be specified as externs inside `*.plovr.json`.

* **TODO: Do not use CSS minification options of Plovr.** Use CSS [@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) instead.
  * **TODO: Use @import only for import CSS files from inside `src/client`**
