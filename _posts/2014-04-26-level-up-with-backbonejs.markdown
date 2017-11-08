---
layout: post
title:  "Leveling up with backbone.js"
date:   2014-04-15 13:15:34 -0700
category: article
---


(This post originally appeared on [blog.safaribooksonline.com](https://www.safaribooksonline.com/blog/2014/11/09/level-backbone-js-javascript/)). 

At [Safari](http://www.safaribooksonline.com/), we like Backbone.js for designing our front-end interactions, including our reading interface. I’m going to shed light on the concepts that I feel are crucial to working with Backbone, if you’re a beginner to it or similar MVC JS frameworks. If you already know a lot of Backbone, this post probably isn’t for you.

<!-- more -->
<span id="resume"></span>

### Models

Models are the heart of a Backbone project. They are a good place to start when beginning a project.

A model will contain the core data of an application and is often a representationa of a backend database model.

If you have ever written any JavaScript for an API without using an “MVC framework” you may be familiar with writing ajax functions and deferred callbacks. Backbone Models abstract this process and allow you to interact with your server much more simply.

{% highlight javascript %}
  Cat = Backbone.Model.extend({
     defaults: {
        name: "Zeus",
        age: 3,
        color: "grey"
    },
    // called immediately when new Cat instance is created
    initialize: function () {
        this.on("change", function () {
              console.log(this.get("name"));
        });
    },
    url: "/update/api/"
  });

  var cat1 = new Cat();
{% endhighlight %}

### Get() and set()

You can use `Model.set()` and `Model.get()` to update and get model attributes before you send them to your server. Model.set() will set a hash change on the model and fire a change event; we’ve set a listener for that event in the initialize function.

{% highlight javascript %}
   // change the model name to ‘Xena’ and logs Xena from change listener
  cat1.set({name: "Xena"});
{% endhighlight %}

`Model.get()` allows quick access to model attributes.

{% highlight javascript %}
  console.log(cat1.get("name")); // Xena
{% endhighlight %}

Use JSON.stringify to read all the attributes of a model.

{% highlight javascript %}
  console.log(JSON.stringify(cat1));
  // logs { name: "Xena", age: 3, color: "grey" }
{% endhighlight %}

# Save()

Sending your model to your server is done with `Model.save()`. This will delegate Backbone.sync and perform ajax using the URL we specified in the model.

{% highlight javascript %}
  cat1.save({age: 5});
  // sends a POST request to "/update/api/"" with the data
  // { name: "Xena", age: 5, color: "grey" }
{% endhighlight %}

The attributes parameter is a hash value of the model attributes you want to send. Save options can include {patch:true} to send an HTTP PATCH request; this will modify only the attributes you’re passing in.

Calling `save()` will immediately trigger a change event and update the model attributes. To avoid this, pass {wait: true} into options to wait for the server before setting the new attributes on your model. You can also pass into the options success and error handlers, or include them in your save function.

{% highlight javascript %}
 save: function (attrs, options) {
    options.success = function (response, status, xhr) {
       // successful things here
    };
    options.error = function (error) {
      // bad things here
    };
 };
{% endhighlight %}

`Model.validate()` is called before `Model.save()` and allows you to prevent updates if your data is invalid.

Any error that is returned in `validate()` will cause the save to abort. For example, adding this function to our Cat Model will fail because it fails to pass validation:

{% highlight javascript %}
 // passes save hash attributes and options
 validate: function (attrs, options) {
   if (attrs.name !== "Zeus") {
     return "my cat is a God";
   }
 };

 cat1.save({name: "Xena"});
 // fails because name isn’t Zeus
{% endhighlight %}

### Override Backbone.sync

Sometimes you may want to customize how you update your API. You can override Backbone.sync globally (`Backbone.sync = function(method, model) … `) or simply attach a `sync()` function to your model.

{% highlight javascript %}
  // @param method is create, update, patch, delete or read
  // @param model is the Backbone model object
  // @param options may include success or error methods
  sync: function (method, model, options) {
    if (method === "create") {
      localStorage.setItem(model.id, JSON.stringify(model));
    }
  }
{% endhighlight %}

It’s helpful to understand how Backbone.sync maps its method handlers:

{% highlight javascript %}
  var methods = {
    "create": "POST",
    "update": "PUT",
    "patch": "PATCH",
    "delete": "DELETE",
    "read": "GET"
  };
{% endhighlight %}

Now on `save()` POSTs, you will simply store your model in localStorage.

# Events

Sometimes you need to run some code when something in particular happens elsewhere deep inside your code.

Backbone has a great publish/subscribe concept in its Events system. You can map any custom events to your handlers (Backbone recommends namespacing them) and trigger them multiple times, anywhere, by extending Backbone.Events:

{% highlight javascript %}
  var myObject = {};
  _.extend(myObject, Backbone.Events);

  myObject.on("cat:sneeze", sneezing);
  myObject.on("cat:purr", purring);

  function sneezing (msg) { console.log("My cat " + msg); }
  function purring (msg) { console.log("My cat is " + msg); }

  // elsewhere in you’re code …
  myObject.trigger("cat:sneeze", "sneezed"); // function sneezing() logs “My cat sneezed”
  myObject.trigger("cat:purr", "purring"); // function purring() logs “My cat is purring”

  // remove all cat:sneeze events
  myObject.off("cat:sneeze");

  // remove just the specific listener
  myObject.off("cat:sneeze", sneezing);
{% endhighlight %}

On perhaps a simpler note, Backbone.Events is available globally in the Backbone object. So you can just as easily do,

{% highlight javascript %}
  Backbone.on("cat:sneeze", function (msg) {
   console.log("My cat " + msg);
  });

  Backbone.trigger("cat:sneeze", "sneezed");
{% endhighlight %}

# Views

Backbone.Views should handle the layer of logic between your models and the UI. Updates can happen automatically when your model changes. You can easily render JavaScript logic in HTML templates and trigger jQuery events and methods for DOM manipulation in much simpler terms.

{% highlight javascript %}
  var Dog = Backbone.View.extend({
   el: "#dog-bone",

   template: _.template("A template"),

   events: {
     "click .my-button": "onClickHandler"
   },

   initialize: {
     this.$my_dog_bone = this.$el.find("#my-dog-bone"); 
     this.model.bind("change", _.bind(this.render, this));
   },

   render: function () {
     this.$el.html(this.template(this.model.toJSON()));
   },

   onClickHandler: function (event) {
     event.preventDefault();
     console.log(this.model.attributes);
   }

  });

 var dog1 = new Dog({ model: cat1 });
{% endhighlight %}

The view attaches to #dog-bone in the HTML and creates a reference in the view with this.$el. From there it is often a good idea to ‘cache’ all the jQuery references in variables for later use:

{% highlight javascript %}
  this.$my_dog_bone = this.$el.find("#my-dog-bone");
{% endhighlight %}

By storing `$my_done_bone` as a variable, I no longer have to traverse the DOM every time I want to do something with $(‘#my-dog-bone’).

`View#events: {}` allows us to map jQuery-like events to our handlers. In this case, clicking .my-button simply logs our model attributes.

`View#initialize()` is run right when the object is created. Inside it, we listen for changes on the model which invoke render. Render passes in our model to the javaScript template which attaches its HTML to #dog-bone (this.$el).

`View#template` is a reference to an Underscore JS template to which we can add JS variables.

We can now update our UI simply changing some attributes on our cat1 model:

{% highlight javascript %}
  cat1.set({color: "purple"});
{% endhighlight %}

# Underscore templates

You can actually use other javaScript templating frameworks, Backbone requires Underscore as a dependency so we use it here. Pretty much it just contains the html you want and the model attributes as javaScript variables.

{% highlight html %}
  <script type="text/template" id="my-template"> 
   <h1> This dog / cat hybrid thing is <%= color => color.</h1>
   <h2> It is age <%= age %> </h1>
   <h3> Also, it's name is <%= name %> </h3>
  </script>
{% endhighlight %}

Underscore templates accept hash objects which is why our model works so well here. But you can also create you’re own hash object and pass it too it,

{% highlight javascript %}
  var objectForMyTemplate = {
   "name": "Xena",
   "color": "grey",
   "age": 3
  };
{% endhighlight %}

# It’s all just javaScript

I often find that I need to use a Backbone View or Model I created elsewhere in my code but I need to change a few of the methods without changing the original code.

This is where JavaScript prototypical inheritance comes in really handy, as do the JS call() and apply() functions.

In Backbone, when you create a new view or model with extend, you’re defining the prototype for the new object.

This is the JavaScript way of “inheriting” properties that will go into your object and makes it easy to extend your own models and views.

{% highlight javascript %}
  var oldInitialize = Dog.prototype.initialize;

  Dog.prototype.initialize = function () {
    console.log("Woof woof");
    oldInitialize.call(this);
  };

  new Dog({model: cat1});
{% endhighlight %}

Our new Dog instances will now log ‘Woof woof’ as well as do everything it does in the original View code.

There is more to working with Backbone including Routers, Collections, helpful Underscore functions, organizing Backbone with require.js, testing with Qunit or Jasmine. For that and much I recommend Developing Backbone.js Application.
