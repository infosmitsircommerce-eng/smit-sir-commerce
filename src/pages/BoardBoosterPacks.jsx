import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import SEO from "../components/ui/SEO";
import BoardBoosterPreview from "../components/growth/BoardBoosterPreview";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { trackEvent } from "../lib/analytics";
import {
  BOARD_BOOSTER_INCLUSIONS,
  BOARD_BOOSTER_PRODUCTS,
} from "../data/boardBoosterProducts";

const PATH = "/board-booster-packs";
const BASE = "https://www.smitsircommerce.in";

function ReservationForm({ selectedId, setSelectedId }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    consent: false,
    website: "",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const started = useRef(false);
  const selected =
    BOARD_BOOSTER_PRODUCTS.find((item) => item.id === selectedId) ||
    BOARD_BOOSTER_PRODUCTS[0];

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (!started.current) {
      started.current = true;
      trackEvent(
        "board_booster_direct_form_start",
        { productId: selected.id },
        user?.id || null,
      );
    }
  }

  async function submit(event) {
    event.preventDefault();
    const mobile = form.mobile.replace(/\D/g, "");
    if (form.website) return;
    if (form.name.trim().length < 2 || !/^[6-9]\d{9}$/.test(mobile)) {
      setMessage(
        "Enter the student's name and a valid 10-digit Indian mobile number.",
      );
      return;
    }
    if (!form.consent) {
      setMessage(
        "Please confirm that we may contact you about this pack request.",
      );
      return;
    }
    setBusy(true);
    setMessage("");
    const params = new URLSearchParams(window.location.search);
    const payload = {
      full_name: form.name.trim(),
      mobile: `+91${mobile}`,
      class_level: selected.classLevel,
      board: selected.board,
      subjects: [selected.subject],
      study_mode: "Online",
      preferred_contact_time: "Any time",
      source: params.get("utm_source")
        ? "Other"
        : document.referrer.includes("google.")
          ? "Google"
          : "Direct",
      intent: "General Enquiry",
      message: `BOARD BOOSTER Rs 199 DIRECT RESERVATION | ${selected.name} | Product prepared: 14-page PDF, 3 original 20-mark tests, answers, 7-day plan and worksheets | Payment status: not requested; confirm recipient and delivery terms before payment.`,
      consent: true,
      first_path: PATH,
      utm_source: params.get("utm_source") || "direct",
      utm_medium: params.get("utm_medium") || "product-page",
      utm_campaign: params.get("utm_campaign") || "board_booster_199",
      landing_context: `board-booster:${selected.id}`,
    };
    const { error } = await supabase.from("lead_submissions").insert(payload);
    if (error) {
      setMessage(
        "We could not save the reservation. Please try again in a moment.",
      );
      trackEvent(
        "board_booster_direct_submit_error",
        { productId: selected.id, code: error.code || "unknown" },
        user?.id || null,
      );
    } else {
      setMessage(
        "Reservation saved. You will receive the exact payment recipient and delivery confirmation before you pay.",
      );
      setForm({ name: "", mobile: "", consent: false, website: "" });
      trackEvent(
        "board_booster_direct_submit_success",
        { productId: selected.id, value: 199 },
        user?.id || null,
      );
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          currency: "INR",
          value: 199,
          offer: "board-booster-pack",
          subject: selected.subject,
          board: selected.board,
        });
      }
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="card-paper p-5 sm:p-8" id="reserve-pack">
      <span className="eyebrow">No payment on this form</span>
      <h2
        className="text-3xl mt-3"
        style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
      >
        Reserve one pack at ₹199
      </h2>
      <p className="text-sm leading-6 mt-3" style={{ color: "var(--muted)" }}>
        Submit the request first. Pay only after the exact pack, recipient and
        delivery process are confirmed by Smit Sir Commerce.
      </p>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="booster-catalog-website">Website</label>
        <input
          id="booster-catalog-website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </div>
      <label className="block text-sm font-bold mt-5">
        Choose subject
        <select
          value={selectedId}
          onChange={(event) => {
            setSelectedId(event.target.value);
            update("subject", event.target.value);
          }}
          className="input-field w-full mt-2"
        >
          {BOARD_BOOSTER_PRODUCTS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.shortName}
            </option>
          ))}
        </select>
      </label>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <label className="text-sm font-bold">
          Student name
          <input
            required
            minLength={2}
            maxLength={80}
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className="input-field w-full mt-2"
            placeholder="Student name"
          />
        </label>
        <label className="text-sm font-bold">
          Mobile number
          <input
            required
            inputMode="numeric"
            maxLength={10}
            value={form.mobile}
            onChange={(event) =>
              update(
                "mobile",
                event.target.value.replace(/\D/g, "").slice(0, 10),
              )
            }
            className="input-field w-full mt-2"
            placeholder="10-digit mobile"
          />
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm leading-6 mt-4">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => update("consent", event.target.checked)}
          className="mt-1 w-4 h-4"
        />
        <span>
          I request details for this pack and agree to be contacted about this
          request. This does not create a payment obligation.
        </span>
      </label>
      <button disabled={busy} className="btn-primary w-full mt-5">
        {busy
          ? "Saving reservation…"
          : `Reserve ${selected.shortName} for ₹199`}
      </button>
      {message ? (
        <p role="status" className="text-sm font-semibold leading-6 mt-4">
          {message}
        </p>
      ) : null}
    </form>
  );
}

