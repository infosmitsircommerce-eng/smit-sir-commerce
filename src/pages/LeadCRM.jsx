import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Download,
  Filter,
  Loader2,
  MessageCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import SEO from "../components/ui/SEO";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { trackEvent } from "../lib/analytics";

const STATUSES = [
  "New",
  "Contacted",
  "Demo Booked",
  "Follow-up",
  "Joined",
  "Lost",
];
const SOURCES = [
  "Google",
  "Instagram",
  "WhatsApp",
  "Referral",
  "Direct",
  "Other",
];

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function csvCell(value) {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}
function whatsappLink(lead) {
  const digits = String(lead.mobile || "").replace(/\D/g, "");
  const teacherProject = String(lead.landing_context || "").startsWith(
    "teacher-service:",
  );
  const text = teacherProject
    ? `Hello ${lead.full_name || ""}, this is Smit Sir Commerce. I am following up on your Teacher Studio service request.`
    : `Hello ${lead.full_name || ""}, this is Smit Sir Commerce. I am following up on your ${lead.intent || "admission"} enquiry.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function Restricted({ loggedIn }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-ivory)" }}
    >
      <SEO
        title="Admissions CRM"
        description="Restricted owner area."
        path="/admin/leads"
        noindex
      />
      <div className="card-paper max-w-lg w-full p-8 text-center">
        <ShieldCheck
          className="w-10 h-10 mx-auto"
          style={{ color: "var(--gold)" }}
        />
        <h1
          className="text-3xl mt-4"
          style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
        >
          {loggedIn ? "Owner access required" : "Owner login required"}
        </h1>
        <p className="text-sm mt-3" style={{ color: "var(--muted)" }}>
          Lead contact details are private and only available to the owner/admin
          account.
        </p>
        <Link
          to={loggedIn ? "/dashboard" : "/login"}
          className="btn-primary inline-flex mt-6"
        >
          {loggedIn ? "Back to dashboard" : "Login"}
        </Link>
      </div>
    </div>
  );
}

export default function LeadCRM() {
  const { user, isAdmin, loading } = useAuth();
  const [leads, setLeads] = useState([]);
  const [events, setEvents] = useState([]);
  const [busy, setBusy] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");

  const refresh = async () => {
    if (!isAdmin) return;
    setBusy(true);
    setMessage("");
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const [leadsRes, eventsRes] = await Promise.all([
      supabase
        .from("leads")
        .select("*")
        .order("last_enquiry_at", { ascending: false })
        .limit(3000),
      supabase
        .from("learning_events")
        .select("event_name,metadata,created_at")
        .gte("created_at", since)
        .in("event_name", [
          "lead_form_view",
          "lead_form_start",
          "lead_submit_attempt",
          "lead_submit_success",
          "local_mehsana_landing_view",
          "local_demo_click",
          "local_contact_click",
          "lead_joined",
          "premium_offer_view",
          "premium_cta_click",
          "premium_qr_download",
          "premium_claim_success",
          "teacher_services_view",
          "teacher_services_page_view",
          "teacher_services_home_click",
          "teacher_service_select",
          "teacher_service_order_start",
          "teacher_service_order_submit_attempt",
          "teacher_service_order_submit_success",
          "teacher_service_order_submit_error",
          "teacher_service_whatsapp_click",
          "booster_page_view",
          "booster_cta_view",
          "booster_cta_click",
          "booster_test_start",
          "booster_test_complete",
          "booster_scorecard_download",
          "booster_scorecard_share",
          "booster_pack_form_start",
          "booster_pack_submit_attempt",
          "booster_pack_submit_success",
          "booster_pack_submit_error",
          "booster_premium_click",
        ])
        .order("created_at", { ascending: false })
        .limit(10000),
    ]);
    if (leadsRes.error || eventsRes.error)
      setMessage(
        `Some CRM data could not be loaded: ${(leadsRes.error || eventsRes.error)?.message}`,
      );
    setLeads(leadsRes.data || []);
    setEvents(eventsRes.data || []);
    setBusy(false);
  };

  useEffect(() => {
    refresh();
  }, [isAdmin]);

  const funnel = useMemo(() => {
    const count = (name) =>
      events.filter((event) => event.event_name === name).length;
    const views = count("lead_form_view");
    const starts = count("lead_form_start");
    const submits = count("lead_submit_success");
    return {
      views,
      starts,
      submits,
      startRate: views ? Math.round((starts / views) * 100) : 0,
      submitRate: starts ? Math.round((submits / starts) * 100) : 0,
    };
  }, [events]);

  const localFunnel = useMemo(() => {
    const localViews = events.filter(
      (event) => event.event_name === "local_mehsana_landing_view",
    ).length;
    const demoClicks = events.filter(
      (event) => event.event_name === "local_demo_click",
    ).length;
    const contactClicks = events.filter(
      (event) => event.event_name === "local_contact_click",
    ).length;
    const enquiries = events.filter(
      (event) =>
        event.event_name === "lead_submit_success" &&
        event.metadata?.landingContext &&
        !String(event.metadata.landingContext).startsWith("teacher-service:"),
    ).length;
    const joinedLocal = leads.filter(
      (lead) =>
        lead.status === "Joined" &&
        lead.landing_context &&
        !String(lead.landing_context).startsWith("teacher-service:"),
    ).length;
    const actionClicks = demoClicks + contactClicks;
    return {
      localViews,
      demoClicks,
      contactClicks,
      actionClicks,
      enquiries,
      joinedLocal,
      clickRate: localViews ? Math.round((actionClicks / localViews) * 100) : 0,
      enquiryRate: demoClicks ? Math.round((enquiries / demoClicks) * 100) : 0,
    };
  }, [events, leads]);

  const premiumFunnel = useMemo(() => {
    const count = (name) =>
      events.filter((event) => event.event_name === name).length;
    return {
      views: count("premium_offer_view"),
      ctas: count("premium_cta_click"),
      qr: count("premium_qr_download"),
      claims: count("premium_claim_success"),
    };
  }, [events]);

  const teacherFunnel = useMemo(() => {
    const count = (name) =>
      events.filter((event) => event.event_name === name).length;
    const projects = leads.filter((lead) =>
      String(lead.landing_context || "").startsWith("teacher-service:"),
    );
    const won = projects.filter((lead) => lead.status === "Joined").length;
    return {
      views: count("teacher_services_page_view"),
      starts: count("teacher_service_order_start"),
      submits: count("teacher_service_order_submit_success"),
      whatsapp: count("teacher_service_whatsapp_click"),
      projects: projects.length,
      won,
    };
  }, [events, leads]);

  const boosterFunnel = useMemo(() => {
    const count = (name) =>
      events.filter((event) => event.event_name === name).length;
    const reservations = leads.filter((lead) =>
      String(lead.landing_context || "").startsWith("board-booster:"),
    );
    return {
      views: count("booster_page_view"),
      starts: count("booster_test_start"),
      completes: count("booster_test_complete"),
      shares:
        count("booster_scorecard_share") + count("booster_scorecard_download"),
      forms: count("booster_pack_submit_success"),
      premiumClicks: count("booster_premium_click"),
      reservations: reservations.length,
      won: reservations.filter((lead) => lead.status === "Joined").length,
    };
  }, [events, leads]);

  const localContextCounts = useMemo(() => {
    const map = new Map();
    leads.forEach((lead) => {
      if (!lead.landing_context) return;
      map.set(lead.landing_context, (map.get(lead.landing_context) || 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [leads]);

  const sourceCounts = useMemo(() => {
    const map = new Map();
    leads.forEach((lead) =>
      map.set(
        lead.source || "Direct",
        (map.get(lead.source || "Direct") || 0) + 1,
      ),
    );
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [leads]);

  const dueFollowUps = leads.filter(
    (lead) =>
      lead.next_follow_up &&
      new Date(lead.next_follow_up) <= new Date() &&
      !["Joined", "Lost"].includes(lead.status),
  ).length;
  const joined = leads.filter((lead) => lead.status === "Joined").length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;
  const demoBooked = leads.filter(
    (lead) => lead.status === "Demo Booked",
  ).length;
  const conversion = leads.length
    ? Math.round((joined / leads.length) * 100)
    : 0;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== "All" && lead.status !== statusFilter) return false;
      if (sourceFilter !== "All" && lead.source !== sourceFilter) return false;
      if (!q) return true;
      return `${lead.full_name || ""} ${lead.mobile || ""} ${lead.board || ""} ${(lead.subjects || []).join(" ")} ${lead.study_mode || ""} ${lead.message || ""} ${lead.landing_context || ""} ${lead.first_path || ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [leads, query, statusFilter, sourceFilter]);

  const patchLead = async (leadId, patch, successText = "Lead updated.") => {
    setActionId(leadId);
    setMessage("");
    const { error } = await supabase
      .from("leads")
      .update(patch)
      .eq("id", leadId);
    if (error) setMessage(`Could not update lead: ${error.message}`);
    else {
      if (patch.status === "Joined") {
        const joinedLead = leads.find((lead) => lead.id === leadId);
        const joinedMetadata = {
          source: joinedLead?.source || "Direct",
          landingContext: joinedLead?.landing_context || "",
          board: joinedLead?.board || "",
          classLevel: joinedLead?.class_level || null,
        };
        trackEvent("lead_joined", joinedMetadata, user?.id || null);
        if (typeof window.gtag === "function")
          window.gtag("event", "lead_joined", joinedMetadata);
      }
      setMessage(successText);
      setLeads((current) =>
        current.map((lead) =>
          lead.id === leadId
            ? { ...lead, ...patch, updated_at: new Date().toISOString() }
            : lead,
        ),
      );
    }
    setActionId(null);
  };

  const exportLeads = () => {
    const header = [
      "Name",
      "Mobile",
      "Class",
      "Board",
      "Subjects",
      "Mode",
      "Preferred contact",
      "Source",
      "Landing context",
      "First page",
      "Intent",
      "Status",
      "Enquiries",
      "Next follow-up",
      "Last enquiry",
      "Notes",
    ];
    const rows = leads.map((lead) => [
      lead.full_name,
      lead.mobile,
      lead.class_level,
      lead.board,
      lead.subjects,
      lead.study_mode,
      lead.preferred_contact_time,
      lead.source,
      lead.landing_context,
      lead.first_path,
      lead.intent,
      lead.status,
      lead.enquiries_count,
      lead.next_follow_up,
      lead.last_enquiry_at,
      lead.owner_notes,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smit-sir-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-ivory)" }}
      >
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "var(--gold)" }}
        />
      </div>
    );
  if (!user) return <Restricted loggedIn={false} />;
  if (!isAdmin) return <Restricted loggedIn />;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-ivory)" }}>
      <SEO
        title="Admissions Lead CRM"
        description="Restricted admissions CRM for Smit Sir Commerce."
        path="/admin/leads"
        noindex
      />
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: "rgba(250,246,238,.96)",
          borderColor: "var(--border)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="page-container py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div
              className="text-xs font-black tracking-[.18em]"
              style={{ color: "var(--gold)" }}
            >
              ADMISSIONS CRM
            </div>
            <h1
              className="text-2xl mt-1"
              style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
            >
              Lead → Demo → Student
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Student control
            </Link>
            <Link to="/admin-studio" className="btn-secondary">
              Content Studio
            </Link>
            <button
              onClick={refresh}
              disabled={busy}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${busy ? "animate-spin" : ""}`} />{" "}
              Refresh
            </button>
            <button
              onClick={exportLeads}
              disabled={!leads.length}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export leads
            </button>
          </div>
        </div>
      </header>

      <main className="page-container py-8 space-y-7">
        {message && (
          <div
            className="rounded-xl p-4 text-sm"
            style={{
              background: "var(--gold-bg)",
              border: "1px solid rgba(184,135,47,.25)",
              color: "var(--charcoal)",
            }}
          >
            {message}
          </div>
        )}

        <section className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            ["Total leads", leads.length, Users],
            ["New", newLeads, MessageCircle],
            ["Demo booked", demoBooked, CalendarClock],
            ["Joined", joined, CheckCircle2],
            ["Follow-ups due", dueFollowUps, CalendarClock],
            ["Lead→Joined", `${conversion}%`, BarChart3],
          ].map(([label, value, Icon]) => (
            <div key={label} className="card-paper p-4">
              <Icon className="w-5 h-5" style={{ color: "var(--gold)" }} />
              <div
                className="text-2xl font-bold mt-3"
                style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
              >
                {busy ? "…" : value}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {label}
              </div>
            </div>
          ))}
        </section>

        <section className="grid lg:grid-cols-[1fr_.7fr] gap-5">
          <div className="card-paper p-5 sm:p-6">
            <span className="eyebrow">30-day funnel</span>
            <h2
              className="text-2xl mt-2"
              style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
            >
              Visitor → enquiry
            </h2>
            <div className="grid grid-cols-3 gap-3 mt-5 text-center">
              <div className="tile-paper p-4">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {funnel.views}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Form views
                </div>
              </div>
              <div className="tile-paper p-4">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {funnel.starts}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Started · {funnel.startRate}%
                </div>
              </div>
              <div className="tile-paper p-4">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {funnel.submits}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Submitted · {funnel.submitRate}%
                </div>
              </div>
            </div>
          </div>
          <div className="card-paper p-5 sm:p-6">
            <span className="eyebrow">Lead sources</span>
            <h2
              className="text-2xl mt-2"
              style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
            >
              Where enquiries come from
            </h2>
            <div className="space-y-2 mt-5">
              {sourceCounts.length ? (
                sourceCounts.map(([source, count]) => (
                  <div
                    key={source}
                    className="flex items-center justify-between tile-paper p-3"
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--charcoal)" }}
                    >
                      {source}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--gold)" }}
                    >
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Source data will appear after real enquiries arrive.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.2fr_.8fr] gap-5">
          <div className="card-paper p-5 sm:p-6">
            <span className="eyebrow">Local SEO → enquiry</span>
            <h2
              className="text-2xl mt-2"
              style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
            >
              Mehsana traffic that can become students
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 text-center">
              <div className="tile-paper p-4">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {localFunnel.localViews}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Local page views
                </div>
              </div>
              <div className="tile-paper p-4">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {localFunnel.actionClicks}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Call/WhatsApp/demo · {localFunnel.clickRate}%
                </div>
              </div>
              <div className="tile-paper p-4">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {localFunnel.enquiries}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Local enquiries · {localFunnel.enquiryRate}%
                </div>
              </div>
              <div className="tile-paper p-4">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {localFunnel.joinedLocal}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Joined from local funnel
                </div>
              </div>
            </div>
          </div>
          <div className="card-paper p-5 sm:p-6">
            <span className="eyebrow">Best local landing pages</span>
            <h2
              className="text-2xl mt-2"
              style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
            >
              Which page creates leads?
            </h2>
            <div className="space-y-2 mt-5">
              {localContextCounts.length ? (
                localContextCounts.slice(0, 8).map(([context, count]) => (
                  <div
                    key={context}
                    className="flex items-center justify-between tile-paper p-3"
                  >
                    <span
                      className="text-xs font-semibold break-all"
                      style={{ color: "var(--charcoal)" }}
                    >
                      {context}
                    </span>
                    <span
                      className="text-sm font-bold ml-3"
                      style={{ color: "var(--gold)" }}
                    >
                      {count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  This will populate when Mehsana visitors submit enquiries.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="card-paper p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="eyebrow">Board Booster funnel · 30 days</span>
              <h2
                className="text-2xl mt-2"
                style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
              >
                Google visit → diagnosis → revenue
              </h2>
            </div>
            <Link to="/board-exam-diagnostic" className="btn-secondary">
              Open diagnostic
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 mt-5 text-center">
            {[
              ["Page views", boosterFunnel.views],
              ["Test starts", boosterFunnel.starts],
              ["Completions", boosterFunnel.completes],
              ["Shares/cards", boosterFunnel.shares],
              ["Pack forms", boosterFunnel.forms],
              ["Premium clicks", boosterFunnel.premiumClicks],
              ["Reservations", boosterFunnel.reservations],
              ["Won", boosterFunnel.won],
            ].map(([label, value]) => (
              <div key={label} className="tile-paper p-4">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {value}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card-paper p-5 sm:p-6">
          <span className="eyebrow">Premium revenue funnel · 30 days</span>
          <h2
            className="text-2xl mt-2"
            style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
          >
            Interest → payment verification
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 text-center">
            {[
              ["Offer views", premiumFunnel.views],
              ["Premium CTA clicks", premiumFunnel.ctas],
              ["QR downloads", premiumFunnel.qr],
              ["Claims submitted", premiumFunnel.claims],
            ].map(([label, value]) => (
              <div key={label} className="tile-paper p-4">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {value}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card-paper p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="eyebrow">
                Teacher Studio revenue funnel · 30 days
              </span>
              <h2
                className="text-2xl mt-2"
                style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
              >
                Service interest → paid project
              </h2>
            </div>
            <Link to="/services-for-teachers" className="btn-secondary">
              Open service page
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mt-5 text-center">
            {[
              ["Page views", teacherFunnel.views],
              ["Form starts", teacherFunnel.starts],
              ["Forms submitted", teacherFunnel.submits],
              ["WhatsApp clicks", teacherFunnel.whatsapp],
              ["Projects in CRM", teacherFunnel.projects],
              ["Won / delivered", teacherFunnel.won],
            ].map(([label, value]) => (
              <div key={label} className="tile-paper p-4">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {value}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "var(--subtle)" }}>
            Mark a completed Teacher Studio project as “Joined” to count it as
            won. Search “TEACHER STUDIO REQUEST” to see only service enquiries.
          </p>
        </section>

        <section className="card-paper p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Pipeline</span>
              <h2
                className="text-3xl mt-2"
                style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
              >
                Admissions + Teacher Studio
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="relative">
                <Search
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted)" }}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-field pl-10 min-w-[220px]"
                  placeholder="Search leads…"
                />
              </label>
              <label className="relative">
                <Filter
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted)" }}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field pl-10 w-auto"
                >
                  <option>All</option>
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="input-field w-auto"
              >
                <option>All</option>
                {SOURCES.map((source) => (
                  <option key={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>

          {busy ? (
            <div className="py-16 flex justify-center">
              <Loader2
                className="w-7 h-7 animate-spin"
                style={{ color: "var(--gold)" }}
              />
            </div>
          ) : visible.length === 0 ? (
            <div className="tile-paper p-10 text-center mt-5">
              <Users
                className="w-8 h-8 mx-auto"
                style={{ color: "var(--gold)" }}
              />
              <div
                className="font-semibold mt-3"
                style={{ color: "var(--ink)" }}
              >
                No matching leads
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                Real admission and Teacher Studio enquiries will appear here
                automatically.
              </p>
            </div>
          ) : (
            <div className="grid xl:grid-cols-2 gap-4 mt-5">
              {visible.map((lead) => {
                const isTeacherProject = String(
                  lead.landing_context || "",
                ).startsWith("teacher-service:");
                return (
                  <article key={lead.id} className="tile-paper p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className="text-xl"
                            style={{
                              fontFamily: "var(--font-serif)",
                              color: "var(--ink)",
                            }}
                          >
                            {lead.full_name}
                          </h3>
                          {isTeacherProject && (
                            <span
                              className="text-[11px] font-black rounded-full px-2 py-1"
                              style={{ background: "#101828", color: "#fff" }}
                            >
                              TEACHER STUDIO
                            </span>
                          )}
                          {lead.enquiries_count > 1 && (
                            <span
                              className="text-[11px] font-bold rounded-full px-2 py-1"
                              style={{
                                background: "var(--gold-bg)",
                                color: "var(--gold)",
                              }}
                            >
                              {lead.enquiries_count} enquiries
                            </span>
                          )}
                        </div>
                        <div
                          className="text-sm mt-1"
                          style={{ color: "var(--muted)" }}
                        >
                          {isTeacherProject
                            ? "Teacher / organisation project"
                            : `+${String(lead.mobile || "").replace(/^\+/, "")} · Class ${lead.class_level || "—"} · ${lead.board || "—"}`}
                        </div>
                      </div>
                      <span
                        className="text-xs font-bold rounded-full px-2.5 py-1"
                        style={{
                          background:
                            lead.status === "Joined"
                              ? "rgba(77,124,15,.09)"
                              : "var(--gold-bg)",
                          color:
                            lead.status === "Joined"
                              ? "var(--green)"
                              : "var(--gold)",
                        }}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(lead.subjects || []).map((subject) => (
                        <span
                          key={subject}
                          className="text-[11px] rounded-full px-2.5 py-1"
                          style={{
                            background: "var(--bg-white)",
                            border: "1px solid var(--border)",
                            color: "var(--charcoal)",
                          }}
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 mt-4 text-xs">
                      <div>
                        <span style={{ color: "var(--subtle)" }}>Mode</span>
                        <div
                          className="font-semibold mt-1"
                          style={{ color: "var(--charcoal)" }}
                        >
                          {lead.study_mode || "—"}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: "var(--subtle)" }}>Source</span>
                        <div
                          className="font-semibold mt-1"
                          style={{ color: "var(--charcoal)" }}
                        >
                          {lead.source || "Direct"} · {lead.intent}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: "var(--subtle)" }}>
                          Local landing
                        </span>
                        <div
                          className="font-semibold mt-1 break-all"
                          style={{ color: "var(--charcoal)" }}
                        >
                          {lead.landing_context || "—"}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: "var(--subtle)" }}>
                          Preferred contact
                        </span>
                        <div
                          className="font-semibold mt-1"
                          style={{ color: "var(--charcoal)" }}
                        >
                          {lead.preferred_contact_time || "Any time"}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: "var(--subtle)" }}>
                          Last enquiry
                        </span>
                        <div
                          className="font-semibold mt-1"
                          style={{ color: "var(--charcoal)" }}
                        >
                          {formatDate(lead.last_enquiry_at)}
                        </div>
                      </div>
                    </div>
                    {lead.message && (
                      <div
                        className="mt-4 rounded-xl p-3 text-sm leading-relaxed"
                        style={{
                          background: "var(--bg-white)",
                          border: "1px solid var(--border)",
                          color: "var(--muted)",
                        }}
                      >
                        {lead.message}
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-3 mt-4">
                      <label>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "var(--muted)" }}
                        >
                          Pipeline status
                        </span>
                        <select
                          disabled={actionId === lead.id}
                          value={lead.status}
                          onChange={(e) =>
                            patchLead(
                              lead.id,
                              { status: e.target.value },
                              `Moved ${lead.full_name} to ${e.target.value}.`,
                            )
                          }
                          className="input-field w-full mt-1.5"
                        >
                          {STATUSES.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "var(--muted)" }}
                        >
                          Next follow-up
                        </span>
                        <input
                          type="datetime-local"
                          value={
                            lead.next_follow_up
                              ? new Date(
                                  new Date(lead.next_follow_up).getTime() -
                                    new Date(
                                      lead.next_follow_up,
                                    ).getTimezoneOffset() *
                                      60000,
                                )
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            patchLead(
                              lead.id,
                              {
                                next_follow_up: e.target.value
                                  ? new Date(e.target.value).toISOString()
                                  : null,
                              },
                              "Follow-up date saved.",
                            )
                          }
                          className="input-field w-full mt-1.5"
                        />
                      </label>
                    </div>
                    <label className="block mt-3">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "var(--muted)" }}
                      >
                        Owner notes
                      </span>
                      <textarea
                        key={lead.updated_at}
                        defaultValue={lead.owner_notes || ""}
                        rows={2}
                        className="input-field w-full mt-1.5 resize-none"
                        placeholder="Private follow-up notes"
                        onBlur={(e) => {
                          if (e.target.value !== (lead.owner_notes || ""))
                            patchLead(
                              lead.id,
                              { owner_notes: e.target.value.trim() || null },
                              "Lead notes saved.",
                            );
                        }}
                      />
                    </label>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <a
                        href={whatsappLink(lead)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                      <a href={`tel:${lead.mobile}`} className="btn-secondary">
                        Call
                      </a>
                      {lead.next_follow_up && (
                        <span
                          className="text-xs self-center"
                          style={{
                            color:
                              new Date(lead.next_follow_up) <= new Date() &&
                              !["Joined", "Lost"].includes(lead.status)
                                ? "#B4533C"
                                : "var(--muted)",
                          }}
                        >
                          Follow-up: {formatDate(lead.next_follow_up)}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
