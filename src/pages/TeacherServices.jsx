import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  ClipboardCheck,
  Clock3,
  Presentation,
  FileText,
  Globe2,
  IndianRupee,
  MessageCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import SEO from "../components/ui/SEO";
import TeacherServiceOrderForm, {
  TEACHER_SERVICES,
} from "../components/leads/TeacherServiceOrderForm";
import { trackEvent } from "../lib/analytics";

const SERVICE_DETAILS = [
  {
    ...TEACHER_SERVICES[0],
    icon: ClipboardCheck,
    turnaround: "Typical: 2–4 working days",
    summary:
      "A clean, syllabus-aligned paper made to your marks pattern, with a separate answer key.",
    includes: [
      "Your school/coaching name and logo",
      "Section-wise marks and instructions",
      "Answer key or marking hints",
      "One revision after first draft",
    ],
  },
  {
    ...TEACHER_SERVICES[1],
    icon: FileText,
    turnaround: "Typical: 3–6 working days",
    summary:
      "Original, classroom-ready chapter notes formatted under your teaching brand.",
    includes: [
      "Concept explanations and key terms",
      "Examples, tables and recap boxes",
      "Your branding and contact details",
      "Print-friendly final PDF",
    ],
  },
  {
    ...TEACHER_SERVICES[2],
    icon: Presentation,
    turnaround: "Typical: 5–8 working days",
    summary:
      "A connected teaching pack so the lesson, practice and assessment match each other.",
    includes: [
      "Classroom presentation",
      "Student worksheet",
      "Chapter test with answer key",
      "Editable source where agreed",
    ],
  },
  {
    ...TEACHER_SERVICES[3],
    icon: Globe2,
    turnaround: "Timeline after requirements call",
    summary:
      "A mobile-friendly teacher or coaching website focused on enquiries and useful material.",
    includes: [
      "Home, courses and contact sections",
      "Mobile-responsive design",
      "Basic search setup and analytics",
      "Deployment guidance",
    ],
  },
  {
    ...TEACHER_SERVICES[4],
    icon: RefreshCw,
    turnaround: "Monthly delivery calendar",
    summary:
      "Consistent branded content without creating every worksheet, test and post yourself.",
    includes: [
      "Monthly plan agreed in advance",
      "Mixed teaching and promotion assets",
      "Priority repeat-client workflow",
      "Monthly review before renewal",
    ],
  },
];

