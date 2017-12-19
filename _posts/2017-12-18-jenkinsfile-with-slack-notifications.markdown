---
layout: post
title:  "Jenkinsfile with Slack notifications"
date:   2017-12-18 13:15:34 -0700
category: article
---

How do you setup a simple Jenkins pipeline that can run node commands for your javaScript project and send notifications of their results to your Slack channels.

<img src="/css/images/slack-notifications.png" />

Creating a `Jenkinsfile` file is a great way to do this. You gain a single source of truth for your pipeline since it can be checked into source control. Great for code review and iterating on the pipeline.

Here is an example for running node commands. It uses the Timestamper plugin which adds timestamps to the console output. Inside this wrapper we use a `nodejs` environment to checkout the project then run `npm` commands during the `Build` stage. You can add additional stages such as for testing, deployment, cleanup etc. but this is intentionally left simple and clean.

These stages are wrapped in a try statement so that build failures can be passed to a `notifyBuild` handler that will deal with sending Slack notifications.

{% highlight groovy %}
#!groovy

timestamps {
  node('nodejs') {
    currentBuild.result = 'SUCCESS'

    try {
      stage('Checkout') {
        checkout scm
      }

      stage('Build') {
        env.NODE_ENV = 'test'

        print 'Environment will be : ${env.NODE_ENV}'

        sh 'node -v'
        sh 'npm prune'
        sh 'npm cache verify'
        sh 'npm install'
        sh 'npm run build'
      }
    }
    catch(err) {
      currentBuild.result = 'FAILURE'
      throw err
    }
    finally {
      // success or failure, always send notifications
      notifyBuild(currentBuild)
    }

  } 
}
{% endhighlight %}

The `notifyBuild` handler looks at the previous builds to figure out if they failed so that we can tailor our messages to be helpful. We don't want to notify every single time a build passes the first time so we return early for those. 

If a build failed but then passes, we send a notification that the build "returned to passing". If a build previously failed and it fails again, we send a notification that the build is "still failing" with a color notification that ratchets up from `danger` to `warning`.

{% highlight groovy %}
PROJECT = 'my-project-on-github-repo'

// Send messages these Slack channels
SLACK_CHANNELS = ['#my-favorite-slack-channel']

def notifyBuild(currentBuild) {
  println 'Evaluating build notifications...'
  def channels = SLACK_CHANNELS

  notificationPrefix = "<${BUILD_URL}/console/|${PROJECT} ${BRANCH_NAME} ${currentBuild.displayName}>"
  lastBuildResult = currentBuild.rawBuild.getPreviousBuild()?.getResult()

  def color = ''
  def message = ''

  println "Build is going from '${lastBuildResult}' to '${currentBuild.result}'"

  if (currentBuild.result == 'SUCCESS') {
    color = 'good'
    if (lastBuildResult &&
        lastBuildResult != hudson.model.Result.SUCCESS &&
        lastBuildResult != hudson.model.Result.ABORTED) {
      message = "${notificationPrefix} returned to passing"
    } else {
      message = "${notificationPrefix} passed"
      // Unnecessary to notify of every build that passes
      return false
    }
  } else if (currentBuild.result == 'FAILURE') {
    if (!lastBuildResult ||
        (lastBuildResult == hudson.model.Result.SUCCESS ||
         lastBuildResult == hudson.model.Result.ABORTED)) {
      color = 'danger'
      message = "${notificationPrefix} failed"
    } else {
      color = 'warning'
      message = "${notificationPrefix} still failing"
    }
  }

  println "Sending '${color}': '${message}' to ${channels}"

  if (color != '' && message != '') {
    // Send notifications
    for (channel in channels) {
      slackSend (channel: channel, color: color, message: message)
    }
  }
}
{% endhighlight %}

You can set this up to work through Github by adding a Slack `Payload URL` to the `Webhooks` sidebar menu setting under the repositories setting in the Github admin. It may also be necessary to add `Non-humans` to the `Collaborators & teams` setting and give them administration permissions so Jenkins can do it's thing. 

<img src="/css/images/jenkinsfile-build-config.png" />

In Jenkins, I set up a new job. Point it at the Github project repository and add a `Build Configuration` Mode selected to `by Jenkinsfile`.

