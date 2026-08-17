import { UserAccount, AuditLogEntry, VirtualEmail } from '../types';
import { FALCON_REPORTS } from './reportsData';
import { ALL_ORACLE_REPORTS } from './oracleReportsData';

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
    ipPolicy: 'office_only',
    customAllowedSubnet: '192.168.100.0/24',
    allowedReportIds: [
      ...FALCON_REPORTS.map(r => r.id),
      ...ALL_ORACLE_REPORTS.map(r => r.id)
    ],
    createdDate: '2025-01-10',
    lastLogin: '2026-08-16 10:14:22',
    lastLoginIp: '192.168.100.15'
  },
  {
    id: 'usr_ajay_02',
    username: 'ajay',
    fullName: 'Ajay (Sales & Dispatch Manager)',
    email: 'ajay@falconchemicals.com',
    password: 'Falcon@2026',
    role: 'manager',
    department: 'Commercial Sales & Dispatch Logistics',
    companyOrBranch: 'Falcon Chemicals LLC - Dubai HQ',
    isActive: true,
    authMethod: 'password',
    ipPolicy: 'office_only',
    customAllowedSubnet: '192.168.100.0/24',
    allowedReportIds: [
      'ora_sales_div_drilldown',
      'ora_sales_avg_analysis',
      'ora_sales_cust_supp_master',
      'ora_sales_salesman_rep',
      'ora_sales_salesman_analysis',
      'ora_sales_return_item',
      'ora_sales_pending_orders',
      'ora_sales_analytics_multidim',
      'ora_dispatch_daily_report',
      'rep_sales_daily',
      'rep_sales_customer',
      'rep_sales_outstanding_aging',
      'rep_stock_balance'
    ],
    createdDate: '2026-08-10',
    lastLogin: '2026-08-16 09:30:00',
    lastLoginIp: '192.168.100.45'
  },
  {
    id: 'usr_sales_03',
    username: 'tariq.mansoor',
    fullName: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@falconchemicals.com',
    password: 'TariqSales$2026',
    role: 'analyst',
    department: 'UAE & GCC Commercial Sales',
    companyOrBranch: 'Dubai Commercial Sales Office',
    isActive: true,
    authMethod: 'token_otp',
    ipPolicy: 'office_only',
    customAllowedSubnet: '192.168.100.0/24',
    allowedReportIds: [
      'ora_sales_div_drilldown',
      'ora_sales_avg_analysis',
      'ora_sales_cust_supp_master',
      'ora_sales_salesman_rep',
      'rep_sales_daily',
      'rep_sales_customer',
      'rep_sales_outstanding_aging'
    ],
    createdDate: '2025-06-01',
    lastLogin: '2026-08-14 11:20:00',
    lastLoginIp: '192.168.100.88'
  },
  {
    id: 'usr_mgr_04',
    username: 'evelyn.vance',
    fullName: 'Dr. Evelyn Vance',
    email: 'evelyn.vance@falconchemicals.com',
    password: 'EvelynChem#2026',
    role: 'manager',
    department: 'R&D Chemical Formulation & Production',
    companyOrBranch: 'DIC Advanced Chemical Plant Lab',
    isActive: true,
    authMethod: 'password',
    ipPolicy: 'office_only',
    customAllowedSubnet: '192.168.100.0/24',
    allowedReportIds: [
      'ora_prod_formulation_costing',
      'ora_prod_raw_mat_division',
      'ora_prod_history',
      'rep_prod_reactor_batch',
      'rep_stock_raw_materials'
    ],
    createdDate: '2025-03-14',
    lastLogin: '2026-08-15 16:30:10',
    lastLoginIp: '192.168.100.42'
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
    details: 'Authenticated as Chief Administrator via Office Subnet. Full Oracle Reports RBAC authorization loaded.',
    status: 'SUCCESS'
  },
  {
    id: 'log_02',
    timestamp: '2026-08-16 09:40:12',
    username: 'tariq.mansoor',
    email: 'tariq.mansoor@falconchemicals.com',
    action: 'LOGIN_BLOCKED_IP',
    ipAddress: '86.96.12.114',
    ipLocationType: 'External Internet / Home WAN',
    details: 'Access attempt blocked: User is restricted to Office LAN (192.168.100.0/24). Security notification sent from noreply@falconchemicals.com.',
    status: 'DENIED'
  },
  {
    id: 'log_03',
    timestamp: '2026-08-16 09:30:00',
    username: 'ajay',
    email: 'ajay@falconchemicals.com',
    action: 'LOGIN_SUCCESS',
    ipAddress: '192.168.100.45',
    ipLocationType: 'Office LAN (192.168.100.0/24)',
    details: 'User authenticated via password. Oracle Sales & Dispatch module permissions active.',
    status: 'SUCCESS'
  },
  {
    id: 'log_04',
    timestamp: '2026-08-15 14:15:30',
    username: 'praveen',
    email: 'praveen@falconchemicals.com',
    action: 'POLICY_UPDATED',
    ipAddress: '192.168.100.15',
    ipLocationType: 'Office LAN (192.168.100.0/24)',
    details: 'Modified RBAC Oracle report permissions for Sales Department team.',
    status: 'SUCCESS'
  }
];

export const checkIpSubnetMatch = (ip: string, policy: string, customSubnet?: string): { allowed: boolean; reason: string } => {
  if (policy === 'internet_allowed') {
    return { allowed: true, reason: 'Remote WAN and Home Internet connections permitted by Chief Admin policy.' };
  }
  if (policy === 'office_only') {
    const isOffice = ip.startsWith('192.168.100.') || ip === '127.0.0.1' || ip === 'localhost';
    if (!isOffice) {
      return {
        allowed: false,
        reason: `Access Denied: Your host IP (${ip}) is outside Falcon Chemicals Office Subnet (192.168.100.0/24). Admin approval is required for remote access.`
      };
    }
    return { allowed: true, reason: 'Internal Office Subnet Authorized (192.168.100.0/24).' };
  }
  if (policy === 'custom_subnet' && customSubnet) {
    const prefix = customSubnet.split('/')[0].split('.').slice(0, 3).join('.');
    const matches = ip.startsWith(prefix);
    if (!matches) {
      return {
        allowed: false,
        reason: `Access Denied: Your host IP (${ip}) does not match authorized custom subnet (${customSubnet}).`
      };
    }
    return { allowed: true, reason: `Authorized for Subnet (${customSubnet}).` };
  }
  return { allowed: true, reason: 'Authorized.' };
};

export const INITIAL_EMAILS: VirtualEmail[] = [
  {
    id: 'eml_01',
    from: 'noreply@falconchemicals.com',
    to: 'praveen@falconchemicals.com',
    subject: 'Your 6-Digit Falcon Portal Login Token: 849201',
    timestamp: '2026-08-16 10:12:00',
    bodyText: 'Falcon Chemicals Enterprise Security Gateway\n\nYour one-time login authentication token is:\n\n[ 8 4 9 2 0 1 ]\n\nThis token is valid for 10 minutes. If you did not request this token, please contact Chief Admin immediately.\n\nFalcon Chemicals LLC - Dubai Industrial City',
    otpCode: '849201',
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
    isRead: true
  }
];
