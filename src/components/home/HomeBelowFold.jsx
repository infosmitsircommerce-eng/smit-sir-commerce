import CommerceJourneyPreview from './CommerceJourneyPreview';
import LearningPhilosophy from './LearningPhilosophy';
import TrustLayer from './TrustLayer';
import MehsanaGrowthCampaign from './MehsanaGrowthCampaign';
import SeoDiscoveryLinks from './SeoDiscoveryLinks';
import CommerceToolsPreview from './CommerceToolsPreview';
import MarksRecoveryCTA from './MarksRecoveryCTA';
import StatsSection from './StatsSection';
import CoursesPreview from './CoursesPreview';
import AboutSection from './AboutSection';
import FreeResources from './FreeResources';
import DailyPracticeCTA from './DailyPracticeCTA';
import StudyCoachCTA from './StudyCoachCTA';
import BatchCTA from './BatchCTA';
import FAQSection from './FAQSection';
import ContactCTA from './ContactCTA';
import StudentJourney from './StudentJourney';
import SectionDivider from '../ui/SectionDivider';

export default function HomeBelowFold() {
  return (
    <>
      <CommerceJourneyPreview />
      <LearningPhilosophy />
      <TrustLayer />
      <MehsanaGrowthCampaign />
      <MarksRecoveryCTA />
      <CommerceToolsPreview />
      <SeoDiscoveryLinks />
      <StatsSection />
      <StudentJourney />
      <DailyPracticeCTA />
      <StudyCoachCTA />
      <CoursesPreview />
      <SectionDivider />
      <AboutSection />
      <FreeResources />
      <BatchCTA />
      <SectionDivider />
      <FAQSection />
      <ContactCTA />
    </>
  );
}