export default function BoardBoosterPacks() {
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();
  const packParam = searchParams.get("pack");
  const initial = BOARD_BOOSTER_PRODUCTS.some(
    (item) => item.id === searchParams.get("pack"),
  )
    ? searchParams.get("pack")
    : BOARD_BOOSTER_PRODUCTS[0].id;
  const [selectedId, setSelectedId] = useState(initial);
  useEffect(() => {
    if (BOARD_BOOSTER_PRODUCTS.some((item) => item.id === packParam)) setSelectedId(packParam);
  }, [packParam]);
  useEffect(() => {
    if (hash !== "#free-preview") return;
    const frame = requestAnimationFrame(() => document.getElementById("free-preview")?.scrollIntoView({ behavior: "auto" }));
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  useEffect(() => {
    trackEvent("board_booster_catalog_view", {
      source: searchParams.get("from") || "direct",
    });
  }, [searchParams]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Class 12 Commerce Board Booster Packs",
    url: BASE + PATH,
    itemListElement: BOARD_BOOSTER_PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.focus,
        brand: { "@type": "Brand", name: "Smit Sir Commerce" },
        offers: {
          "@type": "Offer",
          price: "199",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${BASE}${PATH}?pack=${product.id}`,
        },
      },
    })),
  };

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg-ivory)", color: "var(--ink)" }}
    >
      <SEO
        title="₹199 Class 12 Commerce Board Booster Packs"
        description="Get original CBSE and GSEB Class 12 Commerce Board Booster packs with a 7-day plan, three exam-style tests, answers, weak-topic worksheet and final revision checklist."
        path={PATH}
        structuredData={schema}
        keywords="Class 12 Business Studies test PDF, Class 12 Economics test PDF, CBSE board exam revision pack, GSEB Economics revision pack"
      />
      <section
        className="section-padding"
        style={{
          background:
            "linear-gradient(135deg,#fff8e8 0%,#f7f8fc 58%,#eef1f8 100%)",
        }}
      >
        <div className="page-container text-center max-w-5xl">
          <span className="eyebrow">
            Prepared packs · Launch price ₹199 each
          </span>
          <h1
            className="text-4xl sm:text-6xl mt-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Stop collecting notes. Start a{" "}
            <span style={{ color: "var(--gold)" }}>
              7-day board revision system.
            </span>
          </h1>
          <p
            className="text-lg leading-8 mt-5 max-w-3xl mx-auto"
            style={{ color: "var(--muted)" }}
          >
            Each subject pack turns revision into a clear sequence: priorities,
            daily tasks, timed practice, answer checking and weak-topic repair.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <a
              href="#packs"
              className="btn-primary inline-flex items-center gap-2"
            >
              See the 3 packs <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/board-exam-diagnostic" className="btn-secondary">
              Take the free diagnostic first
            </Link>
          </div>
          <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>
            No marks guarantee. Original educational practice, not an official
            board paper.
          </p>
        </div>
      </section>

      <BoardBoosterPreview selectedId={selectedId} setSelectedId={setSelectedId} />

      <section id="packs" className="page-container section-padding">
        <div className="grid lg:grid-cols-3 gap-5">
          {BOARD_BOOSTER_PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="card-paper p-5 sm:p-7 flex flex-col"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow">{product.board} · Class 12</span>
                <span
                  className="rounded-full px-3 py-1 text-sm font-black"
                  style={{ background: "var(--gold-bg)", color: "var(--gold)" }}
                >
                  ₹199
                </span>
              </div>
              <h2
                className="text-2xl mt-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {product.shortName}
              </h2>
              <p
                className="text-sm leading-6 mt-3"
                style={{ color: "var(--muted)" }}
              >
                {product.focus}
              </p>
              <div className="mt-5 space-y-3 flex-1">
                {product.sample.map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-6">
                    <Check
                      className="w-4 h-4 mt-1 shrink-0"
                      style={{ color: "var(--green)" }}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setSelectedId(product.id);
                  document
                    .getElementById("reserve-pack")
                    ?.scrollIntoView({ behavior: "smooth" });
                  trackEvent("board_booster_product_select", {
                    productId: product.id,
                  });
                }}
                className="btn-primary mt-6 w-full"
              >
                Reserve this pack
              </button>
              <Link
                to={product.diagnosticPath}
                className="btn-secondary mt-3 text-center"
              >
                Try free diagnostic
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-padding" style={{ background: "#fff" }}>
        <div className="page-container grid lg:grid-cols-[1fr_.9fr] gap-8 items-start">
          <div>
            <span className="eyebrow">Inside every pack</span>
            <h2
              className="text-4xl mt-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              A finished revision product, not a future promise
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              {BOARD_BOOSTER_INCLUSIONS.map((item) => (
                <div
                  key={item}
                  className="tile-paper p-4 flex gap-3 text-sm font-semibold"
                >
                  <FileCheck2
                    className="w-5 h-5 shrink-0"
                    style={{ color: "var(--gold)" }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <ReservationForm
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
      </section>

      <section className="page-container section-padding">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            [
              Target,
              "Practice with a purpose",
              "Each test targets a different cluster, so the score tells you what to repair.",
            ],
            [
              BookOpenCheck,
              "Check answers properly",
              "Suggested checking guidance rewards concepts, working and application rather than memorised length.",
            ],
            [
              LockKeyhole,
              "Private paid file",
              "The full PDF is delivered privately after payment verification; it is not placed on a public download link.",
            ],
          ].map(([Icon, title, text]) => (
            <article key={title} className="card-paper p-6">
              <Icon className="w-7 h-7" style={{ color: "var(--gold)" }} />
              <h3
                className="text-xl mt-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {title}
              </h3>
              <p
                className="text-sm leading-6 mt-2"
                style={{ color: "var(--muted)" }}
              >
                {text}
              </p>
            </article>
          ))}
        </div>
        <div className="card-paper p-6 sm:p-8 mt-6">
          <div className="flex gap-4 items-start">
            <ShieldCheck
              className="w-7 h-7 shrink-0"
              style={{ color: "var(--green)" }}
            />
            <div>
              <h2
                className="text-2xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Safe purchase process
              </h2>
              <p
                className="text-sm leading-7 mt-2"
                style={{ color: "var(--muted)" }}
              >
                A reservation is not a payment. Smit Sir Commerce must first
                confirm the selected pack, the official payment recipient and
                delivery terms. Never pay an unverified account or send a
                password or OTP.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-padding"
        style={{
          background: "linear-gradient(135deg,#101a33,#1b2848)",
          color: "white",
        }}
      >
        <div className="page-container text-center max-w-3xl">
          <Sparkles
            className="w-9 h-9 mx-auto"
            style={{ color: "var(--gold-bright)" }}
          />
          <h2
            className="text-4xl mt-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Not sure which pack you need?
          </h2>
          <p
            className="mt-4 leading-7"
            style={{ color: "var(--muted-on-ink)" }}
          >
            Take the free 15-question diagnostic first. It gives an instant
            weak-topic report and does not require payment.
          </p>
          <Link
            to="/board-exam-diagnostic"
            className="btn-primary inline-flex mt-6 items-center gap-2"
          >
            Start free diagnostic <BadgeCheck className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
