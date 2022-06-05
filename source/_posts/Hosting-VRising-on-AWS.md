---
title: Hosting VRising on AWS
date: 2022-06-05 21:17:05
tags:
    - aws
    - ec2
    - python
    - vrising
    - valheim
    - discord
    - raspberry pi
---

{% asset_img "vrising-banner.png" %}

Quick Intro - "V Rising is a open-world survival game developed and published by Stunlock Studios that was released on May 17, 2022. Awaken as a vampire. Hunt for blood in nearby settlements to regain your strength and evade the scorching sun to survive. Raise your castle and thrive in an ever-changing open world full of mystery." ([vrising.fandom.com](https://vrising.fandom.com/wiki/VRising_Wiki))

Hosting a dedicated server for this game is similar to how we set one up with Valheim ([Hosting Valheim on AWS](https://blog.tdinvoke.net/2021/03/07/Hosting-Valheim-on-AWS/)). We used the same server tier as Valheim, below are the details. 

VRising Server does not officially available for Linux OS, luckily we found [this guide](https://gameplay.tips/guides/v-rising-running-a-server-on-centos-linux.html) for setting it up on Centos. Hence we used a centos AMI on "community AMIs".

    - AMI: ap-southeast-2 image for x86_64 CentOS_7
    - instance-type: t3.medium   
    - vpc: we're using default vpc created by aws on our account.
    - storage: 8gb.
    - security group with the folowing rules:
        - Custom UDP Rule: UDP 9876 open to our pc ips
        - Custom UDP Rule: UDP 9877 open to our pc ips
        - ssh: TCP 22 open to our pc ips

We are using the same cloudwatch alarm as Valheim to turn off the server when there's no activity.

This time we also added a new feature, using discord bot chat to turn the aws server on/off. 

{% asset_img discord_capture.JPG %}

This discord bot is hosted on one of our raspberry pi. Here is the [bot](https://github.com/tduong10101/Vrising-aws) repo and below is the flow chart of the whole setup.

{% asset_img Flow_chart.jpg %}

Improvements: 

- Maybe cloudwatch alarm can be set with a lambda function. Which would send a notification to our discord channel letting us know that the server got turn off by cloudwatch. 

- We considered using Elastic IP so the server can retain its ip after it got turn off. But we decided not to, as we wanted to save some cost.

It has been awhile since we got together and work on something this fun. Hopefully, we'll find more ideas and interesting projects to work together. Thanks for reading, so long until next time.


