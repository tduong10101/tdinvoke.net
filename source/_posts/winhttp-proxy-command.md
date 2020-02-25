---
title: winhttp proxy command
date: 2020-02-24 22:16:02
tags: 
    - quick-post
    - command
    - powershell
---

Command to set windows server httpwin proxy setting.

```powershell
netsh winhttp set proxy proxy-server="http=<proxy>:<port>;https=<proxy>:<port>" bypass-list="<local>;<url>"
```

Powershell script to grab winhttp value
```powershell
$ProxyConfig = netsh winhttp show proxy
$Proxy = (((($ProxyConfig | Out-String) -split("`n") |?{$_ -like "*Proxy Server*"}) -split("  ") -split(";")) | ?{$_ -like "http=*"}).Replace("=","://").Trim()
```