import { UserAccount, AuditLogEntry, VirtualEmail } from '../types';
import { FALCON_REPORTS } from './reportsData';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_admin_01',
    username: 'praveen',
    fullName: 'Praveen (Chief Admin)',
    email: 'praveen@falconchemicals.com',
    password: 'FalconAdmin@2026',
    role: 'admin',
    department: 'Executive IT & Corporate Security',
    companyOrBranch: 'Falcon Chemicals LLC HQ - Dubai',
    isActive: true,
    authMethod: 'password_plus_token',
    ipPolicy: 'internet_allowed',
    allowedReportIds: FALCON_REPORTS.map(r => r.id),
    createdDate: '2025-01-10',
    lastLogin: '2026-08-16 10:14:22',
    lastLoginIp: '192.168.100.15'
  },
  {
    id: 'usr_mgr_02',
    username: 'evelyn.vance',
    fullName: 'Dr. Evelyn Vance',
    email: 'evelyn.vance@falconchemicals.com',
    password: 'EvelynChem#2026',
    role: 'manager',
    department: 'R&D Chemical Formulation & QC',
    companyOrBranch: 'DIC Advanced Chemical Plant Lab',
    isActive: true,
    authMethod: 'password',
    ipPolicy: 'office_only',
    customAllowedSubnet: '192.168.100.0/24',
    allowedReportIds: [
      'rep_prod_reactor_batch',
      'rep_prod_qc_lab',
      'rep_stock_raw_materials',
      'rep_kyc_msds_hazard'
    ],
    createdDate: '2025-03-14',
    lastLogin: '2026-08-15 16:30:10',
    lastLoginIp: '192.168.100.42'
  },
  {
    id: 'usr_logistics_03',
    username: 'marcus.sterling',
    fullName: 'Marcus Sterling',
    email: 'marcus.sterling@falconchemicals.com',
    password: 'MarcusLogistics!26',
    role: 'manager',
    department: 'Global Supply Chain & Logistics',
    companyOrBranch: 'Falcon Logistics DIC & JAFZA',
    isActive: true,
    authMethod: 'password',
    ipPolicy: 'internet_allowed',
    allowedReportIds: [
      'rep_sales_daily',
      'rep_stock_balance',
      'rep_stock_raw_materials',
      'rep_sales_outstanding_aging'
    ],
    createdDate: '2025-05-20',
    lastLogin: '2026-08-16 08:45:00',
    lastLoginIp: '86.96.12.114'
  },
  {
    id: 'usr_sales_04',
    username: 'tariq.mansoor',
    fullName: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@falconchemicals.com',
    password: 'TariqSales$2026',
    role: 'analyst',
    department: 'UAE & GCC Commercial Sales',
    companyOrBranch: 'Dubai Commercial Sales Office',
    isActive: true,
    authMethod: 'token_otp', // Login via 6-digit OTP Token
    ipPolicy: 'office_only', // Restricted to Office 192.168.100.0/24
    customAllowedSubnet: '192.168.100.0/24',
    allowedReportIds: [
      'rep_sales_daily',
      'rep_sales_customer',
      'rep_sales_outstanding_aging',
      'rep_kyc_verification'
    ],
    createdDate: '2025-06-01',
    lastLogin: '2026-08-14 11:20:00',
    lastLoginIp: '192.168.100.88'
  },
  {
    id: 'usr_plant_05',
    username: 'aris.thorne',
    fullName: 'Dr. Aris Thorne',
    email: 'aris.thorne@falconchemicals.com',
    password: 'ArisPlant*2026',
    role: 'operator',
    department: 'Reactor Operations & Safety',
    companyOrBranch: 'DIC Manufacturing Bay A',
    isActive: true,
    authMethod: 'password',
    ipPolicy: 'office_only',
    customAllowedSubnet: '192.168.100.0/24',
    allowedReportIds: [
      'rep_prod_reactor_batch',
      'rep_prod_qc_lab',
      'rep_kyc_msds_hazard'
    ],
    createdDate: '2025-08-12',
    lastLogin: '2026-08-16 07:15:33',
    lastLoginIp: '192.168.100.61'
  },
  {
    id: 'usr_cfo_06',
    username: 'farah.cfo',
    fullName: 'Farah Al-Zahra (CFO)',
    email: 'farah.cfo@falconchemicals.com',
    password: 'FarahFinance#2026',
    role: 'auditor',
    department: 'Finance, VAT & Regulatory Compliance',
    companyOrBranch: 'Falcon Executive Office - Dubai',
    isActive: true,
    authMethod: 'password_plus_token',
    ipPolicy: 'internet_allowed',
    allowedReportIds: [
      'rep_sales_daily',
      'rep_sales_customer',
      'rep_sales_outstanding_aging',
      'rep_fin_vat_201',
      'rep_fin_expense_allocation',
      'rep_kyc_verification'
    ],
    createdDate: '2025-02-01',
    lastLogin: '2026-08-16 09:30:12',
    lastLoginIp: '94.200.45.18'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_01',
    timestamp: '2026-08-16 10:14:22',
    username: 'praveen',
    email: 'praveen@falconchemicals.com',
    action: 'LOGIN_SUCCESS',
    ipAddress: '192.168.100.15',
    ipLocationType: 'Office LAN (192.168.100.0/24)',
    details: 'Chief Admin logged in with TLS 1.3 2FA session verification.',
    status: 'SUCCESS'
  },
  {
    id: 'log_02',
    timestamp: '2026-08-16 09:40:15',
    username: 'tariq.mansoor',
    email: 'tariq.mansoor@falconchemicals.com',
    action: 'LOGIN_BLOCKED_IP',
    ipAddress: '86.96.12.114',
    ipLocationType: 'External Internet / Home WAN',
    details: 'Access Denied: User has "Office Only (192.168.100.0/24)" IP restriction.',
    status: 'DENIED'
  },
  {
    id: 'log_03',
    timestamp: '2026-08-16 09:42:00',
    username: 'tariq.mansoor',
    email: 'tariq.mansoor@falconchemicals.com',
    action: 'OTP_SENT',
    ipAddress: '192.168.100.88',
    ipLocationType: 'Office LAN (192.168.100.0/24)',
    details: '6-digit login token dispatched from noreply@falconchemicals.com',
    status: 'SUCCESS'
  },
  {
    id: 'log_04',
    timestamp: '2026-08-16 09:42:45',
    username: 'tariq.mansoor',
    email: 'tariq.mansoor@falconchemicals.com',
    action: 'LOGIN_SUCCESS',
    ipAddress: '192.168.100.88',
    ipLocationType: 'Office LAN (192.168.100.0/24)',
    details: 'Token verified successfully. Granted access to 4 assigned reports.',
    status: 'SUCCESS'
  },
  {
    id: 'log_05',
    timestamp: '2026-08-16 08:45:00',
    username: 'marcus.sterling',
    email: 'marcus.sterling@falconchemicals.com',
    action: 'LOGIN_SUCCESS',
    ipAddress: '86.96.12.114',
    ipLocationType: 'External Internet / Home WAN',
    details: 'Authorized remote session under Internet Allowed corporate policy.',
    status: 'SUCCESS'
  }
];

