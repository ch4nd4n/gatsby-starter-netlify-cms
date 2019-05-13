---
templateKey: blog-post
title: "Moneta session store on Heroku"
date: 2014-03-24 03:49
comments: true
tags: 
  - ruby 
  - heroku 
  - redis
---

Snippet to use Redis as session store on Heroku with Moneta Gem. I have no idea why I did not had tried it out before, but looks pretty neat. Please leave a comment in case you have any opinion about the Gem itself.

Somewhere in config

{% highlight ruby %}
    # Set session store
    if(ENV["RACK_ENV"] == 'development')
      # use localhost for development
      use Rack::Session::Moneta, store: :Redis
    elsif(ENV["RACK_ENV"] == 'production')
      url = ENV["REDISTOGO_URL"]
      uri = URI.parse url
      use Rack::Session::Moneta, store: Moneta.new(:Redis, host: uri.host, port: uri.port, password: uri.password)
    end
{% endhighlight %}


I had to post this as I wasted 3 hours trying to figure out how to get it working. BTW I got that sample config in  Padrino app.rb and it works just <fine class=""></fine>