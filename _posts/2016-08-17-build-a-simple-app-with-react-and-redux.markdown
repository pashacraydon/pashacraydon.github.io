---
layout: post
title:  "Build a simple app with React and Redux"
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
        <div>
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
        </div>
      )
    }
  }
{% endhighlight %}

Quick note: I use ES6 in this app and compile it with webpack. If you are unfamiliar with ES6 I recommend this [resource](https://github.com/lukehoban/es6features).

The above React component returns ```jsx```. This is a javaScript syntax that can contain html and also React components. I recommend this [resource](https://facebook.github.io/react/docs/jsx-in-depth.html) for more information on ```jsx```.

### Props vrs state

State can be passed down to child components by passing them as arguments. This kind of state is known as 'props'. From the perspective of child components, ```props``` are immutable. If they need to be changed, they should be changed from the original source which can be a parent component or a reducer.

*Example passing ```books``` props into the ```Pagination``` component.*

{% highlight javascript %}
    <Pagination books={books} />
{% endhighlight %}

Parent components can handle changes from child components by passing them callbacks.

*Example passing a function from a parent component to a child component. The child component will refer to the callback function as ```this.props.handleClick```.*

 {% highlight javascript %}
    <MyChildComponent handleClick={this.onChildClick} />
{% endhighlight %}

A good pattern to create very reusable components is to have several ```stateless``` child components that are handled by very ```stateful``` parent components. The stateless components simply handle rendering while the stateful components take care of interaction logic. 

State that is not ```props``` is handled in the top level component and is not passed down anywhere. This kind of state is mutable and is useful for such things as re-rendering your component to show or hide things, respond to ```onClick``` events etc.

# Routing

Routes handle url changes in a react app. It is best to always handle change to pages of content through the router. It will reduce logic in your app because you can grab parameters in the url from the router to reason about what content to display. It is also best practice to maintain a browser history and not break the browsers back button (which is a bad thing to do). 

This app uses 'react-router' available through npm. There is only two routes to keep things very simple. 

{% highlight javascript %}
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer} >
      <Route path="page/:page/:query/:index" component={AppContainer} />
    </Route>
  </Router>
{% endhighlight %}

The route maps the url path ```/``` to the ```AppContainer``` component. Browsing to the index page will invoke the ```AppContainer``` component and pass in a few router props like ```route``` and ```routeParams```.

{% highlight javascript %}
  <Route path="page/:page/:query/:index" component={AppContainer} />
{% endhighlight %}

The above nested route also goes to ```AppContainer```. This route requires a url that may look something like ```/page/1/sci-fi-books/11/```. Everything after ```/page/``` are *routeParams* and will show up as ```props``` in ```AppContainer```. These parameters are passed through the router because they are needed to create the correct data required to search against the Google Books API. 

# Components

Components in this app are divided between ```container``` components and the rest of them. Container components are *smart*, they listen to the Redux store via *connect* and handle a lot of state which they pass down as props to their child components. They are also often directly hooked up to routes, as the AppContainer is in this case.

The rest of the components try to be as *dumb* as possible, that is they should ideally not handle any state. This way they will be more reusable.

### Component lifecycle

Components have functions that React will call at specific times during it's [lifecycle](https://facebook.github.io/react/docs/component-specs.html). 

```componentWillMount()``` is a lifecycle method that is called immediately before rendering occurs. This is a good point to dispatch events so that the component can render data returned from a network request for instance. This method is only invoked once, so you can't rely it when the component renders again. Think of it like when you initially visit a webpage, it's called once right before the webpage is shown but never again.

If you want to update a component on renders after the initial one happens, ```componentWillReceiveProps()``` is a good one to use. It is not invoked the first time before a page render when ```componentWillMount()``` is invoked, but everytime after when the component receives new *props* this method is called right before rendering. It also receives the new props as it's argument, so it is good to use to compare new props with the old props.

### Dispatching events

In a Redux app, the best way to change state is through dispatching an action. Let's look at the first action we dispatch in the ```AppContainer```. 

{% highlight javascript %}
  componentWillMount () {
    const { index, query } = this.props.params;

    let searchInfo = {
      'query': query || c.DEFAULT_SEARCH,
      'index': index || c.SEARCH_START_INDEX,
      'maxResults': c.RESULTS_PER_PAGE
    };

    store.dispatch(getBooks(searchInfo));
  }
{% endhighlight %}

After visiting the index page in our app, the route maps the index url to the AppContainer. The lifecycle method ```componentWillMount()``` is invoked right before AppContainer is rendered. ```searchInfo``` is the data needed to make an API request against Google books. Since the url didn't container an index or query because we visited the '/' page, ```searchInfo``` uses some defaults from the ```constants.js``` module. It will look like this;

{% highlight javascript %}
    let searchInfo = {
      'query': '*',
      'index': 1,
      'maxResults': 20
    };
{% endhighlight %}

This is enough information to make a network request against Google books to ask for books that match the wildcard search '*', starting with the first results (you can ask to start with the 20th result for instance, which is useful for paginating results) and to please return a maximum of 20 results.

```store.dispatch(getBooks(searchInfo));``` dispatches an action to getBooks. This is an API action in the ```src/modules/books/api.js``` file.

{% highlight javascript %}
  export function getBooks(searchInfo) {
    const { query, maxResults, index } = searchInfo;
    return function (dispatch) {
      dispatch(getBooksRequest());
      return axios.get(`${c.GOOGLE_BOOKS_ENDPOINT}?q=${encodeURIComponent(query)}&startIndex=${index}&maxResults=${maxResults}&projection=full&fields=totalItems,items(id,volumeInfo)`)
        .then(response => dispatch(getBooksSuccess(response, searchInfo))
      );
    }
  }
{% endhighlight %}

I will go into this more deeply further down in this article when I talk about modules. Basically though it makes an ajax request to the Google books API and dispatches an action when that request is successful to store the response. This response will be stored as ```booksState``` props. A javaScript object that will contain all of the books metadata returned from the Google Books API.

```AppContainer``` can listen for any updates to this data and automatically respond with appropriate React lifecycle methods. This is done via Redux Connect. ```AppContainer``` looks like this hooked up to Redux Connect.

{% highlight javascript %}
  import React, { Component, PropTypes } from 'react';
  import { connect } from 'react-redux';
  import store from 'store';
  import Books from 'components/Books';
  import Header from 'components/Header';

  class AppContainer extends Component {

    render () {
      const { booksState } = this.props;
      const { books } = booksState;

      return (
        <div className="app-wrapper">
          <Header />
          <div className="books-layout">
            <Books books={books.items} />}
          </div>
        </div>
      )
    }
  }

  AppContainer.propTypes = {
    booksState: PropTypes.object.isRequired
  }

  const mapStateToProps = function (store) {
    return {
      booksState: store.booksState
    }
  }

  export default connect(mapStateToProps)(AppContainer);
{% endhighlight %}

