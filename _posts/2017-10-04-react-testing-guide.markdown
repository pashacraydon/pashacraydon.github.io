---
layout: post
title:  "React Testing Guide"
date:   2017-10-04 13:15:34 -0700
category: article
---

I wrote up a guide for writing javaScript tests with React for my company. I thought it would make a good blog post so I have posted it here.

<!-- more -->

# Front-End Testing

Our preferred React testing framework is Jest+Enzyme. Jest can handle everything sinon provided for us in the past, including mocks, timer mocks, spies, and more. Enzyme is a utility package that allows you to easily assert and traverse React components.

## Table of Contents

1. <a href="#organization">Organization</a>
2. <a href="#best-practices">Best Practices</a>
3. <a href="#test-driven-development">Test-Driven Development</a>
4. <a href="#links">Links</a>
5. <a href="#setup">Setup</a>
6. <a href="#spies">Spies</a>
7. <a href="#mocks">Mocks</a>
8. <a href="#redux">Redux</a>
9. <a href="#tips">Tips</a>

# Organization

Keep tests close to implementation. Consider using a separate `tests` directory within a JavaScript app or a `.test.js` file extension within the same directory.

# Best Practices

**Tests must be maintainable.** Fixing tests that other developers have written can be painful, so be kind to your fellow developers. Write your tests so that you can easily refactor. Try to follow these rules:

### 1. Keep tests isolated

Tests should not care about or rely on what is outside of the component or logic being tested. Mock interactions with external services or packages to abstract away the real implementation. Code that is refactored in packages should (almost) never break any tests in apps which consume them.

Think about where tests belong. For example, let's say you are writing a test for a function that goes into the callback of a component that you imported from a separate package. You should test the function you are passing into the callback. You can test that you pass the function as a prop into the component. You should not test your function as it performs in the component since that is an example of testing logic which should be tested in the package.

### How to test code that is in a separate package

It is common to include functions to be invoked as callbacks in components which are imported from separate packages. The best practice for this is to test the function and then test that you pass the function as a prop into the component. The following is an example:

{% highlight javascript %}
  import { MyComponent } from @oreilly/separate-package;

  function myAnalyticsHandler () => {
    ga('send', 'event', 'category', 'click', 'label');
  }

  test('should include `myAnalyticsHandler` as a prop for on click events.', () => {
    const wrapper = shallow(
      <div>
        <MyComponent onClickHandler={myAnalyticsHandler} />
      </div>
    );

    expect(wrapper.find(MyComponent).props().onClickHandler).toEqual(myAnalyticsHandler);
  });

  test('myAnalyticsHandler() should call `ga` with expected events.', () => {
    window.ga = jest.fn();
    myAnalyticsHandler();
    expect(window.ga.toBeCalledWith('send', 'event', 'category', 'click', 'label'));
  });
{% endhighlight %}

The point is that these tests never dig any further than the root level into a component that was imported from a separate package. Refactoring any code inside `MyComponent` will not indirectly break these tests unless `MyComponent` loses its `onClickHandler` callback prop, in which case one of these tests should rightly fail. 

In this case, you would not write a test to ensure that `MyComponent.onClickHandler` correctly invokes your callback. That test belongs within the `@oreilly/separate-package` package close to the `MyComponent` code because that is where its business logic resides.

### Only test code that you wrote

Consider whether you are testing code that you wrote versus in the library you are using. For example, if you write a `connected` component that is hooked up to Redux, you do not need to test the connected part. You can export a version of the component that is not connected just for testing, along with the connected version for your app, e.g.:

  Separately, export the connected component and the unconnected component for testing purposes.

{% highlight javascript %}
  export default connect(
    (state, ownProps) => {
      return {
        ...state
      };
    }
  )(MyComponent);

  export { MyComponent as PureMyComponent };
{% endhighlight %}

  In your test file, import the pure component and write tests for it.

{% highlight javascript %}
  test('should render', () => {
    const wrapper = shallow(<PureMyComponent />)
    expect(wrapper.find('div').exists()).toBe(true);
  });
{% endhighlight %}

### 2. Keep tests specific

When a test breaks, there should be a very logical and specific failure message. Describe tests from the perspective of an engineer rather than a user. For example, instead of describing a test as revealing something based on a click event, describe the specific thing the click handler should do, such as changing a state attribute.

### 3. Prefer shallow over mounted tests

Enzyme includes two methods, each with its own API for asserting and traversing React components, called `shallow` and `mount`. 

`shallow` rendering will not allow you to traverse child components. They will show up only as their root component name. Example of a component mounted using `shallow` in enzyme:

{% highlight javascript %}
  <div>
    <h1>Test title</h1>
    <MyComponent uri={{...}} onClick={Function}>
      <span className="myClass" />
    </MyComponent>
  </div>
{% endhighlight %}

You can assert that `<MyComponent />` exists, that it is passed certain props, that it has some children -- but you can't test the insides of `MyComponent` since it is not rendered. Shallow rendering is useful for ensuring your test does not indirectly assert on behavior of child components. This is important for keeping our test code isolated and should be the preferred method of testing.

