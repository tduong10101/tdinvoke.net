---
title: Spotify - Time machine
date: 2021-04-12 10:28:27
tags:
    - python
    - automation
    - spotify
---
{% asset_img time-machine.jpg %}

“Music is the closest thing we have to a time machine”

Want to go back in time and listen to popular songs of that time? With a bit of web scraping, it is possible search/create a playlist of top songs in spotify with any given date in the last 20 years.

### Where does the idea come from?

This is one of the projects in the 100 days of python challenge - here is the [link](https://100daysofpython.dev/).

### How does it work?


This script would scrap for top 100 billboard songs on user's input date. Then it would create a spotify playlist with following title format "hot-100-<date>"

To set it up please follow "getting started" in this [git repo](https://github.com/tduong10101/spotify-time-machine). Here is an overview flow:

{% asset_img spotify-time-machine.jpg %}

### Challenges

- The spotify api authenticate integration is complex and hard to get my head around. I ended up using spotipy python module instead of directly request to spotify api.

- Took me a bit of time to figure out the billboard site structure. Overall not too bad, I cheated a bit and checked the solution. However, this is my own code version.

- Duplicate playlist! Not sure if this is a bug, but playlist created by the script will not show in user_playlists(). So if a date is re-input, a duplicate playlist will get created.