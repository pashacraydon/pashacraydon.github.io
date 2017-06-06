---
layout: post
title:  "How to write better javaScript faster"
date:   2017-06-01 13:15:34 -0700
category: article
---

Do you write most of your javaScript in the browser, using `debugger;` and `console.log` statements. If so, you may be hindering the speed you write javaScript and the quality of your code. 

## Tunnel code

When you focus first on only whether or not your code runs, the vision of your code is narrow.

It can be easy to look at writing code as just a series of solving problems where each solution is a patchwork of unrelated pieces farmed from jumping from one stackoverflow search to the next.

You may be tempted to believe this is the fastest way to write javaScript. 

How much time do you lose tracking down bugs you do not entirely understand, just to get the thing working. I bet it is a lot.

How often do you get frustrated because your code is broken and if you could just figure out why then you could move on to the next problem and also why is the browser taking so long to load. I bet it is a lot.

## Greater vision

I challenge you to set your gaze higher. Forget about whether or not your code actually works in the browser, that can come later. In fact, forget about the browser altogether at first.

Step back and forget about the code at first too. Think about what you are trying to build, the whole system. 

What are the pieces that will make up the whole system? How do they relate? What would be the best way to organize them? Write it down.

Now start writing your code.

## Small, incremental tests

As you start writing your code, write tests to make sure it works. While you will write more code then you would if you had just started writing code using the browser, this approach will actually save you more time. 

The reason is that there are a lot of small, inconvenient things that even a genius could be forgiven for missing. 

That value you require from a function that needs to be a float, well turns out it is a string. 

The closure that is supposed to return a new value, well turns out it just returns the same value over and over. These problems are much easier to discover and fix with tests then in the browser.

I recommend many, short tests over a few, large tests. Nothing is too dumb to test, it is often the obvious, simple things which have bugs.

## Relax

I believe that writing code should be fun. Focusing on the architecture of my code, deeply understanding it, caring about its readability and maintainability. This is fun to me. 

Solving a bunch of fires because I am focusing only on what is wrong with my code is stressful and not fun.

So relax. Focus on the process and take care of your code. You will write it much quicker and it will be much better, I guarantee it.




