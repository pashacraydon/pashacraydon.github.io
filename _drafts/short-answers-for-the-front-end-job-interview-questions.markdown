---
layout: post
title:  "Short answers for the javaScript front-end job interview questions"
date:   2016-08-06 13:15:34 -0700
categories: jekyll update
---
There is a list of front-end job interview [questions](https://github.com/h5bp/Front-end-Developer-Interview-Questions) circling around the internet. In this post I will try to give short and concise answers the javaScript questions as best I can.

# Explain event delegation

The Document Object Model (a.k.a the DOM) is a hierarchy of node objects best expressed as a tree. When an event is fired on a node in this tree, it is first fired on the window Object and travels down this tree firing it's event on every node along the way. This is known as the 'capturing' phase of an event. 

When it reaches the target event, it fires again and then propagates back up the tree firing again on every node along the way. This is known as the 'bubbling' phase.

*Event delegation* means taking advantage of the flow of an event in javaScript.

A good example of this is attaching a ```click``` listener to the ```<body>``` element to listen for click events that occur outside a dropdown menu that is open in order to close it.

{% highlight javascript %}
  $('body').on('click', function (event) {
    if ($(event.target).closest('.js-my-dropdown-menu').length) {
      return;
    }

    $('.js-my-dropdown-menu').hide();
  }
  });
{% endhighlight %}

Because of the event flow, we can listen to any click events that occur on HTML elements inside ```<body>```. In this code snippet we use jQuery to detect if the target event occurred inside our make-believe dropdown menu. If it did, do nothing, otherwise hide our menu.

A side effect of event delegation is that it can work on DOM nodes added to the tree after an event has been assigned. This makes event delegation very useful for instances where you use AJAX to update the DOM.

# Explain how ```this``` works in JavaScript

In object-oriented javaScript, the ```this``` keyword is a way of referencing the object that we are working with. The scope in which an object operates is known as the *context* and is determined by how an object is called.

When an object is not provided a context, it defaults to the most global thing it can find, which is the window object. In the following example, the dog function operates within the window *context* because it is not provided anything else, so ```this``` points to window.

{% highlight javascript %}
  window.bark = 'woof!';
  function dog () {
    console.log(this.bark);
  }

  dog(); // outputs 'woof!'
{% endhighlight %}


In the following example, the dog function is provided the *context* o

{% highlight javascript %}
  var pet = {
    bark: 'Woof!',
    dog: function () {
      console.log(this.bark);
      }
    }

  pet.dog(); // outputs 'woof!'
{% endhighlight %}

The ```this``` keyword points to the objects within pet.

In javaScript, the *ownership* of an object is known as the *context*. It can get a bit tricky because this *context* can be changed.


{::options parse_block_html="true" /}
<div class="header-hero">
![Banner](/css/images/black-and-white-bridge-wooden.jpg)
<div class="inner"></div>
</div>