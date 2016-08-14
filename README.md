# TinyCLI

TinyCLI is a web-based command line interface.

## Configured modules

**TinyCLI** uses this setup of the following modules.

### Language modules

* [Babel](https://babeljs.io/) compiler for next generation JavaScript.
* [Jade](http://jade-lang.com/) preprocessor to generate HTML.
* [jQuery](http://jquery.com/) library for simplified writing of JavaScripts.
* [PostCSS](https://github.com/postcss/postcss) with [PreCSS](https://jonathantneal.github.io/precss/) to offer
  [SCSS](http://sass-lang.com/)-like syntax.

### Development environment modules

* [BrowserSync](http://www.browsersync.io/) to get a similar development experience to CodePen.
* [Node.js](https://nodejs.org/) for running JavaScript.
* [Gulp.js](http://gulpjs.com/) for task automation.
* [Bower](http://bower.io/) to download packages from the web, like jQuery.

# Setup

1. Check the build status: [![Build Status](https://travis-ci.org/IOIO72/TinyCLI.svg)](https://travis-ci.org/IOIO72/TinyCLI)
1. If you didn't before, install [Node.js](https://nodejs.org/)
1. If you didn't before, install [Gulp.js](http://gulpjs.com/) `npm install --global gulp`
1. If you didn't before, install [Bower](http://bower.io/) `npm install -g bower`
1. Enter `git clone https://github.com/IOIO72/TinyCLI.git yourProjectsName`
1. Enter `cd yourProjectsName`
1. Enter `npm install`
1. Enter `bower install`

# Development workflow

## Serve and watch

```sh
gulp serve
```

This command builds the project, watches code changes and launches web browser and updates on code changes.

## Watch (default)

```sh
gulp watch
```

or

```sh
gulp
```

This is basically the same as the `serve` task, but without the web browser launching and updating.

## Build

```sh
gulp build
```

This task builds the project without watching and doing anything else afterwards.

# Contributing

Be encouraged to ...

* send ideas, thoughts, feedback
* bug reports
* feature requests
* pull requests / merge requests

Please use feature or bug branches for your pull / merge requests like `feature/(YOURFEATURE)` or `bug/(YOURBUGFIX)`.

# Chat

[Chat on gitter.im](https://gitter.im/bulletin-board-de/Lobby)

# License

MIT licensed

Copyright (c) 2016 Tamio Patrick Honma, <http://honma.de>
