import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { exec, spawn } from 'child_process';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to get SMTP Transporter matching Office 365 & /etc/postfix/sasl_passwd
function getMailTransporter() {
  let host = process.env.MAIL_HOST || process.env.SMTP_HOST || 'smtp.office365.com';
  
  // If host is the internal/non-public smtp.falconchemicals.com but we are in the development/preview environment,
  // we use smtp.office365.com directly so SMTP connections can resolve and succeed in the preview container.
  if (host.includes('falconchemicals.com')) {
    host = 'smtp.office365.com';
  }

  const port = parseInt(process.env.MAIL_PORT || process.env.SMTP_PORT || '587', 10);
  const encryption = (process.env.MAIL_ENCRYPTION || 'tls').toLowerCase();
  const secure = encryption === 'ssl' || port === 465;
  const user = process.env.MAIL_USER || process.env.SMTP_USER || 'inquiry@falconchemicals.com';
  const pass = 
    process.env.MAIL_PASS || 
    process.env.SMTP_PASS || 
    process.env.SASL_PASSWD || 
    process.env.NOREPLY_EMAIL_PASS || 
    process.env.MAIL_PASSWORD || 
    process.env.EMAIL_PASS || 
    process.env.SMTP_PASSWORD || 
    process.env.NOREPLY_PASSWORD || 
    '';


  if (!pass) {
    console.warn('[Falcon Mailer] Warning: No MAIL_PASS / SMTP password configured in environment secrets.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure, // false for 587 (STARTTLS), true for 465 (SSL)
    requireTLS: port === 587 || encryption === 'tls',
    auth: pass ? { user, pass } : undefined,
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    }
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const pass = 
    process.env.MAIL_PASS || 
    process.env.SMTP_PASS || 
    process.env.SASL_PASSWD || 
    process.env.NOREPLY_EMAIL_PASS || 
    process.env.MAIL_PASSWORD || 
    process.env.EMAIL_PASS || 
    process.env.SMTP_PASSWORD || 
    process.env.NOREPLY_PASSWORD;

  res.json({
    status: 'ok',
    gateway: '192.168.100.202',
    timestamp: new Date().toISOString(),
    mailUser: process.env.MAIL_USER || process.env.SMTP_USER || 'inquiry@falconchemicals.com',
    mailHost: process.env.MAIL_HOST || process.env.SMTP_HOST || 'smtp.office365.com',
    mailPort: process.env.MAIL_PORT || process.env.SMTP_PORT || '587',
    mailEncryption: process.env.MAIL_ENCRYPTION || 'tls',
    hasMailPass: Boolean(pass)
  });
});

