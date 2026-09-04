import { lazy, Suspense, useEffect, useState } from 'react';
import SEO from '../components/ui/SEO';
import HeroSection from '../components/home/HeroSection';

const HomeBelowFold = lazy(() => import('../components/home/HomeBelowFold'));

function DeferredHomeContent() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId;
    let timerId;
    const reveal = () => setReady(true);

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(reveal, { timeout: 1000 });
    } else {
      timerId = window.setTimeout(reveal, 550);
    }

    return () => {
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timerId) window.clearTimeout(timerId);
    };
  }, []);

  if (!ready) return <div aria-hidden="true" style={{ minHeight: '240px' }} />;

  return (
    <Suspense fallback={<div aria-hidden="true" style={{ minHeight: '240px' }} />}>
      <HomeBelowFold />
    </Suspense>
  );
}

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
      <HeroSection />
      <DeferredHomeContent />
    </>
  );
}
