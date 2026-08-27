<?php
/**
 * Falcon Chemicals Enterprise Portal - Live MariaDB & PHP Diagnostic Test Tool
 * URL: http://192.168.100.202/test_db_write.php or http://127.0.0.1/test_db_write.php
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    echo json_encode(['status' => 'ok']);
    exit;
}

$results = [
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => PHP_VERSION,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'CLI/Unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? __DIR__,
    'steps' => []
];

// Step 1: Locate db_config.php
$configCandidates = [
    '/var/www/kyc/db_config.php',
    '/var/www/FalconChemicalsWebsite/db_config.php',
    __DIR__ . '/db_config.php',
    __DIR__ . '/../db_config.php',
    __DIR__ . '/../kyc/db_config.php'
];

$foundConfig = null;
foreach ($configCandidates as $candidate) {
    if (file_exists($candidate)) {
        $foundConfig = $candidate;
        break;
    }
}

if (!$foundConfig) {
    $results['steps'][] = [
        'step' => '1. Locate db_config.php',
        'status' => 'FAILED',
        'message' => 'db_config.php was not found in checked paths: ' . implode(', ', $configCandidates)
    ];
    echo json_encode($results, JSON_PRETTY_PRINT);
    exit;
}

$results['steps'][] = [
    'step' => '1. Locate db_config.php',
    'status' => 'PASSED',
    'config_path' => $foundConfig
];

// Step 2: Test PDO Connection
try {
    require_once $foundConfig;
    if (!isset($pdo) || !($pdo instanceof PDO)) {
        throw new Exception('PDO connection object ($pdo) was not created by ' . $foundConfig);
    }
    $versionStmt = $pdo->query('SELECT VERSION() as v');
    $dbVer = $versionStmt->fetch(PDO::FETCH_ASSOC)['v'] ?? 'Unknown';
    $results['steps'][] = [
        'step' => '2. Connect to MariaDB via PDO',
        'status' => 'PASSED',
        'database_version' => $dbVer
    ];
} catch (Exception $e) {
    $results['steps'][] = [
        'step' => '2. Connect to MariaDB via PDO',
        'status' => 'FAILED',
        'error' => $e->getMessage()
    ];
    echo json_encode($results, JSON_PRETTY_PRINT);
    exit;
}

// Step 3: Inspect portal_users table schema & role enum
try {
    $descStmt = $pdo->query('DESC portal_users');
    $columns = $descStmt->fetchAll(PDO::FETCH_ASSOC);
    $columnNames = array_column($columns, 'Field');
    $roleCol = null;
    foreach ($columns as $col) {
        if ($col['Field'] === 'role') {
            $roleCol = $col['Type'];
        }
    }

    $results['steps'][] = [
        'step' => '3. Inspect portal_users columns',
        'status' => 'PASSED',
        'column_count' => count($columns),
        'columns' => $columnNames,
        'role_enum_definition' => $roleCol
    ];
} catch (Exception $e) {
    $results['steps'][] = [
        'step' => '3. Inspect portal_users columns',
        'status' => 'FAILED',
        'error' => $e->getMessage()
    ];
    echo json_encode($results, JSON_PRETTY_PRINT);
    exit;
}

// Step 4: Perform Test Write (Sonal Chauhan)
$testUser = [
    'id' => 'usr_sonal_06',
    'username' => 'sonal',
    'fullName' => 'Sonal Chauhan',
    'email' => 'sales2@falconchemicals.com',
    'password' => 'Falcon@2026',
    'role' => 'operator',
    'department' => 'Commercial Sales & Dispatch',
    'companyOrBranch' => 'Falcon Chemicals LLC - Dubai HQ',
    'isActive' => 1,
    'authMethod' => 'token_otp',
    'ipPolicy' => 'office_only',
    'customAllowedSubnet' => '192.168.100.0/24',
    'allowedReportIds' => json_encode([
        'ora_sales_div_drilldown',
        'ora_sales_avg_analysis',
        'ora_sales_salesman_rep',
        'ora_sales_pending_orders',
        'ora_sales_return_item',
        'ora_dispatch_daily_report'
    ]),
    'createdDate' => date('Y-m-d'),
    'lastLogin' => 'Never',
    'lastLoginIp' => '192.168.100.45'
];

try {
    // If role enum doesn't have operator, adjust definition
    if ($roleCol && strpos($roleCol, "'operator'") === false) {
        $pdo->exec("ALTER TABLE portal_users MODIFY COLUMN role ENUM('admin','manager','analyst','operator','viewer') NOT NULL DEFAULT 'viewer'");
    }

    $insertSql = "INSERT INTO portal_users (
        id, username, fullName, email, password, role, department, companyOrBranch, 
        isActive, authMethod, ipPolicy, customAllowedSubnet, allowedReportIds, createdDate, lastLogin, lastLoginIp
    ) VALUES (
        :id, :username, :fullName, :email, :password, :role, :department, :companyOrBranch, 
        :isActive, :authMethod, :ipPolicy, :customAllowedSubnet, :allowedReportIds, :createdDate, :lastLogin, :lastLoginIp
    ) ON DUPLICATE KEY UPDATE 
        fullName = VALUES(fullName),
        email = VALUES(email),
        role = VALUES(role),
        department = VALUES(department),
        companyOrBranch = VALUES(companyOrBranch),
        isActive = VALUES(isActive),
        authMethod = VALUES(authMethod),
        ipPolicy = VALUES(ipPolicy),
        customAllowedSubnet = VALUES(customAllowedSubnet),
        allowedReportIds = VALUES(allowedReportIds)";

    $writeStmt = $pdo->prepare($insertSql);
    $writeStmt->execute($testUser);

    $results['steps'][] = [
        'step' => '4. Execute Test INSERT for user: sonal',
        'status' => 'PASSED',
        'action' => 'INSERT / ON DUPLICATE KEY UPDATE succeeded'
    ];
} catch (Exception $e) {
    $results['steps'][] = [
        'step' => '4. Execute Test INSERT for user: sonal',
        'status' => 'FAILED',
        'error' => $e->getMessage()
    ];
}

// Step 5: Read Current User Count & Usernames
try {
    $readStmt = $pdo->query("SELECT id, username, fullName, role, email, department, isActive FROM portal_users ORDER BY username ASC");
    $allUsers = $readStmt->fetchAll(PDO::FETCH_ASSOC);

    $results['steps'][] = [
        'step' => '5. Query all records from portal_users',
        'status' => 'PASSED',
        'total_users_in_mariadb' => count($allUsers),
        'users' => $allUsers
    ];
} catch (Exception $e) {
    $results['steps'][] = [
        'step' => '5. Query all records from portal_users',
        'status' => 'FAILED',
        'error' => $e->getMessage()
    ];
}

echo json_encode($results, JSON_PRETTY_PRINT);
