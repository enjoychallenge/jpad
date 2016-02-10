# jpad

JS devstack including
* [OpenLayers 3](ol3js.org)
* [Google Closure](https://developers.google.com/closure/) ready for [advanced optimizations](https://developers.google.com/closure/compiler/docs/compilation_levels) using [plovr](https://github.com/bolinfest/plovr)
* [fixjsstyle and gjslint](https://developers.google.com/closure/utilities/docs/linter_howto) included
* both Linux and Windows friendly

Current versions:
* [OpenLayers](http://openlayers.org) v3.7.0
* [Closure Library](https://github.com/google/closure-library) [v2015-02-18] (https://github.com/google/closure-library/tree/567c440d2c7f2601c970ce40bc650ad2044a77d2)
* [plovr](https://github.com/bolinfest/plovr) 2.0.0

This repository is not officially supported by Google, ol3, or individual module authors.

## Requirements
* [Java 7 or higher](http://www.java.com/)
  * Windows users: `path/to/directory/with/java.exe` must be in your PATH system variable
* [Python 2.7](https://www.python.org/downloads/) (32bit or 64bit; must correspond with node.js because of node-gyp)
  * Windows users: `path/to/python/directory` and `path/to/python/directory/Scripts` must be in your PATH system variable
* [node.js](http://nodejs.org/download/) (32bit or 64bit; must correspond with Python 2.7 because of node-gyp)
* [gulp](http://gulpjs.com/) `npm install -g gulp-cli`
* [bower](http://bower.io/) `npm install -g bower`
* [git](http://git-scm.com/downloads)
  * Windows users: `path/to/directory/with/git.exe` must be in your PATH system variable

## Installation
```
git clone https://github.com/jirik/ol3ds.git jpad
cd jpad
npm install
bower install
sudo gulp install (Linux) / gulp install (Windows)
```
### Problems with installation
Windows users: If you have some errors during `npm install` related to [node-gyp](https://github.com/TooTallNate/node-gyp), you will probably need to install [Microsoft Visual Studio C++ 2012 Express for Windows Desktop](http://www.microsoft.com/en-us/download/details.aspx?id=34673) and run the installation again.

## Development
* `gulp` to run dev server and open app in the browser
  * Edit files in `src/client` and see changes in the browser
* `gulp -h` to get more commands

## Build
* `gulp build` to compile the code and copy files to `build/`
* `gulp build -s` to include also [source maps](https://developer.chrome.com/devtools/docs/javascript-debugging#source-maps)
* `gulp -h` to get more commands

