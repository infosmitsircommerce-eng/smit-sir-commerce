import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Target } from "lucide-react";
import { trackEvent } from "../../lib/analytics";

export default function BoosterInlineCTA({
  placement = "content",
  compact = false,
}) {
  useEffect(() => {
    trackEvent("booster_cta_view", { placement });
  }, [placement]);

  return (
    <section
      className="card-paper p-5 sm:p-7"
      aria-label="Free board exam diagnostic"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "var(--gold-bg)", color: "var(--gold)" }}
        >
          <Target className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <span className="eyebrow">Free · 5 minutes · No login</span>
          <h2
            className={`${compact ? "text-xl" : "text-2xl sm:text-3xl"} mt-2`}
            style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
          >
            Find the chapters costing you marks
          </h2>
          <p
            className="text-sm mt-2 leading-6"
            style={{ color: "var(--muted)" }}
          >
            Take the Board Exam Diagnostic and get an instant weak-topic report
            plus a personalised seven-day revision plan.
          </p>
        </div>
        <Link
          to={`/board-exam-diagnostic?from=${encodeURIComponent(placement)}`}
          onClick={() => trackEvent("booster_cta_click", { placement })}
          className="btn-primary inline-flex items-center justify-center gap-2 shrink-0"
        >
          Start free test <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
