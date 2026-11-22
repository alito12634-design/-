import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';

import { AdminCredentials } from './AccountSettingsModal';

interface LoginScreenProps {
  credentials: AdminCredentials;
  onLogin: (adminName: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ credentials, onLogin }) => {
  const [username, setUsername] = useState(credentials.isCustom ? '' : 'admin');
  const [password, setPassword] = useState(credentials.isCustom ? '' : 'shams2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const savedUser = credentials.username.trim().toLowerCase();
    if (!cleanUser || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور.');
      return;
    }

    if (cleanUser === savedUser && password === credentials.password) {
      setError('');
      onLogin(credentials.username);
      return;
    }

    setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between p-4 sm:p-8">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#111C38] px-6 py-7 text-center border-b-4 border-[#EAB308]">
            <div className="flex justify-center mb-3">
              <SchoolLogo size="lg" variant="dark-bg" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              مدرسة شمس المعارف الأساسية الأهلية
            </h1>
            <p className="text-xs sm:text-sm text-[#38BDF8] mt-1.5 font-medium">
              بوابة الإدارة المدرسية · السجل الإلكتروني الموحد
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#111C38] font-display">
                تسجيل دخول الإدارة
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                أدخل بيانات الحساب الإداري للوصول إلى بيانات الطلاب والمناطق والخطوط
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg px-3.5 py-2.5"
              >
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  اسم المستخدم
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full pr-10 pl-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38] focus:ring-2 focus:ring-[#111C38]/10 transition-colors"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38] focus:ring-2 focus:ring-[#111C38]/10 transition-colors"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#111C38] hover:bg-[#19284D] text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>دخول إلى النظام</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            {!credentials.isCustom ? (
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>حساب الإدارة الافتراضي:</span>
                <span className="font-mono text-[#111C38] bg-slate-100 px-2.5 py-1 rounded select-all">
                  admin / shams2026
                </span>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
                أدخل اسم المستخدم وكلمة المرور المخصصة للإدارة
              </div>
            )}
          </form>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-400 pt-6">
        مدرسة شمس المعارف الأساسية الأهلية · نظام الإدارة الإلكتروني
      </footer>
    </div>
  );
};
