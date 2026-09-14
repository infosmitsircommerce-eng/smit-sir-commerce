import { lazy, Suspense, useEffect, useRef, useState } from "react";
import SEO from "../components/ui/SEO";
import MobileLearningHome from "../components/home/MobileLearningHome";

const HomeBelowFold = lazy(() => import("../components/home/HomeBelowFold"));
const HeroScrollDemo = lazy(() =>
  import("../components/ui/demo").then((module) => ({ default: module.HeroScrollDemo })),
);

function DeferredSection({ children, minHeight = "240px", rootMargin = "300px" }) {
  const [ready, setReady] = useState(false);
  const anchor = useRef(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    if (anchor.current) observer.observe(anchor.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  if (!ready) return <div ref={anchor} aria-hidden="true" style={{ minHeight }} />;
  return children;
}

function DeferredScrollExperiment() {
  return (
    <DeferredSection minHeight="320px" rootMargin="500px">
      <Suspense fallback={<div aria-hidden="true" style={{ minHeight: "320px" }} />}>
        <HeroScrollDemo />
      </Suspense>
    </DeferredSection>
  );
}

function DeferredHomeContent() {
  return (
    <DeferredSection>
      <Suspense fallback={<div aria-hidden="true" style={{ minHeight: "240px" }} />}>
        <HomeBelowFold />
      </Suspense>
    </DeferredSection>
  );
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.smitsircommerce.in/#website",
        url: "https://www.smitsircommerce.in/",
        name: "Smit Sir Commerce",
        description:
          "Free Commerce learning website for Class 11 and 12 students with CBSE and GSEB notes, PDFs, practice tools and chapter-wise Economics quizzes.",
        inLanguage: "en-IN",
        publisher: { "@id": "https://www.smitsircommerce.in/#organization" },
      },
      {
        "@type": "EducationalOrganization",
        "@id": "https://www.smitsircommerce.in/#organization",
        name: "Smit Sir Commerce",
        url: "https://www.smitsircommerce.in/",
        areaServed: ["India", "Mehsana, Gujarat"],
        description:
          "Commerce learning platform created by Smit Thaker with free study material, Economics notes, Business Studies support, Accountancy resources, practice tools and quizzes for students.",
        knowsAbout: [
          "Commerce education",
          "CBSE Commerce",
          "GSEB Economics",
          "Class 11 Commerce",
          "Class 12 Commerce",
          "Economics",
          "Business Studies",
          "Accountancy",
          "Commerce study material",
          "Economics quizzes",
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://www.smitsircommerce.in/#home",
        url: "https://www.smitsircommerce.in/",
        name: "Free Commerce Study Material, Notes, PDFs, Practice and Quizzes",
        description:
          "Homepage for Smit Sir Commerce: free Commerce notes, CBSE and GSEB study material, PDFs, practice tools and chapter-wise quizzes for students.",
        isPartOf: { "@id": "https://www.smitsircommerce.in/#website" },
        about: { "@id": "https://www.smitsircommerce.in/#organization" },
        inLanguage: "en-IN",
      },
    ],
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
      <DeferredScrollExperiment />
      <DeferredHomeContent />
    </>
  );
}
