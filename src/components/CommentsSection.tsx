'use client';

import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { fetchApprovedComments, submitComment, CommentItem } from '../lib/supabase';
import { MessageSquare, Star, CheckCircle, AlertCircle, Send } from './Icons';

interface CommentsSectionProps {
  pagePath: string;
  currentLang: Language;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ pagePath, currentLang }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [rating, setRating] = useState<number | 0>(0);
  const [commentText, setCommentText] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const MAX_CHARS = 1000;

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      const data = await fetchApprovedComments(pagePath);
      if (isMounted) {
        setComments(data);
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [pagePath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitSuccess(false);

    if (!commentText.trim()) {
      setErrorMessage(currentLang === 'fa' ? 'لطفاً متن نظر خود را وارد کنید.' : 'Please enter your comment.');
      return;
    }

    if (commentText.length > MAX_CHARS) {
      setErrorMessage(currentLang === 'fa' ? `متن نظر نباید بیشتر از ${MAX_CHARS} کاراکتر باشد.` : `Comment cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    // 60s Rate Limiting Check
    const RATE_LIMIT_KEY = `last_comment_submit_${pagePath}`;
    const lastSubmit = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastSubmit) {
      const elapsed = Date.now() - parseInt(lastSubmit, 10);
      if (elapsed < 60000) {
        const remainingSec = Math.ceil((60000 - elapsed) / 1000);
        setErrorMessage(
          currentLang === 'fa'
            ? `جهت جلوگیری از اسپم، لطفاً ${remainingSec} ثانیه دیگر جهت ارسال نظر بعدی صبر کنید.`
            : `Please wait ${remainingSec} seconds before submitting another comment.`
        );
        return;
      }
    }

    setIsSubmitting(true);

    const result = await submitComment({
      page_path: pagePath,
      name,
      comment_text: commentText,
      rating: rating > 0 ? rating : undefined,
      honeypot
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
      setName('');
      setRating(0);
      setCommentText('');
      setHoneypot('');
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
    } else {
      setErrorMessage(result.error || (currentLang === 'fa' ? 'خطا در ثبت نظر. لطفاً دوباره تلاش کنید.' : 'Error submitting comment. Please try again.'));
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex items-center space-x-1 rtl:space-x-reverse text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= count ? 'text-amber-400' : 'text-slate-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 bg-white rounded-2xl border border-[#dfe6ef] shadow-sm p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#dfe6ef] pb-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#142033]">
          <MessageSquare size={22} className="text-[#2F6FED]" />
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl">
              {currentLang === 'fa' ? 'نظرات و پرسش‌های کاربران' : 'User Reviews & Comments'}
            </h3>
            <p className="text-xs text-[#788697] mt-0.5">
              {currentLang === 'fa' ? 'تجربیات و دیدگاه‌های تاییدشده درباره این صفحه' : 'Verified user experiences and discussions'}
            </p>
          </div>
        </div>
        <span className="text-xs bg-[#eef3f8] text-[#2F6FED] font-bold px-3 py-1.5 rounded-xl">
          {comments.length} {currentLang === 'fa' ? 'نظر تاییدشده' : 'Approved'}
        </span>
      </div>

      {/* Approved Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-16 bg-slate-100 rounded-xl"></div>
            <div className="h-16 bg-slate-100 rounded-xl"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-6 bg-[#f7f9fc] border border-[#dfe6ef] rounded-xl text-center text-xs text-[#788697]">
            {currentLang === 'fa' ? 'هنوز نظری برای این صفحه ثبت نشده است. اولین نفری باشید که دیدگاه خود را مطرح می‌کنید!' : 'No comments published yet. Be the first to share your review!'}
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div className="w-7 h-7 rounded-full bg-[#071B3D] text-white text-xs font-bold flex items-center justify-center">
                      {comment.name ? comment.name.charAt(0).toUpperCase() : 'ک'}
                    </div>
                    <span className="font-bold text-xs text-[#142033]">{comment.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse text-[11px] text-[#788697]">
                    {comment.rating && renderStars(comment.rating)}
                    <span>{new Date(comment.created_at).toLocaleDateString(currentLang === 'fa' ? 'fa-IR' : 'en-US')}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#526174] leading-relaxed pt-1 whitespace-pre-line">
                  {comment.comment_text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Submission Form */}
      <div className="pt-4 border-t border-[#dfe6ef] space-y-4">
        <h4 className="font-extrabold text-base text-[#142033]">
          {currentLang === 'fa' ? 'ثبت نظر یا پرسش جدید' : 'Leave a Comment or Question'}
        </h4>

        {submitSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-900 font-semibold flex items-center space-x-2 rtl:space-x-reverse">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span>
              {currentLang === 'fa'
                ? 'نظر شما با موفقیت ثبت شد و پس از بررسی و تایید مدیر نمایش داده می‌شود.'
                : 'Your comment has been submitted and will appear after moderation.'}
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-900 font-semibold flex items-center space-x-2 rtl:space-x-reverse">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot Anti-Bot Field (Hidden) */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input
              type="text"
              name="website_url_hp"
              tabIndex={-1}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-[#142033] mb-1">
                {currentLang === 'fa' ? 'نام شما (اختیاری)' : 'Your Name (Optional)'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={currentLang === 'fa' ? 'مثلاً: علی رضایی (پیش‌فرض: کاربر ناشناس)' : 'e.g. Alex (Default: Anonymous)'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#dfe6ef] focus:outline-none focus:border-[#2F6FED] bg-[#f8fafc] text-[#142033]"
              />
            </div>

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold text-[#142033] mb-1">
                {currentLang === 'fa' ? 'امتیاز شما (اختیاری)' : 'Rating (Optional)'}
              </label>
              <div className="flex items-center space-x-1 rtl:space-x-reverse py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(rating === star ? 0 : star)}
                    className="text-lg focus:outline-none transition-transform hover:scale-125"
                  >
                    <span className={star <= rating ? 'text-amber-400' : 'text-slate-300'}>★</span>
                  </button>
                ))}
                <span className="text-xs text-[#788697] font-bold me-2">
                  {rating > 0 ? `${rating} / 5` : (currentLang === 'fa' ? 'بدون امتیاز' : 'No rating')}
                </span>
              </div>
            </div>
          </div>

          {/* Comment Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-[#142033]">
                {currentLang === 'fa' ? 'متن نظر یا سوال (الزامی)' : 'Comment or Question (Required)'}
              </label>
              <span className={`text-[11px] ${commentText.length > MAX_CHARS ? 'text-rose-600 font-bold' : 'text-[#788697]'}`}>
                {commentText.length} / {MAX_CHARS}
              </span>
            </div>
            <textarea
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                currentLang === 'fa'
                  ? 'سوال، دیدگاه یا تجربه شخصی خود را اینجا بنویسید...'
                  : 'Write your question, feedback, or personal experience here...'
              }
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#dfe6ef] focus:outline-none focus:border-[#2F6FED] bg-[#f8fafc] text-[#142033] leading-relaxed"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center space-x-2 rtl:space-x-reverse transition-all shadow-sm ${
                isSubmitting || !commentText.trim()
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-[#071B3D] hover:bg-[#2F6FED]'
              }`}
            >
              <span>{isSubmitting ? (currentLang === 'fa' ? 'در حال ارسال...' : 'Submitting...') : (currentLang === 'fa' ? 'ثبت نظر' : 'Submit Comment')}</span>
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
