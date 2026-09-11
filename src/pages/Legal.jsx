import { useLocation } from "react-router-dom";
import SEO from "../components/ui/SEO";

const documents = {
  "/privacy": {
    title: "Privacy Policy",
    description:
      "How Smit Sir Commerce handles account, learning-progress, analytics, advertising and enquiry data.",
    sections: [
      [
        "What we collect",
        "The website may process account details you provide during sign-up, class level, learning progress such as quiz/test scores and bookmarks, and information you voluntarily submit through contact, demo or admission enquiry forms.",
      ],
      [
        "Admission enquiries",
        "When you request a demo or send an admission enquiry, the platform may store your name, mobile number, class, board, selected subjects, preferred learning mode, contact-time preference, enquiry message and the traffic source associated with the enquiry. These details are used to respond, manage follow-ups and understand which admission channels are useful.",
      ],
      [
        "Teacher Studio requests",
        "When a teacher, school or coaching representative requests a service, the platform may store the contact name, mobile number, optional email and organisation name, curriculum, student level, subject, deadline, selected service and project brief. This information is used only to prepare the quote, communicate about the project, deliver agreed work and manage follow-up.",
      ],
      [
        "Demo scheduling",
        "If you choose a published demo slot, the platform may store the selected date and time, learning mode, demo subject, booking status, attendance outcome and private follow-up notes used to manage that demo. A parent or guardian mobile number can be provided optionally and is treated as private admission contact data.",
      ],
      [
        "Young users",
        "Students under 18 should share a contact number only with the awareness of a parent or guardian. The enquiry form does not ask for date of birth, government identification or other unnecessary identity documents.",
      ],
      [
        "Lead privacy",
        "Admission contact details, parent or guardian contact details, demo notes and booking history are not displayed publicly. Direct database access to the admissions CRM and demo-operations area is restricted to an authorized owner or administrator account. Repeated enquiries using the same mobile number may be merged into one lead record so follow-up history stays organized.",
      ],
      [
        "Learning progress",
        "Study activity may be saved in your browser. When cloud sync is enabled and you are signed in, supported progress can also be stored against your authenticated account so it can be available across devices.",
      ],
      [
        "Board diagnostic and pack reservations",
        "The free Board Exam Diagnostic stores answers and the latest result on the current device and may record limited non-identifying funnel events such as test start, completion, score band and selected subject. If a student voluntarily reserves a subject pack, the submitted name, mobile number, board, subject and score summary are stored privately to respond to that request. Students under 18 should submit a contact number only with a parent or guardian’s awareness.",
      ],
      [
        "Analytics",
        "The platform may record limited product-usage events such as page views, calculator use, marks-recovery interactions, exam starts, exam completions and admission-form funnel events to understand which learning and enquiry flows are useful. Analytics metadata is designed not to include passwords, phone numbers, email addresses or free-text student answers.",
      ],
      [
        "Advertising and Google AdSense",
        "Smit Sir Commerce may use Google AdSense or other advertising services in the future on selected public learning pages. If advertising is enabled, Google and its advertising partners may use cookies, local storage, device identifiers or similar technologies to serve, measure and improve ads, subject to applicable consent choices and Google policies. Advertising is not intended to be shown on private dashboards, admin areas, login flows, marks-recovery diagnostics, demo or admission forms, or other sensitive conversion pages.",
      ],
      [
        "Advertising cookies and choices",
        "When advertising is active, third-party vendors including Google may use advertising cookies or identifiers to show personalized or non-personalized ads where permitted. Available consent or ad-personalization choices may depend on the visitor’s location, age signals, browser settings and the consent tools required by applicable law or Google policy. Users can also manage browser cookies through their browser settings.",
      ],
      [
        "Third-party services",
        "Hosting, authentication, database, analytics, advertising, storage and related infrastructure may be provided by services such as Vercel, Supabase and Google. Optional calendar actions can open a calendar provider with the demo time and basic booking details when the owner chooses to use them. Their own privacy and security terms also apply to data processed by those services.",
      ],
      [
        "Your controls",
        "Students can use the My Data page to export supported device-saved study progress, restore a backup and clear supported local study data. Account, cloud-data or enquiry-data deletion requests can be made through the contact page. Browser cookie controls can also be used to remove or block locally stored advertising or analytics identifiers where supported.",
      ],
      [
        "Data safety",
        "Reasonable technical controls are used, including authenticated database access and row-level security where configured. Public demo availability exposes only non-sensitive scheduling information, not student bookings or contact details. No internet service can promise absolute security, so users should keep their passwords private and unique.",
      ],
      [
        "Contact",
        "Questions about privacy, account data, advertising or admission-enquiry data can be sent through the website contact page.",
      ],
    ],
  },
  "/terms": {
    title: "Terms of Use",
    description:
      "Basic terms for using Smit Sir Commerce learning resources and tools.",
    sections: [
      [
        "Educational purpose",
        "Smit Sir Commerce provides study material, practice questions, tests and learning tools for educational support. Content is not an official CBSE publication unless a source is explicitly identified as such.",
      ],
      [
        "Accounts",
        "Users are responsible for keeping login credentials secure and for information submitted through their accounts. Do not attempt to access another student’s account or restricted administrative areas.",
      ],
      [
        "Practice scores",
        "Scores, mastery percentages, weak-topic estimates, Commerce Readiness Scores and Study Coach recommendations are learning aids. They are not official school or board grades and should not be represented as such.",
      ],
      [
        "Content use",
        "Website content is intended for personal study. Users should not republish, sell, scrape or redistribute original platform content at scale without permission.",
      ],
      [
        "Advertising",
        "Selected public learning pages may display third-party advertising in the future. Ads do not represent an endorsement of the advertiser by Smit Sir Commerce. Users must not intentionally generate invalid ad impressions or clicks, and advertising will be kept separate from private learning, admission and administrative flows.",
      ],
      [
        "Demo availability",
        "A displayed demo slot is subject to remaining capacity at the moment the booking is submitted. If a slot becomes unavailable before submission completes, another slot may need to be selected. Demo scheduling does not create a paid commitment by itself.",
      ],
      [
        "Teacher Studio quotes",
        "Teacher Studio prices shown on the website are starting prices for a standard scope. The final deliverables, price, delivery date, file formats and revision allowance must be confirmed in writing before payment. Submitting a request does not create a purchase obligation.",
      ],
      [
        "Original work and client materials",
        "Teacher Studio work is created from the agreed syllabus and instructions. Clients must have permission to share any logo, reference file or source material they provide. Smit Sir Commerce does not agree to copy or rebrand third-party copyrighted publications.",
      ],
      [
        "Service payment and delivery",
        "Payment should be made only after the scope, final amount, delivery date and official recipient are confirmed. Unless a different written scope is agreed, standard packages include one reasonable revision after the first draft. A major change in topic, length or format may require a revised quote. Keep the successful payment UTR or transaction reference; a screenshot alone does not establish receipt.",
      ],
      [
        "Board Booster reservation",
        "The ₹199 Board Booster amount is a launch-price reservation for the subject selected on the diagnostic result page. The form does not charge the student. Exact inclusions, delivery method, final amount and official payment recipient must be confirmed before payment. The free diagnostic and public revision resources remain free whether or not a pack is purchased.",
      ],
      [
        "Availability",
        "Features may change as the platform improves. Some tools depend on third-party hosting, authentication or database services and may be temporarily unavailable.",
      ],
      [
        "Fair use of the service",
        "Do not intentionally overload the site, bypass access controls, interfere with other users or use automated methods to abuse tests, accounts, enquiry forms or infrastructure.",
      ],
      [
        "Contact",
        "For questions about these terms, use the website contact page.",
      ],
    ],
  },
  "/access-policy": {
    title: "Access & Learning Policy",
    description:
      "How free resources, Pro access and learning progress work on Smit Sir Commerce.",
    sections: [
      [
        "Free learning resources",
        "Resources labelled Free can be used without purchasing Pro access, subject to normal website availability.",
      ],
      [
        "Pro-labelled features",
        "A feature marked Pro requires an account that has been granted Premium access. The website does not currently claim automatic payment activation unless a verified payment system is specifically introduced later.",
      ],
      [
        "Access period",
        "Economics Quiz Premium costs ₹999 as a one-time payment. Lifetime means access without a recurring subscription while Smit Sir Commerce operates this service. Easy and Moderate remain free. Hard and Extreme quizzes unlock after payment is verified for your signed-in account.",
      ],
      [
        "What Premium includes",
        "Published Hard and Extreme chapter quizzes with answer explanations and existing Pro-labelled learning features. Additional detailed notes and expanded test series are being developed; only resources already published are available now. Live tuition and separate coaching batches are not included in this quiz purchase.",
      ],
      [
        "Payment verification",
        "Pay using the QR displayed in the Premium popup and send the transaction reference and your registered account email through the official support link. Access is activated manually after the received payment is checked. A screenshot or an I paid message alone does not confirm receipt. Do not send your UPI PIN or OTP.",
      ],
      [
        "Progress storage",
        "Some learning progress is saved on the current device. Logged-in students may also use cloud sync when the required database tables are enabled. The interface will show Device saved when cloud sync is not available rather than pretending that data is synced.",
      ],
      [
        "Refund or cancellation",
        "Any paid access, refund, cancellation or transfer terms should be confirmed in writing before payment. This page does not create a refund promise where no specific paid plan has been agreed.",
      ],
      [
        "Support",
        "If access does not match what was agreed, contact Smit Sir Commerce through the official contact page so the issue can be checked.",
      ],
    ],
  },
};

export default function Legal() {
  const { pathname } = useLocation();
  const doc = documents[pathname] || documents["/terms"];
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-ivory)" }}>
      <SEO
        title={`${doc.title} — Smit Sir Commerce`}
        description={doc.description}
        path={pathname}
      />
      <section className="page-hero">
        <div className="page-container max-w-4xl">
          <span className="eyebrow">Smit Sir Commerce</span>
          <h1 className="mt-5">{doc.title}</h1>
          <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
            {doc.description}
          </p>
          <div className="text-xs mt-4" style={{ color: "var(--subtle)" }}>
            Last updated: 11 September 2026
          </div>
        </div>
      </section>
      <main className="page-container section-padding max-w-4xl">
        <div className="card-paper p-6 sm:p-9 space-y-8">
          {doc.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2
                className="text-2xl"
                style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
              >
                {heading}
              </h2>
              <p className="mt-3 leading-8" style={{ color: "var(--muted)" }}>
                {body}
              </p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
