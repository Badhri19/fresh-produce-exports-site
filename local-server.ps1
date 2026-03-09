param(
  [int]$Port = 8090,
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'
$rootPath = (Resolve-Path $Root).Path
$listener = New-Object System.Net.HttpListener
$prefix = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "Serving $rootPath at $prefix"

function Get-ContentType([string]$filePath) {
  switch ([IO.Path]::GetExtension($filePath).ToLowerInvariant()) {
    '.html' { 'text/html; charset=utf-8' }
    '.css'  { 'text/css; charset=utf-8' }
    '.js'   { 'application/javascript; charset=utf-8' }
    '.json' { 'application/json; charset=utf-8' }
    '.png'  { 'image/png' }
    '.jpg'  { 'image/jpeg' }
    '.jpeg' { 'image/jpeg' }
    '.webp' { 'image/webp' }
    '.svg'  { 'image/svg+xml' }
    '.gif'  { 'image/gif' }
    '.ico'  { 'image/x-icon' }
    '.pdf'  { 'application/pdf' }
    default { 'application/octet-stream' }
  }
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
    $rel = $rel -replace '/', '\\'
    $full = Join-Path $rootPath $rel

    if ((Test-Path $full) -and -not (Get-Item $full).PSIsContainer) {
      $bytes = [IO.File]::ReadAllBytes($full)
      $ctx.Response.StatusCode = 200
      $ctx.Response.ContentType = Get-ContentType $full
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    else {
      $msg = [Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $ctx.Response.StatusCode = 404
      $ctx.Response.ContentType = 'text/plain; charset=utf-8'
      $ctx.Response.ContentLength64 = $msg.Length
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
  }
  catch {
    $msg = [Text.Encoding]::UTF8.GetBytes('500 Server Error')
    $ctx.Response.StatusCode = 500
    $ctx.Response.ContentType = 'text/plain; charset=utf-8'
    $ctx.Response.ContentLength64 = $msg.Length
    $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
  }
  finally {
    $ctx.Response.OutputStream.Close()
  }
}
