---
templateKey: blog-post
title: "Learning Twitter Bootstrap and Less CSS"
date: 2012-09-06 17:28
comments: true
tags: 
    - bootstrap 
    - lesscss
---
### Introduction

This article is reference to self, but I hope it may help others who want to dive in to
[Twitter Bootstrap](http://twitter.github.com/bootstrap/) and [LESS](http://lesscss.org/).
I did not want to write everything from scratch, so, I forked [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
and host the changes to [forked repository](https://github.com/ch4nd4n/bootstrap/)

#### What is Twitter Bootstrap
Sleek, intuitive, and powerful front-end framework for faster and easier web development.
<!-- more -->

#### What is Less CSS
LESS extends CSS with dynamic behavior such as variables, mixins, operations and functions. LESS runs on both the client-side (Chrome, Safari, Firefox) and server-side, with Node.js and Rhino.

#### What does customization look like.
This site is live example of modified Twitter Bootstrap. Another sample page is at [http://ch4nd4n.github.com/docs/customized-template.html](http://ch4nd4n.github.com/docs/customized-template.html). As mentioned forked source is [Twitter Bootstrap](http://twitter.github.com/bootstrap/)

### Get going

[Extending Twitter Bootstrap](http://twitter.github.com/bootstrap/extend.html) has documentation
about dependency to install before you get started. You could either clone Twitter Bootstrap on
github or fork and make your
changes. Forking Git repository has advantage, you maintain versions of your changes. In future
if you make any change that is worth to be shared you send a pull request to Twitter
Bootstrap repo.

_cloning bootstrap_ `git clone`

npm(node package manager) should be installed.

`make` will build the stuff for you.

To quickly compile changes to CSS you would issue command something like

    lessc less/bootstrap.less > DESTINATION/bootstrap.css

append `--compress` to minify the file.

Some of the primary files that I have customized

* [widget.less](https://github.com/ch4nd4n/bootstrap/blob/master/less/widget.less) - this
is the primary less file that contains the crux of the widget CSS.
* [overrides.less](https://github.com/ch4nd4n/bootstrap/blob/master/less/overrides.less) - Overrides the
default values of twitter bootstrap. For example `body` tag
* [bootstrap.less](https://github.com/ch4nd4n/bootstrap/blob/master/less/bootstrap.less) -
include `widget.less` and `override.less` in to this file


#### Work in progress
You could hack around above three files to get an understanding of how things
work. Will update this page soon.