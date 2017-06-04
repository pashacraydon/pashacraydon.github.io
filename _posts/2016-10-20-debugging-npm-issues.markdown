---
layout: post
title:  "Debugging npm issues in webpack"
date:   2016-10-20 13:15:34 -0700
category: article
---

I setup webpack at my company so I am often asked to debug issues other devs have with npm packages. My debug strategy is pretty straightforward;

* Ask for a stacktrace of the error
* Follow it from the bottom to the top

As an example, lets look at this stacktrace I was given. 

{% highlight bash %}
  ```ERROR in ./~/language-tags/lib/index.js
  Module not found: Error: Cannot resolve module 'language-subtag-registry/data/json/index' in /heron-docker/node_modules/language-tags/lib
  resolve module language-subtag-registry/data/json/index in /heron-docker/node_modules/language-tags/lib
    looking for modules in /heron-docker/static/js
      /heron-docker/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/node_modules/sbo-nest/nest/static/js
      /heron-docker/node_modules/sbo-nest/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/node_modules
      resolve 'file' or 'directory' data/json/index in /heron-docker/node_modules/language-subtag-registry
        resolve file
          /heron-docker/node_modules/language-subtag-registry/data/json/index.js doesn't exist
          /heron-docker/node_modules/language-subtag-registry/data/json/index doesn't exist
          /heron-docker/node_modules/language-subtag-registry/data/json/index.jsx doesn't exist
        resolve directory
          /heron-docker/node_modules/language-subtag-registry/data/json/index doesn't exist (directory default file)
          /heron-docker/node_modules/language-subtag-registry/data/json/index/package.json doesn't exist (directory description file)
  [/heron-docker/static/js/language-subtag-registry]
  [/heron-docker/node_modules/sbo-nest/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/node_modules/language-subtag-registry/data/json/index.js]
  [/heron-docker/node_modules/language-subtag-registry/data/json/index]
  [/heron-docker/node_modules/language-subtag-registry/data/json/index.jsx]
   @ ./~/language-tags/lib/index.js 14:12-63
  ERROR in ./~/language-tags/lib/index.js
  Module not found: Error: Cannot resolve module 'language-subtag-registry/data/json/registry' in /heron-docker/node_modules/language-tags/lib
  resolve module language-subtag-registry/data/json/registry in /heron-docker/node_modules/language-tags/lib
    looking for modules in /heron-docker/static/js
      /heron-docker/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/node_modules/sbo-nest/nest/static/js
      /heron-docker/node_modules/sbo-nest/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/node_modules
      resolve 'file' or 'directory' data/json/registry in /heron-docker/node_modules/language-subtag-registry
        resolve file
          /heron-docker/node_modules/language-subtag-registry/data/json/registry doesn't exist
          /heron-docker/node_modules/language-subtag-registry/data/json/registry.js doesn't exist
          /heron-docker/node_modules/language-subtag-registry/data/json/registry.jsx doesn't exist
        resolve directory
          /heron-docker/node_modules/language-subtag-registry/data/json/registry doesn't exist (directory default file)
          /heron-docker/node_modules/language-subtag-registry/data/json/registry/package.json doesn't exist (directory description file)
  [/heron-docker/static/js/language-subtag-registry]
  [/heron-docker/node_modules/sbo-nest/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/node_modules/language-subtag-registry/data/json/registry]
  [/heron-docker/node_modules/language-subtag-registry/data/json/registry.js]
  [/heron-docker/node_modules/language-subtag-registry/data/json/registry.jsx]
   @ ./~/language-tags/lib/index.js 15:15-69
  ERROR in ./~/language-tags/lib/index.js
  Module not found: Error: Cannot resolve module 'language-subtag-registry/data/json/macrolanguage' in /heron-docker/node_modules/language-tags/lib
  resolve module language-subtag-registry/data/json/macrolanguage in /heron-docker/node_modules/language-tags/lib
    looking for modules in /heron-docker/static/js
      /heron-docker/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/node_modules/sbo-nest/nest/static/js
      /heron-docker/node_modules/sbo-nest/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/node_modules
      resolve 'file' or 'directory' data/json/macrolanguage in /heron-docker/node_modules/language-subtag-registry
        resolve file
          /heron-docker/node_modules/language-subtag-registry/data/json/macrolanguage doesn't exist
          /heron-docker/node_modules/language-subtag-registry/data/json/macrolanguage.js doesn't exist
          /heron-docker/node_modules/language-subtag-registry/data/json/macrolanguage.jsx doesn't exist
        resolve directory
          /heron-docker/node_modules/language-subtag-registry/data/json/macrolanguage doesn't exist (directory default file)
          /heron-docker/node_modules/language-subtag-registry/data/json/macrolanguage/package.json doesn't exist (directory description file)
  [/heron-docker/static/js/language-subtag-registry]
  [/heron-docker/node_modules/sbo-nest/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/node_modules/language-subtag-registry/data/json/macrolanguage]
  [/heron-docker/node_modules/language-subtag-registry/data/json/macrolanguage.js]
  [/heron-docker/node_modules/language-subtag-registry/data/json/macrolanguage.jsx]
   @ ./~/language-tags/lib/index.js 108:6-65
  ERROR in ./~/language-tags/lib/index.js
  Module not found: Error: Cannot resolve module 'language-subtag-registry/data/json/meta' in /heron-docker/node_modules/language-tags/lib
  resolve module language-subtag-registry/data/json/meta in /heron-docker/node_modules/language-tags/lib
    looking for modules in /heron-docker/static/js
      /heron-docker/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/node_modules/sbo-nest/nest/static/js
      /heron-docker/node_modules/sbo-nest/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/node_modules
      resolve 'file' or 'directory' data/json/meta in /heron-docker/node_modules/language-subtag-registry
        resolve file
          /heron-docker/node_modules/language-subtag-registry/data/json/meta doesn't exist
          /heron-docker/node_modules/language-subtag-registry/data/json/meta.js doesn't exist
          /heron-docker/node_modules/language-subtag-registry/data/json/meta.jsx doesn't exist
        resolve directory
          /heron-docker/node_modules/language-subtag-registry/data/json/meta doesn't exist (directory default file)
          /heron-docker/node_modules/language-subtag-registry/data/json/meta/package.json doesn't exist (directory description file)
  [/heron-docker/static/js/language-subtag-registry]
  [/heron-docker/node_modules/sbo-nest/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js/language-subtag-registry]
  [/heron-docker/node_modules/language-subtag-registry/data/json/meta]
  [/heron-docker/node_modules/language-subtag-registry/data/json/meta.js]
  [/heron-docker/node_modules/language-subtag-registry/data/json/meta.jsx]
   @ ./~/language-tags/lib/index.js 141:8-58
  ERROR in ./~/language-tags/lib/Tag.js
  Module not found: Error: Cannot resolve module 'language-subtag-registry/data/json/index' in /heron-docker/node_modules/language-tags/lib
  resolve module language-subtag-registry/data/json/index in /heron-docker/node_modules/language-tags/lib
    looking for modules in /heron-docker/static/js
      /heron-docker/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/node_modules/sbo-nest/nest/static/js
      /heron-docker/node_modules/sbo-nest/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/node_modules
      resolve 'file' or 'directory' data/json/index in /heron-docker/node_modules/language-subtag-registry
        resolve file
          /heron-docker/node_modules/language-subtag-registry/data/json/index doesn't exist
          /heron-docker/node_modules/language-subtag-registry/data/json/index.js doesn't exist
          /heron-docker/node_modules/language-subtag-registry/data/json/index.jsx doesn't exist
        resolve directory
          /heron-docker/node_modules/language-subtag-registry/data/json/index/package.json doesn't exist (directory description file)
          /heron-docker/node_modules/language-subtag-registry/data/json/index doesn't exist (directory default file)
    looking for modules in /heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/selenium/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js
      /heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
    looking for modules in /heron-docker/.tox/py27/lib/python2.7/site-packages/nest/static/js
      /
{% endhighlight %}

This is a problem compiling javaScript with webpack in docker. Looking at the line second to the bottom I can see that it is complaining about a missing file.

{% highlight bash %}
  /heron-docker/.tox/qunit/lib/python2.7/site-packages/nest/static/js/language-subtag-registry doesn't exist (module as directory)
{% endhighlight %}

Now looking at the first line in the stacktrace, I can see that the npm module `language-tags` can't find the file `index` in `language-subtag-registry`.

{% highlight bash %}
  Module not found: Error: Cannot resolve module 'language-subtag-registry/data/json/index' in /heron-docker/node_modules/language-tags/lib resolve module language-subtag-registry/data/json/index in /heron-docker/node_modules/language-tags/lib
{% endhighlight %}

# Looking for dependency

My first thought is that `language-subtag-registry` is a dependency in `language-tags`. I visit the npm page for `language-tags` and sure enough, it lists `language-subtag-registry` as a dependency.

*boom*

I ask the dev to install `language-subtag-registry` via npm.

No luck. The dev gets the same error after installing the package via npm.

# Reinstall node-modules

Ok, my next thought is that maybe the devs `node-modules` folder is out of sync for some reason and a good `ol cache clean + reinstall can solve this. I ask the dev to run this command;

{% highlight bash %}
  docker-compose run —rm web rm -rf node_modules && npm cache clear && npm install —production
{% endhighlight %}

No luck. Dev gets the same error again.

# Dig into npm package code on github

At this point I need to really dig into the code and see whats going on here. 

The very first line in the stacktrace (`ERROR in ./~/language-tags/lib/index.js`) tells me where the problem occurs so I visit the github page for `language-tags` and look for the `index.js` in the `language-tags/lib` directory.

I see that the file is importing `language-subtag-registry/data/json/index`, which exactly matches the error on the second line of the stacktrace, `Module not found: Error: Cannot resolve module 'language-subtag-registry/data/json/index' in /heron-docker/node_modules/language-tags/lib`. There is a problem importing `index`. 

{% highlight bash %}
  var index = require('language-subtag-registry/data/json/index');
{% endhighlight %}
*language-tags imports language-subtag-registry/data/json/index*

I realize `index` is a JSON file and webpack needs to look for the `.json` extension, otherwise, it will think it is a `.js` file. I ask the dev to include `.json` in the webpack extensions settings. 

This solves the problem.




