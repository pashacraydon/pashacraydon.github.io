---
layout: post
title:  "How to write good javaScript fast"
date:   2017-06-01 13:15:34 -0700
category: article
---

Do you write most of your javaScript by making sure it runs first in the browser, adding `debugger` and `console.log` statements along the way. If so, you may be hindering the speed at which you write javaScript and the quality of your code.

<!-- more -->
<span id="resume"></span>

## Tunnel code

When you focus first on only whether or not your code runs without errors, the vision of your code is narrow.

It can be easy to look at writing code as just a series of solving problems where each solution is a patchwork of unrelated pieces farmed from jumping from one stackoverflow search to the next.

You may be tempted to believe this is the fastest way to write javaScript. 

How much time do you lose tracking down bugs you do not entirely understand, just to get the thing working.

How often do you get frustrated because your code is broken and if you could just figure out why then you could move on to the next problem and also why is the browser taking so long to load.

I bet it is a lot.

## Greater vision

I challenge you to set your gaze higher. Forget about whether or not your code actually works in the browser, that can come later. In fact, forget about the browser altogether at first.

Step back and forget about the code at first too. Think about what you are trying to build, the whole system. 

What are the pieces that will make up the whole system? How do they relate? What would be the best way to organize them? Write it down.

Now start writing your code.

## Small, incremental tests

As you start writing your code, write tests to make sure it works. While you will write more code then you would if you had just started writing code using the browser, this approach will actually save you more time. 

The reason is that there are a lot of small, inconvenient things that even a genius could be forgiven for missing. 

That value you require from a function that needs to be a float, well turns out it returns a string. 

The closure that is supposed to return a new value, well turns out it just returns the same value over and over. 

These problems are much easier to discover and fix with tests then in the browser.

I recommend many, short tests over a few, large tests. Nothing is too dumb to test. It is often the obvious, simple things which have bugs.

## How

The test-driven development process has three steps;

1. Write a test that fails.
2. Write enough code to make the test pass.
3. Refactor the code to tidy it up, ensure it is readable and maintainable. Run all the tests to ensure there are no regressions.

The first step is important because you can accidentally write broken tests that always pass. In the second step, you focus primarily on solving the test. In the third step you focus on the quality of your code.

## Relax

I believe that writing code should be fun or at least stress free. Using a test-driven development approach has a number of benefits that can improve your javaScript workflow and make writing it more enjoyable;

1. *Deeper understanding of your code*. Writing tests will force you to think more carefully about what you are trying to achieve. As you become more clear about your goals and the architecture of your code, it will be easier to write code.

2. *Slow and steady wins the race*. It sets the goal on the simple task of writing code in small chunks. You are more focused on the process rather then the end result and are more likely to write code that is deliberate and well-considered. You will gradually gain confidence in your code and the process and make fewer mistakes.

3. *Faster debugging*. It will be easier to narrow the scope of bugs that show up in your code. You can be sure that you have fixed certain bugs and can look elsewhere. You can re-run your tests and have more confidence that changes you make to your code have not broken anything. 




