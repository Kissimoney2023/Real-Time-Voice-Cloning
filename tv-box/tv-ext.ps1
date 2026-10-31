# tv-ext.ps1 - Channel Preview Station commands for the Xiaomi TV Box S.
# Works two ways:
#   1) Standalone:   .\tv-ext.ps1 channel creativekingtv
#   2) From tv.ps1:  add these two lines near the top of tv.ps1, before its own command switch:
#        . "$PSScriptRoot\tv-ext.ps1"
#        if (Invoke-TvExt $args) { exit }
#      Commands this file doesn't know return $false, so your existing tv.ps1 commands keep working.
# Compatible with Windows PowerShell 5.1 and PowerShell 7.

$script:Device    = '192.168.8.149:5555'            # the ONLY device this script will ever talk to
$script:AdbExe    = 'C:\Users\admin\platform-tools\adb.exe'
if (-not (Test-Path $script:AdbExe)) {
    $onPath = Get-Command adb -ErrorAction SilentlyContinue
    if ($onPath) { $script:AdbExe = $onPath.Source }
}
$script:Root        = if ($PSScriptRoot) { $PSScriptRoot } else { 'C:\Users\admin\tv-box' }
$script:ChannelFile = Join-Path $script:Root 'channels.json'
$script:YtPackage   = 'com.google.android.youtube.tv'   # YouTube on Google TV
$script:LoadWaitSec = 6      # wait after opening a page before the first screenshot
$script:ScrollWait  = 2      # wait after scrolling before a screenshot
$script:ScrollPress = 3      # DPAD_DOWN presses per "scroll" (one press only moves one row)
$script:ScreenCount = 4
$script:MinPngBytes = 40000  # smaller than this on a TV screen = almost certainly black/blank

# ---------- adb helpers (every call is pinned to $Device with -s) ----------
function Invoke-Adb {
    param([Parameter(ValueFromRemainingArguments)][string[]]$AdbArgs)
    & $script:AdbExe -s $script:Device @AdbArgs
}

function Assert-Connected {
    $state = (& $script:AdbExe -s $script:Device get-state 2>&1 | Out-String).Trim()
    if ($state -ne 'device') {
        throw "Box not connected (state: '$state'). Run: .\tv-ext.ps1 check"
    }
}

function Send-Key([string]$Key) { Invoke-Adb shell input keyevent $Key | Out-Null }

# ---------- channels.json ----------
function Get-Data {
    if (-not (Test-Path $script:ChannelFile)) { throw "channels.json not found at $script:ChannelFile" }
    $d = Get-Content $script:ChannelFile -Raw | ConvertFrom-Json
    if (-not $d.channels) { $d | Add-Member channels @() -Force }
    if (-not $d.videos)   { $d | Add-Member videos   @() -Force }
    $d.channels = @($d.channels); $d.videos = @($d.videos)
    return $d
}
function Save-Data($d) {
    $json = ConvertTo-Json -InputObject $d -Depth 6
    Set-Content -Path $script:ChannelFile -Value $json -Encoding UTF8
}
function Norm([string]$s) { return ($s -replace '[^a-zA-Z0-9]', '').ToLower() }

function Find-Channel([string]$name) {
    $d = Get-Data; $n = Norm $name
    $hit = $d.channels | Where-Object { (Norm $_.name) -eq $n -or (Norm $_.handle) -eq $n } | Select-Object -First 1
    if (-not $hit) { throw "No channel '$name'. Try: tv list" }
    return $hit
}
function Channel-Base($ch) {
    if ($ch.url) { return $ch.url.TrimEnd('/') }
    return 'https://www.youtube.com/' + $ch.handle.TrimStart('/')
}

# ---------- opening pages ----------
function Open-Url([string]$Url) {
    Assert-Connected
    # Single quotes protect & and ? from the device shell.
    $out = Invoke-Adb shell "am start -a android.intent.action.VIEW -d '$Url' -p $script:YtPackage" 2>&1 | Out-String
    if ($out -match 'Error|Exception|does not exist|unable to resolve') {
        throw "YouTube app did not accept the link:`n$out"
    }
    Write-Host "Opened $Url"
}