export const INITIAL_EMAILS: VirtualEmail[] = [
  {
    id: 'eml_01',
    from: 'noreply@falconchemicals.com',
    to: 'tariq.mansoor@falconchemicals.com',
    subject: 'Falcon Portal: Your 6-Digit Secure Login Token',
    timestamp: '2026-08-16 09:42:00',
    otpCode: '849201',
    bodyText: 'Dear Tariq Al-Mansoor,\n\nYour one-time authentication token to access Falcon Chemicals Enterprise Reports is:\n\n849201\n\nThis token is valid for 10 minutes. If you did not initiate this login request, please alert Falcon Corporate IT Security immediately.\n\nCorporate Support: portal@falconchemicals.com\nFalcon Chemicals LLC - Dubai Industrial City, UAE',
    type: 'otp_login',
    isRead: false
  },
  {
    id: 'eml_02',
    from: 'noreply@falconchemicals.com',
    to: 'praveen@falconchemicals.com',
    subject: 'Security Alert: External IP Access Attempt Blocked',
    timestamp: '2026-08-16 09:40:16',
    bodyText: 'Security Notice from Falcon Access Engine:\n\nAn external login attempt for user "tariq.mansoor" was blocked due to IP policy violation.\nHost IP: 86.96.12.114 (Outside Office Subnet 192.168.100.0/24)\nLocation: Dubai, UAE (Etisalat WAN)\n\nAudit Ref: AUD-2026-8819',
    type: 'ip_security_alert',
    isRead: false
  }
];

// IP Range & Subnet Checker Function
export function checkIpSubnetMatch(ip: string, policy: string, customSubnet?: string): { allowed: boolean; reason: string } {
  // Trim and clean
  const cleanIp = (ip || '').trim();

  if (policy === 'internet_allowed') {
    return { allowed: true, reason: 'Remote Internet & Home Access is authorized by Admin for this user account.' };
  }

  const officeSubnet = '192.168.100.';
  const isOfficeIp = cleanIp.startsWith(officeSubnet);

  if (policy === 'office_only') {
    if (isOfficeIp) {
      return { allowed: true, reason: 'Host IP verified inside Falcon Office Subnet (192.168.100.0/24).' };
    }
    return {
      allowed: false,
      reason: `Access Denied: Current IP (${cleanIp}) is outside the required Falcon Office Subnet (192.168.100.0/24). Please connect from the Dubai office or request remote access clearance from Chief Admin.`
    };
  }

  if (policy === 'custom_subnet' && customSubnet) {
    const prefix = customSubnet.split('/')[0].split('.').slice(0, 3).join('.');
    if (cleanIp.startsWith(prefix)) {
      return { allowed: true, reason: `Host IP verified within custom authorized subnet (${customSubnet}).` };
    }
    return {
      allowed: false,
      reason: `Access Denied: Current IP (${cleanIp}) is not inside permitted subnet (${customSubnet}).`
    };
  }

  return { allowed: true, reason: 'Authorized.' };
}
