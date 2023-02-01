---
title: Forza log streaming to Opensearch
date: 2023-02-01 23:25:18
tags:
    - aws
    - IAM
    - automation
    - logging
    - firehose
    - cognito
    - python
    - forza
---

{% asset_img "forza-banner.png" %}

In this project I attempted to get forza log display in 'real time' on AWS Opensearch (poorman splunk). Below is a quick overview of how to the log flow and access configurations.

{% asset_img forza-log-stream.jpg %}

Forza -> Pi -> Firehose data stream:

Setting up log streaming from forza to raspberry pi is quite straight forward. I forked jasperan [forza-horizon-5-telemetry-listener](https://github.com/jasperan/forza-horizon-5-telemetry-listener) repo and updated it with a delay functionality and also a function to send the log to aws firehose data stream ([forked repo](https://github.com/tduong10101/forza-horizon-5-telemetry-listener/tree/firehose-stream)). Then I just got the python script run while I'm playing on forza

Opensearch/Cognito configuration:

Ok this is the hard part. I spent most of the time on this. Firstly, to have firehose stream data into opensearch I need to somehow map the aws access roles to opensearch roles. 'Fine grain access' option will not work, we can either use SAML to hook up to an idp or use the inhouse aws cognito. Since I don't have an existing idp, I had to setup cognito identity pool and user pool. From there I can then give the admin opensearch role to cognito authenticate role which assigned to a user pool group.

Below are some screenshots on opensearch cluster and cognito. Also thanks to Soumil Shah his video on setting up congito with opensearch helped alot. Here's the [link](https://www.youtube.com/watch?v=4d8lEnxM23Y&ab_channel=SoumilShah).

opensearch configure

{% asset_img open-search-cluster-configuration.JPG %}

opensearch security configure

{% asset_img opensearch-security-configure.JPG %}

{% asset_img opensearch-security-configure-1.JPG %}

opensearch role

{% asset_img open-search-roles.JPG %}

Note: all this can be by pass if I choose to send the log straight to opensearch via https rest. But then it would be too easy ;)

Note 2: I've gone with t3.small.search which is why I put real-time in quotation

Firehose data stream -> firehose delivery stream -> Opensearch:

Setting up delivery stream is not too hard. There's a template for sending log to opensearch. Just remember to give it the right access role that. 

Here is what it looks like on opensearch:

{% asset_img open-search-log.JPG %}

{% asset_img live-capture.JPG %}

I'm too tired to build any dashboard for it. Also the timestamp from the log didn't get transform into 'date' type, so I'll need to look into it at another time.

Improvements:

- docker setup to run the python listener/log stream script
- maybe stream log straight to opensearch for real time log? I feel insecure sending username/password with the payload though.
- do this but with splunk? I'm sure the indexing performance would be much better. There's arealdy an [addon](https://splunkbase.splunk.com/app/4615) for forza on splunk, but it's not available on splunk cloud. The addon is where I got the idea for this project.
