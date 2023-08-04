---
title: Terraform and Github actions for Vrising hosting on AWS
date: 2023-08-04 22:42:48
tags:
    - aws
    - IAM
    - automation
    - OIDC
    - terraform
    - github-action
    - bash
    - vrising
    - CICD
    - docker
---

{% asset_img "vrising-banner.png" %}

It's been awhile since the last time I play Vrising, but I think this would be a good project for me to get my hands on setting up a CICD pipeline with terraform and github actions (an upgraded version from my [AWS Vrising hosting solution](https://blog.tdinvoke.net/2022/06/05/Hosting-VRising-on-AWS/)).

There are a few changes to the original solution, first one is the use of [vrising docker image](https://github.com/TrueOsiris/docker-vrising) (thanks to TrueOsiris), instead of manually install vrising server to the ec2 instance. Docker container would be started as part of the ec2 user data. Here's the [user data script](https://github.com/tduong10101/Vrising-aws/blob/master/terraform/vrising-install.tftpl).

The second change is terraform configurations turning all the manual setup processes into IaC. Note, on the [ec2 instance resource](https://github.com/tduong10101/Vrising-aws/blob/master/terraform/main.tf), we have a 'home_cdir_block' variable, referencing an input from github actions secret. So then only the IPs in 'home_cdir_block' can connect to our server. Another layer of protection is the server's password in [user data script](https://github.com/tduong10101/Vrising-aws/blob/master/terraform/vrising-install.tftpl) which also getting input from github secret variable.

Terraform resources would then get deploy out by github actions with OIDC configured to assume a role in AWS. The configuraiton process can be found [here](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services). The IAM role I set up for this project is attached with 'AmazonEC2FullAccess' and the below inline policy:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:GetObjectVersion"
            ],
            "Resource": [
                "arn:aws:s3:::<your-s3-bucket-name>",
                "arn:aws:s3:::<your-s3-bucket-name>/*"
            ]
        }
    ]
}
```

Oh I forgot to mention, we also need an S3 bucket create to store the tfstate file as stated in [_provider.tf](https://github.com/tduong10101/Vrising-aws/blob/master/terraform/_provider.tf).

Below is an overview of the upgraded solution.

Github repo: https://github.com/tduong10101/Vrising-aws

{% asset_img "diagram.png" %}

