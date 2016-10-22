---
layout: post
title:  "Handling duplicate requests in a React app"
date:   2016-10-15 13:15:34 -0700
categories: jekyll update
---

I ran into a messy situation today where I needed my React app which makes network requests for data to play well with another external app. 

The external app uses a slider that makes it's own network requests everytime it creates new slides. When those slides are created, it needs my React app to make it's own network requests to display some UI in each of it's slides. 

Problem was that my React app was making many extra network requests it did not need to make. I also needed this external app to know nothing about my React app, that is I wanted my React app to be dummy proof, anyone should be able to initialize it anywhere and even multiple times on the same page without my React app doing any duplicate requests.


