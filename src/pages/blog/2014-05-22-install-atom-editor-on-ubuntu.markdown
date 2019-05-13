---
templateKey: blog-post
title: "Install Atom editor on Ubuntu"
date: 2014-05-22 22:42
comments: true
tags: 
    - editor 
    - ubuntu
---

### Initial opinion

Looks pretty; well looks almost like sublime, behaves like it as well. On the negative
side, it takes time for cold startup. Might not be a big deal for everyone, but
that's how it is. It since it's based on Google Chrome/V8(whatever) it might not
be any competition to text editors like Vim or Emacs when it comes to handling
large files.

![Atom io screen shot](/assets/images/blog/atom-io-screen-shot.png)

<!-- more -->

## Installation instruction

Instruction to install [Atom](https://atom.io/) editor is available on
[github repo](https://github.com/atom/atom/blob/master/docs/build-instructions/linux.md)

Its quite likely that if you follow the steps given on Github repo it could be a
cakewalk but I was stuck with nvm issue. It requires `sudo` to build the package. I run node
using nvm, so I had to include nvm in path.

So the extra step required was to run(system should have Python installed)

    sudo apt-get install libgnome-keyring-dev

    sudo su
    source /home/USERNAME/.nvm/nvm.sh

Complete build steps

    git clone https://github.com/atom/atom
    cd atom
    script/build # Creates application at $TMPDIR/atom-build/Atom
    sudo su
    source /home/USERNAME/.nvm/nvm.sh
    sudo script/grunt install # Installs command to /usr/local/bin/atom
    sudo script/grunt mkdeb # Generates a .deb package at $TMPDIR/atom-build

HTH somebody who is trying to get Atom editor running on Ubuntu. I suppose
same steps should work just fine on Debian as well.
