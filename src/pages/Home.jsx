import SEO from '../components/ui/SEO';
import JanmashtamiWelcome from '../components/home/JanmashtamiWelcome';
import HeroSection from '../components/home/HeroSection';
import LearningPhilosophy from '../components/home/LearningPhilosophy';
import TrustLayer from '../components/home/TrustLayer';
import MehsanaGrowthCampaign from '../components/home/MehsanaGrowthCampaign';
import SeoDiscoveryLinks from '../components/home/SeoDiscoveryLinks';
import CommerceToolsPreview from '../components/home/CommerceToolsPreview';
import MarksRecoveryCTA from '../components/home/MarksRecoveryCTA';
import StatsSection from '../components/home/StatsSection';
import CoursesPreview from '../components/home/CoursesPreview';
import AboutSection from '../components/home/AboutSection';
import FreeResources from '../components/home/FreeResources';
import DailyPracticeCTA from '../components/home/DailyPracticeCTA';
import StudyCoachCTA from '../components/home/StudyCoachCTA';
import BatchCTA from '../components/home/BatchCTA';
import FAQSection from '../components/home/FAQSection';
import ContactCTA from '../components/home/ContactCTA';
import StudentJourney from '../components/home/StudentJourney';
import SectionDivider from '../components/ui/SectionDivider';

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.smitsircommerce.in/#website',
        url: 'https://www.smitsircommerce.in/',
        name: 'Smit Sir Commerce',
        description: 'Free CBSE Commerce notes, chapter-wise study material, calculators, marks-recovery diagnostics, practice resources and Commerce coaching for Class 11 and 12 students.',
        inLanguage: 'en-IN',
        publisher: { '@id': 'https://www.smitsircommerce.in/#organization' },
      },
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://www.smitsircommerce.in/#organization',
        name: 'Smit Sir Commerce',
        url: 'https://www.smitsircommerce.in/',
        areaServed: ['India', 'Mehsana, Gujarat'],
        description: 'Commerce learning platform focused on concept clarity, curiosity and learning with fun, with free CBSE notes, Economics and Accountancy learning calculators, a Commerce Marks Leak recovery diagnostic, study resources plus online and offline coaching for Class 11 and 12.',
        knowsAbout: ['CBSE Commerce', 'Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education', 'Accountancy learning resources', 'Microeconomics', 'Macroeconomics', 'Commerce exam mistake analysis'],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.smitsircommerce.in/#home',
        url: 'https://www.smitsircommerce.in/',
        name: 'Free CBSE Commerce Notes, Calculators & Practice Class 11 & 12',
        description: 'Free chapter-wise CBSE Commerce notes, Economics and Accountancy learning calculators, marks-recovery diagnostic, PDFs, practice resources and concept-focused exam preparation for Class 11 and 12 students.',
        isPartOf: { '@id': 'https://www.smitsircommerce.in/#website' },
        about: { '@id': 'https://www.smitsircommerce.in/#organization' },
        inLanguage: 'en-IN',
      },
    ],
  };

  return (
    <>
      <SEO
        title="Free CBSE Commerce Notes, Calculators & Practice Class 11 & 12"
        description="Learn CBSE Commerce with concept clarity and fun. Free notes, Economics and Accountancy learning calculators, marks-recovery tools, chapter-wise PDFs, practice resources and coaching by Smit Sir."
        path="/"
        structuredData={structuredData}
      />
      <JanmashtamiWelcome />
      <HeroSection />
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