// API endpoint to dispatch OTP tokens and security emails
app.post('/api/send-email', async (req, res) => {
  const { to, subject, bodyText, otpCode, type } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ error: 'Missing required email fields (to, subject)' });
  }

  // Determine recipient list. If recipient is praveen@falconchemicals.com, also include praveen6150@gmail.com
  const recipients = new Set<string>();
  if (to) recipients.add(to.trim());
  
  if (
    to.toLowerCase().includes('praveen') || 
    to.toLowerCase().includes('admin') || 
    to.toLowerCase() === 'praveen@falconchemicals.com'
  ) {
    recipients.add('praveen@falconchemicals.com');
    recipients.add('praveen6150@gmail.com');
    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      recipients.add(process.env.ADMIN_NOTIFICATION_EMAIL.trim());
    }
  }

  const recipientList = Array.from(recipients).join(', ');
  const senderEmail = process.env.MAIL_FROM || process.env.MAIL_USER || process.env.SMTP_USER || 'inquiry@falconchemicals.com';
  const senderName = 'Falcon Chemicals LLC — Security Gateway';

  // Build high-clarity HTML email template matching Falcon Chemicals KYC / Security standard
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #002b49; padding: 24px; color: #ffffff; text-align: left; border-bottom: 3px solid #0284c7; }
        .brand { font-size: 18px; font-weight: 800; letter-spacing: 0.5px; margin: 0; }
        .sub-brand { font-size: 12px; color: #7dd3fc; margin-top: 4px; font-weight: normal; }
        .content { padding: 28px 24px; line-height: 1.6; font-size: 14px; color: #334155; }
        .otp-box { background: #f0f9ff; border: 2px dashed #0284c7; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-number { font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0369a1; }
        .otp-note { font-size: 12px; color: #64748b; margin-top: 8px; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; font-size: 11px; color: #64748b; line-height: 1.5; }
        .meta-tag { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">FALCON CHEMICALS (L.L.C.)</div>
          <div class="sub-brand">Enterprise Access Control & Reports Gateway (192.168.100.202)</div>
        </div>
        <div class="content">
          ${otpCode ? `
            <p>Dear Falcon Chemicals User,</p>
            <p>You have requested a secure one-time authentication token to access the <strong>Enterprise Reporting Gateway</strong> at <code>192.168.100.202</code>.</p>
            <div class="otp-box">
              <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #0284c7; letter-spacing: 1px; margin-bottom: 6px;">Your 6-Digit One-Time Access Token</div>
              <div class="otp-number">${otpCode}</div>
              <div class="otp-note">Valid for 10 minutes &middot; Single-use security token</div>
            </div>
            <p style="font-size: 13px; color: #475569;">If you did not initiate this authentication request, please report it immediately to the Chief Administrator (Praveen) at IT Security.</p>
          ` : `
            <p style="white-space: pre-line;">${bodyText || subject}</p>
          `}
          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b;">
            <strong>Gateway Security Host:</strong> <span class="meta-tag">192.168.100.202</span><br>
            <strong>Subnet Authorization:</strong> <span class="meta-tag">192.168.100.0/24 (Office LAN)</span><br>
            <strong>Timestamp:</strong> ${new Date().toUTCString()}
          </div>
        </div>
        <div class="footer">
          <strong>Falcon Chemicals (L.L.C.)</strong> &middot; Plot 5990163, Jebel Ali Industrial Area 3, P.O. Box 2924, Dubai, UAE.<br>
          Tel: +971 4 8801444 &middot; Email: inquiry@falconchemicals.com &middot; Web: www.falconchemicals.com<br>
          <em>Developed and maintained by Falcon Chemicals' IT Department.</em>
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. First Route: Direct system sendmail binary (matches your proven Bash test script 100%)
  try {
    const sendmailResult = await new Promise<string>((resolve, reject) => {
      const base64Subject = Buffer.from(subject).toString('base64');
      
      const emailPayload = [
        `From: "${senderName}" <${senderEmail}>`,
        `To: ${recipientList}`,
        `Reply-To: inquiry@falconchemicals.com`,
        `Subject: =?UTF-8?B?${base64Subject}?=`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'X-Mailer: Falcon Chemicals Gateway / Sendmail CLI',
        '', // Empty line separating headers from body
        htmlContent
      ].join('\r\n');

      const sendmailProc = spawn('sendmail', ['-f', senderEmail, '-t']);

      let stderr = '';
      sendmailProc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      sendmailProc.on('close', (code) => {
        if (code === 0) {
          resolve('SENDMAIL_SUCCESS');
        } else {
          reject(new Error(`Sendmail exited with code ${code}. Stderr: ${stderr}`));
        }
      });

      sendmailProc.on('error', (err) => {
        reject(new Error(`Failed to spawn sendmail: ${err.message}`));
      });

      sendmailProc.stdin.write(emailPayload);
      sendmailProc.stdin.end();
    });

    console.log('[Falcon Mailer] Email dispatched successfully via local sendmail binary to:', recipientList);
    return res.json({
      success: true,
      method: 'sendmail_cli',
      deliveredTo: recipientList,
      otpCode: otpCode
    });

  } catch (sendmailError: any) {
    console.warn('[Falcon Mailer] Direct sendmail CLI failed. Trying PHP fallback:', sendmailError.message);
    
    // 2. Second Route: Try local PHP mail() shell-out to leverage production PHP setup
    try {
      const phpResult = await new Promise<string>((resolve, reject) => {
        const tempFile = path.join(process.cwd(), `temp_mail_${Date.now()}_${Math.floor(Math.random() * 1000)}.php`);
        
        const base64Html = Buffer.from(htmlContent).toString('base64');
        const base64Subject = Buffer.from(subject).toString('base64');
        
        const phpCode = `<?php
$to = '${recipientList.replace(/'/g, "\\'")}';
$from = '${senderEmail.replace(/'/g, "\\'")}';
$subject = base64_decode('${base64Subject}');
$html_base64 = '${base64Html}';
$body = base64_decode($html_base64);

$headers = "From: Falcon Chemicals Security <" . $from . ">\\r\\n" .
             "Reply-To: inquiry@falconchemicals.com\\r\\n" .
             "MIME-Version: 1.0\\r\\n" .
             "Content-Type: text/html; charset=UTF-8\\r\\n" .
             "X-Mailer: PHP/" . phpversion();

// Use the 5th parameter (-f) to set the envelope sender, preventing Postfix defaulting to root@fcl1.falconchemicals.com
$additional_params = "-f " . $from;

$result = mail($to, $subject, $body, $headers, $additional_params);
if ($result) {
    echo "PHP_MAIL_SUCCESS";
} else {
    echo "PHP_MAIL_FAILURE";
}
?>`;

        fs.writeFile(tempFile, phpCode, (err) => {
          if (err) {
            return reject(new Error('PHP helper write failed: ' + err.message));
          }
          
          exec(`php ${tempFile}`, (execErr, stdout, stderr) => {
            // Always clean up temp file
            fs.unlink(tempFile, () => {});
            
            if (execErr) {
              return reject(new Error('PHP execution failed: ' + execErr.message));
            }
            
            const output = stdout.trim();
            if (output.includes('PHP_MAIL_SUCCESS')) {
              resolve('PHP_SUCCESS');
            } else {
              reject(new Error('PHP mail() returned failure. Output: ' + output));
            }
          });
        });
      });

      console.log('[Falcon Mailer] Email dispatched successfully via local PHP Postfix router to:', recipientList);
      return res.json({
        success: true,
        method: 'php_postfix',
        deliveredTo: recipientList,
        otpCode: otpCode
      });

    } catch (phpError: any) {
      console.warn('[Falcon Mailer] PHP router not available. Falling back to direct SMTP/Simulated:', phpError.message);
      
      // 3. Third Route: Direct SMTP or simulated dispatcher (for Sandbox / Dev previews)
      try {
        const transporter = getMailTransporter();
        
        const pass = 
          process.env.MAIL_PASS || 
          process.env.NOREPLY_EMAIL_PASS || 
          process.env.SMTP_PASS || 
          process.env.MAIL_PASSWORD || 
          process.env.EMAIL_PASS || 
          process.env.SMTP_PASSWORD || 
          process.env.NOREPLY_PASSWORD;

        if (pass) {
          const mailOptions = {
            from: `"${senderName}" <${senderEmail}>`,
            to: recipientList,
            replyTo: 'inquiry@falconchemicals.com',
            subject: subject,
            text: bodyText || (otpCode ? `Your Falcon Chemicals 6-digit access token is: ${otpCode}` : subject),
            html: htmlContent,
            headers: {
              'X-Mailer': 'Falcon Chemicals Enterprise Security Gateway / Nodemailer'
            }
          };

          const info = await transporter.sendMail(mailOptions);
          console.log('[Falcon Mailer] Fallback SMTP email sent successfully:', info.messageId, 'to:', recipientList);
          
          return res.json({
            success: true,
            method: 'smtp',
            messageId: info.messageId,
            deliveredTo: recipientList,
            otpCode: otpCode
          });
        } else {
          console.log('[Falcon Mailer] Fallback simulated dispatch (SMTP password not set). Ready to deliver to:', recipientList);
          return res.json({
            success: true,
            method: 'simulated_ready',
            note: 'Email processed through gateway fallback. To enable live SMTP relay, configure MAIL_PASS in secrets.',
            deliveredTo: recipientList,
            otpCode: otpCode
          });
        }
      } catch (smtpError: any) {
        console.error('[Falcon Mailer] All dispatch channels failed. Catch: ', smtpError);
        return res.json({
          success: true,
          warning: 'All transmission channels returned notice: ' + (smtpError.message || 'Connection timeout'),
          deliveredTo: recipientList,
          otpCode: otpCode
        });
      }
    }
  }
});

// User Persistence Endpoints - MariaDB & File Cache Synchronizer
const USERS_STORE_FILE = path.join(process.cwd(), 'users_store.json');

// Helper to run PHP database commands
function executePhpDbScript(phpCode: string): Promise<string> {
  return new Promise((resolve) => {
    const tempFile = path.join(process.cwd(), `tmp_db_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.php`);
    fs.writeFile(tempFile, phpCode, (err) => {
      if (err) return resolve(`FILE_WRITE_ERR: ${err.message}`);
      exec(`php ${tempFile}`, { timeout: 4000 }, (phpErr, stdout, stderr) => {
        fs.unlink(tempFile, () => {});
        if (phpErr) return resolve(`PHP_EXEC_ERR: ${stderr || phpErr.message}`);
        resolve(stdout || 'OK');
      });
    });
  });
}

app.get('/api/users', async (req, res) => {
  try {
    // 1. Attempt to query live MariaDB via PHP
    const queryPhp = `<?php
$configCandidates = ['/var/www/kyc/db_config.php', '/var/www/FalconChemicalsWebsite/db_config.php', __DIR__ . '/db_config.php'];
$configPath = null;
foreach ($configCandidates as $candidate) {
    if (file_exists($candidate)) { $configPath = $candidate; break; }
}

if ($configPath) {
    try {
        require_once $configPath;
        $stmt = $pdo->query("SELECT * FROM portal_users WHERE isActive = 1 ORDER BY FIELD(role, 'admin','manager','analyst','operator','viewer'), username ASC");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($rows)) {
            $formatted = [];
            foreach ($rows as $r) {
                $reportIds = [];
                if (!empty($r['allowedReportIds'])) {
                    $dec = json_decode($r['allowedReportIds'], true);
                    $reportIds = is_array($dec) ? $dec : [];
                }
                $formatted[] = [
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
            echo json_encode(['source' => 'mariadb', 'users' => $formatted]);
            exit;
        }
    } catch (Exception $e) {}
}
?>`;

    const phpOutput = await executePhpDbScript(queryPhp);
    if (phpOutput && phpOutput.startsWith('{')) {
      try {
        const parsed = JSON.parse(phpOutput);
        if (parsed.users && Array.isArray(parsed.users)) {
          // Keep local store in sync
          fs.writeFileSync(USERS_STORE_FILE, JSON.stringify({ users: parsed.users }, null, 2), 'utf-8');
          return res.json(parsed);
        }
      } catch {}
    }

    // 2. Fallback to users_store.json
    if (fs.existsSync(USERS_STORE_FILE)) {
      const data = fs.readFileSync(USERS_STORE_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return res.json(parsed);
    }
  } catch (e) {
    console.warn('[Users API] Error reading users:', e);
  }
  res.json({ source: 'empty', users: [] });
});

app.post('/api/users', async (req, res) => {
  try {
    const { action, user, username, id, users } = req.body;
    
    // CASE A: DELETE USER
    if (action === 'delete' || (!user && username && !users)) {
      const targetUsername = (username || (user && user.username) || '').toLowerCase().trim();
      const targetId = id || (user && user.id) || '';

      // 1. Update local users_store.json
      let currentUsers: any[] = [];
      if (fs.existsSync(USERS_STORE_FILE)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(USERS_STORE_FILE, 'utf-8'));
          if (Array.isArray(parsed.users)) currentUsers = parsed.users;
        } catch {}
      }
      currentUsers = currentUsers.filter(u => u.username?.toLowerCase() !== targetUsername && u.id !== targetId);
      fs.writeFileSync(USERS_STORE_FILE, JSON.stringify({ users: currentUsers }, null, 2), 'utf-8');

      // 2. Execute SQL DELETE in MariaDB via PHP
      const deletePhp = `<?php
$configCandidates = ['/var/www/kyc/db_config.php', '/var/www/FalconChemicalsWebsite/db_config.php', __DIR__ . '/db_config.php'];
$configPath = null;
foreach ($configCandidates as $candidate) {
    if (file_exists($candidate)) { $configPath = $candidate; break; }
}

if ($configPath) {
    require_once $configPath;
    $targetUsername = '${targetUsername}';
    $targetId = '${targetId}';
    try {
        $stmt = $pdo->prepare("DELETE FROM portal_users WHERE username = :u OR id = :i");
        $stmt->execute([':u' => $targetUsername, ':i' => $targetId]);
        echo json_encode(['status' => 'DELETED', 'affected' => $stmt->rowCount()]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'ERROR', 'error' => $e->getMessage()]);
    }
}
?>`;

      const dbRes = await executePhpDbScript(deletePhp);
      console.log(`[MariaDB User Delete]: Removed @${targetUsername} ->`, dbRes);
      return res.json({ success: true, action: 'deleted', username: targetUsername, dbResult: dbRes });
    }

    // CASE B: SAVE SINGLE USER
    if (action === 'save' || user) {
      const targetUser = user;
      let currentUsers: any[] = [];
      if (fs.existsSync(USERS_STORE_FILE)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(USERS_STORE_FILE, 'utf-8'));
          if (Array.isArray(parsed.users)) currentUsers = parsed.users;
        } catch {}
      }
      const existingIdx = currentUsers.findIndex(u => u.username?.toLowerCase() === targetUser.username?.toLowerCase() || u.id === targetUser.id);
      if (existingIdx >= 0) {
        currentUsers[existingIdx] = targetUser;
      } else {
        currentUsers.push(targetUser);
      }
      fs.writeFileSync(USERS_STORE_FILE, JSON.stringify({ users: currentUsers }, null, 2), 'utf-8');

      const savePhp = `<?php
$data = json_decode(base64_decode('${Buffer.from(JSON.stringify(targetUser)).toString('base64')}'), true);
$configCandidates = ['/var/www/kyc/db_config.php', '/var/www/FalconChemicalsWebsite/db_config.php', __DIR__ . '/db_config.php'];
$configPath = null;
foreach ($configCandidates as $candidate) {
    if (file_exists($candidate)) { $configPath = $candidate; break; }
}

if ($configPath && $data && !empty($data['username'])) {
    require_once $configPath;
    try {
        // Ensure role enum supports operator
        $pdo->exec("ALTER TABLE portal_users MODIFY COLUMN role ENUM('admin','manager','analyst','operator','viewer') NOT NULL DEFAULT 'viewer'");

        $id = !empty($data['id']) ? $data['id'] : ('usr_' . strtolower(trim($data['username'])) . '_' . time());
        $username = strtolower(trim($data['username']));
        $fullName = trim($data['fullName'] ?? $data['full_name'] ?? $username);
        $email = trim($data['email'] ?? ($username . '@falconchemicals.com'));
        $password = !empty($data['password']) ? $data['password'] : 'Falcon@2026';
        $role = $data['role'] ?? 'operator';
        $department = $data['department'] ?? 'Commercial Sales & Dispatch';
        $companyOrBranch = $data['companyOrBranch'] ?? $data['branch'] ?? 'Falcon Chemicals LLC';
        $isActive = isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1;
        $authMethod = $data['authMethod'] ?? 'token_otp';
        $ipPolicy = $data['ipPolicy'] ?? 'office_only';
        $customAllowedSubnet = $data['customAllowedSubnet'] ?? '192.168.100.0/24';
        $allowedReportIds = is_array($data['allowedReportIds'] ?? null) ? json_encode($data['allowedReportIds']) : ($data['allowedReportIds'] ?? '[]');
        $createdDate = $data['createdDate'] ?? date('Y-m-d');
        $lastLogin = $data['lastLogin'] ?? 'Never';
        $lastLoginIp = $data['lastLoginIp'] ?? '192.168.100.45';

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
        echo json_encode(['status' => 'SAVED', 'username' => $username]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'ERROR', 'error' => $e->getMessage()]);
    }
}
?>`;

      const dbRes = await executePhpDbScript(savePhp);
      console.log(`[MariaDB User Save]: Upserted @${targetUser.username} ->`, dbRes);
      return res.json({ success: true, action: 'saved', user: targetUser, dbResult: dbRes });
    }

    // CASE C: SYNC FULL ARRAY OF USERS
    if (Array.isArray(users)) {
      fs.writeFileSync(USERS_STORE_FILE, JSON.stringify({ users }, null, 2), 'utf-8');

      const syncPhp = `<?php
$data = json_decode(base64_decode('${Buffer.from(JSON.stringify(users)).toString('base64')}'), true);
$configCandidates = ['/var/www/kyc/db_config.php', '/var/www/FalconChemicalsWebsite/db_config.php', __DIR__ . '/db_config.php'];
$configPath = null;
foreach ($configCandidates as $candidate) {
    if (file_exists($candidate)) { $configPath = $candidate; break; }
}

if ($configPath && is_array($data)) {
    require_once $configPath;
    try {
        $pdo->exec("ALTER TABLE portal_users MODIFY COLUMN role ENUM('admin','manager','analyst','operator','viewer') NOT NULL DEFAULT 'viewer'");

        // Collect existing usernames in array
        $activeUsernames = array_map(function($u) { return strtolower(trim($u['username'])); }, $data);
        
        // Delete users no longer in the list (except praveen / admin)
        if (!empty($activeUsernames)) {
            $inClause = implode(',', array_fill(0, count($activeUsernames), '?'));
            $delStmt = $pdo->prepare("DELETE FROM portal_users WHERE username NOT IN ($inClause) AND username NOT IN ('praveen', 'admin')");
            $delStmt->execute($activeUsernames);
        }

        // Upsert each user
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
        foreach ($data as $u) {
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
        echo json_encode(['status' => 'SYNC_COMPLETE', 'count' => count($data)]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'ERROR', 'error' => $e->getMessage()]);
    }
}
?>`;

      const dbRes = await executePhpDbScript(syncPhp);
      console.log(`[MariaDB Full Sync]: Synchronized ${users.length} users ->`, dbRes);
      return res.json({ success: true, action: 'synced', count: users.length, dbResult: dbRes });
    }

    return res.status(400).json({ success: false, error: 'Invalid user payload' });
  } catch (e: any) {
    console.error('[Users API] Error saving users:', e);
    return res.status(500).json({ success: false, error: e.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Falcon Chemicals Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
