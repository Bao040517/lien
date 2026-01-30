$port = 8090
$tcp = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($tcp) {
    $processId = $tcp.OwningProcess
    $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Host "Stopping process '$($proc.ProcessName)' (ID: $processId) on port $port..."
        Stop-Process -Id $processId -Force
        Write-Host "Success!"
    } else {
        # Process might be gone or access denied, try generic kill
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "Process ID $processId killed."
    }
} else {
    Write-Host "No process found on port $port."
}
