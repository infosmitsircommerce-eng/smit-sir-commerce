import SEO from '../components/ui/SEO';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CoursesPreview from '../components/home/CoursesPreview';
import WhatYouGet from '../components/home/WhatYouGet';
import FreeResources from '../components/home/FreeResources';
import GamesPromo from '../components/home/GamesPromo';
import BatchCTA from '../components/home/BatchCTA';
import Toppers from '../components/home/Toppers';
import ResultsBanner from '../components/home/ResultsBanner';
import Testimonials from '../components/home/Testimonials';
import PremiumUnlock from '../components/home/PremiumUnlock';
import AboutSection from '../components/home/AboutSection';
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
      <SectionDivider />
      <StatsSection />
      <SectionDivider />
      <WhyChooseUs />
      <SectionDivider />
      <CoursesPreview />
      <SectionDivider />
      <WhatYouGet />
      <SectionDivider />
      <FreeResources />
      <SectionDivider />
      <GamesPromo />
      <SectionDivider />
      <BatchCTA />
      <SectionDivider />
      <Toppers />
      <SectionDivider />
      <ResultsBanner />
      <SectionDivider />
      <Testimonials />
      <SectionDivider />
      <PremiumUnlock />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <FAQSection />
      <SectionDivider />
      <ContactCTA />
    </>
  );
}
