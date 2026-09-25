import TrustLayer from "./TrustLayer";
import PublishedWork from "./PublishedWork";
import CommerceToolsPreview from "./CommerceToolsPreview";
import FAQSection from "./FAQSection";
import ContactCTA from "./ContactCTA";
import { Pricing } from "../ui/pricing";
import BoardBoosterPromo from "./BoardBoosterPromo";
import StatsSection from "./StatsSection";
import { PREMIUM_MEGA_PACK } from "../../data/premiumMegaPack";

const studentPlans = [
  {
    name: "Free Learning",
    price: 0,
    period: "forever",
    eyebrow: "START HERE",
    description: "A complete starting point for Commerce students—no payment required.",
    features: [
      "Published chapter-wise notes",
      "Easy and Moderate quizzes",
      "Free study tools and diagnostics",
      "No account needed for free PDFs",
    ],
    buttonText: "Explore free resources",
    href: "/study-material",
    isPopular: false,
  },
  {
    name: "Board Booster",
    price: 199,
    period: "one-time",
    eyebrow: "EXAM FOCUS",
    description: "A focused seven-day revision pack for one selected board subject.",
    features: [
      "Original 14-page revision pack",
      "Three exam-style tests with answers",
      "Weak-topic worksheet",
      "Seven-day revision plan",
    ],
    buttonText: "View Board Boosters",
    href: "/board-booster-packs",
    isPopular: true,
  },
  {
    name: PREMIUM_MEGA_PACK.shortName,
    price: PREMIUM_MEGA_PACK.price,
    period: "lifetime",
    eyebrow: PREMIUM_MEGA_PACK.badge,
    description: PREMIUM_MEGA_PACK.focus,
    features: [
      "All currently published Premium master resources",
      "CBSE + GSEB Class 11 and 12 Commerce coverage",
      "Hard + Extreme practice and Premium study tools",
      "One-time purchase with lifetime access",
    ],
    buttonText: "See Complete Commerce",
    href: PREMIUM_MEGA_PACK.accessPath,
    isPopular: false,
  },
];

export default function HomeBelowFold() {
  return (
    <div className="ssc-home-modules">
      <StatsSection />
      <TrustLayer />
      <PublishedWork />
      <CommerceToolsPreview />
      <BoardBoosterPromo />
      <Pricing
        plans={studentPlans}
        title="Free first. Upgrade only when useful."
        description="Every option is clear, student-friendly and paid only once—there are no monthly subscriptions."
      />
      <FAQSection />
      <ContactCTA />
    </div>
  );
}
