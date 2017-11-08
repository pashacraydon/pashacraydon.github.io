---
layout: post
title:  "How I use git"
date:   2013-11-22 13:15:34 -0700
category: article
---

When it comes to git I keep it simple. I use the basic commands which I feel are enough without getting into trouble and the helpful comments in the terminal are usually enough for me figure out what to do right.

<!-- more -->
<span id="resume"></span>

{% highlight js %}
  git status
{% endhighlight %}

I check git status often so I know what branch I’m on and which files I’ve modified etc..

{% highlight js %}
  git branch [branch_name]  
  git checkout [branch_name]
{% endhighlight %}

I always make a branch separate from master to work on. When I’m ready to push changes, I’ll add my changes, commit them then push them to the branch.

{% highlight js %}
  git add -u #add all my changes including deleted files
  git commit -m 'my helpful message'
  git push origin [branch_name]
{% endhighlight %}

When I feel my code is ready, it passes tests and I’ve created a pull request from the github interface where the code has been reviewed by others – I’ll merge master into it, then merge it into master.

{% highlight js %}
  git merge master
  git checkout master
  git merge [branch_name]
{% endhighlight %}

If I’m done with the branch I’ll delete it, locally and remotely.

{% highlight js %}
  git push origin --delete [branch_name]  
  git branch -d [branch_name]
{% endhighlight %}

If I need to work from a branch that I don’t have locally, I’ll need to pull it down and check it out.

{% highlight js %}
  git fetch origin  
  git checkout -b [branch_name] origin/[branch_name]
{% endhighlight %}

These are pretty much the only commands I use. If I run into trouble with a merge – I’ll pick through the problem files and look for the diff’s that git adds and sort them out – this is usually pretty rare.

There are a few other helpful commands. `git stash` for instance is a nice way to "save" your changes locally and switch branches without pushing.

{% highlight js %}
  git stash #stash your current changes  
  git stash list #list all stashes  
  git stash apply [stash] #checkout stash  
  git stash drop [stash] #delete the stash
{% endhighlight %}

A few more helpful commands I will occasionally use include;

{% highlight js %}
  git reset --hard @{u} #reset local changes  
  git remote show origin #show all tracked branches
{% endhighlight %}
