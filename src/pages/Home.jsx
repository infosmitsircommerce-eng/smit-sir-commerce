import { lazy, Suspense, useEffect, useRef, useState } from "react";
import SEO from "../components/ui/SEO";
import MobileLearningHome from "../components/home/MobileLearningHome";

const HomeBelowFold = lazy(() => import("../components/home/HomeBelowFold"));

function DeferredHomeContent() {
  const [ready, setReady] = useState(false);
  const anchor = useRef(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setReady(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '300px' });
    if (anchor.current) observer.observe(anchor.current);
    return () => observer.disconnect();
  }, []);

  if (!ready) return <div ref={anchor} aria-hidden="true" style={{ minHeight: "240px" }} />;

  return (
    <Suspense
      fallback={<div aria-hidden="true" style={{ minHeight: "240px" }} />}
    >
      <HomeBelowFold />
    </Suspense>
  );
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.smitsircommerce.in/#home",
    url: "https://www.smitsircommerce.in/",
    name: "Free Commerce Study Material, Notes, PDFs, Practice and Quizzes",
    description:
      "Homepage for Smit Sir Commerce: free Commerce notes, CBSE and GSEB study material, PDFs, practice tools and chapter-wise quizzes for students.",
    isPartOf: { "@id": "https://www.smitsircommerce.in/#website" },
    about: { "@id": "https://www.smitsircommerce.in/#organization" },
    inLanguage: "en-IN",
  };

  return (
    <>
      <SEO
        title="Free Commerce Notes, PDFs, Practice & Quizzes"
        description="Free Commerce study material for Class 11 and 12 students: CBSE and GSEB notes, Economics PDFs, Business Studies resources, Accountancy support, practice tools and chapter-wise Economics quizzes."
        path="/"
        structuredData={structuredData}
      />
      <MobileLearningHome />
      <DeferredHomeContent />
    </>
  );
}
