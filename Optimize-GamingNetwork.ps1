#Requires -RunAsAdministrator
# Optimize-GamingNetwork.ps1 - Realtek PCIe GbE - Lowest ping / max speed
# Right-click > Run with PowerShell as Administrator
$ErrorActionPreference = "Continue"
$a = (Get-NetAdapter | Where-Object {$_.InterfaceDescription -like "*Realtek*"} | Select-Object -ExpandProperty Name | Select-Object -First 1)
if (-not $a) { Write-Host "Realtek adapter not found!" -ForegroundColor Red; pause; exit 1 }
Write-Host "Adapter: $a" -ForegroundColor Cyan

function Set-Adv($kw,$val){
  try { Set-NetAdapterAdvancedProperty -Name $a -RegistryKeyword $kw -RegistryValue $val -ErrorAction Stop; Write-Host "OK  $kw = $val" -ForegroundColor Green }
  catch { Write-Host "FAIL $kw = $val : $($_.Exception.Message)" -ForegroundColor Yellow }
}

# === Core low-latency settings (maps to Control Panel > Ethernet > Properties > Configure > Advanced) ===
Set-Adv "*InterruptModeration" 0   # تعطيل تخفيف المقاطعة = اهم خطوة للبنج
Set-Adv "*FlowControl" 0           # Flow Control Disabled
Set-Adv "EnableGreenEthernet" 0    # Green Ethernet Disabled
Set-Adv "PowerSavingMode" 0        # Power Saving Mode Disabled (max performance)
Set-Adv "*EEE" 0                   # Energy Efficient Ethernet Disabled
Set-Adv "*WakeOnMagicPacket" 0
Set-Adv "*WakeOnPattern" 0
Set-Adv "S5WakeOnLan" 0
Set-Adv "WolShutdownLinkSpeed" 2   # Not Speed Down
Set-Adv "*PriorityVLANTag" 0       # Priority & VLAN Disabled
Set-Adv "*PMARPOffload" 0
Set-Adv "*PMNSOffload" 0
# Keep optimal (enforce):
Set-Adv "*LsoV2IPv4" 0
Set-Adv "*LsoV2IPv6" 0
Set-Adv "*JumboPacket" 1514
Set-Adv "*RSS" 1
Set-Adv "*NumRssQueues" 4
Set-Adv "*SpeedDuplex" 0           # Auto Negotiation
Set-Adv "AutoDisableGigabit" 0     # Do not downshift to save power
Set-Adv "*ReceiveBuffers" 512
Set-Adv "*TransmitBuffers" 128
Set-Adv "*ModernStandbyWoLMagicPacket" 0
# Checksum offloads stay Disabled (0) = less batching delay with Ryzen 7 5700. For max throughput instead, change to 3.
# Set-Adv "*IPChecksumOffloadIPv4" 3
# Set-Adv "*TCPChecksumOffloadIPv4" 3
# Set-Adv "*UDPChecksumOffloadIPv4" 3

# === Disable Windows turning off NIC to save power ===
try {
  Set-NetAdapterPowerManagement -Name $a -AllowComputerToTurnOffDevice Disabled -WakeOnMagicPacket Disabled -WakeOnPattern Disabled -ErrorAction Stop
  Write-Host "OK  NIC power saving OFF" -ForegroundColor Green
} catch { Write-Host "NIC power mgmt skipped: $($_.Exception.Message)" -ForegroundColor Yellow }

# === DNS: Cloudflare + Google (faster resolve than ISP 217.139.208.19) ===
try { Set-DnsClientServerAddress -InterfaceAlias $a -ServerAddresses ("1.1.1.1","8.8.8.8") -ErrorAction Stop; Write-Host "OK  DNS = 1.1.1.1, 8.8.8.8" -ForegroundColor Green }
catch { Write-Host "DNS FAIL: $($_.Exception.Message)" -ForegroundColor Yellow }

# === Windows latency tweaks ===
try { netsh interface tcp set global autotuninglevel=normal | Out-Null; netsh interface tcp set global ecncapability=disabled | Out-Null; netsh interface tcp set global rss=enabled | Out-Null; Write-Host "OK  TCP global (normal/rss on/ecn off)" -ForegroundColor Green } catch {}

# Disable Nagle per-interface (TcpNoDelay + TcpAckFrequency)
try {
  $ifaces = Get-ChildItem "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces" -ErrorAction Stop
  foreach ($i in $ifaces) {
    New-ItemProperty -Path $i.PSPath -Name "TcpNoDelay" -Value 1 -PropertyType DWord -Force | Out-Null
    New-ItemProperty -Path $i.PSPath -Name "TcpAckFrequency" -Value 1 -PropertyType DWord -Force | Out-Null
    New-ItemProperty -Path $i.PSPath -Name "TCPDelAckTicks" -Value 0 -PropertyType DWord -Force | Out-Null
  }
  Write-Host "OK  Nagle disabled (TcpNoDelay)" -ForegroundColor Green
} catch { Write-Host "Nagle FAIL: $($_.Exception.Message)" -ForegroundColor Yellow }

# Gaming responsiveness: kill network throttling
try {
  New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" -Name "NetworkThrottlingIndex" -Value 4294967295 -PropertyType DWord -Force | Out-Null
  New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" -Name "SystemResponsiveness" -Value 0 -PropertyType DWord -Force | Out-Null
  Write-Host "OK  SystemResponsiveness=0 (gaming)" -ForegroundColor Green
} catch {}

# Stop Delivery Optimization hogging upload during games
try {
  New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DeliveryOptimization" -Force | Out-Null
  New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DeliveryOptimization" -Name "DODownloadMode" -Value 100 -PropertyType DWord -Force | Out-Null
  Write-Host "OK  Delivery Optimization bypassed" -ForegroundColor Green
} catch {}

ipconfig /flushdns | Out-Null
Write-Host "`n=== Verification ===" -ForegroundColor Cyan
Get-NetAdapterAdvancedProperty -Name $a | Select-Object RegistryKeyword,RegistryValue | Format-Table -AutoSize
Get-DnsClientServerAddress -InterfaceAlias $a -AddressFamily IPv4 | Format-Table InterfaceAlias,ServerAddresses -AutoSize
Write-Host "`nDone. Restart PC, then close emulator/Brave before gaming. Test: ping -n 20 8.8.8.8" -ForegroundColor Cyan
pause
