import CommerceJourneyPreview from "./CommerceJourneyPreview";
import TrustLayer from "./TrustLayer";
import PublishedWork from "./PublishedWork";
import CommerceToolsPreview from "./CommerceToolsPreview";
import FAQSection from "./FAQSection";
import ContactCTA from "./ContactCTA";
import { Pricing } from "../ui/pricing";
import BoardBoosterPromo from "./BoardBoosterPromo";

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
    name: "Premium Economics",
    price: 999,
    period: "lifetime",
    eyebrow: "DEEP PRACTICE",
    description: "Advanced Economics practice for students who want harder preparation.",
    features: [
      "Hard and Extreme Economics quizzes",
      "31 chapter deep-dive guides",
      "620 worked challenges",
      "One account with lifetime access",
    ],
    buttonText: "See Premium details",
    href: "/premium",
    isPopular: false,
  },
];

export default function HomeBelowFold() {
  return (
    <div className="ssc-home-modules">
      <TrustLayer />
      <PublishedWork />
      <CommerceJourneyPreview />
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
