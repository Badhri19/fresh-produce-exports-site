param(
  [int]$Port = 8090,
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'
$rootPath = (Resolve-Path $Root).Path
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
$listener.Start()
Write-Output "Serving $rootPath at http://127.0.0.1:$Port/"

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

function Send-Response($stream, [int]$status, [string]$statusText, [byte[]]$body, [string]$contentType = 'text/plain; charset=utf-8') {
  $header = "HTTP/1.1 $status $statusText`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
  $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
  $stream.Write($headerBytes, 0, $headerBytes.Length)
  if ($body.Length -gt 0) {
    $stream.Write($body, 0, $body.Length)
  }
  $stream.Flush()
}

function Resolve-RequestedFile([string]$root, [string]$rawPath) {
  $cleanPath = $rawPath.Split('?')[0]
  $decoded = [Uri]::UnescapeDataString($cleanPath).Trim()

  # Normalize common mobile/browser variants.
  $decoded = $decoded.TrimStart('/')
  $decoded = $decoded.TrimEnd('/')

  if ([string]::IsNullOrWhiteSpace($decoded)) {
    $decoded = 'index.html'
  }

  if ($decoded.Contains('..')) {
    return $null
  }

  $decoded = $decoded -replace '/', '\\'
  $candidate = Join-Path $root $decoded

  if ((Test-Path $candidate) -and -not (Get-Item $candidate).PSIsContainer) {
    return $candidate
  }

  # If user typed /product-inquiry instead of /product-inquiry.html.
  if (-not [IO.Path]::HasExtension($decoded)) {
    $htmlCandidate = Join-Path $root ($decoded + '.html')
    if ((Test-Path $htmlCandidate) -and -not (Get-Item $htmlCandidate).PSIsContainer) {
      return $htmlCandidate
    }
  }

  return $null
}

while ($true) {
  $client = $null
  try {
    $client = $listener.AcceptTcpClient()
    $stream = $client.GetStream()
    $reader = New-Object IO.StreamReader($stream, [Text.Encoding]::ASCII, $false, 1024, $true)

    $requestLine = $reader.ReadLine()
    if ([string]::IsNullOrWhiteSpace($requestLine)) {
      $client.Close()
      continue
    }

    while ($true) {
      $line = $reader.ReadLine()
      if ($null -eq $line -or $line -eq '') { break }
    }

    $parts = $requestLine.Split(' ')
    if ($parts.Count -lt 2) {
      Send-Response $stream 400 'Bad Request' ([Text.Encoding]::UTF8.GetBytes('Bad Request'))
      $client.Close()
      continue
    }

    $method = $parts[0].ToUpperInvariant()
    $rawPath = $parts[1]

    if ($method -ne 'GET' -and $method -ne 'HEAD') {
      Send-Response $stream 405 'Method Not Allowed' ([Text.Encoding]::UTF8.GetBytes('Method Not Allowed'))
      $client.Close()
      continue
    }

    $fullPath = Resolve-RequestedFile -root $rootPath -rawPath $rawPath

    if ($null -eq $fullPath) {
      Send-Response $stream 404 'Not Found' ([Text.Encoding]::UTF8.GetBytes('404 Not Found'))
      $client.Close()
      continue
    }

    $bytes = [IO.File]::ReadAllBytes($fullPath)
    $contentType = Get-ContentType $fullPath

    if ($method -eq 'HEAD') {
      Send-Response $stream 200 'OK' ([byte[]]::new(0)) $contentType
    }
    else {
      Send-Response $stream 200 'OK' $bytes $contentType
    }

    $client.Close()
  }
  catch {
    if ($client) { $client.Close() }
  }
}
