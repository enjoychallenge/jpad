
-- Requirements --
* Python 2.7 (32bit or 64bit; must correspond with node.js because of node-gyp)
* Windows users:
  path/to/python/directory
    and
  path/to/python/directory/Scripts
    must be in your PATH system variable
* node.js (32bit or 64bit; must correspond with Python 2.7 because of node-gyp)
* Windows users:
  because of node-gyp
    https://github.com/TooTallNate/node-gyp
  you will probably need to install following apps before Installation:
  * Microsoft Visual Studio C++ 2012 Express for Windows Desktop
* grunt
  to install, run
    npm install -g grunt-cli
* bower
  to install, run
    npm install -g bower

-- Installation --
npm install
bower install
sudo grunt install (Linux) / grunt install (Windows)

-- Develop --
grunt

-- Build --
grunt build

