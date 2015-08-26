# Rules of code structure

## Source files for client side
* Source files for client are located in `src/client`
* Everything is there together: HTML, JS, CSS, Plovr configuration, whatever you need
* File names are in lower case
* File names correspond with location in directory tree inside `src/client`
 * Example: All files inside `src/client/my/first/app` directory start with `my.first.app` string
* If you use link to source file, **always use one string literal for file name** (especially inside JS)
  * This is good: `var imgPath = 'my.first.app.logo.png';`
  * This is bad: `var imgPath = 'my.first.app' + '.logo.png';`
* Every `*.js` inside `src/client` directory is ready for compilation using Closure Compiler's advanced mode
  * **TODO: If it is not extern** (`*.externs.js`)
* Namespace provided by `goog.provide` correspond with file name, case-insensitive
 * Example: All namespaces inside `my.first.app.js` file start with `my.first.app` or `my.first.App` or `my.first.APP` string
* Every `*.plovr.json` is configuration file for Plovr
* **TODO: Do not use CSS minification options of Plovr.** Use CSS [@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) instead.
 * **TODO: Use @import only for import CSS files from inside `src/client`**
