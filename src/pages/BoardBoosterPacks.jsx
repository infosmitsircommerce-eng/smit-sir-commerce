import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronRight,
  Eye,
  FileText,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import SEO from "../components/ui/SEO";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { trackEvent } from "../lib/analytics";
import {
  BOARD_BOOSTER_INCLUSIONS,
  BOARD_BOOSTER_PRODUCTS,
  BOARD_BOOSTER_RULES,
  FREE_RESOURCE_COLLECTIONS,
} from "../data/boardBoosterProducts";

const PATH = "/board-booster-packs";
const BASE = "https://www.smitsircommerce.in";
const boardOptions = ["All", "CBSE", "GSEB"];
const classOptions = ["All", "11", "12"];

function ResourceLink({ to, children, ...props }) {
  const isStaticDocument = /\.html(?:$|[?#])/.test(to || "");
  if (isStaticDocument) {
    return <a href={to} {...props}>{children}</a>;
  }
  return <Link to={to} {...props}>{children}</Link>;
}

function PaidPackContents({ product, compact = false }) {
  const items = product.premiumItems || [];
  const firstCount = compact ? 3 : 4;
  const visible = items.slice(0, firstCount);
  const remaining = items.slice(firstCount);

  if (!items.length) return null;

  return (
    <div
      className="mt-5 rounded-2xl p-4 sm:p-5"
      style={{ background: "#fffaf0", border: "1px solid rgba(184,135,47,.28)" }}
    >
      <div className="flex items-center gap-2">
        <LockKeyhole className="w-5 h-5 shrink-0" style={{ color: "var(--gold)" }} />
        <div>
          <div className="text-xs font-black uppercase tracking-[.12em]" style={{ color: "var(--gold)" }}>Inside this ₹{product.price} pack</div>
          <div className="text-sm font-black mt-1">These are the paid resources — not just a number.</div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {visible.map((item) => (
          <div key={`${product.id}-${item.title}`} className="flex gap-3 text-sm leading-5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#fff", border: "1px solid var(--border)" }}>
              <FileText className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
            </div>
            <div>
              <div className="font-black">{item.title}</div>
              {item.meta ? <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{item.meta}</div> : null}
            </div>
          </div>
        ))}
      </div>

      {remaining.length ? (
        <details className="mt-4 rounded-xl" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <summary className="cursor-pointer px-4 py-3 text-sm font-black">
            View all {items.length} paid resources
          </summary>
          <div className="px-4 pb-4 space-y-3">
            {remaining.map((item) => (
              <div key={`${product.id}-more-${item.title}`} className="text-sm leading-5">
                <div className="font-black">{item.title}</div>
                {item.meta ? <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{item.meta}</div> : null}
              </div>
            ))}
          </div>
        </details>
      ) : null}

      {product.premiumPractice?.length ? (
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(184,135,47,.20)" }}>
          <div className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--gold)" }}>Premium practice also included</div>
          <div className="mt-2 space-y-1.5">
            {product.premiumPractice.map((item) => (
              <div key={item} className="flex gap-2 text-xs sm:text-sm leading-5">
                <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#21663a" }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PackReservation({ selected, onSelect }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", mobile: "", consent: false, website: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const started = useRef(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (!started.current) {
      started.current = true;
      trackEvent("board_booster_reservation_start", { productId: selected.id }, user?.id || null);
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (form.website) return;
    const mobile = form.mobile.replace(/\D/g, "");
    if (form.name.trim().length < 2 || !/^[6-9]\d{9}$/.test(mobile)) {
      setMessage("Enter the student's name and a valid 10-digit Indian mobile number.");
      return;
    }
    if (!form.consent) {
      setMessage("Please confirm that we may contact you about this pack.");
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
      source: params.get("utm_source") ? "Other" : document.referrer.includes("google.") ? "Google" : "Direct",
      intent: "General Enquiry",
      message: `BOARD BOOSTER ₹${selected.price} RESERVATION | ${selected.name} | Cashfree activation pending; no payment collected on this form.`,
      consent: true,
      first_path: PATH,
      utm_source: params.get("utm_source") || "direct",
      utm_medium: params.get("utm_medium") || "product-page",
      utm_campaign: params.get("utm_campaign") || "board_booster_catalog",
      landing_context: `board-booster:${selected.id}`,
    };

    const { error } = await supabase.from("lead_submissions").insert(payload);
    if (error) {
      setMessage("We could not save the reservation. Please try again in a moment.");
      trackEvent("board_booster_reservation_error", { productId: selected.id, code: error.code || "unknown" }, user?.id || null);
    } else {
      setMessage("Reserved. No payment has been taken. We will connect this pack to secure Cashfree checkout after activation.");
      setForm({ name: "", mobile: "", consent: false, website: "" });
      trackEvent("board_booster_reservation_success", { productId: selected.id, value: selected.price }, user?.id || null);
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="card-paper p-5 sm:p-7" id="reserve-pack">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">Cashfree activation pending</span>
        <span className="text-sm font-black" style={{ color: "var(--gold)" }}>₹{selected.price}</span>
      </div>
      <h2 className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: "var(--font-serif)" }}>Reserve {selected.shortName}</h2>
      <p className="text-sm leading-6 mt-3" style={{ color: "var(--muted)" }}>
        This form does not collect money. It only records which pack you want while secure online checkout is being activated.
      </p>

      <label className="block text-sm font-bold mt-5">
        Pack
        <select value={selected.id} onChange={(event) => onSelect(event.target.value)} className="input-field w-full mt-2">
          {BOARD_BOOSTER_PRODUCTS.map((product) => (
            <option key={product.id} value={product.id}>{product.shortName} · ₹{product.price}</option>
          ))}
        </select>
      </label>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="booster-site">Website</label>
        <input id="booster-site" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <label className="text-sm font-bold">
          Student name
          <input required minLength={2} maxLength={80} value={form.name} onChange={(event) => update("name", event.target.value)} className="input-field w-full mt-2" placeholder="Student name" />
        </label>
        <label className="text-sm font-bold">
          Mobile number
          <input required inputMode="numeric" maxLength={10} value={form.mobile} onChange={(event) => update("mobile", event.target.value.replace(/\D/g, "").slice(0, 10))} className="input-field w-full mt-2" placeholder="10-digit mobile" />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 mt-4">
        <input type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-1 w-4 h-4" />
        <span>I want details about this pack and agree to be contacted about this request.</span>
      </label>

      <button disabled={busy} className="btn-primary w-full mt-5">{busy ? "Saving…" : `Reserve ₹${selected.price} pack`}</button>
      {message ? <p role="status" className="text-sm font-semibold leading-6 mt-4">{message}</p> : null}
    </form>
  );
}

function ProductCard({ product, selected, onSelect }) {
  return (
    <article className="card-paper p-5 sm:p-7 flex flex-col" style={selected ? { outline: "2px solid rgba(184,135,47,.45)", boxShadow: "0 18px 45px rgba(76,55,20,.10)" } : undefined}>
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">{product.board} · Class {product.classLevel}</span>
        <span className="rounded-full px-3 py-1 text-xs font-black" style={{ background: "#edf9f0", color: "#21663a" }}>{product.badge}</span>
      </div>

      <h2 className="text-2xl mt-4" style={{ fontFamily: "var(--font-serif)" }}>{product.name}</h2>
      <p className="text-sm leading-6 mt-3" style={{ color: "var(--muted)" }}>{product.focus}</p>

      <div className="grid grid-cols-3 gap-2 mt-5">
        {product.inventory.map((item) => (
          <div key={item.label} className="rounded-xl p-3" style={{ background: "var(--bg-ivory)", border: "1px solid var(--border)" }} title={item.detail}>
            <div className="text-xl sm:text-2xl font-black" style={{ color: "var(--ink)" }}>{item.value}</div>
            <div className="text-[11px] sm:text-xs font-bold mt-1 leading-4">{item.label}</div>
            <div className="text-[10px] mt-1 leading-4" style={{ color: "var(--muted)" }}>{item.detail}</div>
          </div>
        ))}
      </div>

      <PaidPackContents product={product} />

      <details className="mt-4 rounded-xl" style={{ border: "1px solid var(--border)", background: "#fff" }}>
        <summary className="cursor-pointer p-4 font-black text-sm">Pack benefits & access details</summary>
        <div className="px-4 pb-4 space-y-3">
          {product.included.map((item) => (
            <div key={item} className="flex gap-2 text-sm leading-6"><Check className="w-4 h-4 mt-1 shrink-0" style={{ color: "#21663a" }} /><span>{item}</span></div>
          ))}
        </div>
      </details>

      <div className="mt-5 grid gap-2">
        <ResourceLink to={product.previewPath} onClick={() => trackEvent("board_booster_preview_click", { productId: product.id })} className="btn-secondary w-full inline-flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" /> Preview free material
        </ResourceLink>
        {product.diagnosticPath ? <Link to={product.diagnosticPath} className="text-center text-sm font-bold py-2" style={{ color: "var(--gold)" }}>Take free diagnostic →</Link> : null}
      </div>

      <div className="mt-auto pt-4 flex items-end justify-between gap-4">
        <div><div className="text-3xl font-black">₹{product.price}</div><div className="text-xs mt-1" style={{ color: "var(--muted)" }}>one-time pack price</div></div>
        <button onClick={() => onSelect(product.id, true)} className="btn-primary inline-flex items-center gap-2">Reserve <ArrowRight className="w-4 h-4" /></button>
      </div>
    </article>
  );
}

export default function BoardBoosterPacks() {
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();
  const initialId = BOARD_BOOSTER_PRODUCTS.some((product) => product.id === searchParams.get("pack")) ? searchParams.get("pack") : BOARD_BOOSTER_PRODUCTS[0].id;
  const [selectedId, setSelectedId] = useState(initialId);
  const [board, setBoard] = useState("All");
  const [classLevel, setClassLevel] = useState("All");
  const [view, setView] = useState("premium");
  const selected = BOARD_BOOSTER_PRODUCTS.find((product) => product.id === selectedId) || BOARD_BOOSTER_PRODUCTS[0];

  const filteredPremium = useMemo(() => BOARD_BOOSTER_PRODUCTS.filter((product) => (board === "All" || product.board === board) && (classLevel === "All" || String(product.classLevel) === classLevel)), [board, classLevel]);
  const filteredFree = useMemo(() => FREE_RESOURCE_COLLECTIONS.filter((collection) => (board === "All" || collection.board === board) && (classLevel === "All" || String(collection.classLevel) === classLevel)), [board, classLevel]);

  function selectPack(id, scroll = false) {
    setSelectedId(id);
    const product = BOARD_BOOSTER_PRODUCTS.find((item) => item.id === id);
    if (product) {
      setBoard(product.board);
      setClassLevel(String(product.classLevel));
    }
    trackEvent("board_booster_product_select", { productId: id });
    if (scroll) requestAnimationFrame(() => document.getElementById("reserve-pack")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }

  useEffect(() => {
    const requested = searchParams.get("pack");
    if (BOARD_BOOSTER_PRODUCTS.some((product) => product.id === requested)) selectPack(requested, false);
  }, [searchParams]);

  useEffect(() => {
    if (hash !== "#free-library") return;
    setView("free");
    requestAnimationFrame(() => document.getElementById("catalog")?.scrollIntoView({ behavior: "auto" }));
  }, [hash]);

  useEffect(() => {
    trackEvent("board_booster_catalog_view", { source: searchParams.get("from") || "direct" });
  }, [searchParams]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Smit Sir Commerce Premium Study Packs",
    url: BASE + PATH,
    itemListElement: BOARD_BOOSTER_PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.focus,
        brand: { "@type": "Brand", name: "Smit Sir Commerce" },
        offers: { "@type": "Offer", price: String(product.price), priceCurrency: "INR", availability: "https://schema.org/PreOrder", url: `${BASE}${PATH}?pack=${product.id}` },
      },
    })),
  };

  return (
    <main className="min-h-screen pb-28 lg:pb-0" style={{ background: "var(--bg-ivory)", color: "var(--ink)" }}>
      <SEO title="Premium Commerce Board Boosters — Preview Before You Buy" description="Compare Smit Sir Commerce premium packs and free resources by board, class and subject. See exact inclusions, resource counts, free previews and ₹199 pack pricing." path={PATH} structuredData={structuredData} keywords="GSEB Class 12 Economics premium notes, CBSE Class 12 Economics premium, Class 11 Microeconomics premium practice, Commerce Board Booster" />

      <section className="section-padding" style={{ background: "linear-gradient(145deg,#0f172a 0%,#16233f 54%,#2e2618 100%)", color: "#fff" }}>
        <div className="page-container grid lg:grid-cols-[1.08fr_.92fr] gap-8 lg:gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black tracking-widest" style={{ background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.14)", color: "#f6d37d" }}><Sparkles className="w-4 h-4" /> SMIT SIR COMMERCE STUDY STORE</span>
            <h1 className="text-4xl sm:text-6xl mt-5 leading-tight" style={{ fontFamily: "var(--font-serif)", letterSpacing: "-.04em" }}>Know exactly what you get <span style={{ color: "#f0c866" }}>before you pay.</span></h1>
            <p className="text-base sm:text-lg leading-8 mt-5 max-w-2xl" style={{ color: "#d2d9e6" }}>Free notes stay free. Premium packs add deeper explanations, harder practice and focused revision. Every pack below now shows the actual paid resources and a working free preview first.</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a href="#catalog" className="btn-primary inline-flex items-center gap-2">Browse premium packs <ArrowRight className="w-4 h-4" /></a>
              <button onClick={() => { setView("free"); requestAnimationFrame(() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })); }} className="btn-secondary">See what stays free</button>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-8 max-w-xl">
              {[["₹199", "per focused pack"], ["3", "paid packs ready"], ["6", "free collections mapped"]].map(([value, label]) => (
                <div key={label} className="rounded-2xl p-3 sm:p-4" style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.10)" }}><div className="text-xl sm:text-2xl font-black">{value}</div><div className="text-[11px] sm:text-xs mt-1" style={{ color: "#bdc8da" }}>{label}</div></div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl p-5 sm:p-7" style={{ background: "rgba(255,255,255,.96)", color: "var(--ink)", boxShadow: "0 30px 70px rgba(0,0,0,.28)" }}>
            <span className="eyebrow">Featured pack</span>
            <div className="flex items-start justify-between gap-4 mt-3"><div><h2 className="text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-serif)" }}>GSEB Class 12 Economics</h2><p className="text-sm mt-2" style={{ color: "var(--muted)" }}>Premium revision + harder chapter practice</p></div><BadgeCheck className="w-8 h-8 shrink-0" style={{ color: "#21663a" }} /></div>
            <div className="grid grid-cols-3 gap-2 mt-5">{BOARD_BOOSTER_PRODUCTS[0].inventory.map((item) => <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: "#f7f8fc", border: "1px solid var(--border)" }}><div className="text-xl font-black">{item.value}</div><div className="text-[10px] sm:text-xs mt-1 leading-4">{item.label}</div></div>)}</div>
            <PaidPackContents product={BOARD_BOOSTER_PRODUCTS[0]} compact />
            <ResourceLink to={BOARD_BOOSTER_PRODUCTS[0].previewPath} onClick={() => trackEvent("board_booster_preview_click", { productId: BOARD_BOOSTER_PRODUCTS[0].id, placement: "featured" })} className="btn-secondary w-full mt-5 inline-flex items-center justify-center gap-2"><Eye className="w-4 h-4" /> Preview free material</ResourceLink>
            <button onClick={() => selectPack(BOARD_BOOSTER_PRODUCTS[0].id, true)} className="btn-primary w-full mt-3">Reserve ₹199 pack</button>
            <p className="text-xs text-center mt-3" style={{ color: "var(--muted)" }}>Secure Cashfree checkout will replace reservation after gateway activation.</p>
          </div>
        </div>
      </section>

      <section className="page-container pt-8 sm:pt-12">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-paper p-5 sm:p-6"><div className="flex items-center gap-3"><BookOpen className="w-6 h-6" style={{ color: "#21663a" }} /><h2 className="text-xl font-black">FREE = learn & test the quality</h2></div><div className="mt-4 space-y-2">{BOARD_BOOSTER_RULES.free.map((item) => <div key={item} className="flex gap-2 text-sm leading-6"><Check className="w-4 h-4 mt-1 shrink-0" style={{ color: "#21663a" }} />{item}</div>)}</div></div>
          <div className="card-paper p-5 sm:p-6"><div className="flex items-center gap-3"><LockKeyhole className="w-6 h-6" style={{ color: "var(--gold)" }} /><h2 className="text-xl font-black">PREMIUM = deeper exam preparation</h2></div><div className="mt-4 space-y-2">{BOARD_BOOSTER_RULES.premium.map((item) => <div key={item} className="flex gap-2 text-sm leading-6"><Check className="w-4 h-4 mt-1 shrink-0" style={{ color: "var(--gold)" }} />{item}</div>)}</div></div>
        </div>
      </section>

      <section id="catalog" className="page-container section-padding">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div><span className="eyebrow">Organized catalogue</span><h2 className="text-3xl sm:text-5xl mt-3" style={{ fontFamily: "var(--font-serif)" }}>Board → Class → Subject → Pack</h2><p className="mt-3 max-w-2xl leading-7" style={{ color: "var(--muted)" }}>No random PDF wall. Filter once and see the exact paid resources or free collection you need.</p></div>
          <div className="inline-flex rounded-xl p-1 self-start" style={{ background: "#fff", border: "1px solid var(--border)" }}><button onClick={() => setView("premium")} className={view === "premium" ? "btn-primary" : "px-4 py-2 text-sm font-black"}>Premium Packs</button><button onClick={() => setView("free")} className={view === "free" ? "btn-primary" : "px-4 py-2 text-sm font-black"}>Free Library</button></div>
        </div>

        <div className="flex flex-wrap gap-3 mt-7">
          <div className="flex items-center gap-2 flex-wrap"><span className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--muted)" }}>Board</span>{boardOptions.map((option) => <button key={option} onClick={() => setBoard(option)} className={board === option ? "btn-primary" : "btn-secondary"}>{option}</button>)}</div>
          <div className="flex items-center gap-2 flex-wrap ml-0 sm:ml-3"><span className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--muted)" }}>Class</span>{classOptions.map((option) => <button key={option} onClick={() => setClassLevel(option)} className={classLevel === option ? "btn-primary" : "btn-secondary"}>{option === "All" ? "All" : `Class ${option}`}</button>)}</div>
        </div>

        {view === "premium" ? (
          <div className="grid lg:grid-cols-3 gap-5 mt-7">{filteredPremium.map((product) => <ProductCard key={product.id} product={product} selected={selectedId === product.id} onSelect={selectPack} />)}{!filteredPremium.length ? <div className="card-paper p-8 lg:col-span-3 text-center"><Layers3 className="w-8 h-8 mx-auto" style={{ color: "var(--gold)" }} /><h3 className="text-xl font-black mt-3">No paid pack in this filter yet</h3><p className="mt-2" style={{ color: "var(--muted)" }}>We will not charge for a collection until it has a genuinely different premium layer.</p></div> : null}</div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-7" id="free-library">{filteredFree.map((collection) => <article key={collection.id} className="card-paper p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><span className="eyebrow">{collection.board} · Class {collection.classLevel}</span><span className="rounded-full px-3 py-1 text-xs font-black" style={{ background: "#edf9f0", color: "#21663a" }}>FREE</span></div><h3 className="text-xl font-black mt-4">{collection.subject}</h3><div className="text-2xl font-black mt-3" style={{ color: "var(--gold)" }}>{collection.count}</div><p className="text-sm leading-6 mt-3" style={{ color: "var(--muted)" }}>{collection.note}</p><ResourceLink to={collection.path} className="btn-secondary w-full mt-5 inline-flex items-center justify-center gap-2">Open free resources <ChevronRight className="w-4 h-4" /></ResourceLink></article>)}</div>
        )}
      </section>

      <section className="section-padding" style={{ background: "#fff" }}>
        <div className="page-container grid lg:grid-cols-[1fr_.9fr] gap-8 items-start">
          <div>
            <span className="eyebrow">Purchase clarity</span>
            <h2 className="text-3xl sm:text-4xl mt-4" style={{ fontFamily: "var(--font-serif)" }}>No more “Premium” with no explanation.</h2>
            <p className="mt-4 max-w-2xl leading-7" style={{ color: "var(--muted)" }}>Every paid pack now has a defined board, class, subject, price, real inventory, visible paid-resource list and working preview route. Collections that are currently just published notes stay free.</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">{BOARD_BOOSTER_INCLUSIONS.map((item) => <div key={item} className="tile-paper p-4 flex gap-3 text-sm font-semibold leading-6"><ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />{item}</div>)}</div>
            <div className="card-paper p-5 mt-6"><div className="flex items-center gap-3"><Target className="w-6 h-6" style={{ color: "var(--gold)" }} /><h3 className="text-xl font-black">What happens after Cashfree is approved?</h3></div><div className="grid sm:grid-cols-4 gap-3 mt-5 text-sm">{["Choose pack", "Preview", "Cashfree checkout", "Unlock access"].map((step, index) => <div key={step} className="rounded-xl p-3" style={{ background: "var(--bg-ivory)", border: "1px solid var(--border)" }}><div className="text-xs font-black" style={{ color: "var(--gold)" }}>0{index + 1}</div><div className="font-black mt-1">{step}</div></div>)}</div></div>
          </div>
          <PackReservation selected={selected} onSelect={(id) => selectPack(id, false)} />
        </div>
      </section>

      <section className="page-container section-padding">
        <div className="card-paper p-6 sm:p-8 text-center max-w-4xl mx-auto"><Zap className="w-8 h-8 mx-auto" style={{ color: "var(--gold)" }} /><h2 className="text-3xl mt-4" style={{ fontFamily: "var(--font-serif)" }}>Not sure whether you need Premium?</h2><p className="mt-3 leading-7" style={{ color: "var(--muted)" }}>Start with the free notes and quizzes. Upgrade only when you want the deeper revision guides and harder practice.</p><div className="flex flex-wrap justify-center gap-3 mt-6"><Link to="/study-material" className="btn-secondary inline-flex items-center gap-2"><FileText className="w-4 h-4" /> Free Study Material</Link><Link to="/quizzes" className="btn-secondary">Free Quizzes</Link><Link to="/board-exam-diagnostic" className="btn-primary">Take Free Diagnostic</Link></div></div>
      </section>

      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden p-3" style={{ background: "rgba(10,15,44,.96)", borderTop: "1px solid rgba(255,255,255,.12)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-xl mx-auto flex items-center gap-3"><div className="min-w-0 flex-1" style={{ color: "#fff" }}><div className="text-xs truncate" style={{ color: "#c8d1df" }}>{selected.shortName}</div><div className="font-black">₹{selected.price} <span className="text-xs font-normal" style={{ color: "#c8d1df" }}>one-time</span></div></div><button onClick={() => selectPack(selected.id, true)} className="btn-primary shrink-0">Reserve pack →</button></div>
      </div>
    </main>
  );
}
