export type RoleType = 'admin' | 'manager' | 'analyst' | 'operator' | 'auditor';

export interface ProductItem {
  id: string;
  name: string;
  category: 'adhesives' | 'construction' | 'coatings' | 'aerosols';
  shortDesc: string;
  fullDesc: string;
  keyFeatures: string[];
  applications: string[];
  packaging: string[];
  specs: {
    appearance: string;
    density?: string;
    viscosity?: string;
    dryingTime?: string;
    shelfLife?: string;
  };
  featured?: boolean;
}

export type IPAccessPolicy = 'office_only' | 'internet_allowed' | 'custom_subnet';

export type AuthMethod = 'password' | 'token_otp' | 'password_plus_token';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  password?: string;
  role: RoleType;
  department: string;
  companyOrBranch: string;
  isActive: boolean;
  authMethod: AuthMethod;
  ipPolicy: IPAccessPolicy;
  customAllowedSubnet?: string; // e.g. "192.168.100.0/24"
  allowedReportIds: string[]; // List of report IDs user can access
  createdDate: string;
  lastLogin?: string;
  lastLoginIp?: string;
}

export type ReportCategory = 'sales' | 'inventory' | 'production' | 'finance' | 'kyc_compliance';

export interface ReportColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'currency' | 'date' | 'badge';
  align?: 'left' | 'center' | 'right';
}

export interface ReportDefinition {
  id: string;
  code: string;
  title: string;
  category: ReportCategory;
  description: string;
  menuOrder: number;
  requiresElevatedPrivilege?: boolean;
  columns: ReportColumn[];
  sampleData: Record<string, any>[];
  summaryStats?: {
    label: string;
    value: string;
    sublabel?: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  username: string;
  email: string;
  action: 'LOGIN_SUCCESS' | 'LOGIN_BLOCKED_IP' | 'LOGIN_FAILED_CREDENTIALS' | 'REPORT_VIEWED' | 'USER_CREATED' | 'POLICY_UPDATED' | 'OTP_SENT' | 'PASSWORD_RESET';
  ipAddress: string;
  ipLocationType: 'Office LAN (192.168.100.0/24)' | 'External Internet / Home WAN' | 'Custom VPN';
  details: string;
  status: 'SUCCESS' | 'DENIED' | 'WARNING';
}

export interface VirtualEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  timestamp: string;
  bodyText: string;
  otpCode?: string;
  actionUrl?: string;
  type: 'otp_login' | 'password_recovery' | 'account_created' | 'ip_security_alert';
  isRead: boolean;
}

export interface PresentationChapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  durationSec: number;
  bgGradient: string;
  statLabel: string;
  statValue: string;
}

export interface SoundSettings {
  isMuted: boolean;
  ambientPlaying: boolean;
  ambientVolume: number;
  fxVolume: number;
  presentationAutoPlay: boolean;
}
