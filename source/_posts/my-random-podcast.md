---
title: My random podcast app
date: 2019-09-22 22:47:53
tags:
    - serverless
    - podcast
    - random
    - hexo
    - aws
---
{% asset_img A-0901-Podcast-BBVA-1024x416.jpg %}
I've been trying to catch up with a few podcasts and was while can't decide  what to listen to first. So I thought, let create an app that could pick out a random episode for me. Less thinking about picking and more time listening!

So here is what I came up with.

{% asset_img random-podcast.jpg %}

I thought it was straight forward but it took me a whole weekend to get it up T__T

Short explanation: there are 4 lambda functions that will keep crawling on my list of podcast stations, update/read on 2 dynamodb (station lists and episodes list). This blog would then access the episode list via api gatways.

You can find the codes [here](https://github.com/tduong10101/td-podcast)

To see the app in action, please visit [here](https://blog.tdinvoke.net/random-podcast/)

Issues encountered/thoughts:

- Learnt how to add js scripts to Hexo. There arn't much information on how to... I had to hack around for awhile. Basically, I need to create a new script folder at thems/'my-theme'/source/'td-podcast'. Chuck all my js scripts in there, then modify '_partials/scripts.ejs' to reference the source folder. Learnt a bit of ejs as well.
```javascript
<% var title = page.title; %>
<% if (title === 'Random Podcast') { %>
<%- js('/podcast/podcast.js') %>
<% } %>
```
- Chalice is a pain with Dynamodb, gave up half way and gone back to create the lambda functions manually.
- Need to do CI/CD on this. (Maybe for next post)
- Split crawler into separate lambda functions. At the moment, this app only crawl playerfm stations.
- Could make this into youtube/twitch random video.