There is more going on in the actual component but this is all you would need to hook up to the Redux store. The beauty of this is now all you need to do is dispatch actions that change the data stored in Redux and AppContainer will automatically receive and respond to the new data. 

The ```booksState``` object comes from the Redux reducers in the ```store.js``` file. 

{% highlight javascript %}
  import { createStore, applyMiddleware } from 'redux';
  import reducers from './reducers';
  import thunkMiddleware from 'redux-thunk';
  import createLogger from 'redux-logger';

  const loggerMiddleware = createLogger()

  const store = createStore(
    reducers,
    applyMiddleware(
      thunkMiddleware
    )
  );
{% endhighlight %}

This file combines all of the reducers into one object and is responsible for directly exporting the ```booksState``` object. *store.js* also hooks up some Redux middleware, including the ```thunkMiddleware``` which allows for the more complex actions I use in the ```api.js``` files.

Taking a look at the ```reducers.js``` file,

{% highlight javascript %}
  import { combineReducers } from 'redux';
  import * as books from 'modules/books';
  import * as bookDetail from 'modules/book-detail';

  // Combine Reducers
  var reducers = combineReducers({
    booksState: books.reducer,
    bookDetailState: bookDetail.reducer
  });

  export default reducers;
{% endhighlight %}

You can see that the books reducer is responsible for the ```booksState```. This brings us to modules.


# Modules

Modules are purely an organizational term I use and are not an actual "React-thing". It is way of nicely organizing the 'data structures' part of your application in a way that can scale nicely. They are self-contained units should expose public functions via index.js in their appropriate folders for other parts of the application to use. 

They will typically contain these files.

*1. actionsTypes.js*

Action types are different kinds of actions. In the books module, there is two. 

{% highlight javascript %}
  export const GET_BOOKS_REQUEST = 'GET_BOOKS_REQUEST';
  export const GET_BOOKS_SUCCESS = 'GET_BOOKS_SUCCESS';
{% endhighlight %}

One action type for just making a network request to get books. We will use this to update the ```booksState``` to include an ```isFetching``` value so we can show a loading spinner while the request takes place.

The other action type will happen when the request is successfully resolved. When this action happens, we will know that we have gotten data back from our network request to the Google Books API and we can safely store the response.

*2. actions.js*

Actions are functions that you can directly dispatch from components or elsewhere. They will take some data as arguments and return them along with an appropriate actionType to the reducer. The reducer will know which action occured from the actionType. 

*3. reducer.js*

The reducer maintains a state tree in redux. The reducer should use pure functions which never directly mutate state but rather create a copy of a new state. 

Lets look at the reducer in the books module.

{% highlight javascript %}
  import * as types from './actionTypes';
  import React from 'react';

  const initialState = {
    books: {
      'items': []
    }
  };

  export default (state = initialState, action) => {

    switch(action.type) {

      case types.GET_BOOKS_REQUEST:
        return Object.assign({}, state, { 
          isFetching: true,
          didInvalidate: false
        });

      case types.GET_BOOKS_SUCCESS:
        return Object.assign({}, state, {
          isFetching: false,
          didInvalidate: false,
          books: {
            items: action.books.items,
            totalItems: action.books.totalItems,
            info: action.searchInfo
          }
        });
    }

    return state;
  }
{% endhighlight %}

Dispatching actions will send the data we pass as arguments to the reducer. For example, in the books module actions.js file there are two different actions.

{% highlight javascript %}
  import * as types from './actionTypes';

  export function getBooksRequest() {
    return {
      type: types.GET_BOOKS_REQUEST
    };
  }

  export function getBooksSuccess(response, searchInfo) {
    return {
      type: types.GET_BOOKS_SUCCESS,
      books: response.data,
      searchInfo: searchInfo
    };
  }
{% endhighlight %}

Looking at the above reducer, we can see that dispatching ```getBooksRequest()``` via ```store.dispatch(getBooksRequest())``` will update ```booksState``` to include two new values. 

```isFetching: true``` so we can tell that the request is happening. 
```didInvalidate: false``` so we can say that the data is fresh. But we could use it to dispatch an action to say that the data should be fetched again or to erase the data.

We can dispatch the action ```store.dispatch(getBooksSuccess(response, searchInfo))``` to change ```isFetching``` to false so any spinners we show can go away and we add new books objects to ```booksState.books```.







{::options parse_block_html="true" /}
<div class="header-hero">
![Banner](/css/images/black-and-white-bridge-wooden.jpg)
<div class="inner"></div>
</div>