import React from 'react';
import { VirtualEmail } from '../types';
import { Mail, ShieldAlert, KeyRound, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface VirtualEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: VirtualEmail[];
  onUseOtpCode?: (code: string) => void;
}

export const VirtualEmailModal: React.FC<VirtualEmailModalProps> = ({
  isOpen,
  onClose,
  emails,
  onUseOtpCode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-cyan-950/60 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Corporate Email Server
                </h3>
                <span className="px-2 py-0.5 text-xs font-mono bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 rounded-full">
                  noreply@falconchemicals.com
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live simulated dispatch for 6-digit OTP tokens, KYC recoveries & IP alerts
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {emails.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Mail className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No incoming corporate messages yet.</p>
              <p className="text-xs text-slate-600 mt-1">Request an OTP login or password recovery to generate notifications.</p>
            </div>
          ) : (
            emails.map((email) => {
              const isAlert = email.type === 'ip_security_alert';
              const isOtp = email.type === 'otp_login' || email.type === 'password_recovery';

              return (
                <div
                  key={email.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAlert
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {isAlert ? (
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-white">
                        {email.subject}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {email.timestamp}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-mono mb-2 flex items-center gap-2">
                    <span className="text-slate-400">To:</span> {email.to}
                  </div>

                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                    {email.bodyText}
                  </p>

                  {/* OTP Code Badge & Quick-Fill Button */}
                  {email.otpCode && (
                    <div className="mt-3 flex items-center justify-between bg-cyan-950/40 border border-cyan-500/30 rounded-lg p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-cyan-300 font-medium">OTP Token:</span>
                        <span className="text-lg font-mono font-bold tracking-widest text-cyan-400">
                          {email.otpCode}
                        </span>
                      </div>
                      {onUseOtpCode && (
                        <button
                          onClick={() => {
                            audioEngine.playSuccess();
                            onUseOtpCode(email.otpCode!);
                            onClose();
                          }}
                          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Auto-Fill Token
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Falcon Chemicals LLC Secure SMTP Relay</span>
          <span className="font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SMTP Active
          </span>
        </div>

      </div>
    </div>
  );
};
