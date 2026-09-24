import { useEffect, useState } from "react";
import SEO from "../components/ui/SEO";
import MobileLearningHome from "../components/home/MobileLearningHome";
import HomeBelowFold from "../components/home/HomeBelowFold";

function StableHomeBelowFold() {
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    if (ready) return undefined;

    const mount = () => setReady(true);
    let idleId;
    let timerId;

    // Mobile can defer the long tail until the browser is idle, but desktop must
    // have the complete page structure in the first render. Previously an
    // IntersectionObserver mounted thousands of pixels of content while the user
    // was actively scrolling into it, which caused visible scroll anchoring and
    // a "forced" jump/jank sensation on laptops.
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(mount, { timeout: 1400 });
    } else {
      timerId = window.setTimeout(mount, 700);
    }

    return () => {
      if (idleId != null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timerId != null) window.clearTimeout(timerId);
    };
  }, [ready]);

  if (!ready) {
    return (
      <div
        aria-hidden="true"
        data-home-below-fold-placeholder="true"
        style={{ minHeight: "320px" }}
      />
    );
  }

  return <HomeBelowFold />;
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.smitsircommerce.in/#home",
    url: "https://www.smitsircommerce.in/",
    name: "Free Commerce Study Material, Notes, PDFs and Practice",
    description:
      "Homepage for Smit Sir Commerce: free Commerce notes, CBSE and GSEB study material, PDFs and chapter-wise practice for students.",
    isPartOf: { "@id": "https://www.smitsircommerce.in/#website" },
    about: { "@id": "https://www.smitsircommerce.in/#organization" },
    inLanguage: "en-IN",
  };

  return (
    <>
      <SEO
        title="Free Commerce Notes, PDFs & Practice"
        description="Free Commerce study material for Class 11 and 12 students: CBSE and GSEB notes, Economics PDFs, Business Studies resources, Accountancy support, chapter-wise practice and useful study tools."
        path="/"
        structuredData={structuredData}
      />
      <MobileLearningHome />
      <StableHomeBelowFold />
    </>
  );
}
