# ioioPen - A starter project with Gulp, Bower, Jade, SCSS via PostCSS, jQuery and BrowerSync

I love to use [CodePen](http://codepen.io/) with my default setup [Jade](http://jade-lang.com/),
[SCSS](http://sass-lang.com/) and [jQuery](http://jquery.com/) to start experimenting seamlessly from a first
inspiration to soon visible results.

Sometimes these experiments are seeds for larger projects, which require a version control system and some other stuff,
which CodePen doesn't provide.

That's the reason why I set up this starter project template, which I call **ioioPen** in derivation of the name
_CodePen_ and my alias name _IOIO_.

Just setup this project and copy your CodePen sources _(Jade, SCSS, jQuery JS)_ to it for further development.

## Configured modules

**ioioPen** uses this setup of the following modules.

### Language modules

* [Jade](http://jade-lang.com/) preprocessor to generate HTML.
* [jQuery](http://jquery.com/) library for simplified writing of JavaScripts.
* [PostCSS](https://github.com/postcss/postcss) with [PreCSS](https://jonathantneal.github.io/precss/) to offer
  [SCSS](http://sass-lang.com/)-like syntax.

### Development environment modules

* [BrowserSync](http://www.browsersync.io/) to get a similar development experience to CodePen.
* [Node.js](https://nodejs.org/) for running JavaScript.
* [Gulp.js](http://gulpjs.com/) for task automation.
* [Bower](http://bower.io/) to download packages from the web, like jQuery.

### Extending

The setup is focused on the CodePen setup, I described in the introduction. It's intentionally just configured to
migrate your CodePen project to your local development environment in a fast and easy way.

**But** it can be extended very easily for your project's proposes. Everything is prepared for extension:

* **PostCSS** is a modular system for CSS that can be configured to nearly everything you like very easily. A very hot
  candidate you should take a look at is [cssnext](http://cssnext.io/).
* You can control everything you would usually download manually with **Bower** to keep track of updates and save the
  package references. _ioioPen_ currently just uses the _jQuery_ package. Take a look at
  [bowers search](http://bower.io/search/) to search for things like _modernizr_, _angular_, _bootstrap_, etc.
* And of course you can use **npm** and **Gulp** to [add modules](http://gulpjs.com/plugins/).

**Why are two package managers in this template?**

_Bower_ should be used for client side assets like _JavaScripts_ because _bower_ allows only one version of a package,
which is good for client side JavaScripts. So you can't add two different versions of jQuery into the same web page,
for example.

_npm_ should be used for everything else, especially for processing modules like _gulp_ modules.

# Setup

1. Check the build status: [![Build Status](https://travis-ci.org/IOIO72/ioioPen.svg)](https://travis-ci.org/IOIO72/ioioPen)
1. If you didn't before, install [Node.js](https://nodejs.org/)
1. If you didn't before, install [Gulp.js](http://gulpjs.com/) `npm install --global gulp`
1. If you didn't before, install [Bower](http://bower.io/) `npm install -g bower`
1. Enter `git clone https://github.com/IOIO72/ioioPen.git yourProjectsName`
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

# Get in touch

You can chat with me about this and other projects of me on Slack.

[Join my Slack-Chat](https://tamiohonma.typeform.com/to/z1YOoo)

# License

MIT licensed

Copyright (c) 2015 Tamio Patrick Honma, <http://honma.de>