Enzyme's `mount()` method will fully render all the nodes of a component and its child components (like html displayed on a page). It is a sort of code smell because you are much more likely to be testing logic that is not native to your component and may be breaking the isolation rule. Keep an eye on this in your own tests and in code review.

There is no hard rule against using `mount()`. Writing tests with `mount()` is still appropriate in many situations such as where child components play an integral role in their parents.

# Test-Driven Development

This section is an opinion on how to write efficient javaScript fast. TDD is just one approach out of many to write javaScript.

TDD is a tool that can help you escape the "tunnel vision" sympton of writing javaScript where you first try to make sure your code runs in the browser, constantly reloading the page and adding `console.log` statements along the way. This way of writing javaScript can lead to a lot of frustration. TDD can help you gain a deeper understanding of your code by forcing you to think more carefully about what you are trying to achieve. As you become more clear about your goals and the architecture of your code, it will become easier to write code.

The test-driven development process has three steps;

1. Write a test that fails.
2. Write enough code to make the test pass.
3. Refactor the code to tidy it up, ensure it is readable and maintainable. Run all the tests to ensure there are no regressions.

The first step is important because you can accidentally write broken tests that always pass. In the second step, you focus primarily on solving the test. In the third step you focus on the quality of your code.

TDD maybe new and completely foreign to you. It is like riding a bike. At first you suck at it but it soon becomes second nature. If you are struggling with writing tests or writing javaScript in general, I recommend to give it a try.

# Links

