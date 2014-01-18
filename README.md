Lunte The Adventure
===================

A bird perspective adventure basing on a bomberman clone.


Node.js and NPM
===============

You need node.js and npm. Install it so that npm is in your PATH.

http://nodejs.org/

Afterwards, you need to install the package manager bower http://bower.io/.

    npm install -g bower (this might require root privileges)

You also need to install Grunt (http://gruntjs.com/getting-started), a
JavaScript task runner (similar to ant):

    npm install -g grunt-cli (this might require root privileges)


Getting dependencies
====================

This step needs to be done only once and after updating package.json:

    npm install

To download the actual project dependencies like jQuery, you have to invoke
bower:

    bower install


Running in browser
==================

Grunt can watch any files for updates and rebuild everything automatically.
Simply execute:

    grunt serve

This will start a server and open your browser to load the page. When you edit
any file, the browser will be informed to reload the page.


Building an official release
============================

To build an official release, use:

    grunt

The release will be stored in the dist/ folder.


Running static code analysis
============================

There are two common tools to prevent common coding errors in JavaScript.

1) Add the following line at the very top of each JavaScript file so that the
browser's compiler stops on syntax errors like undefined variables:

    'use strict';

2) Run static code analysis on your code using the following grunt task:

    grunt newer:jshint


Formatting source code
======================

To format all JS files according to common JS style guide, use:

	grunt format
