---
title: Serverless Blog
date: 2019-08-16 23:12:16
tags:
    - aws
    - hexo
    - serverless
---

{% asset_img hexo-logo.png %}

So this blog is serverless using combination of hexo, s3, github, codebuild, route53 and cloudfront. My original plan was to build the blog from the ground up with lambda chalice, dynamodb and some hacking with java script. But I thought there got to be someone with the same idea somewhere. One search on google and found two wonderful guides from [hackernoon](https://hackernoon.com/build-a-serverless-production-ready-blog-b1583c0a5ac2) and [greengocloud](https://greengocloud.com/2018/08/28/How-to-Make-a-Fast-and-Cheap-Serverless-Blog/). Thanks to the guides I was able to spin this up within 4-5 hours. I'm still getting use to Hexo and markdown but feeling pretty good that I got it working.

I was struggling a bit with git, the theme didn't get committed properly. Removed Git Submodule sorted the issue out.

Also CodeBuild didn't play nice with default role, got to give the role fullS3access to the bucket. It's working like charm now.

PS: This blog use [Chan theme](https://github.com/denjones/hexo-theme-chan) by [denjones](https://github.com/denjones)
