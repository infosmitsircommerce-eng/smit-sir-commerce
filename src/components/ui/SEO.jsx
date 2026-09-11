import { Helmet } from "react-helmet-async";
import { hubByPath, materialByPath } from "../../data/seoMaterials";
import { gsebMaterials } from "../../data/gsebMaterials";

const BASE = "https://www.smitsircommerce.in";
const DEFAULT_IMG = BASE + "/og-image.jpg";
const SITE = "Smit Sir Commerce";
const DEFAULT_DESCRIPTION =
  "Free Commerce study material, CBSE and GSEB PDF notes, chapter-wise practice, Commerce tools and optional teacher help from Smit Sir Commerce.";

const gsebMaterialByPath = Object.fromEntries(
  gsebMaterials.map((material) => [material.seo_path, material]),
);

const CORE_RESOURCE_LINKS = [
  {
    name: "Free Commerce Study Material",
    url: `${BASE}/study-material`,
    about: "CBSE and GSEB chapter-wise PDF notes",
  },
  {
    name: "CBSE Commerce Notes",
    url: `${BASE}/cbse-notes`,
    about: "Class 11 and Class 12 CBSE Commerce notes",
  },
  {
    name: "GSEB Class 12 Economics Notes",
    url: `${BASE}/gseb-class-12-economics.html`,
    about: "GSEB Class 12 Economics chapter-wise notes and PDFs",
  },
  {
    name: "Commerce Practice",
    url: `${BASE}/daily-practice`,
    about: "Chapter practice and revision questions",
  },
  {
    name: "Commerce Tools",
    url: `${BASE}/tools`,
    about: "Free Economics and Accountancy calculators",
  },
  {
    name: "Commerce Games",
    url: `${BASE}/games`,
    about: "Interactive learning games for Commerce students",
  },
  {
    name: "AI Discovery Summary",
    url: `${BASE}/ai-discovery.html`,
    about: "AI-readable first-party summary of Smit Sir Commerce resources",
  },
];

