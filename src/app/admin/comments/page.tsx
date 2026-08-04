'use client';

import React, { useEffect, useState } from 'react';
import { fetchAdminComments, updateCommentStatus, deleteComment, CommentItem } from '@/lib/supabase';

export default function AdminCommentsPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [authError, setAuthError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (expected && password === expected) {
      setIsAuthenticated(true);
      setAuthError('');
      loadAdminData();
    } else {
      setAuthError('رمز عبور واردشده نادرست است یا متغیر NEXT_PUBLIC_ADMIN_PASSWORD در محیط تنظیم نشده است.');
    }
  };

  async function loadAdminData() {
    setLoading(true);
    const data = await fetchAdminComments();
    setComments(data);
    setLoading(false);
  }

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    await updateCommentStatus(id, status);
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm('آیا از حذف دائم این نظر اطمینان دارید؟')) {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#071B3D] flex items-center justify-center px-4 font-sans text-right rtl">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#eef3f8] text-[#2F6FED] rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              🔐
            </div>
            <h1 className="text-2xl font-extrabold text-[#142033]">پنل مدیریت نظرات سایت</h1>
            <p className="text-xs text-[#788697]">جهت ورود، رمز عبور مدیریت را وارد فرمایید.</p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#142033] mb-1.5">رمز عبور مدیریت (Admin Password)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور را وارد کنید..."
                className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-sm focus:outline-none focus:border-[#2F6FED] bg-[#f8fafc]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#071B3D] hover:bg-[#2F6FED] text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
            >
              ورود به پنل مدیریت
            </button>
          </form>

          <div className="p-3 bg-[#f7f9fc] border border-[#dfe6ef] rounded-xl text-[11px] text-[#788697] text-center font-semibold">
            🔐 احراز هویت بر اساس متغیر محیطی <code className="bg-white px-2 py-0.5 rounded border border-[#dfe6ef] font-mono text-[#2F6FED]">NEXT_PUBLIC_ADMIN_PASSWORD</code> انجام می‌شود.
          </div>
        </div>
      </div>
    );
  }

  const filteredComments = comments.filter((c) => {
    if (activeTab === 'all') return true;
    return c.status === activeTab;
  });

  const pendingCount = comments.filter((c) => c.status === 'pending').length;
  const approvedCount = comments.filter((c) => c.status === 'approved').length;
  const rejectedCount = comments.filter((c) => c.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-[#f7f9fc] py-10 px-4 sm:px-6 lg:px-8 font-sans text-right rtl">
      <div className="max-w-[1280px] mx-auto space-y-8">
        {/* Header Bar */}
        <div className="bg-[#071B3D] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <span className="text-xs text-[#2F6FED] font-bold uppercase tracking-wider">DORVIA EUROP — Admin Panel</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">مدیریت و تایید نظرات کاربران</h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-[#0b2b55] hover:bg-rose-600 text-xs font-bold text-white rounded-xl transition-colors self-start sm:self-auto"
          >
            خروج از پنل
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#dfe6ef] shadow-sm">
            <span className="text-xs text-[#788697] font-bold">کل نظرات</span>
            <div className="text-2xl font-extrabold text-[#142033] mt-1">{comments.length}</div>
          </div>
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-sm">
            <span className="text-xs text-amber-800 font-bold">در انتظار تایید (Pending)</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</div>
          </div>
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 shadow-sm">
            <span className="text-xs text-emerald-800 font-bold">تاییدشده (Approved)</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{approvedCount}</div>
          </div>
          <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 shadow-sm">
            <span className="text-xs text-rose-800 font-bold">ردشده (Rejected)</span>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">{rejectedCount}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-[#dfe6ef] space-x-2 rtl:space-x-reverse text-xs font-bold">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-3 px-4 transition-colors border-b-2 ${
              activeTab === 'pending'
                ? 'border-amber-500 text-amber-600 font-extrabold'
                : 'border-transparent text-[#788697] hover:text-[#142033]'
            }`}
          >
            ⏳ در انتظار تایید ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`pb-3 px-4 transition-colors border-b-2 ${
              activeTab === 'approved'
                ? 'border-emerald-500 text-emerald-600 font-extrabold'
                : 'border-transparent text-[#788697] hover:text-[#142033]'
            }`}
          >
            ✅ تاییدشده ({approvedCount})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`pb-3 px-4 transition-colors border-b-2 ${
              activeTab === 'rejected'
                ? 'border-rose-500 text-rose-600 font-extrabold'
                : 'border-transparent text-[#788697] hover:text-[#142033]'
            }`}
          >
            ❌ رده‌شده ({rejectedCount})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-4 transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-[#2F6FED] text-[#2F6FED] font-extrabold'
                : 'border-transparent text-[#788697] hover:text-[#142033]'
            }`}
          >
            همه نظرات ({comments.length})
          </button>
        </div>

        {/* Comments Table */}
        <div className="bg-white rounded-2xl border border-[#dfe6ef] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#788697] animate-pulse">در حال بارگذاری نظرات...</div>
          ) : filteredComments.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#788697]">هیچ نظری در این بخش یافت نشد.</div>
          ) : (
            <div className="divide-y divide-[#dfe6ef]">
              {filteredComments.map((item) => (
                <div key={item.id} className="p-5 sm:p-6 space-y-3 hover:bg-[#f8fafc] transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span className="font-extrabold text-sm text-[#142033]">{item.name}</span>
                      <span className="bg-[#eef3f8] text-[#2F6FED] px-2.5 py-0.5 rounded-lg text-[11px] font-bold dir-ltr">
                        📍 {item.page_path}
                      </span>
                      {item.rating && (
                        <span className="text-amber-500 text-xs font-bold">
                          {'★'.repeat(item.rating)} ({item.rating}/5)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs">
                      <span className="text-[#788697]">
                        📅 {new Date(item.created_at).toLocaleString('fa-IR')}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          item.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status === 'approved' ? 'تاییدشده' : item.status === 'rejected' ? 'ردشده' : 'در انتظار'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#526174] leading-relaxed bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef] whitespace-pre-line">
                    {item.comment_text}
                  </p>

                  <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-1">
                    {item.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'approved')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        ✓ تایید و انتشار
                      </button>
                    )}
                    {item.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'rejected')}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        ✕ رد نظر
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
