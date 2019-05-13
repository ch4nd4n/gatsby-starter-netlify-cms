---
templateKey: blog-post
title: "Using Omniauth with Sinatra"
date: 2013-01-07 19:30
comments: true
tags: 
    - ruby
    - sinatra
---

A brief note and tutorial about OmniAuth Identity. How to use it in conjunction with Sinatra. With no to minor
modifications you can use it with Padrino as well.

This [Railcast](http://railscasts.com/episodes/304-omniauth-identity?view=comments) on Omniauth helped to understand
most of it.

I would like to highlight the major bits of source here, although, you can clone [working App](https://github.com/ch4nd4n/sinatra_omniauth_demo) and tailor it to your fit. The sample app uses sqlite for storage.

The important bits of it are `User` model, `Authentication` class and auth callback in the controller. Create user model that extends `OmniAuth::Identity::Models::ActiveRecord`

Authentication model for User class should look like

Finally the sinatra app definition which defines basic role based auth.
