<?php
/**
 * Falcon Chemicals LLC - Enterprise User & RBAC Persistence Gateway
 * 
 * Automatically connects to MariaDB / MySQL using /etc/fcl1/.env credentials
 * and syncs portal users with `falcon_kyc.portal_users`.
 * Also mirrors to `users_store.json` as a reliable high-speed fallback cache.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$STORE_FILE = __DIR__ . '/users_store.json';

// 1. Parse /etc/fcl1/.env or local environment configuration
function loadEnvConfig() {
    $config = [
        'DB_HOST' => '127.0.0.1',
        'DB_PORT' => '3306',
        'DB_NAME' => 'falcon_kyc',
        'DB_USER' => 'kyc_app',
        'DB_PASS' => ''
    ];

    $envPaths = ['/etc/fcl1/.env', __DIR__ . '/../.env', __DIR__ . '/.env'];
    foreach ($envPaths as $envPath) {
        if (file_exists($envPath) && is_readable($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || strpos($line, '#') === 0) continue;
                if (strpos($line, '=') !== false) {
                    list($key, $val) = explode('=', $line, 2);
                    $key = trim($key);
                    $val = trim($val, " \t\n\r\0\x0B\"'");
                    $config[$key] = $val;
                }
            }
            break;
        }
    }
    return $config;
}

$env = loadEnvConfig();

// 2. Establish MariaDB / MySQL PDO Connection
function getDbConnection($env) {
    try {
        $dsn = "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_NAME']};charset=utf8mb4";
        $pdo = new PDO($dsn, $env['DB_USER'], $env['DB_PASS'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 3
        ]);

        // Auto-bootstrap portal_users table if not already created
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `portal_users` (
                `id` VARCHAR(64) NOT NULL PRIMARY KEY,
                `username` VARCHAR(64) NOT NULL UNIQUE,
                `fullName` VARCHAR(128) NOT NULL,
                `email` VARCHAR(128) NOT NULL,
                `password` VARCHAR(255) NOT NULL,
                `role` ENUM('admin', 'manager', 'analyst', 'viewer') NOT NULL DEFAULT 'viewer',
                `department` VARCHAR(128) NOT NULL,
                `companyOrBranch` VARCHAR(128) NOT NULL,
                `isActive` TINYINT(1) NOT NULL DEFAULT 1,
                `authMethod` VARCHAR(32) NOT NULL DEFAULT 'password',
                `ipPolicy` VARCHAR(32) NOT NULL DEFAULT 'office_only',
                `customAllowedSubnet` VARCHAR(64) NULL DEFAULT '192.168.100.0/24',
                `allowedReportIds` TEXT NULL,
                `createdDate` VARCHAR(32) NOT NULL,
                `lastLogin` VARCHAR(32) NULL,
                `lastLoginIp` VARCHAR(64) NULL,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        return $pdo;
    } catch (Exception $e) {
        return null;
    }
}

$pdo = getDbConnection($env);

// Handle GET: Load users from Database (or file fallback)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM `portal_users` ORDER BY FIELD(`role`, 'admin', 'manager', 'analyst', 'viewer'), `username` ASC");
            $rows = $stmt->fetchAll();

            if (!empty($rows)) {
                $users = [];
                foreach ($rows as $row) {
                    $reportIds = [];
                    if (!empty($row['allowedReportIds'])) {
                        $decoded = json_decode($row['allowedReportIds'], true);
                        $reportIds = is_array($decoded) ? $decoded : explode(',', $row['allowedReportIds']);
                    }
                    $users[] = [
                        'id' => $row['id'],
                        'username' => $row['username'],
                        'fullName' => $row['fullName'],
                        'email' => $row['email'],
                        'password' => $row['password'],
                        'role' => $row['role'],
                        'department' => $row['department'],
                        'companyOrBranch' => $row['companyOrBranch'],
                        'isActive' => (bool)$row['isActive'],
                        'authMethod' => $row['authMethod'],
                        'ipPolicy' => $row['ipPolicy'],
                        'customAllowedSubnet' => $row['customAllowedSubnet'],
                        'allowedReportIds' => $reportIds,
                        'createdDate' => $row['createdDate'],
                        'lastLogin' => $row['lastLogin'],
                        'lastLoginIp' => $row['lastLoginIp']
                    ];
                }

                echo json_encode(['source' => 'mariadb', 'database' => $env['DB_NAME'], 'users' => $users]);
                exit;
            }
        } catch (Exception $e) {
            // DB query fallback to file
        }
    }

    // Fallback: Read from users_store.json
    if (file_exists($STORE_FILE)) {
        $content = file_get_contents($STORE_FILE);
        if ($content && json_decode($content)) {
            echo $content;
            exit;
        }
    }
    
    echo json_encode(['source' => 'empty', 'users' => []]);
    exit;
}

// Handle POST: Save updated users list to Database & File
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
        exit;
    }

    $usersToSave = isset($data['users']) ? $data['users'] : (is_array($data) ? $data : null);

    if (!is_array($usersToSave)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Users array missing']);
        exit;
    }

    $dbSaved = false;
    $dbError = null;

    if ($pdo) {
        try {
            $pdo->beginTransaction();

            // Clear old records and replace with current updated state
            $pdo->exec("DELETE FROM `portal_users`");

            $insertStmt = $pdo->prepare("
                INSERT INTO `portal_users` (
                    `id`, `username`, `fullName`, `email`, `password`, `role`, 
                    `department`, `companyOrBranch`, `isActive`, `authMethod`, 
                    `ipPolicy`, `customAllowedSubnet`, `allowedReportIds`, 
                    `createdDate`, `lastLogin`, `lastLoginIp`
                ) VALUES (
                    :id, :username, :fullName, :email, :password, :role,
                    :department, :companyOrBranch, :isActive, :authMethod,
                    :ipPolicy, :customAllowedSubnet, :allowedReportIds,
                    :createdDate, :lastLogin, :lastLoginIp
                )
            ");

            foreach ($usersToSave as $u) {
                $reportIdsJson = isset($u['allowedReportIds']) ? json_encode($u['allowedReportIds']) : '[]';
                $insertStmt->execute([
                    ':id' => $u['id'],
                    ':username' => $u['username'],
                    ':fullName' => $u['fullName'],
                    ':email' => $u['email'],
                    ':password' => $u['password'],
                    ':role' => $u['role'],
                    ':department' => $u['department'] ?? 'General',
                    ':companyOrBranch' => $u['companyOrBranch'] ?? 'Falcon Chemicals LLC',
                    ':isActive' => (!empty($u['isActive']) || $u['isActive'] === true) ? 1 : 0,
                    ':authMethod' => $u['authMethod'] ?? 'password',
                    ':ipPolicy' => $u['ipPolicy'] ?? 'office_only',
                    ':customAllowedSubnet' => $u['customAllowedSubnet'] ?? '192.168.100.0/24',
                    ':allowedReportIds' => $reportIdsJson,
                    ':createdDate' => $u['createdDate'] ?? date('Y-m-d'),
                    ':lastLogin' => $u['lastLogin'] ?? null,
                    ':lastLoginIp' => $u['lastLoginIp'] ?? null
                ]);
            }

            $pdo->commit();
            $dbSaved = true;
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $dbError = $e->getMessage();
        }
    }

    // Always mirror to users_store.json as file cache
    file_put_contents($STORE_FILE, json_encode(['users' => $usersToSave], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

    echo json_encode([
        'success' => true,
        'persistedTo' => $dbSaved ? 'MariaDB (`falcon_kyc.portal_users`) + File Cache' : 'File Cache (`users_store.json`)',
        'count' => count($usersToSave),
        'dbError' => $dbError,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}
