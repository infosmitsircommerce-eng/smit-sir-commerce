import { Helmet } from "react-helmet-async";
import { hubByPath, materialByPath } from "../../data/seoMaterials";
import { gsebMaterials } from "../../data/gsebMaterials";
import { localTuitionService } from "../../data/localTuitionService";

const BASE = "https://www.smitsircommerce.in";
const DEFAULT_IMG = BASE + "/og-image.jpg";
const SITE = "Smit Sir Commerce";
const DEFAULT_DESCRIPTION =
  "Free Commerce study material, CBSE and GSEB PDF notes, chapter-wise practice, Commerce tools and optional teacher help from Smit Sir Commerce.";

const gsebMaterialByPath = Object.fromEntries(
  gsebMaterials.map((material) => [material.seo_path, material]),
);

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

  const accessLabel = material.is_free === false ? "Explore" : "Download free";
  const resourceLabel = material.type || "Notes PDF";
  return {
    title: `GSEB Class ${material.class_level} ${material.subject} Chapter ${material.chapterNumber} ${material.chapter} Notes PDF`,
    description: `${accessLabel} GSEB Class ${material.class_level} ${material.subject} Chapter ${material.chapterNumber} ${material.chapter} ${resourceLabel.toLowerCase()} from Smit Sir Commerce. ${material.description || "View the chapter resource online with clear subject-specific details."}`,
  };
}

function getLocalSearchMeta(path) {
  if (path !== "/commerce-coaching-mehsana") return null;
  return {
    title: localTuitionService.title,
    description: localTuitionService.description,
  };
}

function normalizePageTitle(value) {
  return String(value || "")
    .replace(new RegExp(`^${SITE}\\s*[|—–-]\\s*`, "i"), "")
    .replace(new RegExp(`\\s*[|—–-]\\s*${SITE}$`, "i"), "")
    .trim();
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
  const effectiveTitle = normalizePageTitle(searchMeta?.title || title);
  const effectiveDescription = searchMeta?.description || description;
  const titleAlreadyNamesSite = effectiveTitle.toLowerCase().includes(SITE.toLowerCase());
  const fullTitle = effectiveTitle
    ? titleAlreadyNamesSite
      ? effectiveTitle
      : normalizedPath === "/"
        ? `${SITE} | ${effectiveTitle}`
        : `${effectiveTitle} | ${SITE}`
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

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
