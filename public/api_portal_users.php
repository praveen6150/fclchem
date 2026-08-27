<?php
/**
 * Falcon Chemicals LLC - Enterprise Portal Users Gateway (MariaDB Direct)
 * Handles live GET, POST (save), and POST (delete/sync) for portal_users
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Locate db_config.php
$configCandidates = [
    '/var/www/kyc/db_config.php',
    '/var/www/FalconChemicalsWebsite/db_config.php',
    __DIR__ . '/db_config.php',
    __DIR__ . '/../db_config.php'
];

$foundConfig = null;
foreach ($configCandidates as $candidate) {
    if (file_exists($candidate)) {
        $foundConfig = $candidate;
        break;
    }
}

if (!$foundConfig) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database configuration file db_config.php not found']);
    exit;
}

require_once $foundConfig;

// Ensure role enum supports operator
try {
    $pdo->exec("ALTER TABLE portal_users MODIFY COLUMN role ENUM('admin','manager','analyst','operator','viewer') NOT NULL DEFAULT 'viewer'");
} catch (Exception $e) {}

// Read incoming request
$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?? $_POST;
$action = $data['action'] ?? ($data['user'] ? 'save' : (isset($data['username']) && !isset($data['fullName']) ? 'delete' : 'save'));

// GET: Read all active users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM portal_users WHERE isActive = 1 ORDER BY FIELD(role, 'admin','manager','analyst','operator','viewer'), username ASC");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $users = [];
        foreach ($rows as $r) {
            $reportIds = [];
            if (!empty($r['allowedReportIds'])) {
                $dec = json_decode($r['allowedReportIds'], true);
                $reportIds = is_array($dec) ? $dec : [];
            }
            $users[] = [
                'id' => $r['id'],
                'username' => $r['username'],
                'fullName' => $r['fullName'],
                'email' => $r['email'],
                'password' => $r['password'],
                'role' => $r['role'],
                'department' => $r['department'],
                'companyOrBranch' => $r['companyOrBranch'],
                'isActive' => (bool)$r['isActive'],
                'authMethod' => $r['authMethod'] ?? 'password',
                'ipPolicy' => $r['ipPolicy'] ?? 'office_only',
                'customAllowedSubnet' => $r['customAllowedSubnet'] ?? '192.168.100.0/24',
                'allowedReportIds' => $reportIds,
                'createdDate' => $r['createdDate'] ?? date('Y-m-d'),
                'lastLogin' => $r['lastLogin'] ?? 'Never',
                'lastLoginIp' => $r['lastLoginIp'] ?? '192.168.100.45'
            ];
        }
        echo json_encode(['success' => true, 'source' => 'mariadb', 'users' => $users]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

// POST Action: DELETE USER
if ($action === 'delete' || (!empty($data['username']) && empty($data['fullName']) && empty($data['user']))) {
    $targetUsername = strtolower(trim($data['username'] ?? $data['user']['username'] ?? ''));
    $targetId = $data['id'] ?? $data['user']['id'] ?? '';
    
    if (in_array($targetUsername, ['praveen', 'admin'])) {
        echo json_encode(['success' => false, 'error' => 'Chief Admin account cannot be deleted']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM portal_users WHERE username = :u OR id = :i");
        $stmt->execute([':u' => $targetUsername, ':i' => $targetId]);
        echo json_encode(['success' => true, 'action' => 'deleted', 'username' => $targetUsername, 'affected' => $stmt->rowCount()]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

// POST Action: SYNC ALL USERS
if ($action === 'sync' || (!empty($data['users']) && is_array($data['users']))) {
    $userList = $data['users'];
    try {
        $activeUsernames = array_map(function($u) { return strtolower(trim($u['username'])); }, $userList);
        if (!empty($activeUsernames)) {
            $inClause = implode(',', array_fill(0, count($activeUsernames), '?'));
            $delStmt = $pdo->prepare("DELETE FROM portal_users WHERE username NOT IN ($inClause) AND username NOT IN ('praveen', 'admin')");
            $delStmt->execute($activeUsernames);
        }

        $sql = "INSERT INTO portal_users (
            id, username, fullName, email, password, role, department, companyOrBranch, 
            isActive, authMethod, ipPolicy, customAllowedSubnet, allowedReportIds, createdDate, lastLogin, lastLoginIp
        ) VALUES (
            :id, :username, :fullName, :email, :password, :role, :department, :companyOrBranch, 
            :isActive, :authMethod, :ipPolicy, :customAllowedSubnet, :allowedReportIds, :createdDate, :lastLogin, :lastLoginIp
        ) ON DUPLICATE KEY UPDATE 
            fullName = VALUES(fullName),
            email = VALUES(email),
            password = IF(VALUES(password) != '', VALUES(password), password),
            role = VALUES(role),
            department = VALUES(department),
            companyOrBranch = VALUES(companyOrBranch),
            isActive = VALUES(isActive),
            authMethod = VALUES(authMethod),
            ipPolicy = VALUES(ipPolicy),
            customAllowedSubnet = VALUES(customAllowedSubnet),
            allowedReportIds = VALUES(allowedReportIds)";

        $stmt = $pdo->prepare($sql);
        foreach ($userList as $u) {
            $id = !empty($u['id']) ? $u['id'] : ('usr_' . strtolower(trim($u['username'])) . '_' . time());
            $username = strtolower(trim($u['username']));
            $stmt->execute([
                ':id' => $id,
                ':username' => $username,
                ':fullName' => trim($u['fullName'] ?? $u['full_name'] ?? $username),
                ':email' => trim($u['email'] ?? ($username . '@falconchemicals.com')),
                ':password' => !empty($u['password']) ? $u['password'] : 'Falcon@2026',
                ':role' => $u['role'] ?? 'operator',
                ':department' => $u['department'] ?? 'Commercial Sales & Dispatch',
                ':companyOrBranch' => $u['companyOrBranch'] ?? $u['branch'] ?? 'Falcon Chemicals LLC',
                ':isActive' => (!empty($u['isActive']) || $u['isActive'] === true) ? 1 : 0,
                ':authMethod' => $u['authMethod'] ?? 'token_otp',
                ':ipPolicy' => $u['ipPolicy'] ?? 'office_only',
                ':customAllowedSubnet' => $u['customAllowedSubnet'] ?? '192.168.100.0/24',
                ':allowedReportIds' => is_array($u['allowedReportIds'] ?? null) ? json_encode($u['allowedReportIds']) : ($u['allowedReportIds'] ?? '[]'),
                ':createdDate' => $u['createdDate'] ?? date('Y-m-d'),
                ':lastLogin' => $u['lastLogin'] ?? 'Never',
                ':lastLoginIp' => $u['lastLoginIp'] ?? '192.168.100.45'
            ]);
        }
        echo json_encode(['success' => true, 'action' => 'synced', 'count' => count($userList)]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

// POST Action: SAVE SINGLE USER
$target = $data['user'] ?? $data;
if (!empty($target['username'])) {
    $username = strtolower(trim($target['username']));
    $id = !empty($target['id']) ? $target['id'] : ('usr_' . $username . '_' . time());
    $fullName = trim($target['fullName'] ?? $target['full_name'] ?? $username);
    $email = trim($target['email'] ?? ($username . '@falconchemicals.com'));
    $password = !empty($target['password']) ? $target['password'] : 'Falcon@2026';
    $role = $target['role'] ?? 'operator';
    $department = $target['department'] ?? 'Commercial Sales & Dispatch';
    $companyOrBranch = $target['companyOrBranch'] ?? $target['branch'] ?? 'Falcon Chemicals LLC';
    $isActive = isset($target['isActive']) ? ($target['isActive'] ? 1 : 0) : 1;
    $authMethod = $target['authMethod'] ?? 'token_otp';
    $ipPolicy = $target['ipPolicy'] ?? 'office_only';
    $customAllowedSubnet = $target['customAllowedSubnet'] ?? '192.168.100.0/24';
    $allowedReportIds = is_array($target['allowedReportIds'] ?? null) ? json_encode($target['allowedReportIds']) : ($target['allowedReportIds'] ?? '[]');
    $createdDate = $target['createdDate'] ?? date('Y-m-d');
    $lastLogin = $target['lastLogin'] ?? 'Never';
    $lastLoginIp = $target['lastLoginIp'] ?? '192.168.100.45';

    try {
        $sql = "INSERT INTO portal_users (
            id, username, fullName, email, password, role, department, companyOrBranch, 
            isActive, authMethod, ipPolicy, customAllowedSubnet, allowedReportIds, createdDate, lastLogin, lastLoginIp
        ) VALUES (
            :id, :username, :fullName, :email, :password, :role, :department, :companyOrBranch, 
            :isActive, :authMethod, :ipPolicy, :customAllowedSubnet, :allowedReportIds, :createdDate, :lastLogin, :lastLoginIp
        ) ON DUPLICATE KEY UPDATE 
            fullName = VALUES(fullName),
            email = VALUES(email),
            password = IF(VALUES(password) != '', VALUES(password), password),
            role = VALUES(role),
            department = VALUES(department),
            companyOrBranch = VALUES(companyOrBranch),
            isActive = VALUES(isActive),
            authMethod = VALUES(authMethod),
            ipPolicy = VALUES(ipPolicy),
            customAllowedSubnet = VALUES(customAllowedSubnet),
            allowedReportIds = VALUES(allowedReportIds)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':username' => $username,
            ':fullName' => $fullName,
            ':email' => $email,
            ':password' => $password,
            ':role' => $role,
            ':department' => $department,
            ':companyOrBranch' => $companyOrBranch,
            ':isActive' => $isActive,
            ':authMethod' => $authMethod,
            ':ipPolicy' => $ipPolicy,
            ':customAllowedSubnet' => $customAllowedSubnet,
            ':allowedReportIds' => $allowedReportIds,
            ':createdDate' => $createdDate,
            ':lastLogin' => $lastLogin,
            ':lastLoginIp' => $lastLoginIp
        ]);

        echo json_encode(['success' => true, 'action' => 'saved', 'username' => $username, 'message' => "User @{$username} written to MariaDB"]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

echo json_encode(['success' => false, 'error' => 'No action performed']);
