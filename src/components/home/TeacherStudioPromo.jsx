import { ArrowRight, ClipboardCheck, Presentation, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import { trackEvent } from "../../lib/analytics";

export default function TeacherStudioPromo() {
  return (
    <section
      className="section-light py-12 sm:py-16"
      style={{ background: "#101828" }}
    >
      <div className="page-container">
        <div
          className="rounded-3xl p-6 sm:p-9 lg:p-11 grid lg:grid-cols-[1fr_auto] gap-8 items-center"
          style={{
            background:
              "linear-gradient(135deg,rgba(201,160,80,.18),rgba(255,255,255,.05))",
            border: "1px solid rgba(201,160,80,.28)",
          }}
        >
          <div>
            <span
              className="text-xs font-black tracking-[.16em] uppercase"
              style={{ color: "var(--gold-bright)" }}
            >
              For teachers, schools & coaching classes
            </span>
            <h2
              className="text-3xl sm:text-4xl mt-3"
              style={{ fontFamily: "var(--font-serif)", color: "#fff" }}
            >
              Need a question paper, branded notes or teaching pack?
            </h2>
            <p
              className="mt-4 max-w-3xl leading-relaxed"
              style={{ color: "var(--muted-on-ink)" }}
            >
              Smit Sir Teacher Studio creates original classroom material and
              simple teacher websites, with clear starting prices from ₹499.
            </p>
            <div
              className="flex flex-wrap gap-4 mt-5 text-sm"
              style={{ color: "#fff" }}
            >
              <span className="inline-flex items-center gap-2">
                <ClipboardCheck
                  className="w-4 h-4"
                  style={{ color: "var(--gold-bright)" }}
                />{" "}
                Papers + keys
              </span>
              <span className="inline-flex items-center gap-2">
                <Presentation
                  className="w-4 h-4"
                  style={{ color: "var(--gold-bright)" }}
                />{" "}
                PPT bundles
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe2
                  className="w-4 h-4"
                  style={{ color: "var(--gold-bright)" }}
                />{" "}
                Teacher websites
              </span>
            </div>
          </div>
          <Link
            to="/services-for-teachers"
            onClick={() => trackEvent("teacher_services_home_click")}
            className="btn-gold inline-flex items-center justify-center gap-2 min-h-12"
          >
            See services & pricing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