[Enzyme](http://airbnb.io/enzyme/), [jest](https://facebook.github.io/jest/docs/en/expect.html) and [redux](http://redux.js.org/docs/recipes/WritingTests.html) are all great resources for the testing API's that we use. Their documentation should not replace our own as they are very readable and up to date. However, the following are some common patterns we use.

# Setup

It is a good idea to write a reusable setup method for tests where mock rendering a component is repeated through many tests. For example.

{% highlight javascript %}
  const setup = props => {
    const wrapper = shallow(
      <MyComponent {...props} />
    );

    return {
      props,
      wrapper
    };
  };

  test('should render', () => {
    const { wrapper } = setup({
      href: '/home'
    });

    expect(wrapper.find('form').exists()).toBe(true);
  });
{% endhighlight %}

# Spies

Jest uses the Object `jest.fn()` for mocks and spies. Here is an example using `jest.fn()` to create a spy to test a callback in a component.

{% highlight javascript %}
  const myOnClickSpy = jest.fn();
  const wrapper = shallow(
    <MyComponent onClick={myOnClickSpy}>
        My Component
    </MyComponent>
  );

  wrapper.find('button').simulate('click');
  expect(myOnClickSpy.mock.calls.length).toBe(1);
{% endhighlight %}

Find more information on the [jest Object here](http://facebook.github.io/jest/docs/en/jest-object.html#content).

# Mocks

Mock functions allow you to spy on the behavior of functions that are indirectly called in your code. In keeping with the isolation rule, you can use functions to "stub" out (remove) behavior that is not directly related to what you are testing and would otherwise create errors. These functions can also be used to preprogram behavior to react in a specific way for your test.

Use `jest.spyOn(... ).mockImplementation()` for this. For example.

{% highlight javascript %}
  const myFunctionStub = 
  jest.spyOn(MyComponent.prototype,'myFunction').mockImplementation(() => { return false; })

  const wrapper = shallow(
    <MyComponent />
  );
{% endhighlight %}

In this case, `MyComponent` is a React component that contains a function called `myFunction`. We are preprogramming it to return `false`. It is important to note that the function must be mocked before you instantiate it's component (using `shallow` in this case). Find more information on [this function here](http://facebook.github.io/jest/docs/en/jest-object.html#jestspyonobject-methodname).

Mocked functions are also great place to put spies in order to test that a function is called. Example.

{% highlight javascript %}
  test('should call `myFunction`.', () => {
    const myFunctionSpy = jest.fn();

    const stub = jest.spyOn(MyComponent.prototype, 'myFunction').mockImplementation(args => {
      myFunctionSpy(args);
    });

    const wrapper = shallow(
      <MyComponent />
    );

    wrapper.instance().myFunction(123);
    expect(myFunctionSpy).toBeCalledWith(123);

    stub.mockRestore();
  });
{% endhighlight %}

Check out additional mock [functions here](http://facebook.github.io/jest/docs/en/mock-function-api.html#content).

### Mock a module or package

Sometimes packages or modules will interfere with your test code. You may want to stub them out entirely or have them contain your own spies or a preprogrammed set of fixture data.

You can stub out modules or packages using `jest.mock`. Example mocking out the package `react-dom`.

{% highlight javascript %}
  jest.mock('react-dom', () => {
    return {
      findDOMNode: () => ({
        isSameNode: jest.fn(),
        contains: jest.fn()
      })
    };
  });
{% endhighlight %}

In this case, `react-dom` is the string name of the package that is used in the code being tested. Find more information on [`jest.mock` here](http://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock).

### Mock time

Native timer functions such as `setTimeout`, `setInterval` and even packages such as lodash which use them with functions like `debounce` are not ideal for testing since they rely on the real passage of time. Jest can swap these functions out and allow you to control the passage of time.

Stub out native timer functions by calling `jest.useFakeTimers();`.

In your test use `jest.runTimersToTime(time);` to move time forward. Example.

{% highlight javascript %}
  function timerFunction(callback) {
    setTimeout(() => {
      callback && callback();
    }, 1000);
  }

  test('should invoke callback after 1000ms.', () => {
    jest.useFakeTimers();
    const spy = jest.fn();

    expect(spy).not.toBeCalled();
    timerFunction(spy);

    jest.runTimersToTime(1000);
    expect(spy).toBeCalled();
  });
{% endhighlight %}

Check out a few additional [timer mocks here](http://facebook.github.io/jest/docs/en/timer-mocks.html#content).

# Async

Pass a `done` callback to test code asynchronuously. Example.

{% highlight javascript %}
  test('async test example', done => {
      ...async stuff...
      done();
  });
{% endhighlight %}

You can use `async/await` in your tests too. Example.

{% highlight javascript %}
  test('async test example', async () => {
    await expect(myAsyncAction()).resolves.toEqual({ 'success': true });
  });
{% endhighlight %}

Find more information on testing [async code here](http://facebook.github.io/jest/docs/en/tutorial-async.html#content).

# Redux

The best authority on writing Redux tests are the [redux docs](http://redux.js.org/docs/recipes/WritingTests.html). The following are common patterns we use.

### Actions

Test actions by asserting that they return the right action. Example.

{% highlight javascript %}
  test('receiveKalturaSession() should create an action to receive a video session.', t => {
    const data = { 'session': '12345', 'expiry': '2017-05-02T21:26:35.273887' };
    const expectedAction = {
      type: actions.RECEIVE_KALTURA_SESSION,
      session: data.session,
      expiry: data.expiry
    };

    expect(actions.receiveKalturaSession(data.session, data.expiry).toEqual(expectedAction);
  });
{% endhighlight %}

### Async Actions

Test async actions by mocking the Redux store. The package `redux-mock-store` is great for this. We also use `fetch-mock` to mock the HTTP requests. Example.

{% highlight javascript %}
  import fetchMock from 'fetch-mock';
  import thunk from 'redux-thunk';
  import configureMockStore from 'redux-mock-store';

  const middlewares = [ thunk ];
  const mockStore = configureMockStore(middlewares);

  test('fetchVideoSession() should use expected actions after an error.', t => {
    const reference_id = '12345';

    const store = mockStore();
    const url = `/api/v1/player/kaltura_session/?reference_id=${reference_id}`;
    fetchMock.getOnce(url, {
      status: 500
    });

    return store.dispatch(actions.fetchVideoSession(url)).then(() => {
      const [requestAction, errorAction] = store.getActions();
      expect(requestAction).toEqual(actions.requestKalturaSession());
      expect(errorAction.error.message.indexOf('Unexpected end of JSON') > -1).toBe(true);
    });
  });
{% endhighlight %}

First we mock the HTTP request to fetch a video session (`/api/v1/player/kaltura_session/?reference_id=${reference_id}`). We are testing that the correct actions are returned if this request errors so our mock forces a 500 status error.

Then we dispatch our async action `actions.fetchVideoSession(url)` using our mocked store and assert that it returns the correct actions.

### Reducers

Reducers return a new state after applying an action. You should test that the reducer returns the correct new state. Example.

{% highlight javascript %}
  import fixtureData from './fixture.json';

  test('should handle RECEIVE_SOME_DATA by adding new data to the state.', t => {
    const data = fixtureData;

    const expected = Object.assign({}, initialState, {
      myData: [data]
    });

    const actual = myReducer(undefined, {
      type: action.RECEIVE_SOME_DATA,
      data
    });

    expect(actual).toEqual(expected);
  });
{% endhighlight %}

In this example we assert that our reducer returns the state with the new data added from the action `RECEIVE_SOME_DATA`.

# Tips

### Assert spy is called with arguments

Sometimes your spy is called with arguments that have very deep Objects that are unreasonable to mock. Use `expect.any` to just assert the spy was called with specific arguments.

{% highlight javascript %}
  expect(stub).toBeCalledWith('resize', expect.any(Function));
{% endhighlight %}

### Mocking global data

Turn global data such as Objects (such as `localStorage`) that exist on the `window` Object into spies using `global`. Example.

{% highlight javascript %}
  test('should set some data in `localStorage`', () => {
    global.localStorage = global.localStorage || {
      setItem() {
        return true;
      }
    };
    const localStorageStub = jest.spyOn(global.localStorage, 'setItem');

    const wrapper = shallow(<MyComponent />);

    wrapper.instance().functionThatSetsLocalStorageData('test_data');
    expect(localStorageStub).toBeCalledWith('MY_LOCALSTORAGE_KEY', 'test_data');
    localStorageStub.mockRestore();
  });
{% endhighlight %}

