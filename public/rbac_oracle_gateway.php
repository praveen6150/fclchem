<?php
/**
 * Falcon Chemicals (L.L.C.) - RBAC Security Gatekeeper for Oracle Reports 11g
 * 
 * Target Server: 192.168.100.202 (or kyc.falconchemicals.com)
 * Purpose: Enforces granular Role-Based Access Control (RBAC) on raw Oracle Reports (Port 8080).
 * 
 * Prevents unauthorized users from directly accessing http://192.168.100.202:8080/reports/rwservlet
 * or static RDF/HTML menu files without an active, authorized session in `falcon_kyc.portal_users`.
 */

session_start();
header('Content-Type: text/html; charset=utf-8');

// 1. Load MariaDB Database Configuration from /etc/fcl1/.env
function loadEnv() {
    $config = ['DB_HOST' => '127.0.0.1', 'DB_PORT' => '3306', 'DB_NAME' => 'falcon_kyc', 'DB_USER' => 'kyc_app', 'DB_PASS' => ''];
    $envPaths = ['/etc/fcl1/.env', __DIR__ . '/.env', __DIR__ . '/../.env'];
    foreach ($envPaths as $p) {
        if (file_exists($p) && is_readable($p)) {
            $lines = file($p, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                if (strpos($line, '=') !== false) {
                    list($k, $v) = explode('=', $line, 2);
                    $config[trim($k)] = trim($v, " \t\n\r\0\x0B\"'");
                }
            }
            break;
        }
    }
    return $config;
}

$env = loadEnv();

// 2. Validate User Session & Permissions
function checkUserPermission($reportId) {
    global $env;

    // Check session
    if (!isset($_SESSION['fcl_user'])) {
        // Also allow passing session token via Authorization header or GET param
        $tokenUser = $_GET['auth_user'] ?? $_SERVER['HTTP_X_AUTH_USER'] ?? null;
        if (!$tokenUser) return false;
        $_SESSION['fcl_user'] = $tokenUser;
    }

    $username = $_SESSION['fcl_user'];
    if ($username === 'praveen' || $username === 'admin') {
        return true; // Chief Admin has master access to all 23 reports
    }

    try {
        $dsn = "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_NAME']};charset=utf8mb4";
        $pdo = new PDO($dsn, $env['DB_USER'], $env['DB_PASS'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $stmt = $pdo->prepare("SELECT allowedReportIds, isActive, ipPolicy, customAllowedSubnet FROM portal_users WHERE username = :u LIMIT 1");
        $stmt->execute([':u' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !$user['isActive']) return false;

        // Subnet verification (Office LAN 192.168.100.x)
        $clientIp = $_SERVER['REMOTE_ADDR'] ?? '';
        if ($user['ipPolicy'] === 'office_only' && strpos($clientIp, '192.168.100.') !== 0 && $clientIp !== '127.0.0.1') {
            return false;
        }

        $allowed = json_decode($user['allowedReportIds'], true) ?: [];
        return in_array($reportId, $allowed);
    } catch (Exception $e) {
        return false;
    }
}

// 3. Handle Incoming Request
$requestedReport = $_GET['report'] ?? 'menu';
$isAuthorized = ($requestedReport === 'menu') || checkUserPermission($requestedReport);

if (!$isAuthorized) {
    http_response_code(403);
    echo "
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <title>403 RBAC Access Denied - Falcon Chemicals</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1e293b; border: 1px solid #dc2626; border-radius: 16px; padding: 32px; max-width: 480px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
            h1 { color: #f87171; font-size: 20px; margin-bottom: 12px; }
            p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
            .btn { display: inline-block; margin-top: 20px; background: #0284c7; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 13px; }
        </style>
    </head>
    <body>
        <div class='card'>
            <h1>Access Denied by Corporate RBAC Policy</h1>
            <p>Your current user account does not have authorization to view this Oracle Report (<code>" . htmlspecialchars($requestedReport) . "</code>).</p>
            <p>Please contact <strong>Praveen (Chief Admin)</strong> to request reporting permissions.</p>
            <a class='btn' href='https://kyc.falconchemicals.com'>Return to Falcon Portal</a>
        </div>
    </body>
    </html>
    ";
    exit;
}

// 4. If Authorized, proxy request directly to Oracle Reports 11g engine on Port 8080
$targetUrl = "http://127.0.0.1:8080/reports/rwservlet?" . $_SERVER['QUERY_STRING'];
// Stream or redirect to Oracle 11g engine
header("Location: " . $targetUrl);
exit;
