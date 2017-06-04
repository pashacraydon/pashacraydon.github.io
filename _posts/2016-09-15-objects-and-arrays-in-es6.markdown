---
layout: post
title:  "Objects and Arrays in ES6"
date:   2016-09-15 13:15:34 -0700
category: article
---

ES6 has some new tools for dealing with objects and arrays. These include destructuring assignment, enhanced object literals and the spread operator. 

# Destructuring Assignment

### Object destructuring

Object destructuring allows us to pull in specific attributes from an object and scope it locally. Consider the following cat object (also known as an *object literal*).

{% highlight javascript %}
  var cat = {
    color: "grey",
    gender: "female",
    age: 2
  }
{% endhighlight %}

We can pull out attributes and create local variables out of them. These variables can be changed without changing the original `cat` object.

{% highlight javascript %}
  var { color, gender } = cat
  color = "black"
  gender = "male"

  console.log(color) // "black"
  console.log(gender) // "male"

  console.log(cat.color) // "grey"
  console.log(cat.gender) // "female"
{% endhighlight %}

Just as object literals allow us to create multiple properties at once, we can destructure them, by extracting multiple properties at once. This is considered an *object pattern*.

{% highlight js %}
  const { color: c, gender: g, age: a } = cat

  console.log(c) // "grey"
  console.log(g) // "female"
  console.log(a) // 2
{% endhighlight %}

This is the same thing as doing the following in ES5.

{% highlight javascript %}
  var c = cat.color
  var g = cat.gender
  var a = cat.age
{% endhighlight %}

We can also destructure objects that are arguments in functions. Consider the following function that logs the cats gender.

{% highlight javascript %}
  var getColorOfCat = ({color}) => {
    console.log(`The color is ${color}.`)
  }
{% endhighlight %}

This is the same thing as doing the following;

{% highlight javascript %}
  var getColorOfCat = cat => {
    console.log(`The color is ${cat.color}.`)
  }
{% endhighlight %}

Instead of using dot notation to access the color of the cat object literal within the function, we can destructure the cat object and pull out it's color attribute.

This is a more declarative approach because we signal that we are only using the color attribute from the cat object.

### Array destructuring

In ES6 we can pull out values from arrays and scope them to local variables. 

{% highlight javascript %}
  const [firstAnimal] = ["cat", "dog", "lion", "horse"]
  console.log(firstAnimal) // "cat"
{% endhighlight %}

You can pass over values in arrays using commas to get to specific indexes.

{% highlight javascript %}
  const [,,thirdAnimal,] = ["cat", "dog", "lion", "horse"]
  console.log(firstAnimal) // "lion"
{% endhighlight %}

You can get all the remaining elements of an array using the rest operator. This operator looks like the spread operator in ES6 (...) except it is used inside function calls and arrays.

{% highlight javascript %}
  const [firstAnimal,, ...remaining] = ["cat", "dog", "lion", "horse"]
  console.log(firstAnimal, ...remaining) // "cat", ["lion", "horse"]
{% endhighlight %}

You can use array destructuring to swap values in variables. 

{% highlight javascript %}
  var pet1 = "cat", pet2 = "dog"
  [pet1, pet2] = [pet2, pet1]
  console.log(pet1, pet2) // "dog", "cat"
{% endhighlight %}

This is the same as the following in ES5.

{% highlight javascript %}
  var pet1 = "cat",
      pet2 = "dog"

  var pets = [pet2, pet1]

  pet1 = pets[0]
  pet2 = pets[1]
{% endhighlight %}

# Enhanced Object Literals

Object literal enhancement allows us to create objects from variables that are in scope. 

{% highlight javascript %}
  var color = "grey"
  var age = 2

  var cat = { color, age }

  console.log(cat); // { color: "grey", age: 2 }
{% endhighlight %}

`color` and `age` are now attributes in the new cat object. Object literal enhancement can also include functions.

{% highlight javascript %}
  var color = "grey"
  var age = 2
  var getAttributes = function () {
    console.log(`Color is: ${this.color}, age is: ${this.age}`)
  }

  var cat = { color, age, getAttributes };
  cat.getAttributes(); // Color is: grey, age is: 2
{% endhighlight %}

We can write a shorthand version of this without the function operator.

{% highlight javascript %}
  var color = "grey"
  var age = 2
  var getAttributes() {
    console.log(`Color is: ${this.color}, age is: ${this.age}`)
  }
{% endhighlight %}

We can write shorthand for objects whose properties are initialised by variables of the same name.

{% highlight javascript %}
  var cat = {
    color,
    age,
    getAttributes() {
      console.log(`Color is: ${this.color}, age is: ${this.age}`)
    }
  }
{% endhighlight %}

This is the same as writing the following in ES5.

{% highlight javascript %}
  var cat = {
    color: color,
    age: age,
    getAttributes: function getAttributes() {
      console.log("Color is: " + this.color + ", age is: " + this.age)
    }
  };
{% endhighlight %}

This could be quite handy in functions or modules that export objects.

{% highlight javascript %}
  var cat = (age, gender) => age({age, gender})
{% endhighlight %}

This is the same as writing the following in ES5.

{% highlight javascript %}
  var cat = function cat(age, gender) {
    return { age: age, gender: gender }
  };
{% endhighlight %}

# Spread Operator

The spread operator is three dots (...) and allows us to do powerful new things with arrays. 

### Copy

We can copy arrays.

{% highlight javascript %}
  var animals = ["cat", "dog", "lion"]
  var animalsCopy = [...animals]
{% endhighlight %}

The array copy ```animalsCopy``` is separate from the ```animals``` array and is unaffected by changes to ```animalsCopy```.

{% highlight javascript %}
  animalsCopy.push("zebra");
  console.log(animals) // ["cat", "dog", "lion"]
  console.log(animalsCopy) // ["cat", "dog", "lion", "zebra"]
{% endhighlight %}

This is a great way to deal with immutable data that uses arrays.

### Function arguments

The spread operator can be used in functions to collect arguments as an array. Consider this use of ```appply```.

{% highlight javascript %}
  function animals(x, y, z) { }
  var args = ["cat", "dog", "lion"]
  animals.apply(null, args)
{% endhighlight %}

This can be called in ES6 using the spread operator like this;

{% highlight javascript %}
  animals.apply(...args)
{% endhighlight %}

Inversely, we can create a function that accepts ```n``` number of arguments as an array then uses the spread operator to operate on them.

{% highlight javascript %}
  function animals(...args) {
    var [firstAnimal, ...remaining] = args
    console.log(firstAnimal)
    console.log(remaining.reverse())
  }

  animals("cat", "dog", "zebra"); // "cat" // ["zebra", "dog"]
{% endhighlight %}


-

I highly recommend using the [Babel Repl](https://babeljs.io/repl/) to play around with ES6 code.





