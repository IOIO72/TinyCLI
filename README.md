# ioioPen - A lightweight starter for Gulp, Bower, Jade, PostCSS with SCSS, jQuery and BrowerSync

I love to use [CodePen](http://codepen.io/) to start experimenting seamlessly from a first inspiration to soon visible
results.

Sometimes these experiments are seeds for larger projects, which require a version control system and some other stuff,
which CodePen doesn't provide.

That's the reason why I set up this boilerplate code, which I call **ioioPen** in derivation of the name _CodePen_ and
my alias name _IOIO_.

My default setup on CodePen is [Jade](http://jade-lang.com/), [SASS](http://sass-lang.com/) and
[jQuery](http://jquery.com/).

**ioioPen** uses this setup and configures the fantastic [BrowserSync](http://www.browsersync.io/) to get a similar
development experience to CodePen. I also added an auto prefixer for CSS, source maps and code checkers for CSS, HTML
and JavaScript.

It is based on the JavaScript runtime [Node.js](https://nodejs.org/), the task automation system
[Gulp.js](http://gulpjs.com/) and the package manager [Bower](http://bower.io/) to get jQuery.

# Setup

1. Check build status: [![Build Status](https://travis-ci.org/IOIO72/ioioPen.svg)](https://travis-ci.org/IOIO72/ioioPen)
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
