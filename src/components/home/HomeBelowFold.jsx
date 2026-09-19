import TrustLayer from "./TrustLayer";
import PublishedWork from "./PublishedWork";
import CommerceToolsPreview from "./CommerceToolsPreview";
import FAQSection from "./FAQSection";
import ContactCTA from "./ContactCTA";
import BoardBoosterPromo from "./BoardBoosterPromo";

export default function HomeBelowFold() {
  return (
    <div className="ssc-home-modules">
      <TrustLayer />
      <PublishedWork />
      <CommerceToolsPreview />
      <BoardBoosterPromo />
      <FAQSection />
      <ContactCTA />
    </div>
  );
}
