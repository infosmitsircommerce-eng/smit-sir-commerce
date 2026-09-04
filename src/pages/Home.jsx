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
        description: 'A growing Commerce learning platform with school, college and competitive-exam resources: Class 11 & 12, B.Com, M.Com, UGC NET Commerce, GSET Commerce, notes, tools and practice.',
        inLanguage: 'en-IN',
        publisher: { '@id': 'https://www.smitsircommerce.in/#organization' },
      },
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://www.smitsircommerce.in/#organization',
        name: 'Smit Sir Commerce',
        url: 'https://www.smitsircommerce.in/',
        areaServed: ['India', 'Mehsana, Gujarat'],
        description: 'Commerce learning platform spanning school, college and competitive-exam resources, with specialist Class 11 and 12 teaching by Smit Sir and a growing library for B.Com, M.Com, UGC NET and GSET Commerce.',
        knowsAbout: ['Commerce education', 'CBSE Commerce', 'Class 11 Commerce', 'Class 12 Commerce', 'B.Com learning resources', 'M.Com learning resources', 'UGC NET Commerce', 'GSET Commerce', 'Economics', 'Business Studies', 'Accountancy learning resources'],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.smitsircommerce.in/#home',
        url: 'https://www.smitsircommerce.in/',
        name: 'Commerce Learning Hub — School, College & Competitive Exams',
        description: 'Commerce learning resources across Class 11 & 12, B.Com, M.Com, UGC NET Commerce and GSET Commerce, with notes, PDFs, tools, practice and exam preparation.',
        isPartOf: { '@id': 'https://www.smitsircommerce.in/#website' },
        about: { '@id': 'https://www.smitsircommerce.in/#organization' },
        inLanguage: 'en-IN',
      },
    ],
  };

  return (
    <>
      <SEO
        title="Commerce Notes, Tools & Exam Resources — School to NET"
        description="A growing Commerce learning platform for Class 11 & 12, B.Com, M.Com, UGC NET and GSET with notes, PDFs, practice and tools. Specialist Class 11 & 12 teaching by Smit Sir."
        path="/"
        structuredData={structuredData}
      />
      <HeroSection />
      <DeferredHomeContent />
    </>
  );
}
