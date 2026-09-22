import { Languages } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

export default function LanguageSwitcher({ tone = "light", compact = false, className = "" }) {
  const { language, setLanguage } = useLanguage();
  const dark = tone === "dark";

  return (
    <div
      data-no-translate="true"
      className={`inline-flex items-center rounded-xl p-1 ${className}`}
      style={{
        background: dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.88)",
        border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid var(--border)",
        boxShadow: dark ? "none" : "0 3px 12px rgba(16,24,40,0.06)",
      }}
      role="group"
      aria-label="Website language"
    >
      {!compact && (
        <Languages
          className="w-4 h-4 mx-1"
          aria-hidden="true"
          style={{ color: dark ? "#D9AC5C" : "var(--gold)" }}
        />
      )}
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        aria-label="Use English"
        className="min-w-9 h-8 px-2 rounded-lg text-[11px] font-black transition-all"
        style={{
          background: language === "en" ? (dark ? "#D9AC5C" : "var(--gold)") : "transparent",
          color: language === "en" ? "#1E1812" : (dark ? "#E5E7EB" : "var(--charcoal)"),
        }}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("gu")}
        aria-pressed={language === "gu"}
        aria-label="ગુજરાતી ભાષા પસંદ કરો"
        className="min-w-9 h-8 px-2 rounded-lg text-[11px] font-black transition-all"
        style={{
          background: language === "gu" ? (dark ? "#D9AC5C" : "var(--gold)") : "transparent",
          color: language === "gu" ? "#1E1812" : (dark ? "#E5E7EB" : "var(--charcoal)"),
        }}
      >
        ગુજ
      </button>
    </div>
  );
}
