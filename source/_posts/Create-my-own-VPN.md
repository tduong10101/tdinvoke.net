---
title: Create my own VPN
date: 2019-08-19 20:17:43
tags:
    - aws
    - ec2
    - openvpn
    - netflix
---
{% asset_img "OpenVPN-logo.jpg" "netflix au - marvel search" %}

Just created my personal VPN by using the OpenVPN AMI from AWS Marketplace so I could trick Netflix to show movies from the US netflix region ([Link](https://medium.com/@tatianaensslin/how-to-create-a-free-personal-vpn-in-the-cloud-using-ec2-openvpn-626c40e96dab) on how to create the VPN) Below is the differences between AU and US when I search for Marvel.

**Netflix au with a search on "Marvel"**

{% asset_img "netflix-au.JPG" "netflix au - marvel search" %}

**Netflix us with a search on "Marvel"**

{% asset_img "netflix-us.JPG" "netflix us - marvel search" %}

I was closed but no cigar. Got the below when I tried to watch Infinity War.
[netflix.com/proxy](https://help.netflix.com/en/node/277)

{% asset_img "netflix-error.JPG" %}

Setting the vpn was quite straight forward. I was bit confused with the password. Eventually I figured out that I needed to run the password reset as:
    sudo passwd openvpn
Same username declared when init OpenVPN, not the root user (openvpnas).

To clean up just terminate the ec2, also don't forget to disassociate and release the Elastic IP Address.
