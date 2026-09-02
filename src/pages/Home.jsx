import SEO from '../components/ui/SEO';
import HeroSection from '../components/home/HeroSection';
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
        description: 'Free CBSE Commerce notes, chapter-wise study material, practice resources and Commerce coaching for Class 11 and 12 students.',
        inLanguage: 'en-IN',
      },
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://www.smitsircommerce.in/#organization',
        name: 'Smit Sir Commerce',
        url: 'https://www.smitsircommerce.in/',
        areaServed: ['India', 'Mehsana, Gujarat'],
        educationalCredentialAwarded: 'Class 11 and Class 12 Commerce learning support',
        description: 'Commerce learning platform offering free CBSE notes and study resources plus online and offline coaching.',
      },
    ],
  };

  return (
    <>
      <SEO
        title="Free CBSE Commerce Notes Class 11 & 12"
        description="Free CBSE Commerce notes for Class 11 and 12: chapter-wise Economics, Business Studies and Accountancy study material, practice resources, tests and Commerce coaching by Smit Sir."
        path="/"
        structuredData={structuredData}
      />
      <HeroSection />
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