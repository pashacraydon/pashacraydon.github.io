---
layout: post
title:  "Building a simple app with React and Redux"
date:   2016-08-15 13:15:34 -0700
category: article
---
I built a simple React + Redux app as a demonstration to help my company transition from using Marionette + Backbone to React + Redux. It simply fetches metadata from the Google Books API and lets you search it. It is on Github here [Github](https://github.com/pashasc/react_books) and it can be demo'd here [Demo](https://pashacraydon.github.io/react-books/).

![React Books](/css/images/react_books.png)

<!-- more -->

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

The above React component returns ```jsx```. This is a javaScript syntax that can contain html and also React components. I recommend this [resource](https://facebook.github.io/react/docs/jsx-in-depth.html) for more information on ```jsx```.

# Props vrs state

React divides data between `state` and `props`. Props are immutable data that get passed from parent through child components. `state` is mutable and handled within components where it can only be modified there. 

Data in the above dropdown example is `state` because it is mutable and is local to the component.

The difference between `state` and `props` becomes more obvious when you want to display a list of components. 
If `props` was passed into a list of components, a single change to `props` will effect every component. 

*Example passing ```books``` props into the ```Pagination``` component.*

{% highlight javascript %}
    <Pagination books={books} />
{% endhighlight %}

*Example of a single book component rendering book props data*

{% highlight javascript %}
  render () {
    const { volumeInfo } = this.props.book;

    return (
      <li className="book-item">
        <a href="#"
          onClick={this.showDetail}
        >
          <div className="wrap-book">
            {volumeInfo.imageLinks &&
            <img key={volumeInfo.imageLinks.thumbnail}
              src={volumeInfo.imageLinks.thumbnail} />}
          </div>
        </a>
      </li>
    )
  }
{% endhighlight %}

Meanwhile, you may want to just make a change to a single component out of that list, in that case you'll need to change the `state` for that one component.


### Pass callbacks into child components 

A logical next question is how do I make a change to a child component based on the behavior of it's parent?

Parent components can handle changes from child components by passing them callbacks.

*Example passing a function from a parent component to a child component. The child component will refer to the callback function as ```this.props.handleClick```.*

 {% highlight javascript %}
    <MyChildComponent handleClick={this.onChildClick} />
{% endhighlight %}

A good pattern to create very reusable components is to have several ```stateless``` child components that are handled by very ```stateful``` parent components. The stateless components simply handle rendering while the stateful components take care of interaction logic. 


# Routing

Routes handle url changes in a react app. It is best to always handle change to pages of content through the router. It will reduce logic in your app because you can grab parameters in the url from the router to reason about what content to display. It is also best practice to maintain a browser history and not break the browsers back button (which is a bad thing to do). 

This app uses `react-router` available through npm. There are only two routes to keep things very simple. 

{% highlight javascript %}
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer} >
      <Route path="page/:page/:query/:index" component={AppContainer} />
    </Route>
  </Router>
{% endhighlight %}

The route maps the url path ```/``` to the ```AppContainer``` component. Browsing to the index page will invoke the ```AppContainer``` component and pass in a few router props like ```route``` and ```routeParams``` which will contain url segments.

{% highlight javascript %}
  <Route path="page/:page/:query/:index" component={AppContainer} />
{% endhighlight %}

The above nested route also goes to ```AppContainer```. This route requires a url that may look something like ```/page/1/sci-fi-books/11/```. Everything after ```/page/``` are *routeParams* and will show up as ```props``` in ```AppContainer```. These parameters are passed through the router because they are needed to create the correct data required to search against the Google Books API. 

# Components

Components in this app are divided between ```container``` components and the rest of them. Container components are *smart*, they listen to the Redux store via *redux connect* and handle a lot of state which they pass down as `props` to their child components. They are also often directly hooked up to routes, as the AppContainer is in this case.

The rest of the components try to be as *dumb* as possible, that is they should ideally not handle any state. This way they will be more reusable.

### Component lifecycle

Components have functions that React will call at specific times during it's [lifecycle](https://facebook.github.io/react/docs/component-specs.html). 

```componentWillMount()``` is a lifecycle method that is called immediately before rendering occurs. This is a good point to dispatch events so that the component can render data returned from a network request for instance. This method is only invoked once, so you can't rely it when the component renders again. Think of it like when you initially visit a webpage, it's called once right before the webpage is shown but never again.

If you want to update a component on renders after the initial one happens, ```componentWillReceiveProps()``` is a good one to use. It is not invoked the first time before a page render when ```componentWillMount()``` is invoked, but everytime after when the component receives new *props* this method is called right before rendering. It also receives the new props as it's argument, so it is good to use to compare new props with the old props.

# Actions

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

The `store` in redux holds application state. It allows you to dispatch actions using `dispatch(action)`, access state using `getState()`, subscribe to changes using `subscribe(listener)`.

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

This action makes an ajax request to the Google books API. If the request is successful and resolves, a new action `dispatch(getBooksSuccess(response, searchInfo)` is emitted. 

*The `getBooksSuccess` action from the `src/modules/books/actions.js` file*

{% highlight javascript %}
  export function getBooksSuccess(response, searchInfo) {
    return {
      type: types.GET_BOOKS_SUCCESS,
      books: response.data,
      searchInfo: searchInfo
    };
  }
{% endhighlight %}

This action passes the response data from the Google Books API request to a reducer where it can be stored in our application state.

*The reducer from the `src/modules/books/reducer.js` file*

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

The switch case `types.GET_BOOKS_SUCCESS` picks up the `getBooksSuccess` action and stores some data. This includes a value `isFetching`. This value is `true` in the above switch case for the `GET_BOOKS_REQUEST` action. This is a useful boolean flag for showing a spinner of some sort in your UI while network requests take place. 

Another value, `didInvalidate` is useful for telling our application state it is holding outdated data and needs to fetch new data.

We also of course store the books response in the `books` object.

### Updating the UI after storing data

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

### Origin of ```booksState```

It is not immediately obvious where `booksState` comes into `AppContainer` through the reducer. The ```booksState``` object comes from the Redux reducers in the ```store.js``` file. 

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

You can see that the books reducer is responsible for the ```booksState```.

# Modules

I broke up the organization of this app into "modules", the parts of the application which deal with state. They are self-contained units which should expose public functions in index.js for other parts of the application.

A module will usually contain these files.

### actionTypes.js and actions.js

The only way to mutate state in a react app is to emit an action. An action is a plain javaScript object which describes what happened. ActionTypes are kinds of actions.

### reducer.js

Reducers maintain a state tree in redux. Reducers are pure functions which do not mutate / change state but rather create a copy of a new state.

### api.js

Functions that facilitate network requests should go in the API file. These functions use Redux Thunk Async Actions to perform requests, dispatch the state of the request then store the response.

### index.js

Modules should expose functions via this file. You should not directly import functions in modules from other parts of the application to use. This is best practice to avoid recursive imports and keep code decoupled.

For example, this is wrong;

{% highlight javascript %}
  import getBooks from 'modules/books/api';
{% endhighlight %}

This is right;

{% highlight javascript %}
  import * as books from 'modules/books';
  const { getBooks } = books.api;
{% endhighlight %}

If another part of the application needs to dip into a module to manipulate some things, the module should instead expose a function via index.js that does the manipulations that other parts of the app can run instead.

# Tests

For testing components I used enzyme. It allows you to test React components without fully rendering them using a `shallow` method. This way you can test components without including the dependencies you would need if you were to render them in the DOM. 

*Testing a component using enzymes `shallow` method, from the `tests/components/Book.tests.js` file*

{% highlight javascript %}
  import expect from 'expect';
  import React from 'react';
  import axios from 'axios';
  import MockAdapter from 'axios-mock-adapter';
  import store from 'store';
  import * as c from 'constants';
  import booksJSON from 'fixtures/books.json';
  import Book from 'components/Book';

  const { shallow, mount } = enzyme;
  const singleBook = booksJSON.items[0];

  function setup(properties = {}) {
    const props = Object.assign({
      book: singleBook
    }, properties);

    const enzymeWrapper = shallow(
      <Book {...props} />
    )

    return {
      props,
      enzymeWrapper
    }
  }

  describe('<Book />', () => {
    it('should render self and subcomponents', () => {
      const { enzymeWrapper } = setup();
      expect(enzymeWrapper.find('.book-item').length).toExist();
    });

    it('clicking book should make request to get book details.', () => {
      const { enzymeWrapper } = setup();

      const mock = new MockAdapter(axios);
      mock.onPost(`${c.GOOGLE_BOOKS_ENDPOINT}/${singleBook.id}`)
        .reply(200, { response: { data: singleBook }
      });

      enzymeWrapper.find('a').simulate('click', { preventDefault() {} });

      expect(store.getState().bookDetailState.isFetching).toExist();
      mock.reset();
    });

  });
{% endhighlight %}

You can also use `mount` to render components. This is often necessary for simulating click events which occur in the DOM.

*Testing a component using enzymes `mount` method, from the `tests/components/BookDetail.tests.js` file*

{% highlight javascript %}
  import expect from 'expect';
  import React from 'react';
  import store from 'store';
  import booksJSON from 'fixtures/books.json';
  import BookDetail from 'components/BookDetail';

  const { mount } = enzyme;
  const singleBook = booksJSON.items[0].volumeInfo;

  function setup(properties = {}) {
    const props = Object.assign({
      book: singleBook
    }, properties);

    const enzymeWrapper = mount(
      <BookDetail {...props} />
    )

    return {
      props,
      enzymeWrapper
    }
  }

  describe('<BookDetail />', () => {
    it('should render self and subcomponents', () => {
      const { enzymeWrapper } = setup();
      expect(enzymeWrapper.find('.detail-view').length).toExist();
    });

    it('clicking close detail link should empty the book details state.', () => {
      const { enzymeWrapper } = setup();
      enzymeWrapper.find('a').simulate('click');
      expect(Object.keys(store.getState().bookDetailState.book).length).toNotExist();
    });
  });
{% endhighlight %}

# Wrapping up

I covered a lot of material very quickly in this blog post. I highly recommend these sources for digging further into the details.

* [Official Redux docs](http://redux.js.org/){:target="_blank"}
* [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html){:target="_blank"}
* [Enzyme Documentation](https://github.com/airbnb/enzyme/){:target="_blank"}

<!--
{::options parse_block_html="true" /}
<div class="header-hero">
![Banner](/css/images/black-and-white-bridge-wooden.jpg)
<div class="inner"></div>
</div> -->