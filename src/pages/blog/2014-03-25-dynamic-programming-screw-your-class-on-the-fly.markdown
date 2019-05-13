---
templateKey: blog-post
title: "Dynamic Programming: Screw your class on the fly"
date: 2014-03-25 05:01
comments: true
tags: 
  - programming 
  - ruby
---

I spent about an hour trying to figure out why Sinatra app was spinning off the track. Basically after the update call(`put`), Region model started to misbehave.

Active Resource
{% highlight ruby %}
    class Region <  ActiveResource::Base

    end
{% endhighlight %}

Sinatra Controller
{% highlight ruby %}
    get :list do
      content_type :json
      Region.find(:all, :params => params).to_json
    end

    put :update do
      obj = JSON.parse request.body.read
      Region = Region.find(params[:id])
      Region.update_attributes(obj).to_json
    end
{% endhighlight %}

 Do you see any problem in above code?


Well the problem lies with `Region = Region.find(params[:id])`. I redefined the class inadvertently. Yes, you can do that. Java fanboys I am not lying. Try Ruby, and welcome to   the hell!