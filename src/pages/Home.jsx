import SEO from '../components/ui/SEO';
import HeroSection from '../components/home/HeroSection';
import MehsanaGrowthCampaign from '../components/home/MehsanaGrowthCampaign';
import SeoDiscoveryLinks from '../components/home/SeoDiscoveryLinks';
import CommerceToolsPreview from '../components/home/CommerceToolsPreview';
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
        description: 'Free CBSE Commerce notes, chapter-wise study material, calculators, practice resources and Commerce coaching for Class 11 and 12 students.',
        inLanguage: 'en-IN',
        publisher: { '@id': 'https://www.smitsircommerce.in/#organization' },
      },
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://www.smitsircommerce.in/#organization',
        name: 'Smit Sir Commerce',
        url: 'https://www.smitsircommerce.in/',
        areaServed: ['India', 'Mehsana, Gujarat'],
        description: 'Commerce learning platform offering free CBSE notes, Economics and Accountancy calculators, study resources plus online and offline coaching for Class 11 and 12.',
        knowsAbout: ['CBSE Commerce', 'Economics', 'Business Studies', 'Accountancy', 'Microeconomics', 'Macroeconomics', 'National Income', 'Accounting Ratios'],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.smitsircommerce.in/#home',
        url: 'https://www.smitsircommerce.in/',
        name: 'Free CBSE Commerce Notes, Calculators & Practice Class 11 & 12',
        description: 'Free chapter-wise CBSE Commerce notes, Economics and Accountancy calculators, PDFs, practice resources and exam preparation for Class 11 and 12 students.',
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
        description="Free CBSE Commerce notes, Economics and Accountancy calculators, chapter-wise PDFs, practice resources, tests and Commerce coaching by Smit Sir."
        path="/"
        structuredData={structuredData}
      />
      <HeroSection />
      <MehsanaGrowthCampaign />
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
