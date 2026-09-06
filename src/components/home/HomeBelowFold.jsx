import StudentResourceGateway from './StudentResourceGateway';
import FreeResources from './FreeResources';
import CommerceToolsPreview from './CommerceToolsPreview';
import DailyPracticeCTA from './DailyPracticeCTA';
import StudyCoachCTA from './StudyCoachCTA';
import StudentJourney from './StudentJourney';
import LearningPhilosophy from './LearningPhilosophy';
import TrustLayer from './TrustLayer';
import FAQSection from './FAQSection';
import ContactCTA from './ContactCTA';
import SeoDiscoveryLinks from './SeoDiscoveryLinks';
import SectionDivider from '../ui/SectionDivider';

export default function HomeBelowFold() {
  return (
    <>
      <StudentResourceGateway />
      <FreeResources />
      <CommerceToolsPreview />
      <DailyPracticeCTA />
      <StudyCoachCTA />
      <StudentJourney />
      <LearningPhilosophy />
      <TrustLayer />
      <SeoDiscoveryLinks />
      <SectionDivider />
      <FAQSection />
      <ContactCTA />
    </>
  );
}
