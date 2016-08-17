---
layout: post
title:  "Build a simple React with Redux app"
date:   2016-08-15 13:15:34 -0700
categories: jekyll update
---
I built a simple React + Redux app as a demonstration to help my company transition from using Marionette + Backbone to React + Redux. In this post I will go over how it's built and what to be aware of if you are coming from a Backbone or jQuery mindset.

# React Books

React Books is my app. It simply fetches metadata from the Google Books API which you do searches against. It is on Github here [Github](https://github.com/pashasc/react_books) and it can be demo'd here [Demo](https://pashasc.github.io/react_books/).

![React Books](/css/images/react_books.png)

# Whats different about React

### You update the UI by updating the state

Using jQuery you might write some code like this to show or hide an element.

{% highlight javascript %}
  $('.element').on('click', function (event) {
    event.preventDefault();
    var $dropdown = $(this).closest('.my-dropdown');

    if ($dropdown.is(':visible')) {
      $dropdown.hide();
    }
    else {
      $dropdown.show();
    }
  });
{% endhighlight %}

In React the parts of your interface are broken up into components. A component returns the html it should show based on it's state. 

Simply changing the state of a component will cause it to re-render and show the new state, completely handled by React, with no action on your part. 

So the above familiar bit of jQuery might look like this in React.

{% highlight javascript %}
  import React, { Component } from 'react';

  export default class MyDropDown extends Component {
    constructor () {
      super();

      this.state = {
        'is_hidden': true
      }

      this.showDropdown = this.showDropdown.bind(this);
      this.hideDropdown = this.hideDropdown.bind(this);
    }

    showDropdown (event) {
      this.setState({ 'is_hidden': false });
    }

    hideDropdown (event) {
      this.setState({ 'is_hidden': true });
    }

    render () {
      return (
        {!this.state.is_hidden &&
        <div className="my-dropdown">
          <div>Dropdown text</div>
          <a href="#"
            onClick={this.hideDropdown}>
          Hide Dropdown
          </a>
        </div>}
        {this.state.is_hidden &&
        <a href="#"
          onClick={this.showDropdown}>
        Show Dropdown
        </a>}
      )
    }
  }
{% endhighlight %}

Quick note: I use ES6 in this app and compile it with webpack. If you are unfamiliar with ES6 I recommend this [resource](https://github.com/lukehoban/es6features).

The above React component returns ```jsx```. This is a javaScript syntax that can contain html and also React components. Some of the conditionals may look new too. 

A shorthand ```if``` condition in jsx is to write ```{my_true_or_false_boolean_value && <div className="the-html-i-want-show-if-boolean-is-true">Example</div>}```.

# The Router

Let's dive into the app. This story begins in the router. The router will handle changes to your app based on the url which you can provide links to in your app. It will also maintain the browser history and not break the browsers back button (which is a bad thing to do).

If you are displaying pages of content, it is best to use routes so that people can create links to your content.

In this app I use the ```react-router``` which is an npm package. This router is pretty simple.

{% highlight javascript %}
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer} >
      <Route path="page/:page/:query/:index" component={AppContainer} />
    </Route>
  </Router>
{% endhighlight %}



{::options parse_block_html="true" /}
<div class="header-hero">
![Banner](/css/images/black-and-white-bridge-wooden.jpg)
<div class="inner"></div>
</div>