const FAQS = [
  [
    "Are these fixed final prices?",
    "They are starting prices for the listed standard scope. The final price is confirmed in writing after checking the chapter, length, format, deadline and revision requirement.",
  ],
  [
    "Do I pay before submitting the form?",
    "No. First submit the requirement. Pay only after the exact scope, price, delivery date and payment recipient are confirmed.",
  ],
  [
    "Can you copy another publisher’s PDF or question bank?",
    "No. The service creates original material from the syllabus and your instructions. Reference files can guide coverage and format, but copyrighted material is not copied.",
  ],
  [
    "Can CBSE, GSEB and college teachers request work?",
    "Yes. CBSE and GSEB Commerce are the strongest current focus. Other curricula can be considered after the source material and scope are checked.",
  ],
  [
    "How many revisions are included?",
    "The standard packages include one reasonable revision after the first draft. Larger rewrites or a changed scope may need a revised quote.",
  ],
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://www.smitsircommerce.in/services-for-teachers#service",
      name: "Teaching Material and Website Services for Teachers",
      serviceType:
        "Custom question papers, branded notes, classroom presentations, worksheets and teacher websites",
      provider: { "@id": "https://www.smitsircommerce.in/#organization" },
      areaServed: { "@type": "Country", name: "India" },
      audience: { "@type": "EducationalAudience", educationalRole: "teacher" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Smit Sir Teacher Studio services",
        itemListElement: SERVICE_DETAILS.map((service) => ({
          "@type": "Offer",
          name: service.label,
          priceCurrency: "INR",
          price:
            service.id === "teacher-website"
              ? "4999"
              : service.price.replace(/\D/g, ""),
          url: `https://www.smitsircommerce.in/services-for-teachers#${service.id}`,
          itemOffered: { "@type": "Service", name: service.label },
        })),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function TeacherServices() {
  const [selectedService, setSelectedService] = useState("question-paper");

  useEffect(() => {
    trackEvent("teacher_services_page_view");
  }, []);

  const chooseService = (serviceId) => {
    setSelectedService(serviceId);
    trackEvent("teacher_service_select", {
      service: serviceId,
      placement: "pricing",
    });
    window.setTimeout(
      () =>
        document
          .getElementById("teacher-service-order")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      30,
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-ivory)" }}>
      <SEO
        title="Question Paper, Notes & PPT Services for Teachers"
        description="Custom question papers, answer keys, branded notes, teaching PPTs, worksheets and websites for teachers, schools and coaching classes in India. Pricing from ₹499."
        path="/services-for-teachers"
        structuredData={structuredData}
        keywords="question paper making service for teachers, custom exam paper with answer key, branded notes for coaching classes, teaching PPT service, teacher website India, coaching class content service"
      />

      <section
        className="section-light pt-12 sm:pt-20 pb-14 sm:pb-20 overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 85% 15%, rgba(201,160,80,.22), transparent 32%), linear-gradient(180deg,#fffaf0 0%,#f7f8fc 100%)",
        }}
      >
        <div className="page-container grid lg:grid-cols-[1.15fr_.85fr] gap-10 items-center">
          <div>
            <span className="eyebrow">
              <Sparkles className="w-3.5 h-3.5" /> Smit Sir Teacher Studio
            </span>
            <h1 className="headline mt-5 max-w-4xl">
              Ready-to-use teaching material, <em>made for your classroom.</em>
            </h1>
            <p
              className="text-lg mt-5 max-w-2xl leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              For teachers, schools and coaching classes that need original
              question papers, branded notes, presentations, worksheets or a
              simple website—without building everything from zero.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <button
                type="button"
                onClick={() => chooseService("question-paper")}
                className="btn-primary inline-flex items-center gap-2"
              >
                Request a quote <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%20Commerce%2C%20I%20want%20to%20discuss%20Teacher%20Studio%20services."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("teacher_service_whatsapp_click", {
                    placement: "hero",
                  })
                }
                className="btn-secondary inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
            <div
              className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-sm"
              style={{ color: "var(--charcoal)" }}
            >
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4" style={{ color: "var(--green)" }} />{" "}
                No payment before confirmation
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4" style={{ color: "var(--green)" }} />{" "}
                One standard revision
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4" style={{ color: "var(--green)" }} />{" "}
                Original work
              </span>
            </div>
          </div>
          <div className="card-paper p-6 sm:p-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--gold-bg)", color: "var(--gold)" }}
            >
              <BookOpenCheck className="w-7 h-7" />
            </div>
            <p
              className="text-xs font-black tracking-[.16em] uppercase mt-6"
              style={{ color: "var(--gold)" }}
            >
              Launch offer
            </p>
            <div className="flex items-end gap-2 mt-2">
              <span
                className="text-5xl font-black"
                style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
              >
                ₹499
              </span>
              <span className="pb-2 text-sm" style={{ color: "var(--muted)" }}>
                starting price
              </span>
            </div>
            <h2
              className="text-2xl mt-4"
              style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
            >
              Custom question paper + answer key
            </h2>
            <p
              className="text-sm mt-3 leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              A low-risk first project for teachers who want to test the quality
              before ordering a larger package.
            </p>
            <button
              type="button"
              onClick={() => chooseService("question-paper")}
              className="btn-gold w-full mt-6"
            >
              Start with one paper
            </button>
          </div>
        </div>
      </section>

      <section
        className="section-light section-padding"
        aria-labelledby="services-heading"
      >
        <div className="page-container">
          <div className="max-w-3xl">
            <span className="eyebrow">Clear starting prices</span>
            <h2 id="services-heading" className="headline mt-4">
              Choose the work that saves you the most time.
            </h2>
            <p className="mt-4" style={{ color: "var(--muted)" }}>
              Every project begins with written scope confirmation. No hidden
              automatic subscription and no payment request before the
              requirement is checked.
            </p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-9">
            {SERVICE_DETAILS.map(
              ({
                id,
                icon: Icon,
                label,
                price,
                turnaround,
                summary,
                includes,
              }) => (
                <article
                  id={id}
                  key={id}
                  className="card-paper p-5 sm:p-6 flex flex-col scroll-mt-24"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        background: "var(--gold-bg)",
                        color: "var(--gold)",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-black"
                      style={{ background: "#101828", color: "#fff" }}
                    >
                      {price}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold mt-5"
                    style={{ color: "var(--ink)" }}
                  >
                    {label}
                  </h3>
                  <p
                    className="text-sm mt-2 leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {summary}
                  </p>
                  <ul className="space-y-2 mt-5 flex-1">
                    {includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: "var(--charcoal)" }}
                      >
                        <Check
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: "var(--green)" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="flex items-center gap-2 mt-5 text-xs"
                    style={{ color: "var(--subtle)" }}
                  >
                    <Clock3 className="w-4 h-4" />
                    {turnaround}
                  </div>
                  <button
                    type="button"
                    onClick={() => chooseService(id)}
                    className="btn-secondary w-full mt-4"
                  >
                    Request this service
                  </button>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        className="section-light section-padding"
        style={{ background: "#fff" }}
      >
        <div className="page-container grid lg:grid-cols-[.9fr_1.1fr] gap-8 items-start">
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow">Real work, not mock claims</span>
            <h2 className="headline mt-4">Check published samples first.</h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              These public Smit Sir Commerce resources show the writing,
              organisation and digital-product work already published. They are
              examples of capability, not claims that every future project will
              look identical.
            </p>
            <div className="grid gap-3 mt-6">
              <Link
                to="/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-1-nature-and-significance-of-management-notes"
                className="tile-paper p-4 flex items-center justify-between gap-3"
              >
                <span>
                  <strong className="block" style={{ color: "var(--ink)" }}>
                    Branded chapter notes
                  </strong>
                  <small style={{ color: "var(--muted)" }}>
                    GSEB Class 12 OCM sample
                  </small>
                </span>
                <ArrowRight
                  className="w-4 h-4"
                  style={{ color: "var(--gold)" }}
                />
              </Link>
              <Link
                to="/cbse/class-12/business-studies-case-study-questions"
                className="tile-paper p-4 flex items-center justify-between gap-3"
              >
                <span>
                  <strong className="block" style={{ color: "var(--ink)" }}>
                    Question-writing sample
                  </strong>
                  <small style={{ color: "var(--muted)" }}>
                    Business Studies case-study resource
                  </small>
                </span>
                <ArrowRight
                  className="w-4 h-4"
                  style={{ color: "var(--gold)" }}
                />
              </Link>
              <Link
                to="/test-series"
                className="tile-paper p-4 flex items-center justify-between gap-3"
              >
                <span>
                  <strong className="block" style={{ color: "var(--ink)" }}>
                    Assessment system sample
                  </strong>
                  <small style={{ color: "var(--muted)" }}>
                    Published Commerce test series
                  </small>
                </span>
                <ArrowRight
                  className="w-4 h-4"
                  style={{ color: "var(--gold)" }}
                />
              </Link>
              <Link
                to="/teacher-guides"
                className="tile-paper p-4 flex items-center justify-between gap-3"
              >
                <span>
                  <strong className="block" style={{ color: "var(--ink)" }}>
                    Teacher resource hub
                  </strong>
                  <small style={{ color: "var(--muted)" }}>
                    Free guides teachers can inspect
                  </small>
                </span>
                <ArrowRight
                  className="w-4 h-4"
                  style={{ color: "var(--gold)" }}
                />
              </Link>
            </div>
          </div>
          <TeacherServiceOrderForm
            key={selectedService}
            defaultService={selectedService}
          />
        </div>
      </section>

      <section className="section-light section-padding">
        <div className="page-container">
          <div className="grid lg:grid-cols-3 gap-5">
            {[
              [
                "1",
                "Send the requirement",
                "Choose a service and share the curriculum, topic, format and deadline.",
              ],
              [
                "2",
                "Confirm scope and price",
                "You receive the exact deliverables, final quote, delivery date and payment instructions.",
              ],
              [
                "3",
                "Draft, review and delivery",
                "The first draft is shared for review, one standard revision is completed, then final files are delivered.",
              ],
            ].map(([number, title, text]) => (
              <article key={number} className="card-paper p-6">
                <span
                  className="text-sm font-black"
                  style={{ color: "var(--gold)" }}
                >
                  STEP {number}
                </span>
                <h3
                  className="text-xl font-bold mt-3"
                  style={{ color: "var(--ink)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed mt-2"
                  style={{ color: "var(--muted)" }}
                >
                  {text}
                </p>
              </article>
            ))}
          </div>
          <div className="card-paper p-6 sm:p-8 mt-7 grid lg:grid-cols-[auto_1fr] gap-5 items-start">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gold-bg)", color: "var(--gold)" }}
            >
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <h2
                className="text-2xl"
                style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
              >
                Safe payment process
              </h2>
              <p
                className="mt-2 leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                Do not send money only because you saw a price on this page. Pay
                after you receive a written confirmation of the final scope,
                amount, delivery date and official payment recipient. A payment
                screenshot alone does not prove receipt; keep the successful
                UTR/reference number.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-light section-padding"
        style={{ background: "#fff" }}
      >
        <div className="page-container max-w-4xl">
          <span className="eyebrow">
            <BadgeCheck className="w-3.5 h-3.5" /> Before you order
          </span>
          <h2 className="headline mt-4">Frequently asked questions</h2>
          <div className="space-y-4 mt-7">
            {FAQS.map(([question, answer]) => (
              <details key={question} className="card-paper p-5 group">
                <summary
                  className="font-bold cursor-pointer"
                  style={{ color: "var(--ink)" }}
                >
                  {question}
                </summary>
                <p
                  className="text-sm leading-relaxed mt-3"
                  style={{ color: "var(--muted)" }}
                >
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
