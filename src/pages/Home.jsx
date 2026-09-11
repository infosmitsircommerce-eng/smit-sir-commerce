import { lazy, Suspense, useEffect, useState } from "react";
import SEO from "../components/ui/SEO";
import QuizPromo from "../components/home/QuizPromo";
import PremiumSpotlight from "../components/home/PremiumSpotlight";
import HeroSection from "../components/home/HeroSection";
import BoardBoosterPromo from "../components/home/BoardBoosterPromo";

const HomeBelowFold = lazy(() => import("../components/home/HomeBelowFold"));

function DeferredHomeContent() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId;
    let timerId;
    const reveal = () => setReady(true);

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(reveal, { timeout: 1000 });
    } else {
      timerId = window.setTimeout(reveal, 550);
    }

    return () => {
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timerId) window.clearTimeout(timerId);
    };
  }, []);

  if (!ready) return <div aria-hidden="true" style={{ minHeight: "240px" }} />;

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
        title="Free Commerce Notes, PDFs, Practice & Quizzes | Smit Sir Commerce"
        description="Free Commerce study material for Class 11 and 12 students: CBSE and GSEB notes, Economics PDFs, Business Studies resources, Accountancy support, practice tools and chapter-wise Economics quizzes."
        path="/"
        structuredData={structuredData}
      />
      <HeroSection />
      <BoardBoosterPromo />
      <PremiumSpotlight />
      <QuizPromo />
      <DeferredHomeContent />
    </>
  );
}
