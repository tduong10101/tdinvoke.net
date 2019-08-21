---
title: 'TI9 - Follow my fav team with opendota api, lambda and sns'
date: 2019-08-21 22:39:41
tags:
    - aws
    - serverless
    - dota2
    - open_dota_api
---

{% asset_img ti9.jpg %}

It's Dota season of the year, [The International 9](https://liquipedia.net/dota2/The_International/2019), the biggest esport event on the planet. So I thought I should make a project relate to this event - a notification function that notify me on my favorite team matches.

This function uses [opendota api](https://docs.opendota.com/), aws lambda, cloudwatch and sns.  Below is a high level design of the function I put together:

{% asset_img Ti_notification.jpg %}

Lambda funcion is set to run every 1 hour trigger by CloudWatch. If the function found my favorite team just finish their match, it will sms me the result. Below is the lambda python code and a screen shot of a sms message.

{% asset_img phone.jpg %}

```python
import os
import requests
import json
from datetime import datetime, timedelta
import boto3

def lambda_handler(event, context):
uri = 'https://api.opendota.com/api/proMatches'
response = requests.get(uri)
json_data = json.loads(response.content)
team_name = os.environ['MY_TEAM']
league_name = os.environ['LEAGUE_NAME']

filtered_json_data = list()
for j in json_data:
    check_rad_name = team_name in j['radiant_name']
    check_dire_name = team_name in j['dire_name']
    check_tour = league_name in j['league_name']
    current_time = datetime.now()
    duration = j['duration']
    start_time = datetime.fromtimestamp(j['start_time'])
    end_time = start_time + timedelta(seconds=duration)
    elapsed_time = current_time - end_time
    elapsed_time_cal = divmod(elapsed_time.total_seconds(), 60)
    check_time = elapsed_time_cal[0] < 60
    if (check_rad_name or check_dire_name) and check_tour and check_time:
         filtered_json_data.append(j)

#print(*filtered_json_data, sep="\n")

for f in filtered_json_data:
    if f['radiant_win']:
        winner = f['radiant_name']
        winner_score = f['radiant_score']
        loser = f['dire_name']
        loser_score = f['dire_score']
        winner_side = "R"
        loser_side = "D"
    else:
        winner = f['dire_name']
        winner_score = f['dire_score']
        loser = f['radiant_name']
        loser_score = f['radiant_score']
        winner_side = "D"
        loser_side = "R"

    if winner in team_name:
        message = "{0}({5}) won against {1}({6})\n{0}: {2} - {1}: {3}\nGame duration {4:.0f} minutes".format(winner, loser, winner_score, loser_score, f['duration']/60,winner_side,loser_side)
    else:
        message = "{1}({6}) lost against {0}({5})\n{0}: {2} - {1}: {3}\nGame duration {4:.0f} minutes".format(winner, loser, winner_score, loser_score, f['duration']/60,winner_side,loser_side)

    client = boto3.client('sns')
    client.publish(
        TopicArn = os.environ['SNS_ARN_TOPIC'],
        Message = message
    )

return 0
```
Things could be improved:
- set up full CI/CD
- CloudWatch schedule time to only run when the matches are happenning not 24/7
- UI to select favorite team or hook up with Steam account favorite team

I'll comeback on another day to work on this. Got to go watch the game now...

Let's go Liquid!
