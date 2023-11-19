---
title: Flask Note app with aws, terraform and github action
date: 2023-11-18 16:53:22
tags:
    - aws
    - github action
    - terraform
    - flask
    - python
    - docker
    - ecs
    - rds
    - vpc
---

{% asset_img "AWS-HLD.png" %}

This project is part of a mentoring program from my current work - Vanguard Au. Thanks [Indika](https://www.linkedin.com/in/indikarajanayake) for the guidance and supports through this project.

Please test out the app here: https://tnote.tdinvoke.net

# Flask note app

Source: https://github.com/tduong10101/tnote/tree/env/tnote-dev-apse2/website

Simple flask note application that let user sign-up/in, create/delete notes. Thanks to [Tech With Tim](https://www.youtube.com/@TechWithTim) for the [tutorial](https://www.youtube.com/watch?v=dam0GPOAvVI).

## Changes from the tutorial

### Moved the db out to a mysql instance

Setup .env variables:

```
from dotenv import load_dotenv
....
load_dotenv()

SQL_USERNAME=os.getenv('SQL_USERNAME')
SQL_PASSWORD=os.getenv('SQL_PASSWORD')
SQL_HOST=os.getenv('SQL_HOST')
SQL_PORT=os.getenv('SQL_PORT')
DB_NAME=os.getenv('DB_NAME')
```

connection string:

```
url=f"mysql+pymysql://{SQL_USERNAME}:{SQL_PASSWORD}@{SQL_HOST}:{SQL_PORT}/{DB_NAME}"
```

update create_db function as below:

```
def create_db(url,app):
    try:
        if not database_exists(url):
            create_database(url)
            with app.app_context():
                db.create_all()
            print('Created Database!')
    except Exception as e:
        if e.code!='f405':
            raise e
```

### Updated encryption method to use 'scrypt'

```
new_user=User(email=email,first_name=first_name,password=generate_password_hash(password1, method='scrypt'))
```

### Added Gunicorn Server

```
/home/python/.local/bin/gunicorn -w 2 -b 0.0.0.0:80 "website:create_app()"
```

# Github Workflow configuration

Source: https://github.com/tduong10101/tnote/tree/env/tnote-dev-apse2/.github/workflows

## Github - AWS OIDC configuration

Follow this [doco](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) to configure OIDC so Github action can access AWS resources.

## app

Utilise aws-actions/amazon-ecr-login couple with OIDC AWS to configure docker registry.

```
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::<aws_acc_num>:role/github-ecr-img-builder
    role-session-name: GitHub_to_AWS_via_FederatedOIDC
    aws-region: ap-southeast-2

- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v1
```

This action can only be triggered manually.

## network

Source: https://github.com/tduong10101/tnote/blob/env/tnote-dev-apse2/.github/workflows/network.yml

This action cover aws network resource management for the app. It can be triggered manually, push and PR flow.

Here the trigger details:

| Action                  | Trigger                 |
| ----------------------- | ----------------------- |
| Atmos Terraform Plan    | Manual, PR create       |
| Atmos Terraform Apply   | Manual, PR merge (Push) |
| Atmos Terraform Destroy | Manual                  |

Auto trigger only apply on branch with "env/\*"

## infra

Source: https://github.com/tduong10101/tnote/blob/env/tnote-dev-apse2/.github/workflows/infra.yml

This action for creating AWS ECS resources, dns record and rds mysql db.

| Action                  | Trigger           |
| ----------------------- | ----------------- |
| Atmos Terraform Plan    | Manual, PR create |
| Atmos Terraform Apply   | Manual            |
| Atmos Terraform Destroy | Manual            |

# Terraform - Atmos

[Atmos](https://atmos.tools/) solve the missing param management piece over multi stacks for Terraform.

name_pattern is set with: {tenant}-{state}-{environment} example: tnote-dev-apse2

Source: https://github.com/tduong10101/tnote/tree/env/tnote-dev-apse2/atmos-tf

Structure:

```
.
├── atmos.yaml
├── components
│   └── terraform
│       ├── infra
│       │   ├── _data.tf
│       │   ├── _provider.tf
│       │   ├── _vars.tf
│       │   └── main.tf
│       └── network
│           ├── _provider.tf
│           ├── _var.tf
│           ├── backend.tf.json
│           └── main.tf
└── stacks
    ├── tnote
    │   ├── _defaults.yaml
    │   ├── dev
    │   │   ├── _defaults.yaml
    │   │   └── ap-southeast-2
    │   │       ├── _defaults.yaml
    │   │       └── main.yaml
    │   ├── prod
    │   │   ├── _defaults.yaml
    │   │   └── us-east-1
    │   │       ├── _defaults.yaml
    │   │       └── main.yaml
    │   └── test
    └── workflows
        └── workflows-tnote.yaml

```

# Issue encoutnered

## Avoid service start deadlock when start ecs service from UserData

Symptom: ecs service is in 'inactive' status and run service command stuck when manually run on the ec2 instance.

```
sudo systemctl enable --now --no-block ecs.service
```

## Ensure rds and ecs are in same vpc

Remember to turn on ecs logging by adding the cloudwatch loggroup resource.

Error:

```
pymysql.err.OperationalError: (2003, "Can't connect to MySQL server on 'terraform-20231118092121881600000001.czfqdh70wguv.ap-southeast-2.rds.amazonaws.com' (timed out)")
```

## Don't declare db_name in rds resource block

This is due to the note app has a db/table create function, if the db_name is declared in terraform it would create an empty db without the required tables. Which would then resulting in app fail to run.

## Load secrets into atmos terraform using github secret and TF*VAR*

Ensure sensitive is set to true for the secret. Use github secret and TF_VAR to load the secret into atmos terraform `TF_VAR_secret_name={secrets.secret_name}`
