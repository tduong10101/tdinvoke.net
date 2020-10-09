---
title: Powershell Password Encryption and Decryption
date: 2020-10-08 19:45:08
tags:
    - powershell
    - security
    - quick-post
---
Encrypte and Decrypt credential:
```powershell
#Create encrypt key
$EncryptKey = New-Object Byte[] 16
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($EncryptKey)
$EncryptKey| Out-File C:\key.txt
#Encrypt credential
$UserCred = Get-Credential
$UserCred.Password | ConvertFrom-SecureString -Key $EncryptedKey | Out-File C:\encrypted.txt

#Decrypt credential
$User = 'TestUser'
$SecureKey = Get-Content C:\Key.txt | ConvertTo-SecureString
$SecurePassword = Get-Content C:\encrypted.txt | ConvertTo-SecureString -SecureKey $SecureKey
$UserCred = New-Object System.Management.Automation.PSCredential ($User, $SecurePassword)
Get-WmiObject -Class win32_OperatingSystem -ComputerName RemoteServerA -Credential $UserCred
```

Encrypt and Decrypt password:
```powershell
$Password = "Password123"
$PasswordBytes = [System.Text.Encoding]::Unicode.GetBytes($Password)
$SecurePassword = [Security.Cryptography.ProtectedData]::Protect($PasswordBytes, $null, [Security.Cryptography.DataProtectionScope]::LocalMachine)
$SecurePasswordStr = [System.Convert]::ToBase64String($SecurePassword)

$SecureStr = [System.Convert]::FromBase64String($SecurePasswordStr)
$StringBytes = [Security.Cryptography.ProtectedData]::Unprotect($SecureStr, $null, [Security.Cryptography.DataProtectionScope]::LocalMachine)
$PasswordStr = [System.Text.Encoding]::Unicode.GetString($StringBytes)
```