const SITEWIDE_ENTITY = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: `${BASE}/`,
      name: SITE,
      alternateName: [
        "Smit Sir Commerce Classes",
        "Smit Sir Commerce Notes",
        "Smit Sir Commerce Material",
      ],
      description: DEFAULT_DESCRIPTION,
      inLanguage: "en-IN",
      publisher: { "@id": `${BASE}/#organization` },
      subjectOf: [
        {
          "@type": "CreativeWork",
          name: "LLMS text summary",
          url: `${BASE}/llms.txt`,
        },
        {
          "@type": "Dataset",
          name: "Smit Sir Commerce AI summary JSON",
          url: `${BASE}/ai-summary.json`,
        },
        {
          "@type": "AboutPage",
          name: "AI Discovery for Smit Sir Commerce",
          url: `${BASE}/ai-discovery.html`,
        },
      ],
      hasPart: CORE_RESOURCE_LINKS.map((item) => ({
        "@type": "WebPage",
        name: item.name,
        url: item.url,
        about: item.about,
        isAccessibleForFree: true,
      })),
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${BASE}/#organization`,
      name: SITE,
      alternateName: [
        "Smit Sir Commerce Classes",
        "Smit Sir Commerce Notes",
        "Smit Sir Commerce Material",
      ],
      url: `${BASE}/`,
      email: "infosmitsircommerce@gmail.com",
      description:
        "Smit Sir Commerce is a student-first Commerce learning resource library for free CBSE and GSEB notes, PDFs, practice resources, realistic learning games and Commerce tools, with optional support from Smit Sir when students need help.",
      areaServed: [
        { "@type": "Country", name: "India" },
        {
          "@type": "City",
          name: "Mehsana",
          containedInPlace: {
            "@type": "State",
            name: "Gujarat",
            containedInPlace: { "@type": "Country", name: "India" },
          },
        },
      ],
      knowsAbout: [
        "Class 11 Commerce",
        "Class 12 Commerce",
        "CBSE Commerce notes",
        "GSEB Class 12 Economics notes",
        "Free Commerce notes PDF",
        "Commerce study material",
        "Commerce learning games",
        "Commerce calculators",
        "Economics",
        "Business Studies",
        "Accountancy learning resources",
        "Entrepreneurship",
        "Physical Education",
        "Commerce exam preparation",
        "B.Com learning resources",
        "M.Com learning resources",
        "UGC NET Commerce preparation resources",
        "GSET Commerce preparation resources",
      ],
      founder: { "@id": `${BASE}/about#smit-thaker` },
      subjectOf: [
        {
          "@type": "AboutPage",
          name: "AI Discovery for Smit Sir Commerce",
          url: `${BASE}/ai-discovery.html`,
        },
        {
          "@type": "CreativeWork",
          name: "Smit Sir Commerce LLMS file",
          url: `${BASE}/llms.txt`,
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Commerce learning resources and student support",
        itemListElement: [
          "Free Commerce Notes PDF",
          "CBSE Class 11 Commerce Notes",
          "CBSE Class 12 Commerce Notes",
          "GSEB Class 12 Economics Notes",
          "Economics Practice Resources",
          "Business Studies Revision Resources",
          "Accountancy Learning Tools",
          "Realistic Commerce Learning Games",
          "Commerce Doubt Support",
        ].map((name) => ({
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          itemOffered: {
            "@type": "LearningResource",
            name,
            provider: { "@id": `${BASE}/#organization` },
            educationalLevel: ["Class 11", "Class 12"],
            learningResourceType: [
              "Notes",
              "PDF",
              "Practice material",
              "Interactive resource",
            ],
            isAccessibleForFree: true,
          },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": `${BASE}/about#smit-thaker`,
      name: "Smit Thaker",
      alternateName: "Smit Sir",
      url: `${BASE}/about`,
      worksFor: { "@id": `${BASE}/#organization` },
      knowsAbout: [
        "Economics",
        "Business Studies",
        "Entrepreneurship",
        "Physical Education",
        "Commerce education",
        "Commerce notes",
        "Commerce study material",
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${BASE}/#free-commerce-resources`,
      name: "Important free Commerce resources on Smit Sir Commerce",
      itemListElement: CORE_RESOURCE_LINKS.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  ],
};

function getChapterSearchMeta(path) {
  const material = materialByPath[path];
  if (!material) return null;

  if (material.gscTitle || material.gscDescription) {
    return {
      title: material.gscTitle || material.seoTitle,
      description: material.gscDescription || material.description,
    };
  }

  const hub = hubByPath[material.hub_path];
  const subject =
    hub?.label?.replace(`Class ${material.class_level} `, "") ||
    material.subject;
  return {
    title: `Free CBSE Class ${material.class_level} ${subject} Chapter ${material.chapterNumber} ${material.chapter} Notes PDF`,
    description: `Free CBSE Class ${material.class_level} ${subject} Chapter ${material.chapterNumber} ${material.chapter} notes PDF. View online or download chapter-wise notes with key topics, important questions, MCQs and exam-focused revision.`,
  };
}

function getGsebChapterSearchMeta(path) {
  const material = gsebMaterialByPath[path];
  if (!material) return null;

  return {
    title: `GSEB Class 12 Economics Chapter ${material.chapterNumber} ${material.chapter} Notes PDF`,
    description: `Download free GSEB Class 12 Economics Chapter ${material.chapterNumber} ${material.chapter} notes PDF from Smit Sir Commerce. Chapter-wise Gujarati board Economics notes with online view, direct PDF and practice link.`,
  };
}

function getLocalSearchMeta(path) {
  if (path !== "/commerce-coaching-mehsana") return null;
  return {
    title: "Commerce Tuition in Mehsana — Class 11 & 12 CBSE",
    description:
      "Commerce tuition in Mehsana for Class 11 and 12 with Economics, Business Studies and Entrepreneurship teaching, tests, revision resources and student support by Smit Sir Commerce.",
  };
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  image = DEFAULT_IMG,
  noindex = false,
  type = "website",
  structuredData = null,
  publishedTime = null,
  modifiedTime = null,
  keywords = "free commerce notes, commerce study material, CBSE Commerce notes, GSEB Class 12 Economics notes PDF, Economics notes, Business Studies notes, Accountancy tools, Commerce games",
}) {
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");
  const gsebMeta = getGsebChapterSearchMeta(normalizedPath);
  const chapterMeta = getChapterSearchMeta(normalizedPath);
  const localMeta = getLocalSearchMeta(normalizedPath);
  const searchMeta = gsebMeta || chapterMeta || localMeta;
  const effectiveTitle = searchMeta?.title || title;
  const effectiveDescription = searchMeta?.description || description;
  const fullTitle = effectiveTitle
    ? `${effectiveTitle} | ${SITE}`
    : `${SITE} | Commerce Learning Hub`;
  const url = BASE + normalizedPath;
  const robots = noindex
    ? "noindex, nofollow, nosnippet"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={effectiveDescription} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="bingbot" content={robots} />
      <meta name="application-name" content={SITE} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      <link
        rel="alternate"
        type="text/plain"
        href={`${BASE}/llms.txt`}
        title="LLMS text summary for Smit Sir Commerce"
      />
      <link
        rel="alternate"
        type="application/json"
        href={`${BASE}/ai-summary.json`}
        title="AI summary JSON for Smit Sir Commerce"
      />
      <link rel="author" href={`${BASE}/about`} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={effectiveDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content={`${effectiveTitle || SITE} — ${SITE}`}
      />

      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={effectiveDescription} />
      <meta name="twitter:image" content={image} />
      <meta
        name="twitter:image:alt"
        content={`${effectiveTitle || SITE} — ${SITE}`}
      />

      <script type="application/ld+json">
        {JSON.stringify(SITEWIDE_ENTITY)}
      </script>
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
