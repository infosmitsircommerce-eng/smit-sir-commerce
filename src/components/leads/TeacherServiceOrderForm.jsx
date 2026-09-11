import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { captureAcquisition } from "../../lib/acquisition";
import { trackEvent } from "../../lib/analytics";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export const TEACHER_SERVICES = [
  {
    id: "question-paper",
    label: "Custom exam paper + answer key",
    price: "₹499",
  },
  { id: "branded-notes", label: "Branded chapter notes / PDF", price: "₹999" },
  {
    id: "teaching-bundle",
    label: "PPT + worksheet + test bundle",
    price: "₹1,499",
  },
  {
    id: "teacher-website",
    label: "Teacher / coaching website",
    price: "From ₹4,999",
  },
  {
    id: "monthly-content",
    label: "Monthly teaching content package",
    price: "₹2,999/month",
  },
];

const WHATSAPP_NUMBER = "916353709585";

export default function TeacherServiceOrderForm({
  defaultService = "question-paper",
}) {
  const { user } = useAuth();
  const location = useLocation();
  const attribution = captureAcquisition(location.pathname, location.search);
  const firstTouch = attribution?.first || {};
  const startedAt = useRef(Date.now());
  const trackedStart = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState({
    service: defaultService,
    fullName: "",
    organisation: "",
    mobile: "",
    email: "",
    board: "GSEB",
    classLevel: "Class 11–12",
    subject: "",
    deadline: "Within 7 days",
    preferredTime: "Any time",
    brief: "",
    consent: false,
  });

  const selected =
    TEACHER_SERVICES.find((service) => service.id === form.service) ||
    TEACHER_SERVICES[0];

  useEffect(() => {
    trackEvent(
      "teacher_services_view",
      { service: defaultService },
      user?.id || null,
    );
  }, [defaultService, user?.id]);

  const startTracking = () => {
    if (trackedStart.current) return;
    trackedStart.current = true;
    trackEvent(
      "teacher_service_order_start",
      { service: form.service },
      user?.id || null,
    );
  };

  const set = (key) => (event) => {
    startTracking();
    const value = event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "service")
      trackEvent(
        "teacher_service_select",
        { service: value },
        user?.id || null,
      );
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello Smit Sir Commerce, I want to discuss the ${selected.label} service. Please share the next steps.`)}`;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (honeypot) {
      setSubmitted(true);
      return;
    }
    if (Date.now() - startedAt.current < 1200) {
      setError("Please review the form once and submit again.");
      return;
    }
    const digits = form.mobile.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      setError("Please enter a valid mobile or WhatsApp number.");
      return;
    }
    if (!form.subject.trim() || !form.brief.trim()) {
      setError("Please add the subject and a short project brief.");
      return;
    }
    if (!form.consent) {
      setError("Please confirm that we may contact you about this request.");
      return;
    }

    setBusy(true);
    trackEvent(
      "teacher_service_order_submit_attempt",
      { service: form.service, board: form.board, deadline: form.deadline },
      user?.id || null,
    );

    const message = [
      `TEACHER STUDIO REQUEST: ${selected.label} (${selected.price})`,
      form.organisation.trim()
        ? `Organisation: ${form.organisation.trim()}`
        : null,
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
      `Audience: ${form.board} · ${form.classLevel}`,
      `Subject: ${form.subject.trim()}`,
      `Requested timeline: ${form.deadline}`,
      `Brief: ${form.brief.trim()}`,
      "Payment status: Not requested — confirm scope, price and delivery first.",
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      full_name: form.fullName.trim(),
      mobile: form.mobile.trim(),
      class_level: null,
      board: "Other",
      subjects: [selected.label],
      study_mode: "Online",
      preferred_contact_time: form.preferredTime,
      source: firstTouch.source || "Direct",
      intent: "General Enquiry",
      message,
      consent: true,
      first_path: firstTouch.path || location.pathname,
      utm_source: firstTouch.utmSource || null,
      utm_medium: firstTouch.utmMedium || null,
      utm_campaign: firstTouch.utmCampaign || null,
      landing_context: `teacher-service:${form.service}`,
    };

    const { error: submitError } = await supabase
      .from("lead_submissions")
      .insert(payload);
    if (submitError) {
      setBusy(false);
      setError(
        "We could not save the request right now. Please use WhatsApp or call 63537 09585.",
      );
      trackEvent(
        "teacher_service_order_submit_error",
        { service: form.service },
        user?.id || null,
      );
      return;
    }

    try {
      await fetch("/api/enquiry-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          mobile: form.mobile.trim(),
          classLevel: form.classLevel,
          board: form.board,
          subjects: [selected.label],
          studyMode: "Online",
          preferredTime: form.preferredTime,
          source: firstTouch.source || "Direct",
          intent: "Teacher Studio Request",
          message,
          firstPath: firstTouch.path || location.pathname,
          landingContext: `teacher-service:${form.service}`,
          consent: true,
        }),
      });
    } catch {
      /* The CRM submission is the source of truth. */
    }

    setBusy(false);
    setSubmitted(true);
    trackEvent(
      "teacher_service_order_submit_success",
      { service: form.service, board: form.board, deadline: form.deadline },
      user?.id || null,
    );
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", {
        lead_type: "teacher_service",
        service: form.service,
        value: Number(selected.price.replace(/\D/g, "")) || 0,
        currency: "INR",
      });
    }
  };

  if (submitted)
    return (
      <div className="card-paper p-6 sm:p-8 text-center" aria-live="polite">
        <CheckCircle2
          className="w-12 h-12 mx-auto"
          style={{ color: "var(--green)" }}
        />
        <h2
          className="text-3xl mt-4"
          style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
        >
          Request received
        </h2>
        <p className="mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
          The scope, final price and delivery date will be confirmed before any
          payment is requested. Keep your syllabus or sample ready for the
          discussion.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent(
              "teacher_service_whatsapp_click",
              { service: form.service, placement: "success" },
              user?.id || null,
            )
          }
          className="btn-primary inline-flex items-center gap-2 mt-5"
        >
          <MessageCircle className="w-4 h-4" /> Continue on WhatsApp
        </a>
      </div>
    );

  return (
    <form
      id="teacher-service-order"
      onSubmit={submit}
      onFocus={startTracking}
      aria-busy={busy}
      className="card-paper p-5 sm:p-7 space-y-5"
    >
      <div>
        <span className="eyebrow">No advance payment</span>
        <h2
          className="text-3xl mt-3"
          style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
        >
          Request a project quote
        </h2>
        <p
          className="text-sm mt-2 leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          Share the requirement. You receive a confirmed scope, price and
          delivery date before paying.
        </p>
      </div>

      <label className="block">
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--muted)" }}
        >
          Service *
        </span>
        <select
          value={form.service}
          onChange={set("service")}
          className="input-field w-full mt-1.5"
        >
          {TEACHER_SERVICES.map((service) => (
            <option key={service.id} value={service.id}>
              {service.label} — {service.price}
            </option>
          ))}
        </select>
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--muted)" }}
          >
            Your name *
          </span>
          <input
            required
            maxLength={80}
            value={form.fullName}
            onChange={set("fullName")}
            className="input-field w-full mt-1.5"
            autoComplete="name"
            placeholder="Teacher / coordinator name"
          />
        </label>
        <label className="block">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--muted)" }}
          >
            School / coaching name{" "}
            <span className="font-normal">(optional)</span>
          </span>
          <input
            maxLength={100}
            value={form.organisation}
            onChange={set("organisation")}
            className="input-field w-full mt-1.5"
            placeholder="Organisation name"
          />
        </label>
        <label className="block">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--muted)" }}
          >
            Mobile / WhatsApp *
          </span>
          <input
            required
            value={form.mobile}
            onChange={set("mobile")}
            className="input-field w-full mt-1.5"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 XXXXX XXXXX"
          />
        </label>
        <label className="block">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--muted)" }}
          >
            Email <span className="font-normal">(optional)</span>
          </span>
          <input
            type="email"
            maxLength={120}
            value={form.email}
            onChange={set("email")}
            className="input-field w-full mt-1.5"
            autoComplete="email"
            placeholder="name@school.com"
          />
        </label>
        <label className="block">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--muted)" }}
          >
            Board / curriculum *
          </span>
          <select
            value={form.board}
            onChange={set("board")}
            className="input-field w-full mt-1.5"
          >
            <option>GSEB</option>
            <option>CBSE</option>
            <option>ICSE / ISC</option>
            <option>University</option>
            <option>Other</option>
          </select>
        </label>
        <label className="block">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--muted)" }}
          >
            Student level *
          </span>
          <select
            value={form.classLevel}
            onChange={set("classLevel")}
            className="input-field w-full mt-1.5"
          >
            <option>Class 9–10</option>
            <option>Class 11–12</option>
            <option>College</option>
            <option>Competitive exam</option>
            <option>Mixed</option>
          </select>
        </label>
        <label className="block">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--muted)" }}
          >
            Subject / topic *
          </span>
          <input
            required
            maxLength={120}
            value={form.subject}
            onChange={set("subject")}
            className="input-field w-full mt-1.5"
            placeholder="e.g. Class 12 Economics"
          />
        </label>
        <label className="block">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--muted)" }}
          >
            When do you need it? *
          </span>
          <select
            value={form.deadline}
            onChange={set("deadline")}
            className="input-field w-full mt-1.5"
          >
            <option>Within 3 days</option>
            <option>Within 7 days</option>
            <option>Within 2 weeks</option>
            <option>Flexible</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--muted)" }}
          >
            Best time to contact
          </span>
          <select
            value={form.preferredTime}
            onChange={set("preferredTime")}
            className="input-field w-full mt-1.5"
          >
            <option>Any time</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--muted)" }}
        >
          Project brief *
        </span>
        <textarea
          required
          minLength={15}
          maxLength={1200}
          rows={5}
          value={form.brief}
          onChange={set("brief")}
          className="input-field w-full mt-1.5 resize-y"
          placeholder="Tell us the chapter, marks, question pattern, language, branding and any sample you already use."
        />
      </label>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input
            tabIndex="-1"
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </label>
      </div>
      <label
        className="flex items-start gap-3 rounded-xl p-3"
        style={{
          background: "var(--bg-ivory)",
          border: "1px solid var(--border)",
        }}
      >
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => {
            startTracking();
            setForm((current) => ({
              ...current,
              consent: event.target.checked,
            }));
          }}
          className="mt-1"
        />
        <span
          className="text-xs leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          I agree to be contacted about this service request and understand that
          the displayed price may change if the confirmed scope is larger.
        </span>
      </label>
      {error && (
        <div
          role="alert"
          className="rounded-xl p-3 text-sm"
          style={{
            background: "rgba(180,83,60,.08)",
            border: "1px solid rgba(180,83,60,.2)",
            color: "#B4533C",
          }}
        >
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={busy}
        className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3.5"
      >
        {busy ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {busy ? "Saving request…" : `Request ${selected.price} quote`}
      </button>
      <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-center">
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--subtle)" }}
        >
          <ShieldCheck className="w-4 h-4" /> Contact details stay private in
          the owner CRM.
        </div>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent(
              "teacher_service_whatsapp_click",
              { service: form.service, placement: "form" },
              user?.id || null,
            )
          }
          className="btn-secondary inline-flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp instead
        </a>
      </div>
    </form>
  );
}
