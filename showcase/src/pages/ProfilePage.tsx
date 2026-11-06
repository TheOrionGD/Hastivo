import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  KeyRound,
  Trash2,
  Check,
  AlertCircle,
  LogOut,
  Smartphone,
  Laptop,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, verifyAndChangeEmail, changePassword, deactivateAccount, logout } = useAuth();
  const { theme, language, accent } = useTheme();

  // Email change state
  const [newEmail, setNewEmail] = useState('');
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);
  const [emailChangeOpen, setEmailChangeOpen] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<string | null>(null);
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);

  // Editable fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Deactivate modal
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await verifyAndChangeEmail(newEmail);
    setEmailStatusMsg(res.message);
    if (res.success) {
      setTimeout(() => {
        setEmailChangeOpen(false);
        setEmailStatusMsg(null);
        setNewEmail('');
      }, 2500);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordStatusMsg(res.message || 'Password updated.');
      setTimeout(() => {
        setPasswordChangeOpen(false);
        setPasswordStatusMsg(null);
        setOldPassword('');
        setNewPassword('');
      }, 2000);
    } else {
      setPasswordStatusMsg(res.error || 'Failed to update password');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 space-y-10">
      {/* Top Header */}
      <div className="space-y-4 hairline-border-b pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-coral)] font-bold">
              SECURITY &bull; USER IDENTITY
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Account Profile
            </h1>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 border border-[var(--border)] text-xs font-mono uppercase text-[var(--brand-coral)] hover:border-[var(--brand-coral)] flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Col: Avatar & Status Badge (4 cols) */}
        <div className="md:col-span-4 p-6 bg-[var(--surface)] hairline-border space-y-6 text-center">
          <div className="w-24 h-24 mx-auto bg-[var(--surface-secondary)] border-2 border-[var(--brand-coral)] flex items-center justify-center">
            <User className="w-12 h-12 text-[var(--brand-coral)]" />
          </div>

          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
              {user?.fullName || user?.username || 'Guest Collaborator'}
            </h2>
            <span className="font-mono text-xs text-[var(--text-tertiary)] block">
              @{user?.username || 'guest'}
            </span>
          </div>

          <div className="pt-4 hairline-border-t space-y-2 text-xs font-mono text-left">
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">ROLE:</span>
              <span className="text-[var(--brand-blue)] font-bold uppercase">{user?.role || 'USER'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">STATUS:</span>
              <span className="text-[var(--brand-coral)] font-bold uppercase">{user?.status || 'ACTIVE'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">THEME:</span>
              <span className="text-[var(--text-primary)] uppercase">{theme}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">LANG:</span>
              <span className="text-[var(--text-primary)] uppercase">{language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">ACCENT:</span>
              <span className="text-[var(--text-primary)] uppercase">{accent}</span>
            </div>
          </div>
        </div>

        {/* Right Col: Editable Details, Verified Email Flow & Security (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          {/* Personal Details Form */}
          <div className="p-6 bg-[var(--surface)] hairline-border space-y-4">
            <div className="flex items-center justify-between hairline-border-b pb-3">
              <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                General Profile Details
              </h3>
              {savedSuccess && (
                <span className="font-mono text-xs text-[var(--brand-blue)] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> SAVED
                </span>
              )}
            </div>

            <form onSubmit={handleSaveDetails} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)] uppercase block">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] px-3.5 py-2 text-xs focus:outline-none focus:border-[var(--brand-coral)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)] uppercase block">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] px-3.5 py-2 text-xs focus:outline-none focus:border-[var(--brand-coral)]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--text-primary)] text-[var(--background)] hover:opacity-90 uppercase font-semibold cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Verified Email Change Flow */}
          <div className="p-6 bg-[var(--surface)] hairline-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-base font-bold text-[var(--text-primary)]">
                  Primary Email Address
                </h4>
                <p className="font-mono text-xs text-[var(--text-secondary)]">
                  Current: <strong className="text-[var(--text-primary)]">{user?.email || 'guest@signa.local'}</strong>
                </p>
              </div>
              <button
                onClick={() => setEmailChangeOpen(!emailChangeOpen)}
                className="px-3 py-1.5 border border-[var(--border)] text-xs font-mono uppercase hover:border-[var(--brand-coral)] cursor-pointer"
              >
                {emailChangeOpen ? 'Cancel' : 'Change Email'}
              </button>
            </div>

            {emailChangeOpen && (
              <form onSubmit={handleEmailSubmit} className="pt-3 border-t border-[var(--border)] space-y-3 font-mono text-xs">
                {emailStatusMsg && (
                  <div className="p-2.5 bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] border border-[var(--brand-blue)]">
                    {emailStatusMsg}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)] uppercase">New Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="new.email@domain.com"
                    className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] p-2 focus:outline-none focus:border-[var(--brand-coral)]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--brand-coral)] text-white hover:opacity-90 uppercase font-semibold cursor-pointer"
                >
                  Verify & Update Email
                </button>
              </form>
            )}
          </div>

          {/* Password Update Flow */}
          <div className="p-6 bg-[var(--surface)] hairline-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-base font-bold text-[var(--text-primary)]">
                  Security & Password
                </h4>
                <p className="font-mono text-xs text-[var(--text-secondary)]">
                  Update your authentication credentials.
                </p>
              </div>
              <button
                onClick={() => setPasswordChangeOpen(!passwordChangeOpen)}
                className="px-3 py-1.5 border border-[var(--border)] text-xs font-mono uppercase hover:border-[var(--brand-coral)] cursor-pointer"
              >
                {passwordChangeOpen ? 'Cancel' : 'Update Password'}
              </button>
            </div>

            {passwordChangeOpen && (
              <form onSubmit={handlePasswordSubmit} className="pt-3 border-t border-[var(--border)] space-y-3 font-mono text-xs">
                {passwordStatusMsg && (
                  <div className="p-2.5 bg-[var(--brand-coral)]/10 text-[var(--brand-coral)] border border-[var(--brand-coral)]">
                    {passwordStatusMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[var(--text-secondary)] uppercase">Old Password</label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] p-2 focus:outline-none focus:border-[var(--brand-coral)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[var(--text-secondary)] uppercase">New Password (&ge; 8)</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] p-2 focus:outline-none focus:border-[var(--brand-coral)]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--text-primary)] text-[var(--background)] hover:opacity-90 uppercase font-semibold cursor-pointer"
                >
                  Confirm Password Update
                </button>
              </form>
            )}
          </div>

          {/* Active Sessions */}
          <div className="p-6 bg-[var(--surface)] hairline-border space-y-3 font-mono text-xs">
            <h4 className="font-display text-base font-bold text-[var(--text-primary)]">
              Authorized Active Sessions
            </h4>
            <div className="p-3 bg-[var(--background)] border border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[var(--brand-coral)]" />
                <div>
                  <div className="text-[var(--text-primary)] font-bold">Current Browser Session</div>
                  <div className="text-[var(--text-tertiary)] text-[10px]">Active Now &bull; IP: Authenticated Local</div>
                </div>
              </div>
              <span className="text-[var(--brand-blue)] text-[10px] font-bold uppercase">CURRENT DEVICE</span>
            </div>
          </div>

          {/* Account Deactivation Danger Zone */}
          <div className="p-6 bg-[var(--brand-coral)]/5 border border-[var(--brand-coral)] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[var(--brand-coral)] font-bold uppercase block">Danger Zone</span>
                <span className="text-[var(--text-secondary)]">Deactivate or delete your personal platform data.</span>
              </div>
              <button
                onClick={() => setDeactivateModalOpen(true)}
                className="px-3 py-1.5 bg-[var(--brand-coral)] text-white hover:opacity-90 uppercase font-semibold cursor-pointer"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Account Modal */}
      {deactivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--surface)] hairline-border p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[var(--brand-coral)]">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-display text-lg font-bold">Confirm Account Deactivation</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Are you sure you want to request account deactivation? All stored local sessions and verified conversation history will be permanently cleared from your client.
            </p>
            <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => setDeactivateModalOpen(false)}
                className="px-4 py-2 border border-[var(--border)] text-[var(--text-primary)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDeactivateModalOpen(false);
                  deactivateAccount();
                }}
                className="px-4 py-2 bg-[var(--brand-coral)] text-white font-semibold cursor-pointer"
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
