import React from 'react';
import { CostEstimate, TimelineEstimate } from '../../types/content';

interface FeesAndTimelinesProps {
  fees: CostEstimate[];
  timelines: TimelineEstimate[];
  isRtl: boolean;
  translations: {
    feesTitle: string;
    timelinesTitle: string;
    amountHeader: string;
    notesHeader: string;
    durationHeader: string;
  };
}

export const FeesAndTimelines: React.FC<FeesAndTimelinesProps> = ({ fees, timelines, isRtl, translations }) => {
  const hasFees = fees && fees.length > 0;
  const hasTimelines = timelines && timelines.length > 0;

  if (!hasFees && !hasTimelines) return null;

  return (
    <div className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
      {hasFees && (
        <div className="space-y-2">
          <h3 className="font-extrabold text-base text-[#142033]">
            {translations.feesTitle}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-[#526174] border border-[#dfe6ef] rounded-xl overflow-hidden">
              <thead className="bg-[#071B3D] text-white font-bold">
                <tr>
                  <th className="p-3 border-b border-[#dfe6ef]">{translations.amountHeader}</th>
                  <th className="p-3 border-b border-[#dfe6ef]">{translations.notesHeader}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfe6ef] bg-white">
                {fees.map((fee, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-extrabold text-[#2F6FED] bg-[#f8fafc] whitespace-nowrap">
                      {fee.amount} {fee.currency} {!fee.isFixed && (isRtl ? '(تخمینی)' : '(est.)')}
                    </td>
                    <td className="p-3">{fee.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hasTimelines && (
        <div className="space-y-2">
          <h3 className="font-extrabold text-base text-[#142033]">
            {translations.timelinesTitle}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-[#526174] border border-[#dfe6ef] rounded-xl overflow-hidden">
              <thead className="bg-[#071B3D] text-white font-bold">
                <tr>
                  <th className="p-3 border-b border-[#dfe6ef]">{translations.durationHeader}</th>
                  <th className="p-3 border-b border-[#dfe6ef]">{translations.notesHeader}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfe6ef] bg-white">
                {timelines.map((time, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-extrabold text-[#2F6FED] bg-[#f8fafc] whitespace-nowrap">
                      {time.duration} {!time.isGuaranteed && (isRtl ? '(متغیر)' : '(variable)')}
                    </td>
                    <td className="p-3">{time.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
