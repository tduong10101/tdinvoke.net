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
I've been trying to catch up with a few podcasts and can't decide  what to listen to first. So I thought, let create an app that could pick out a random episode for me. Less thinking about picking and more time listening!

So here is what I came up with.

{% asset_img random-podcast.jpg %}

I thought it would be straight forward but it took me the whole weekend to get it up T__T

There are 4 lambda functions in this app.

1- update-station: trigger whenever a new item is added to stationsDB. This will crawl the site main page to get episode playlist and insert that back to stationsDB as list_url

2- update-episode: trigger by update-station function or a monthly cloudwatch event. This function will loop through the stationsdb and run the item's spider fucntion on its list_url. The output would be a list of 50 most recent episodes for each stations. This list would then get compare with all episodes added to episodesDB. The differences would then get added to episodesDB

3- gen-random-episode: trigger by api gateway when an episode is finished playing at [https://blog.tdinvoke.net/random-podcast/](https://blog.tdinvoke.net/random-podcast/). This funciton would first change the current episode status 'completed'. Then it would pull out all episodes url from episodeDB that haven't play (with blank status). Random pick out 1 episode and change its status to current.

4- get-current-episode: trigger by api gateway when the page [https://blog.tdinvoke.net/random-podcast/](https://blog.tdinvoke.net/random-podcast/) is loaded. This one is simple, pull episode with 'current' status.

You can find the codes [here](https://github.com/tduong10101/td-podcast)

To see the app in action, please visit [here](https://blog.tdinvoke.net/random-podcast/)

Issues encountered/thoughts:

- Add a UI page to modify the station DB. I'll have to workout how to put authorisation in API call to add new station.
- Split crawler functions into separate lambda functions which make the functions clean and easy to manage.
- Add more crawler.At the moment, this app only crawl playerfm stations.
- Learnt how to add js scripts to Hexo. There arn't much information on how to it out there. I had to hack around for awhile. Basically, I need to create a new script folder at thems/'my-theme'/source/'td-podcast'. Chuck all my js scripts in there, then modify '_partials/scripts.ejs' to reference the source folder. Learnt a bit of ejs as well.
- Chalice doesn't have Dynamodb stream trigger, gave up halfway and gone back to create the lambda functions manually.
- Looking into SAM and CloudFormation to do CI/CD on this. 
- Could turn this into youtube/twitch random video. Looking into Youtube Google api and Twitch api.
