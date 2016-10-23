---
layout: post
title:  "Handling duplicate requests in a React app"
date:   2016-10-15 13:15:34 -0700
categories: jekyll update
---

I have been working on a React app that needs to be embedded on many other parts of a site. It makes network requests to display a bunch of data. 

I ran into a sticky situation where I embedded it in a part of the site that makes it's own network requests to display some slides. The React app needed to display it's own data in each slide. 

The problem was that the React app was being initialized multiple times and making more network requests then it needed to. This couldn't really be avoided and I didn't want other parts of the site to "know about" the React app. It needed to be dummy proof, any other engineer could embed it anywhere and it would only make the network requests it needed to bootstrap itself.

### Solution





