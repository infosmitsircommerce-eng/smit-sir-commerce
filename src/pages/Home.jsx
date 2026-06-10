import SEO from '../components/ui/SEO';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import CoursesPreview from '../components/home/CoursesPreview';
import AboutSection from '../components/home/AboutSection';
import FreeResources from '../components/home/FreeResources';
import BatchCTA from '../components/home/BatchCTA';
import ResultsBanner from '../components/home/ResultsBanner';
import FAQSection from '../components/home/FAQSection';
import ContactCTA from '../components/home/ContactCTA';
import SectionDivider from '../components/ui/SectionDivider';

export default function Home() {
  return (
    <>
      <SEO
        title="Class 11 & 12 CBSE Commerce Coaching Mehsana"
        description="Smit Sir Commerce — Top CBSE Commerce coaching in Mehsana, Gujarat. 200+ students, 91% score above 80%. Economics, Accountancy, Business Studies. Book free demo!"
        path="/"
      />
      <HeroSection />
      <StatsSection />
      <CoursesPreview />
      <SectionDivider />
      <AboutSection />
      <FreeResources />
      <BatchCTA />
      <ResultsBanner />
      <SectionDivider />
      <FAQSection />
      <ContactCTA />
    </>
  );
}
