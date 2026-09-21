import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Crown,
  Eye,
  FileText,
  Sparkles,
} from "lucide-react";
import { trackEvent } from "../../lib/analytics";

export const ACCOUNTANCY_PREMIUM_SAMPLE_PDF =
  "https://upload.higgsfield.ai/user_3IeBtmZKf7raEGMa7lNKq84904t/6b237a13-c780-4c21-8611-ea9b8527943b.pdf";

export const ACCOUNTANCY_PREMIUM_SAMPLE_COVER =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_3IeBtmZKf7raEGMa7lNKq84904t/e0783293-ec82-4e24-b73a-d380df39f403.jpg";

const benefits = [
  "Visual concept maps & premium layouts",
  "Step-by-step worked numericals",
  "Teacher POV, exam tips & common traps",
  "Large, mobile-friendly study pages",
];

export default function AccountancyPremiumPreview({ variant = "compact" }) {
  const showcase = variant === "showcase";

  const openSample = () => {
    void trackEvent("premium_accountancy_sample_open", {
      placement: showcase ? "premium_accountancy_page" : "homepage",
      resource: "financial_ratios_analysis_105_page_sample",
    });
  };

  return (
    <section
      aria-labelledby={showcase ? "premium-sample-title" : "home-premium-sample-title"}
      className={showcase ? "page-container max-w-6xl py-8 sm:py-10" : "w-full"}
      style={showcase ? undefined : { gridColumn: "1 / -1" }}
    >
      <div
        className={
          showcase
            ? "overflow-hidden rounded-[28px] border shadow-[0_20px_60px_rgba(23,32,51,.12)]"
            : "overflow-hidden rounded-3xl border shadow-[0_14px_36px_rgba(23,32,51,.10)]"
        }
        style={{
          background:
            "linear-gradient(135deg, #fffdf7 0%, #f4fbf7 52%, #fff7e6 100%)",
          borderColor: "#d8e5dc",
        }}
      >
        <div
          className={
            showcase
              ? "grid lg:grid-cols-[.72fr_1.28fr] gap-0"
              : "grid sm:grid-cols-[170px_1fr] lg:grid-cols-[210px_1fr] gap-0"
          }
        >
          <div
            className="relative flex items-center justify-center p-4 sm:p-5"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(25,126,109,.15), transparent 55%), linear-gradient(145deg,#eaf7f1,#f9f2df)",
            }}
          >
            <span
              className="absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] font-black tracking-[.12em]"
              style={{ background: "#0f766e", color: "#fff" }}
            >
              FREE FULL SAMPLE
            </span>
            <a
              href={ACCOUNTANCY_PREMIUM_SAMPLE_PDF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={openSample}
              className="group block"
              aria-label="Open the free Financial Ratios Premium PDF sample"
            >
              <img
                src={ACCOUNTANCY_PREMIUM_SAMPLE_COVER}
                alt="Financial Ratios Analysis Premium Master Notes cover"
                width="951"
                height="1345"
                loading={showcase ? "lazy" : "eager"}
                decoding="async"
                className={
                  showcase
                    ? "w-[220px] sm:w-[250px] lg:w-[280px] rounded-xl border bg-white shadow-[0_18px_45px_rgba(20,57,52,.20)] transition-transform duration-300 group-hover:-translate-y-1"
                    : "w-[118px] sm:w-full max-w-[180px] rounded-lg border bg-white shadow-[0_14px_32px_rgba(20,57,52,.18)] transition-transform duration-300 group-hover:-translate-y-1"
                }
                style={{ borderColor: "#d9dfdb" }}
              />
            </a>
          </div>

          <div className={showcase ? "p-6 sm:p-9 lg:p-10" : "p-5 sm:p-6 lg:p-7"}>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] sm:text-[11px] font-black tracking-[.12em]"
                style={{ background: "#e8f6f1", color: "#0f766e", border: "1px solid #c8e7dc" }}
              >
                <Sparkles className="w-3.5 h-3.5" /> NEW PREMIUM MASTER STANDARD
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] sm:text-[11px] font-black tracking-[.1em]"
                style={{ background: "#fff1c9", color: "#8a6012" }}
              >
                <Crown className="w-3.5 h-3.5" /> 105-PAGE FREE SAMPLE
              </span>
            </div>

            <h2
              id={showcase ? "premium-sample-title" : "home-premium-sample-title"}
              className={
                showcase
                  ? "text-3xl sm:text-4xl lg:text-5xl mt-4 leading-[1.06]"
                  : "text-xl sm:text-2xl lg:text-3xl mt-3 leading-tight"
              }
              style={{ color: "#172033", fontFamily: "var(--font-serif)" }}
            >
              See exactly what a Premium Accountancy PDF should feel like.
            </h2>

            <p
              className={showcase ? "mt-4 text-base sm:text-lg leading-8 max-w-3xl" : "mt-2 text-sm sm:text-base leading-6 max-w-3xl"}
              style={{ color: "#596273" }}
            >
              Read <strong style={{ color: "#172033" }}>Financial Ratios — Analysis</strong> completely free.
              This full chapter is the quality benchmark for our Premium Master Notes: visual, detailed,
              exam-focused and built to make difficult Accountancy easier to understand.
            </p>

            <div className={showcase ? "grid sm:grid-cols-2 gap-3 mt-6" : "hidden lg:grid grid-cols-2 gap-2.5 mt-4"}>
              {benefits.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,.78)", border: "1px solid #e3e8e4", color: "#293244" }}
                >
                  <BadgeCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#16806d" }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-5 sm:mt-6">
              <a
                href={ACCOUNTANCY_PREMIUM_SAMPLE_PDF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={openSample}
                className="btn-primary inline-flex min-h-12 items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" /> Open Free PDF Preview
              </a>
              <Link
                to="/premium/cbse-12-accountancy"
                className="btn-secondary inline-flex min-h-12 items-center justify-center gap-2"
                onClick={() =>
                  void trackEvent("premium_accountancy_sample_cta", {
                    placement: showcase ? "premium_accountancy_page" : "homepage",
                  })
                }
              >
                <BookOpenCheck className="w-4 h-4" /> Explore Premium
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-start gap-2 mt-4 text-xs leading-5" style={{ color: "#6d7582" }}>
              <FileText className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#b8872f" }} />
              <span>
                This chapter is free as a quality sample. Premium access unlocks the protected Accountancy
                library and future Master PDFs built to this same visual standard.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
