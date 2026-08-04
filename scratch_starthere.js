const fs = require("fs");
const path = "src/components/StartHereContent.tsx";
let content = fs.readFileSync(path, "utf8");

const newCases = `
  const disclaimer = currentLang === "fa"
    ? "????: ????? ?? ?????? ?????? (IGI) — ????? ?????: ????"
    : "Source: General Inspectorate for Immigration (IGI) — Last reviewed: 2026";

  switch (subRoute) {
    case "planning-to-come":
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === "fa" ? "??? ???? ?? ?????? ?? ????" : "Planning to come"}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === "fa" ? "?????? ???? ?????" : "Choosing the Right Pathway"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === "fa" ? "???? ???? ???? ?? ??? ??? ?????? ???: " : "Your entry pathway varies by purpose: "}
                  <button onClick={() => onNavigate("study")} className="text-[#2F6FED] hover:underline font-medium">{currentLang === "fa" ? "?????" : "Study"}</button>
                  {", "}
                  <button onClick={() => onNavigate("work")} className="text-[#2F6FED] hover:underline font-medium">{currentLang === "fa" ? "???" : "Work"}</button>
                  {", "}
                  <button onClick={() => onNavigate("company")} className="text-[#2F6FED] hover:underline font-medium">{currentLang === "fa" ? "??? ????" : "Business"}</button>
                  {currentLang === "fa" ? " ?? ????? ???????." : " or Family Reunification."}
                </li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === "fa" ? "????????? ???????????" : "Realistic Timeline"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "????????? ????? (????? ?????) ??????? ??????? ?? ?????? ???? ???????? ???? ??? ??????????? ????? ?? ??? ??? ??? ?? ????? ??????? ???? ???." : "Administrative processes (visa, residency) often take weeks to months; it is best to start planning several months ahead of your target date."}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === "fa" ? "????? ???? ???? ????" : "Official Starting Resources"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "????? ?? ?????? (IGI) ? ?????/???????? ??????? ????? ???? ???? ??????? ?????? ? ???? ?????." : "The General Inspectorate for Immigration (IGI) and the Romanian Embassy/Consulate are the primary sources for up-to-date and official information."}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "just-arrived":
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === "fa" ? "???? ?? ?????? ????????" : "Just arrived in Romania"}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === "fa" ? "?????? ????" : "Immediate Priority"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "??????? ?????? ???? ????? ???? ??? IGI ???? ??? ???? ?????? (??????? ??? ?? ????? ?????? ????? D) ????? ???." : "Registering for a temporary residence permit with IGI must be done within the legal timeframe (usually before the D visa expires)."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === "fa" ? "?????? ???? ?????? ???" : "Practical First Tasks"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "???? ???????? ????? ?????? ???? ????? (???? ?? CNP ?? ???? ????? ????)? ? ???? ???? ??? ????? ????." : "Getting a local SIM card, opening a bank account (requires CNP or residency document), and finding temporary accommodation."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === "fa" ? "???? ??? ????" : "Important Address Note"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "???? ??? ????? ???? ?? ????? ?????? ??? ???? ????? ???? ???? ?? IGI ????? ???? ???." : "Your residential address must be registered on your residency documents; any change of address must be reported to IGI."}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "living-here":
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === "fa" ? "???? ?????? ????" : "Living in Romania"}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === "fa" ? "????? ? ??????? ?????" : "Residency Maintenance"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === "fa" ? "????? ???? ????? ???? ??? ?? ????? ?????? ????? ???. ??????? ????? ?? " : "Permit renewal must be done before expiration. Read more in "}
                  <button onClick={() => onNavigate("immigration/residence-renewal")} className="text-[#2F6FED] hover:underline font-medium">{currentLang === "fa" ? "????? ?????" : "Residence Renewal"}</button>
                  {currentLang === "fa" ? "." : "."}
                </li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === "fa" ? "????? ?? ?????" : "Social Integration"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === "fa" ? "?????? ?? ???? ????? ????? (" : "Accessing the public health system ("}
                  <button onClick={() => onNavigate("needs/insurance")} className="text-[#2F6FED] hover:underline font-medium">{currentLang === "fa" ? "????" : "Insurance"}</button>
                  {currentLang === "fa" ? ")? ????? ??????? ????? ? ???????? ????? ????????." : "), language learning options, and Iranian community networks."}
                </li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === "fa" ? "???? ???????" : "Long-term Pathways"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === "fa" ? "?? ?? ??????? ???? ?? ????? ?????? ?????? ????? ????? ???? ????? ??????? ???? ????. ??????? ?? " : "After a specific period of continuous legal residency, long-term residency options open up. See "}
                  <button onClick={() => onNavigate("immigration/long-term-residence")} className="text-[#2F6FED] hover:underline font-medium">{currentLang === "fa" ? "????? ???????" : "Long-term Residence"}</button>
                  {currentLang === "fa" ? "." : "."}
                </li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "pre-departure-checklist":
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === "fa" ? "??????? ??? ?? ???" : "Pre-departure Checklist"}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === "fa" ? "????? ?????" : "Essential Documents"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "??????? ?? ????? ? ??? ?????? ????? ?? ????? ?????? ????? ????? D ?????? ???? ?????? ??????????? ???? ???? ????." : "Passport valid for at least 3 months beyond visa expiration, a valid Type D visa, international travel insurance, and proof of funds."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === "fa" ? "?????????? ???? ? ???????" : "Financial & Comm Prep"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "????? ?????? ??? ???? ????????? ?????? ??????????? ?? ???? ?????? ??? (?? ???? ??????? ?? ???? ??????????)? ????? ???? ??????? ?? ????? ???." : "Exchanging a minimum amount of currency for initial expenses, notifying your bank (if using international cards), and saving digital copies of key documents."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === "fa" ? "??????? ??? ?????" : "Accommodation Setup"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "????? ???? ??? ????? ???? ?? ??????? ??? ?? ?????? ????? ?? ????? ???? ???? ????." : "Confirming your temporary housing or dorm reservation before the flight, and having the exact destination address at hand."}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "first-three-days":
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === "fa" ? "? ??? ??? ?? ??????" : "First 3 Days"}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === "fa" ? "??? ????" : "Arrival Day"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "???? ?? ???? ? ????? ????? ?????? ??? ????? ??????? ?? ??? ??????? ???????." : "Clearing customs and border control, getting the entry stamp, and ensuring passport details are correctly processed."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === "fa" ? "?????? ????" : "Urgent Tasks"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "???? ???????? ???? ???? ??????? ??????? ?????????? ???? IGI ??? ????? ???? ????? ????." : "Purchasing a local SIM card for communication, and locating the nearest IGI branch for your upcoming residency steps."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === "fa" ? "???? ?????" : "Safety Note"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "??????? ???? ?? ????? ????? ??????? ??????? ?? ??? ?????." : "Keep copies of your identity documents stored separately from the originals."}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "first-month":
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === "fa" ? "??? ??? ?????" : "First Month"}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === "fa" ? "??? ???? ?????" : "Official Residency Registration"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === "fa" ? "??????? ???? ????? ???? ??? IGI ???? ?? ??? ???? ????? ???. ???? ?? " : "Requesting a temporary residence permit at IGI must be done in this timeframe. See "}
                  <button onClick={() => onNavigate("immigration/igi-process")} className="text-[#2F6FED] hover:underline font-medium">{currentLang === "fa" ? "????? IGI" : "IGI Process"}</button>
                  {currentLang === "fa" ? "." : "."}
                </li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === "fa" ? "???? ????? ? ????" : "Banking & Finance"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "?????? ???? ????? ????? ?????? ????? ??????? ??????? ?? ???? ???? (???? ????? ??? ?? ?????? ???????)." : "Opening a permanent bank account and obtaining a tax identification number if necessary (for renting property or economic activities)."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === "fa" ? "??????? ?? ?????" : "Service Enrollment"}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === "fa" ? "??????? ?????? (?? ???? ?????? ????) ?? ???? ???? ??? (?? ???? ????? ???????)? ??? ???? ??? ?????." : "University enrollment (if a student) or officially starting work (if employed), and registering your residential address."}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
\`;

const startIdx = content.indexOf("const disclaimer =");
const endIdx = content.lastIndexOf("};");
content = content.substring(0, startIdx) + newCases + "\\n" + content.substring(endIdx);
fs.writeFileSync(path, content);
console.log("Done");

