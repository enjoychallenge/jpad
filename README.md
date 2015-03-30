# ol3 devstack

[OpenLayers 3](ol3js.org) & [Google Closure](https://developers.google.com/closure/) devstack ready for [advanced optimizations](https://developers.google.com/closure/compiler/docs/compilation_levels) using [plovr](https://github.com/bolinfest/plovr). Moreover [fixjsstyle and gjslint](https://developers.google.com/closure/utilities/docs/linter_howto) are also included.

Current versions:
* [OpenLayers](ol3js.org) v3.4.0
* [plovr](https://github.com/bolinfest/plovr) 2.0.0

This repository is not officially supported by Google, ol3, or individual module authors.

## Requirements
* [git](http://git-scm.com/downloads)
  * Windows users: `path/to/directory/with/git.exe` must be in your PATH system variable
* [Python 2.7](https://www.python.org/downloads/) (32bit or 64bit; must correspond with node.js because of node-gyp)
  * Windows users: `path/to/python/directory` and `path/to/python/directory/Scripts` must be in your PATH system variable
* [node.js](http://nodejs.org/download/) (32bit or 64bit; must correspond with Python 2.7 because of node-gyp)
* [grunt](http://gruntjs.com/) `npm install -g grunt-cli`
* [bower](http://bower.io/) `npm install -g bower`

## Installation
```
git clone https://github.com/jirik/ol3ds.git
cd ol3ds
npm install
bower install
sudo grunt install (Linux) / grunt install (Windows)
```
### Problems with installation
Windows users: If you have some errors during `npm install` related to [node-gyp](https://github.com/TooTallNate/node-gyp), you will probably need to install [Microsoft Visual Studio C++ 2012 Express for Windows Desktop](http://www.microsoft.com/en-us/download/details.aspx?id=34673) and run the installation again.

## Development
* `grunt` to run dev server and open Hello World in the browser
  * Edit content of `client/src/js/webpages/index.js` and see changes in the browser
* `grunt lint` to run gjslint
* `grunt fix` to run fixjsstyle

## Build
* `grunt build` to compile the code and copy files to `client/public`
* `grunt build --map` to include also [source maps](https://developer.chrome.com/devtools/docs/javascript-debugging#source-maps)

