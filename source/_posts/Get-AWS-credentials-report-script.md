---
title: Get AWS IAM credentials report script
date: 2020-09-03 22:08:59
tags: 
    - aws
    - IAM
    - automation
    - serverless
    - quick-post
---
Quick powershell script to generate and save AWS IAM credentials report to csv format on a local location.

```powershell
Import-Module AWSPowerShell
$reportLocation = "C:\report"
if (!(test-path($reportLocation))){
    New-Item -ItemType Directory -Path $reportLocation
}
$date = get-date -Format dd-MM-yy-hh-mm-ss
$reportName = "aws-credentials-report-$date.csv"
$reportPath = Join-Path -Path $reportLocation -ChildPath $reportName
# request iam credential report to be generated
do {
    $result = Request-IAMCredentialReport
    Start-Sleep -Seconds 10
} while ($result.State.Value -notmatch "COMPLETE")
# get iam report
$report = Get-IAMCredentialReport -AsTextArray
# convert to powershell object
$report = $report|ConvertFrom-Csv
# export to set location
$report | Export-Csv -Path $reportPath -NoTypeInformation
```