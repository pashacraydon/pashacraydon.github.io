---
layout: post
title:  "Mixing Backbone Events"
date:   2014-05-18 13:15:34 -0700
category: article
---

Backbone allows you to mix your own custom events to bind and trigger. 

Example in a require module.

{% highlight javascript %}
  define(function (require) {
    var Backbone = require('backbone'),
      _ = require('underscore'),
      proxy = {};

     _.extend(proxy, Backbone.Events);

    return proxy;
  });
{% endhighlight %}

<!-- more -->

Somewhere else you can include this and start creating your own triggers.

{% highlight javascript %}
  define(function (require) {
    var Backbone = require('backbone'),
      proxy = require('js/proxy');

      myfunction = function (msg) {
         console.log(msg);
      };

     proxy.on('myevent', myfunction);
     ...
     proxy.trigger('myevent', 'Lets do some nice stuff');
  });
{% endhighlight %}

When myevent is triggered it will pass in ‘Lets do some nice stuff’ to myfunction and output it to the console.

Backbone allows you to pass single and multiple events.

{% highlight javascript %}
  proxy.on('my_first_event', myfunction);
  proxy.on('my_second_event', myfunction);
  proxy.on('my_third_event', myfunction);
{% endhighlight %}

Trigger a single event.

{% highlight javascript %}
  proxy.trigger('my_second_event', 'Say some nice stuff');
{% endhighlight %}

Trigger multiple events.

{% highlight javascript %}
  proxy.trigger('my_first_event my_second_event my_third_event', 'say this three different times');
{% endhighlight %}

You can pass multiple arguments to a single event.

{% highlight javascript %}
  myfunction = function (do, stuff) {
      console.log('I want to ' + do + ' some ' + stuff);
  };

  proxy.trigger('my_first_event', 'eat', 'candy');
{% endhighlight %}

You can pass multiple arguments to multiple events.

{% highlight javascript %}
  proxy.trigger('my_first_event my_second_event', 'chow', 'food');
{% endhighlight %}

There is a catchall where you can listen to all events.

{% highlight javascript %}
  proxy.on("all", function(event) {
      console.log("The event was " + event);
   });
{% endhighlight %}

You can also turn off events.

{% highlight javascript %}
  proxy.off("my_first_event");
{% endhighlight %}

# Delegate events

Backbone Views allow you to bind events easily,

{% highlight javascript %}
  events: {
    'click #clickelement': 'clickedFunction'
  },
{% endhighlight %}

Behind the scenes is delegateEvents. So maybe you wanted to make two different types of events, you could do so like this;

{% highlight javascript %}
  var View = Backbone.View.extend({
     el: '#somehtml',

     clickEvents: {
        'click #clickelement': 'clickedFunction'
     },

     keyEvents: {
        'keyup #keyelement': 'keyedFunction'
     },

     initialize: {
       var navEvents = _.extend(this.clickEvents, this.keyEvents);
       this.delegateEvents(navEvents);
     }
  });
{% endhighlight %}
