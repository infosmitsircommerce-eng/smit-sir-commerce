import SEO from '../components/ui/SEO';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import CoursesPreview from '../components/home/CoursesPreview';
import AboutSection from '../components/home/AboutSection';
import FreeResources from '../components/home/FreeResources';
import BatchCTA from '../components/home/BatchCTA';
import FAQSection from '../components/home/FAQSection';
import ContactCTA from '../components/home/ContactCTA';
import SectionDivider from '../components/ui/SectionDivider';

export default function Home() {
  return (
    <>
      <SEO
        title="Class 11 & 12 CBSE Commerce Coaching Mehsana"
        description="CBSE Commerce coaching for Class 11 and 12 in Mehsana, Gujarat, with free chapter-wise PDF notes and a free demo class."
        path="/"
      />
      <HeroSection />
      <StatsSection />
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
