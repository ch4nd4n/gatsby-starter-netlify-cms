---
templateKey: blog-post
title: "Static IP on Ubuntu"
date: 2012-11-07 17:22
comments: true
tags: 
    - ubuntu 
    - network 
    - linux
---
I tried these steps on Ubuntu 12.04. It may differ for other Linux versions.

### Introduction
Sometimes you may want to setup OS instances with static ip. Doing this on Ubuntu is quite simple.
Static IP implies that IP address of the machine does not change. Everytime you bootup you have
same IP address associated. When you assign static IP to any machine, make sure that you select an
IP that is not assigned to any other machine. You may run in to network issues if two machines have
same IP address.

<!-- more -->
### How you do this on Ubuntu?
*Before you start making these changes make sure that you take a backup of your existing config*
For example

`cp /etc/network/interfaces ~/interfaces.bak`

Copy interfaces file to your home folder.

You would need to modify `/etc/network/interfaces` file, after setting up static ip
it would look something like below after changes

    # This file describes the network interfaces available on your system
    # and how to activate them. For more information, see interfaces(5).
    # The loopback network interface
    auto lo
    iface lo inet loopback
    # The primary network interface
    iface eth0 inet static
      address 192.168.1.151
      netmask 255.255.255.0
      gateway 192.168.1.1

Here it is assumed that you are on a network in range of `192.168.1.xxxx` and you are setting
static ip of `192.168.1.151`. You can use whatever value fits your need

Once you are done making changes restart network.

    sudo /etc/init.d/networking restart

Verify this using `ifconfig`. IP address should be what you have assigned in the interfaces file.
If it is not the case, check for typos.

At this point of time you may not be able to connect to any server out of your network. You can verify
this by pinging. For example

    ping google.com

Most probably `/etc/resolve.conf` file may not have nameserver verify this by

    sudo cat /etc/resolv.conf

To fix this on Ubuntu 12.04 you would need to modify `/etc/resolvconf/resolv.conf.d/base`
and add name server entry

    nameserver 8.8.8.8

You can replace `8.8.8.8` with nameserver address of your choice.

[More info](http://www.stgraber.org/2012/02/24/dns-in-ubuntu-12-04/) on setting up name server.
