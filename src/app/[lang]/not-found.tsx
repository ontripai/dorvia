import { LocalizedLink as Link } from '@/components/LocalizedLink';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-2xl font-black">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">
            صفحه مورد نظر یافت نشد
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            این صفحه ممکن است جابه‌جا شده باشد، یا دسترسی به آن موقتاً غیرفعال است.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}