function Assert-YouTubeFocused {
    $focus = (Invoke-Adb shell "dumpsys window | grep -E 'mCurrentFocus|mFocusedApp'" 2>&1 | Out-String)
    if ($focus -notmatch 'youtube') {
        throw "YouTube doesn't appear to be on screen (focus: $($focus.Trim())). Stopping instead of retrying."
    }
}

# ---------- screenshots ----------
function Get-ShotDir {
    $dir = Join-Path (Join-Path $script:Root 'screenshots') (Get-Date -Format 'yyyy-MM-dd')
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    return $dir
}

function Take-Shot([string]$Label) {
    Assert-Connected
    $safe = ($Label -replace '[^\w\-]', '_'); if (-not $safe) { $safe = 'shot' }
    $path = Join-Path (Get-ShotDir) ("{0}_{1}.png" -f (Get-Date -Format 'HHmmss'), $safe)

    # Capture raw bytes. PowerShell's > or | would re-encode as text and corrupt the PNG.
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $script:AdbExe
    $psi.Arguments = "-s $($script:Device) exec-out screencap -p"
    $psi.RedirectStandardOutput = $true
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $proc = [System.Diagnostics.Process]::Start($psi)
    $ms = New-Object System.IO.MemoryStream
    $proc.StandardOutput.BaseStream.CopyTo($ms)
    $proc.WaitForExit()
    $bytes = $ms.ToArray()

    $isPng = $bytes.Length -gt 8 -and $bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50 -and $bytes[2] -eq 0x4E -and $bytes[3] -eq 0x47
    if (-not $isPng) { throw "Screenshot is not a valid PNG ($($bytes.Length) bytes). Stopping." }
    [System.IO.File]::WriteAllBytes($path, $bytes)
    if ($bytes.Length -lt $script:MinPngBytes) {
        throw "Screenshot looks black/blank ($($bytes.Length) bytes, saved as $path). Stopping instead of retrying."
    }
    Write-Host "Saved $path"
    return $path
}

# ---------- preview ----------
function Add-Report([string]$ChannelName, [string]$Url, [string[]]$Files) {
    $report = Join-Path (Get-ShotDir) 'report.md'
    if (-not (Test-Path $report)) {
        Set-Content $report ("# Preview report - {0}`n" -f (Get-Date -Format 'yyyy-MM-dd')) -Encoding UTF8
    }
    $lines = @("", "## $ChannelName", "Page: $Url", "Taken: $(Get-Date -Format 'HH:mm:ss')", "")
    foreach ($f in $Files) { $lines += "- $(Split-Path $f -Leaf)" }
    Add-Content $report $lines -Encoding UTF8
    Write-Host "Report: $report"
}

function Invoke-Preview([string]$Name) {
    $ch  = Find-Channel $Name
    $url = (Channel-Base $ch) + '/videos'
    Open-Url $url
    Start-Sleep -Seconds $script:LoadWaitSec
    Assert-YouTubeFocused
    $slug = Norm $ch.name
    $files = @()
    for ($i = 1; $i -le $script:ScreenCount; $i++) {
        if ($i -gt 1) {
            for ($k = 0; $k -lt $script:ScrollPress; $k++) { Send-Key 'KEYCODE_DPAD_DOWN'; Start-Sleep -Milliseconds 300 }
            Start-Sleep -Seconds $script:ScrollWait
        }
        try { $files += Take-Shot ("{0}_screen{1}" -f $slug, $i) }
        catch {
            if ($files.Count) { Add-Report "$($ch.name) (INCOMPLETE: $($_.Exception.Message))" $url $files }
            throw
        }
    }
    Add-Report $ch.name $url $files
}

