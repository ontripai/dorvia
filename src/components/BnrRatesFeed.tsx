'use client';

import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { Landmark } from './Icons';

interface BnrRatesData {
  success: boolean;
  date?: string;
  fetchedAt?: string;
  source?: string;
  rates?: Record<string, number>;
  error?: string;
  officialSiteUrl?: string;
}

interface BnrRatesFeedProps {
  currentLang: Language;
}

export const BnrRatesFeed: React.FC<BnrRatesFeedProps> = ({ currentLang }) => {
  const [data, setData] = useState<BnrRatesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRates() {
      try {
        const res = await fetch('/api/bnr-rates');
        const json: BnrRatesData = await res.json();
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setData({
            success: false,
            error: currentLang === 'fa' ? 'در حال حاضر امکان دریافت نرخ زنده وجود ندارد' : 'Live exchange rates are currently unavailable.',
            officialSiteUrl: 'https://www.bnr.ro/Cursul-de-schimb-514.aspx'
          });
          setLoading(false);
        }
      }
    }

    fetchRates();

    return () => {
      isMounted = false;
    };
  }, [currentLang]);

  // Mandatory Disclaimer Text
  const disclaimerText = currentLang === 'fa'
    ? 'نرخ منتشرشده بانک ملی رومانی یک نرخ مرجع است و الزاماً نرخ نهایی خرید یا فروش بانک، کارت یا صرافی نیست.'
    : 'The rate published by the National Bank of Romania is a reference rate and is not necessarily the final buy/sell rate of banks or exchange offices.';

  // 1. Loading State (Skeleton)
  if (loading) {
    return (
      <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4 animate-pulse">
        <div className="flex items-center justify-between border-b border-[#dfe6ef] pb-3">
          <div className="h-5 bg-slate-200 rounded w-48"></div>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef] space-y-2">
              <div className="h-3 bg-slate-200 rounded w-12 mx-auto"></div>
              <div className="h-5 bg-slate-200 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State / Fallback (No Stale Numbers)
  if (!data || !data.success || !data.rates) {
    return (
      <div className="editorial-card p-6 bg-white border border-rose-200 space-y-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-rose-700 font-extrabold text-base">
          <Landmark size={20} className="text-rose-600" />
          <span>{currentLang === 'fa' ? 'در حال حاضر امکان دریافت نرخ زنده وجود ندارد' : 'Live exchange rates are currently unavailable'}</span>
        </div>

        <p className="text-xs text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'ارتباط با سیستم دریافت نرخ زنده بانک ملی رومانی (BNR) موقتاً برقرار نشد. می‌توانید نرخ‌های رسمی به‌روز را مستقیماً از وب‌سایت اصلی BNR مشاهده نمایید.'
            : 'Temporary connection issue with the BNR live feed. You can check official rates directly on the BNR website.'}
        </p>

        <div className="pt-2">
          <a
            href={data?.officialSiteUrl || 'https://www.bnr.ro/Cursul-de-schimb-514.aspx'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-[#071B3D] hover:bg-[#2F6FED] rounded-xl transition-colors shadow-sm"
          >
            ↗ {currentLang === 'fa' ? 'مشاهده نرخ رسمی در سایت بانک ملی رومانی (BNR)' : 'View Official Rates on BNR Website'}
          </a>
        </div>
      </div>
    );
  }

  // 3. Success State
  const keyCurrencies = ['EUR', 'USD', 'GBP', 'AED', 'TRY'];
  const formattedTime = data.fetchedAt ? new Date(data.fetchedAt).toLocaleTimeString(currentLang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#dfe6ef] pb-3 gap-2">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#142033]">
          <Landmark size={20} className="text-[#2F6FED]" />
          <h3 className="font-extrabold text-base">
            {currentLang === 'fa' ? 'نرخ مرجع زنده بانک ملی رومانی (BNR)' : 'Live BNR Official Reference Rates'}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#788697] font-semibold">
          <span className="bg-[#eef3f8] px-2.5 py-1 rounded-lg">
            📅 {currentLang === 'fa' ? `تاریخ نرخ: ${data.date}` : `Rate Date: ${data.date}`}
          </span>
          {formattedTime && (
            <span className="bg-[#eef3f8] px-2.5 py-1 rounded-lg">
              ⏱️ {currentLang === 'fa' ? `دریافت سرور: ${formattedTime}` : `Retrieved: ${formattedTime}`}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
        {keyCurrencies.map((curr) => {
          const val = data.rates?.[curr];
          return (
            <div key={curr} className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef] hover:border-[#2F6FED] transition-colors">
              <div className="text-xs text-[#788697] font-bold">1 {curr}</div>
              <div className="text-base font-extrabold text-[#2F6FED] mt-1">
                {val ? `${val} RON` : '—'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium leading-relaxed flex items-start space-x-2 rtl:space-x-reverse">
        <span className="text-amber-600 font-bold shrink-0">⚠️</span>
        <div>
          <span className="font-bold">{currentLang === 'fa' ? 'تذکر مهم (نرخ مرجع): ' : 'Mandatory Notice: '}</span>
          <span>{disclaimerText}</span>
        </div>
      </div>
    </div>
  );
};
