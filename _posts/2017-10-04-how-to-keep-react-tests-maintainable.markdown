---
layout: post
title:  "How to keep React tests maintainable"
description: "Make React tests work for you instead of against you."
date:   2017-10-04 13:15:34 -0700
category: article
---

Keeping front-end tests maintainable is important. When it comes to adding features or refactoring code, you can inadvertently break more tests then you intend and suck much more time into your project then may be necessary. Here are some steps I try to follow to keep React tests helpful and easy to maintain.

## 1. Keep tests isolated

Tests should not care about or rely on what is outside of the component or logic being tested. Mock interactions with external services or packages to abstract away the real implementation. Code that is refactored in packages should (almost) never break any tests in apps which consume them.

Think about where tests belong. For example, let's say you are writing a test for a function that goes into the callback of a component that you imported from a separate package. You should test the function you are passing into the callback. You can test that you pass the function as a prop into the component. You should not test your function as it performs in the component since that is an example of testing logic which should be tested in the package.

### How to test code that is in a separate package

It is common to use functions that are invoked as callbacks in components which are imported from separate packages. You can test the function and you can test that you pass the function as a prop to the component. The following is an example:

{% highlight javascript %}
  import { MyComponent } from separate-package;

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

The point here is that these tests never dig any further than the root level into a component that was imported from a separate package. Refactoring any code inside `MyComponent` will not indirectly break these tests unless `MyComponent` loses its `onClickHandler` callback prop, in which case one of these tests should rightly fail. 

In this case, you would not write a test to ensure that `MyComponent.onClickHandler` correctly invokes your callback. That test belongs within the `separate-package` package close to the `MyComponent` code because that is where its business logic resides.

### Only test code that you wrote

Consider whether you are testing code that you wrote versus code that is in the library you are using. For example, if you write a `connected` component that is hooked up to Redux, you do not need to test the connected part. You can export a version of the component that is not connected just for testing, along with the connected version for your app, e.g.:

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

## 2. Keep tests specific

When a test breaks, there should be a very logical and specific failure message. Describe tests from the perspective of a developer rather than a user. For example, instead of describing a test as revealing something based on a click event, describe the specific thing the click handler should do, such as changing a state attribute.

## 3. Prefer shallow over mounted tests

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

I have no hard rule against using `mount()`. Writing tests with `mount()` is still appropriate in many situations such as where child components play an integral role in there parents.

## Summary

In short, keep tests maintainable by making sure you keep your tests isolated and free from any dependencies. Don't overcomplicate your tests by testing logic you did not write. Keep your tests specific by describing them from the perspective of a developer. Avoid testing the logic of child components by using `shallow` methods to traverse your components.

