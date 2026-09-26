import { lazy, Suspense, useEffect, useState } from "react";
import SEO from "../components/ui/SEO";
import MobileLearningHome from "../components/home/MobileLearningHome";

const HomeBelowFold = lazy(() => import("../components/home/HomeBelowFold"));

function HomeBelowFoldFallback() {
  return (
    <div
      aria-hidden="true"
      data-home-below-fold-placeholder="true"
      style={{ minHeight: "360px" }}
    />
  );
}

function StableHomeBelowFold() {
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    if (ready) return undefined;

    let idleId;
    let timerId;
    let mounted = false;

    const mount = () => {
      if (mounted) return;
      mounted = true;
      setReady(true);
    };

    // Desktop keeps the full document available immediately. On mobile, defer
    // the expensive lower-home render until idle — but reveal it instantly if
    // the student starts scrolling or interacting before the idle window.
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(mount, { timeout: 1200 });
    } else {
      timerId = window.setTimeout(mount, 650);
    }

    window.addEventListener("scroll", mount, { once: true, passive: true });
    window.addEventListener("pointerdown", mount, { once: true, passive: true });
    window.addEventListener("touchstart", mount, { once: true, passive: true });

    return () => {
      if (idleId != null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timerId != null) window.clearTimeout(timerId);
      window.removeEventListener("scroll", mount);
      window.removeEventListener("pointerdown", mount);
      window.removeEventListener("touchstart", mount);
    };
  }, [ready]);

  if (!ready) return <HomeBelowFoldFallback />;

  return (
    <Suspense fallback={<HomeBelowFoldFallback />}>
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
