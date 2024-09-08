---
title: Migrate my note flask app from ecs to pi
date: 2024-09-08 22:07:50
tags:
    - aws
    - route53
    - cloudflare
    - cloudflare-tunnel
    - tnote
    - pi4
    - docker
    - mysql
---

So to cutdown some cost on hosting my tnote flask app - [tnote.tdinvoke.net](https://tnote.tdinvoke.net), I'm hoping to move it down to my pi4. But I don't want to deal with port forwarding and ssl certificate setup. So enter cloudflare tunnel, it's not perfectly safe as cloudflare can see all traffic going to the exposed sites but since these are just my lab projects, I think I should be fine.

I need to use my tdinvoke.net domain for the sites, so I had to migrate my r53 dns setup over to cloudflare.

-   Move all my dns records to cloudflare manually. I don't have much so it's pretty painless. Note: All my alias records to aws cloudfront need to be created as CNAME - 'DNS only' on cloudflare.
-   Point my registered domain name-servers to cloudflare name-servers.

Migration from ecs was not too bad since I just need to spin up the containers on my pi.

Here's an overview flow of the setup:

{% asset_img 'cloudflare-dns.jpg' %}

More information on cloudflare tunnel and how to setup one - [here](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-local-tunnel/).
