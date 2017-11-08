---
layout: post
title:  "React.js, performance and web security at Fluent 2015"
date:   2015-04-26 13:15:34 -0700
category: article
---

[Fluent 2015](http://conferences.oreilly.com/fluent/javascript-html-2015) was packed with presentations on javaScript, microservices, native script, GIT, design and much more. It was fascinating diving into languages and topics presented by people who are leaders on them. Here are a few things that I took away from it that will effect the way I work.

<!-- more -->
<span id="resume"></span>

# React.js

React.js is pretty hot right now. I got a nice introduction and high level overview and in the process became more aware of the limitations of backbone.js (the front-end framework we use at Safari). React does away with the “model, view, controller” or MVC idea and instead consolidates its components into the “view” layer while focusing on doing it really well. React offers a few advantages over MVC frameworks, including;

### 1. Stateless over stateful

Backbone can manage data state quite well. Fetching data from a server, storing it in models and collections and displaying it in views. As your Backbone application grows and becomes more interactive you start to lean more on ‘application state’, the kind of state which manages your data. Your views need to talk to each other more consistently and it starts to get trickier to keep track of the messages flowing through your global event bus (thankfully there are libraries like Marionette.js and Backbone Radio to help with this).

React takes a different approach and divides data acces into 'state’ and 'props’. Props are immutable 'things’ that get passed from parent through child nodes. React advocates using these as much as possible. 'State’ is mutable and kept within components where it can only be modified there. React advocates using this as little as possible.

In a react application, lines of communication build up in a tree-node structure. Data flow is one-way from parent down through child nodes. Child nodes can display data but not modify it, they can handle events and will send callbacks up to parents to modify their logic. In this way, data flow is similar to the original data flow blueprint that Events (bubbling up and down) and Cascading Style Sheets already use, the DOM.

### 2. Precise re-rendering through a virtual DOM

React uses a 'virtual DOM’ for efficient re-rendering of the DOM. The virtual DOM uses a diff algorithm to generate a real DOM patch and avoid unnecessary re-renders. Virtual DOM diffs are more similar to Github code diffs so that DOM updates are very precise. This is in contrast to other frameworks, (like Backbone) that will do large re-renders, even multiple times, that are often largely unnecessary.

### 3. JavaScript and HTML mushed together

React has a component called 'JSX’ that allows you to write HTML inside its javaScript. I was a little uncomfortable about this but I’ve opened up to it. React wants you to think of things in terms of components made up of behaviors and layouts that often model your markup. It makes a convincing argument that MVC is great on the server, but not so much on the client. I’m willing to give it a go.

### 4. Clarity over brevity

React wants you to name your handlers and variables in a way that you can immediately identify how they work later. I think all javaScript frameworks can take away something from this. Type a few extra characters into your handler names, you will thank yourself later when you come back to refactor it.

# Performance

It is not news that performance is good and can help you increase revenue. Google is even now ranking websites higher that load quickly on mobile devices. This means building your site responsive and fast in all devices is more important then ever. So how can we accomplish this?

### Prototype early

Get your designers and developers together early. Establish communication early and ask the question, “what are the most important things?”.

### Measure performance from the start

Users expect your site to load fast. You can prioritize performance by setting a 'performance budget’. Plug your site into [www.webpagetest.org](https://www.webpagetest.org/) and look at the 'start render’ and 'speed index’.

The 'start render’ is the measurement between when the user was staring at a blank screen and the very first thing displayed on the screen.

The 'speed index’ is the average time visible parts of the site are rendered. It computes an overall score for how quickly content is painted by looking at the visual progress, captured in frames and measured in percentages. More info on [speed index here](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index).

Do some benchmarking by doing the same for a few competitor sites. Set a performance mark such as 20% faster then competitor B. Set limits on load time, render time, css and js payload sizes.

### Custom metrics

The metrics on webpagetest.org aren’t the only way to judge performance. You can identify your own custom metrics by prioritizing the most important things on the page. Twitter defined theirs as the '[time to first tweet](https://blog.twitter.com/2012/improving-performance-on-twittercom)’, how long it takes for a user to see the first tweet at the top of their timeline.

Other tools to use include the [User Timing Spec](https://www.w3.org/TR/user-timing/#introduction), Google Anaytlics and Speed Curve.

# Web Security

Security is more important then ever. I learned a few things from the web security presentation.

On login and authentication, you should check for these things and make sure they don’t happen;

* Is password echoed to the screen ? (looking over someones shoulder hack)
* Is login form served without HTTPS ?
* Are login username and password sent without HTTPS ?
* Are authenticated cookies transmitted without HTTPS ?
* Session cookies should be 'secure’ and 'HttpOnly’
* Check your authentication cookie flags. Look for the 'session cookie’ in the browser console tab, (under resources in Chrome) and make sure it’s 'Secure’ and 'HttpOnly’ flags are set.

The 'HttpOnly’ flag means the cookie cannot be accessed through a client side script. So if a bug such as an XSS flaw exists and a malicious script were to access it, the browser would not reveal the cookie.

The 'secure’ flag will make sure your cookie is encryped and prevent them being read by unauthorized sources. This flag requires HTTPS, browsers won’t send the cookie with the secure flag over unencrypted HTTP.

These are both good things to look for because exposing your session to someone would be the same as logging in to your site and then walking away, allowing anyone to do what they want with the same priveleges as a logged-in user.

### Invalidation of cookies at logout

Your cookies should be invalidated after logout. You can check this by logging in, find your session cookie, api_key or other cookie values relevant to your current session and copy / paste them somewhere. Log out, log back in and change those new values back to what they were.

You can replace the cookie values using javaScript in the browser console. You shouldn’t be able to continue using the site after that point. This would mean if someones session was compromised it could be for an indefinite period of time.

There are some great tools out there for checking your session hijacking security, including;

* [Cookie cadger](https://www.cookiecadger.com/)
* Qualys SSl Checker2
* Google Safer Email Report
* [Asafaweb.com](https://asafaweb.com/)

_


Fluent 2015 was a whirlwind of information. I learned about the Hack programming language Facebook uses from it’s creator Julien Verlaguet. I dove into native script with Googles Brad Nelson. There was even a javaScript musical.

There was probably only less then 1% of the community there, but I really got a sense of just how large and vibrant the javaScript and larger web community is. It feels good to be a javaScript developer in 2015.