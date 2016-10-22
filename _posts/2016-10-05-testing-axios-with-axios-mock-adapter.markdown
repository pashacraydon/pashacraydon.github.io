---
layout: post
title:  "Testing axios with axios-mock-adapter"
date:   2016-10-05 13:15:34 -0700
categories: jekyll update
---

I have been using [axios](https://www.npmjs.com/package/axios) to make network requests to a webservice from a React + Redux app. For testing the requests from the React app, I have been using [axios-mock-adapter](https://www.npmjs.com/package/axios-mock-adapter). The following is the action which makes the network request that I want to test.

{% highlight javascript %}
  export function retrieveSingleCollection(collectionId) {
    return function (dispatch) {
      dispatch(retrieveCollectionRequest())
      return axios.get(`${c.WEBSERVICE_ENDPOINT}/collections/${collectionId}/`)
        .then(response => dispatch(retrieveSingleCollectionSuccess(response)))
        .catch(error => dispatch(collectionsRequestDidError(error)))
    }
  }
{% endhighlight %}

It uses a Redux thunk to dispatch the request action `retrieveCollectionRequest()` before the network request happens.

The next action, `retrieveSingleCollectionSuccess(response))` happens after the request is successfully resolved. This action just passes the response from the request to my reducer which stores the response in my Redux store.

I dispatch the action elsewhere in one of my components.

{% highlight javascript %}
  store.dispatch(retrieveSingleCollection(collectionId))
{% endhighlight %}

I want to test that when I dispatch this action it makes a network request to my webservice then stores the response in my Redux store if it is successful.

{% highlight javascript %}
  import axios from 'axios'
  import MockAdapter from 'axios-mock-adapter'
  import expect from 'expect'
  import * as c from 'collections/utils/constants'
  import collectionsJSON from 'collections/tests/collections.json'

  const collections = collectionsJSON
  const collection = collections[0]

  describe('retrieveSingleCollection()', () => {
    it('should store the response from a successful GET request.', function () {
      const mock = new MockAdapter(axios)
      const collectionId = '123456789'

      mock.onGet(`${c.WEBSERVICE_ENDPOINT}/collections/${collectionId}/`).reply(200, collections[0])

      return store.dispatch(retrieveSingleCollection(collectionId))
        .then(() => {
          const { collection } = store.getState().collectionsState
          expect(collection).toEqual(collections[0])
        })
      })
    })
  })
{% endhighlight %}

The `MockAdapter` replys to my `GET` request with a 200 status code so that the request resolves successfully and passes in a collection as the response. `collectionsState` is the object in my Redux store where I store the response. I test that the collection which shows up in the `collectionsState` matches the data in the `mock.onGet()` reply handler. 

# Debugging

I had a few issues with this test at first. The data that I used in the reply handler to respond to my request did not match the data that the request resolved. This resulted in my request receiving a 404 status code.

I also wanted to see what my request was doing when the mock adapter handles it. To accomplish this I can use this bit of code to inspect it;

{% highlight javascript %}
  mock.onGet(`${c.WEBSERVICE_ENDPOINT}/collections/${collectionId}/`).reply(function(config) {
    console.log(JSON.stringify(config, null, 2))
    return [200]
  });
{% endhighlight %}

The github repo for `axios-mock-adapter` has some nice [tests](https://github.com/ctimmerm/axios-mock-adapter/tree/master/test) itself which helped me resolve the bugs I ran into.