# ---------- list / add ----------
function Show-List {
    $d = Get-Data
    Write-Host "CHANNELS"
    foreach ($c in $d.channels) {
        $n = if ($c.notes) { "  [$($c.notes)]" } else { '' }
        Write-Host ("  {0,-16} {1,-16} {2}{3}" -f $c.name, $c.handle, (Channel-Base $c), $n)
    }
    Write-Host "VIDEOS"
    foreach ($v in $d.videos) {
        $u = if ($v.url) { $v.url } else { '(empty - add with: tv add "' + $v.name + '" <url>)' }
        Write-Host ("  {0,-24} {1}" -f $v.name, $u)
    }
}

function Add-Entry([string]$Name, [string]$Url) {
    if (-not $Name -or -not $Url) { throw 'Usage: tv add <name> <url>' }
    $d = Get-Data
    if ($Url -match 'youtube\.com/(@[^/?#]+)' -and $Url -notmatch 'watch\?v=') {
        $handle = $Matches[1]
        $existing = $d.channels | Where-Object { (Norm $_.name) -eq (Norm $Name) }
        if ($existing) { $existing.handle = $handle; $existing.url = "https://www.youtube.com/$handle" }
        else { $d.channels += [pscustomobject]@{ name = $Name; handle = $handle; url = "https://www.youtube.com/$handle"; notes = '' } }
        Write-Host "Channel saved: $Name ($handle)"
    } else {
        $existing = $d.videos | Where-Object { (Norm $_.name) -eq (Norm $Name) }
        if ($existing) { $existing.url = $Url } else { $d.videos += [pscustomobject]@{ name = $Name; url = $Url; notes = '' } }
        Write-Host "Video saved: $Name"
    }
    Save-Data $d
}

function Resolve-VideoUrl([string]$NameOrUrl) {
    if ($NameOrUrl -match '^https?://') { return $NameOrUrl }
    $d = Get-Data
    $v = $d.videos | Where-Object { (Norm $_.name) -eq (Norm $NameOrUrl) } | Select-Object -First 1
    if (-not $v) { throw "No saved video '$NameOrUrl'. Try: tv list" }
    if (-not $v.url) { throw "Video '$($v.name)' has no link yet. Add one: tv add `"$($v.name)`" <url>" }
    return $v.url
}

function Show-Check {
    & $script:AdbExe connect $script:Device
    & $script:AdbExe devices
    Assert-Connected
    Send-Key 'KEYCODE_HOME'
    Write-Host 'Sent KEYCODE_HOME - the box should be on its home screen now.'
}

# ---------- dispatcher ----------
function Invoke-TvExt {
    param([string[]]$CmdArgs)
    if (-not $CmdArgs -or $CmdArgs.Count -eq 0) { return $false }
    $cmd  = $CmdArgs[0].ToLower()
    $rest = @($CmdArgs | Select-Object -Skip 1)
    $arg1 = $rest -join ' '
    try {
        switch ($cmd) {
            'check'      { Show-Check }
            'channel'    { Open-Url (Channel-Base (Find-Channel $arg1)) }
            'videos'     { Open-Url ((Channel-Base (Find-Channel $arg1)) + '/videos') }
            'shorts'     { Open-Url ((Channel-Base (Find-Channel $arg1)) + '/shorts') }
            'video'      { Open-Url (Resolve-VideoUrl $arg1) }
            'list'       { Show-List }
            'add'        { Add-Entry $rest[0] ($rest | Select-Object -Skip 1 | Select-Object -First 1) }
            'shot'       { Take-Shot $(if ($arg1) { $arg1 } else { 'shot' }) | Out-Null }
            'preview'    { Invoke-Preview $arg1 }
            'previewall' { foreach ($c in (Get-Data).channels) { Invoke-Preview $c.name } }
            default      { return $false }
        }
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $global:LASTEXITCODE = 1
    }
    return $true
}

# Standalone mode: run directly (not dot-sourced).
if ($MyInvocation.InvocationName -ne '.') {
    if (-not (Invoke-TvExt $args)) {
        Write-Host 'Commands: check | channel <n> | videos <n> | shorts <n> | video <n|url> | list | add <name> <url> | shot [label] | preview <n> | previewall'
    }
}
