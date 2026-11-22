import React, { useEffect, useState } from 'react';
import { X, KeyRound, Eye, EyeOff, Check } from 'lucide-react';

export interface AdminCredentials {
  username: string;
  password: string;
  isCustom: boolean;
}

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: AdminCredentials;
  onUpdateCredentials: (next: AdminCredentials) => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  credentials,
  onUpdateCredentials,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(credentials.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentPassword('');
    setNewUsername(credentials.username);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSaved(false);
  }, [isOpen, credentials.username]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (currentPassword !== credentials.password) {
      setError('كلمة المرور الحالية غير صحيحة.');
      return;
    }

    const cleanUser = newUsername.trim();
    if (!cleanUser || cleanUser.length < 3) {
      setError('يجب أن يكون اسم المستخدم 3 أحرف على الأقل.');
      return;
    }

    if (!newPassword.trim() || newPassword.length < 4) {
      setError('يجب أن تكون كلمة المرور الجديدة 4 أحرف أو أرقام على الأقل.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('تأكيد كلمة المرور غير مطابق لكلمة المرور الجديدة.');
      return;
    }

    onUpdateCredentials({
      username: cleanUser,
      password: newPassword,
      isCustom: true,
    });

    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1A36]/60 backdrop-blur-[2px] flex items-center justify-center p-4 no-print">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-[#111C38] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#EAB308]" />
            <h3 className="text-base font-bold font-display">
              تغيير اسم المستخدم وكلمة المرور
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg px-3.5 py-2.5">
              {error}
            </div>
          )}

          {saved && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-lg px-3.5 py-2.5 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>تم حفظ اسم المستخدم وكلمة المرور الجديدة بنجاح.</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              اسم المستخدم الجديد
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="مثال: modir_shams"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              كلمة المرور الحالية
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="أدخل كلمة المرور الحالية"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
              autoComplete="current-password"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                كلمة المرور الجديدة
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="4 أحرف على الأقل"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                تأكيد كلمة المرور
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد كتابتها"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPasswords((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#111C38] cursor-pointer"
          >
            {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPasswords ? 'إخفاء كلمات المرور' : 'إظهار كلمات المرور'}</span>
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saved}
              className="px-5 py-2 text-sm font-bold text-[#0F1A36] bg-[#EAB308] hover:bg-[#D99B00] disabled:opacity-60 rounded-lg cursor-pointer"
            >
              حفظ البيانات الجديدة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
