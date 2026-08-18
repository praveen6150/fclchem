<?php
header('Content-Type: application/json');

// Read JSON input from React fetch POST
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || empty($data['to'])) {
    echo json_encode([
        "success" => false,
        "error" => "Missing required parameter: to"
    ]);
    exit;
}

$to = trim($data['to']);
$subject = isset($data['subject']) ? trim($data['subject']) : 'Access Control OTP';
$bodyText = isset($data['bodyText']) ? trim($data['bodyText']) : '';
$otpCode = isset($data['otpCode']) ? trim($data['otpCode']) : '';

// Setup recipient list. If recipient matches praveen/admin, also copy praveen@falconchemicals.com, praveen6150@gmail.com, and inquiry@falconchemicals.com
$recipients = [$to];
$toLower = strtolower($to);
if (strpos($toLower, 'praveen') !== false || strpos($toLower, 'admin') !== false || $toLower === 'praveen@falconchemicals.com') {
    $recipients[] = 'praveen@falconchemicals.com';
    $recipients[] = 'praveen6150@gmail.com';
    $recipients[] = 'inquiry@falconchemicals.com';
}
$recipientList = implode(', ', array_unique($recipients));

// Build high-clarity Falcon Chemicals Security HTML email template
$htmlContent = '
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
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
    <div class="content">';

if (!empty($otpCode)) {
    $htmlContent .= '
      <p>Dear Falcon Chemicals User,</p>
      <p>You have requested a secure one-time authentication token to access the <strong>Enterprise Reporting Gateway</strong> at <code>192.168.100.202</code>.</p>
      <div class="otp-box">
        <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #0284c7; letter-spacing: 1px; margin-bottom: 6px;">Your 6-Digit One-Time Access Token</div>
        <div class="otp-number">' . htmlspecialchars($otpCode) . '</div>
        <div class="otp-note">Valid for 10 minutes &middot; Single-use security token</div>
      </div>
      <p style="font-size: 13px; color: #475569;">If you did not initiate this authentication request, please report it immediately to the Chief Administrator (Praveen) at IT Security.</p>';
} else {
    $htmlContent .= '
      <p style="white-space: pre-line;">' . htmlspecialchars($bodyText) . '</p>';
}

$htmlContent .= '
      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b;">
        <strong>Gateway Security Host:</strong> <span class="meta-tag">192.168.100.202</span><br>
        <strong>Subnet Authorization:</strong> <span class="meta-tag">192.168.100.0/24 (Office LAN)</span><br>
        <strong>Timestamp:</strong> ' . date('r') . '
      </div>
    </div>
    <div class="footer">
      <strong>Falcon Chemicals (L.L.C.)</strong> &middot; Plot 5990163, Jebel Ali Industrial Area 3, P.O. Box 2924, Dubai, UAE.<br>
      Tel: +971 4 8801444 &middot; Email: inquiry@falconchemicals.com &middot; Web: www.falconchemicals.com<br>
      <em>Developed and maintained by Falcon Chemicals\' IT Department.</em>
    </div>
  </div>
</body>
</html>';

// Format PHP Mail headers
$headers = "From: Falcon Chemicals Security <noreply@falconchemicals.com>\r\n" .
           "Reply-To: noreply@falconchemicals.com\r\n" .
           "MIME-Version: 1.0\r\n" .
           "Content-Type: text/html; charset=UTF-8\r\n" .
           "X-Mailer: PHP/" . phpversion();

// Use the -f flag to set the envelope sender, preventing Postfix from defaulting to root@fcl1.falconchemicals.com
$additional_params = "-f noreply@falconchemicals.com";

if (mail($recipientList, $subject, $htmlContent, $headers, $additional_params)) {
    echo json_encode([
        "success" => true,
        "method" => "php_native_mail",
        "deliveredTo" => $recipientList,
        "otpCode" => $otpCode
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => "PHP mail() execution returned failure status"
    ]);
}
?>
