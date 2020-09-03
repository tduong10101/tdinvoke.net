---
title: Hosting a simple Code Editor on S3
date: 2020-09-03 23:39:38
tags:
    - aws
    - serverless
    - s3
    - cloudfront
    - route53
---
{% asset_img "SampleSite.JPG" %}

I got this old code editor project sitting in github without much description - [repo link](https://github.com/tduong10101/codePlayer). So I thought why not try to host it on S3 so I could showcase it in the repo.

Also it's a good pratice to brush up my knowledge on some of the AWS services (S3, CloudFront, Route53). After almost an hour, I got the site up so it's not too bad. Below are the steps that I took.

1. Create a S3 bucket and upload my code to this new bucket - ceditor.tdinvoke.net.
2. Enable "Static website hosting" on the bucket
    
    {% asset_img "static-site-s3.JPG" %}
3. Create a web CloudFront without following settings (the rest are set with default)
   1. Origin Domain Name: endpoint url in S3 ceditor.tdinvoke.net 'Static Website Hosting'
   2. Alternate Domain Names (CNAMEs): codeplayer.tdinvoke.net
   3. Viewer Protocol Policy: Redirect HTTP to HTTPS
   4. SSL Certificate: Custom SSL Certificate - reference my existing SSL certificate
4. Create new A record in Route 53 and point it to the new CloudFront Distributions

Aaand here is the site: https://codeplayer.tdinvoke.net/

Next I need to go back to the repo and write up a readme.md for it.