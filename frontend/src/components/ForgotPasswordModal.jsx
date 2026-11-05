import React, { useState } from 'react';
import { 
  X, KeyRound, Mail, Lock, User, Shield, Briefcase, Building, 
  ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordModal({ isOpen, onClose, defaultRole = 'ALL', onLoginSuccess }) {
  const { forgotPassword, resetPassword, login, loading } = useAuth();

  // Step 1: 'request' (enter username/email), Step 2: 'reset' (enter code & new password), Step 3: 'success'
  const [step, setStep] = useState('request');
  const [selectedRole, setSelectedRole] = useState(defaultRole); // 'ALL', 'ROLE_CITIZEN', 'ROLE_OFFICER', 'ROLE_ADMIN'
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  
  // Step 2 inputs
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null); // stores { username, resetCode, maskedEmail, role }

  if (!isOpen) return null;

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!usernameOrEmail.trim()) {
      setError('Please enter your User ID or email address.');
      return;
    }

    const rolePayload = selectedRole === 'ALL' ? null : selectedRole;
    const res = await forgotPassword(usernameOrEmail.trim(), rolePayload);

    if (res.success) {
      setSuccessInfo(res.data);
      setResetCode(res.data.resetCode || '');
      setStep('reset');
    } else {
      setError(res.error || 'Account not found. Please verify your User ID or role.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!resetCode.trim()) {
      setError('Please enter the 6-digit verification reset code.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    const res = await resetPassword(
      usernameOrEmail.trim(),
      resetCode.trim(),
      newPassword.trim()
    );

    if (res.success) {
      setStep('success');
    } else {
      setError(res.error || 'Failed to reset password. Please check the reset code.');
    }
  };

  const handleQuickLoginWithNewPassword = async () => {
    setError('');
    const loginRes = await login(usernameOrEmail.trim(), newPassword.trim());
    if (loginRes.success) {
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } else {
      setError(loginRes.error || 'Password was updated! Please sign in manually.');
    }
  };

  const handleClose = () => {
    setStep('request');
    setError('');
    setSuccessInfo(null);
    setUsernameOrEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            Security & Password Recovery
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {step === 'request' && 'Forgot Your Password?'}
            {step === 'reset' && 'Set New Password'}
            {step === 'success' && 'Password Reset Complete!'}
          </h2>
          
          <p className="text-xs text-slate-300 mt-1 font-light leading-relaxed">
            {step === 'request' && 'Recover access for your Citizen, Field Officer, or Municipal Admin account.'}
            {step === 'reset' && `Enter the 6-digit verification code generated for ${successInfo?.username || usernameOrEmail}.`}
            {step === 'success' && 'Your credentials have been securely updated. You can now access your account.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Request Reset Code */}
          {step === 'request' && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              {/* Role Filter Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Account Type / Persona</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ROLE_CITIZEN')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'ROLE_CITIZEN'
                        ? 'bg-sky-50 border-sky-500 text-sky-800 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-sky-600" />
                    <span>Citizen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('ROLE_OFFICER')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'ROLE_OFFICER'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                    <span>Officer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('ROLE_ADMIN')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'ROLE_ADMIN'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Username or Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  User ID (Username) or Registered Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. citizen or admin@urbanfix.com"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Demo IDs: <span className="font-mono text-slate-600">citizen</span>, <span className="font-mono text-slate-600">officer</span>, <span className="font-mono text-slate-600">admin</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-sky-500/20 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Generating Reset Code...</span>
                ) : (
                  <>
                    <span>Generate Reset Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Enter Code & New Password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Simulated OTP / Code Card */}
              {successInfo && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1 text-amber-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Verification Code Generated:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono text-xs font-black tracking-widest">
                      {successInfo.resetCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Sent to: <strong>{successInfo.maskedEmail}</strong> (Username: <code>{successInfo.username}</code>, Role: <code>{successInfo.role?.replace('ROLE_', '')}</code>). Code valid for 15 minutes.
                  </p>
                </div>
              )}

              {/* 6-Digit Code Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">6-Digit Verification Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full px-4 py-2.5 text-center font-mono text-base tracking-widest font-black rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                />
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Password Reset Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your password for User ID <strong>{usernameOrEmail}</strong> has been updated. You can now authenticate immediately.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={handleQuickLoginWithNewPassword}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In Immediately</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-all"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
