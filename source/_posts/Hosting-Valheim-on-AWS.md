---
title: Hosting Valheim on AWS
date: 2021-03-08 09:39:52
tags:
    - aws
    - ec2
    - powershell
    - valheim
---
{% asset_img "valheim-banner.jpg" %}

Quick introduction for Valheim, it's an indi game developed by IronGate which is a viking survival game where player can build/craft like minecraft, fight like darksoul and explore a beautiful world like zelda. The game is a huge success with 5 milion players, more information can be found here at [Valheim official site](https://www.valheimgame.com/).

This post is about how I got Valheim server hosted on aws ec2 with a friend of mine.

1. Spin up an ec2 instance: The game ran pretty smooth with a tiny bit of latency. Below is the instance details:
    
    - AMI: Ubuntu Server 20.04 LTS (HVM)
    - instance-type: t3a.medium. This is the cheapest we can get. Unfortunately valheim does not support 64bit(Arm) so we can't use t4 instance type.
    - vpc: we're using default vpc created by aws on our account.
    - storage: 8gb, the game only require less than 2gb.
    - security group with the folowing rules:
        - Custom TCP Rule: TCP 2456 - 2458 open to our pc ips
        - Custom UDP Rule: UDP 2456 - 2458 open to our pc ips
        - ssh: TCP 22 open to our pc ips
    
2. Install Valheim server follow this git repo created by Nimdy: [Dedicated_Valheim_Server_Script](https://github.com/Nimdy/Dedicated_Valheim_Server_Script)

3. Setup cloudwatch to monitor "Network packet out(count)" to stop the instance when it's not in use after 25 minutes. Valheim server save the world every 20 minutes, this ensure we have the game save whenever we log off:

    - Threshold type: statics
    - Whenever NetworkPacketsOut is: Lower/Equal <= threshold
    - than: 250
    - period: 5 minutes
    - Datapoint to alarm: 5 out of 5
    - treat missing data as missing

4. Optional: Migrate exisiting world on local computer to valheim server. Coppy the following to files from the below source to valheim server world location: .fwl, .fwl.old, .db. I'm using FileZilla to transfer the file to the ec2 instance.

    - source: C:\Users\YOURNAME\AppData\LocalLow\IronGate\Valheim\worlds
    - valheim server world location: /home/steam/.config/unity3d/IronGate/Valheim/worlds

5. Run the below script to start the instance and game. (aws powershell module is requrired on the local computer)

    ```powershell
    Import-Module AWS.Tools.EC2

    $steam_exe = <steam_exe_location>
    $instance_id = <ec2_valheim_instance_id>
    Set-DefaultAWSRegion -Region <ec2_valheim_instance_region>


    $instance_status = Get-EC2InstanceStatus -InstanceId $instance_id
    if ($instance_status -eq $null){
        Start-EC2Instance -InstanceId $instance_id
        do {
            $instance = (Get-EC2Instance -InstanceId $instance_id).Instances
            Start-Sleep -Seconds 10
        } while ($instance.PublicIpAddress -eq $null)
    } else {
        $instance = (Get-EC2Instance -InstanceId $instance_id).Instances
    }

    $server_ip = $instance.PublicIpAddress

    while ($instance_status.Status.status -ne "ok"){
        Start-Sleep -Seconds 10
        $instance_status = Get-EC2InstanceStatus -InstanceId $instance_id
        $instance_status.Status.status
    }
    if ($instance_status.Status.status -eq "ok"){
        & $steam_exe -applaunch 892970 +connect ${server_ip}:2456
    }
    ```

Ok! that's enough for today, gotta get back to exploring Valheim.