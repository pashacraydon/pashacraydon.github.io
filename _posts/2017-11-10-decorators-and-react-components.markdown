---
layout: post
title:  "Decorators and React Components"
date:   2017-11-09 13:15:34 -0700
category: article
---

Decorators are a syntax for calling higher order functions. Typically, a decorator is just a function which takes another function and extends the latters behavior. We can use decorators to reduce boilerplate by easily adding reusable behaviors to React components.

<!-- more -->
<span id="resume"></span>

Decorators are available using the ES7 syntax so you need an npm plugin such as the [`babel-plugin-transform-decorators-legacy`](https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy) to transpile it.

The following is a very simple example of simply outputting the decoratored components props to the console so we get an idea of how this can work.

{% highlight javascript %}
  import React, { Component } from 'react';

  function debugDecorator() {
    return DecoratedClass => class extends Component {
      render() {
        console.log(this.props);
        return <DecoratedClass {...this.props} />;
      }
    };
  }

  @debugDecorator()
  export default class Car extends Component {
    render() {
      return (
        <div>
          <h2>This is a car. Zoom.</h2>
        </div>
      );
    }
  }
{% endhighlight %}

Every instance of `<Car />` will now output its props to the console.

### Arguments

Taking this example further, we can pass arguments to the decorator. In this example, the decorator accepts a callback function which we use to pass in the function `warn` which simply outputs the components props via `console.warn`.

{% highlight javascript %}
  import React, { Component } from 'react';

  function debugDecorator(callback) {
    return DecoratedClass => class extends Component {
      render() {
        callback(this.props);
        return <DecoratedClass {...this.props} />;
      }
    };
  }

  const warn = (props) => console.warn(props);

  @debugDecorator(warn)
  export default class Car extends Component {
    render() {
      return (
        <div>
          <h2>This is a car. Zoom.</h2>
        </div>
      );
    }
  }
{% endhighlight %}


