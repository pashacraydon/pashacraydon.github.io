---
layout: post
title:  "Polling an AJAX request in React + Redux"
date:   2016-10-15 13:15:34 -0700
category: article
---

Problem; how to mount a React component that requires data from a webservice on many other parts of a page, many times (that also each make their own network requests) without duplicating requests.

<!-- more -->
<span id="resume"></span>

### Polling to the rescue

{% highlight js %}
  function displayMenu(collections) {
    ReactDOM.render(
      <MenuDropdown collectionsState={collections} />,
      document.getElementsByClassName('js-my-react-mount')[0]
    );
  }

  if (store.getState().collections.length) {
    displayMenu(store.getState().collections);
  }
  else if (store.getState().collections.isFetching) {
    const pollRequest = setInterval(() => {
      if (!store.getState().collections.isFetching) {
        displayMenu(store.getState().collections);
        clearInterval(pollRequest);
      }
    }, 100);
  }
  else {
    store.dispatch(getAllCollections())
      .then((response) => {
        displayMenu(response);
      });
  }
{% endhighlight %}

This bit of code is embedded inside the ajax promises of other parts of the page. They fetch their own data then need this React component to fetch it's own data and display it.

* First it checks if the React component has data in it's Redux store. If so, it uses that data to render itself. 
* If it finds that it has no data in storage but is in the process of requesting it, it will poll for the request to finish by looking at the 'isFetching' state in the Redux store, then use that stored data when the 'isFetching' state finishes. 
* Finally, if there is no data in storage and no request is happening, it will make a new request.

-

This provided a clean solution to a messy situation where I needed my React code to be "dummy proof". That is, any other engineer could just embed it in any other parts of the site (often multiple times and at multiple points, inside the promises of other network requests) without knowing a thing about it and it would just work without making duplicate requests.




