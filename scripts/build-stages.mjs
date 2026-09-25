export const PREBUILD_STAGES = [
  {
    "name": "01-assets-search-inputs",
    "scripts": [
      "scripts/optimize-og-image.mjs",
      "scripts/apply-search-console-source-overrides.mjs"
    ]
  },
  {
    "name": "02-learning-data",
    "scripts": [
      "scripts/generate-public-quizzes.mjs",
      "scripts/audit-quizzes.mjs"
    ]
  },
  {
    "name": "03-pdf-assets",
    "scripts": [
      "scripts/sync-gset-pdfs.mjs",
      "scripts/generate-price-elasticity-pdf.mjs",
      "scripts/generate-direct-pdf-seo.mjs",
      "scripts/strengthen-price-elasticity-pdf-discovery.mjs",
      "scripts/generate-pdf-provenance.mjs"
    ]
  },
  {
    "name": "04-discovery-index",
    "scripts": [
      "scripts/generate-sitemap.mjs",
      "scripts/refresh-updated-sitemap-lastmods.mjs",
      "scripts/ensure-indexable-premium-sitemap.mjs"
    ]
  }
];

export const POSTBUILD_STAGES = [
  {
    "name": "05-public-prerender",
    "scripts": [
      "scripts/prerender-core-pages.mjs",
      "scripts/prerender-bst-premium.mjs",
      "scripts/prerender-commerce-expansion.mjs",
      "scripts/prerender-commerce-discovery.mjs",
      "scripts/prerender-commerce-resources.mjs",
      "scripts/prerender-seo.mjs",
      "scripts/inject-practice-links.mjs",
      "scripts/prerender-growth.mjs",
      "scripts/prerender-pyq.mjs",
      "scripts/prerender-authority.mjs",
      "scripts/prerender-teacher-guides-hub.mjs",
      "scripts/prerender-local-seo.mjs",
      "scripts/prerender-conversion.mjs",
      "scripts/prerender-marks-recovery.mjs",
      "scripts/prerender-tools.mjs",
      "scripts/prerender-trust.mjs",
      "scripts/prerender-silent-search.mjs",
      "scripts/prerender-genuine-traffic-pages.mjs",
      "scripts/prerender-local-action-pages.mjs"
    ]
  },
  {
    "name": "06-seo-policy-access",
    "scripts": [
      "scripts/prepare-adsense-static.mjs",
      "scripts/finalize-seo-html.mjs",
      "scripts/prerender-i18n.mjs",
      "scripts/strengthen-top-pages.mjs",
      "scripts/strengthen-adsense-readiness.mjs",
      "scripts/fix-adsense-policy-canonicals.mjs",
      "scripts/finalize-adsense-policy-pages.mjs",
      "scripts/resolve-final-seo-warnings.mjs",
      "scripts/finalize-gseb-economics-access.mjs",
      "scripts/prerender-quiz-discovery.mjs",
      "scripts/fix-final-canonicals.mjs"
    ]
  },
  {
    "name": "07-products-study-paths",
    "scripts": [
      "scripts/finalize-board-booster-store.mjs",
      "scripts/finalize-premium-transition.mjs",
      "scripts/connect-study-pathways.mjs",
      "scripts/install-static-download-tracking.mjs",
      "scripts/add-premium-why-section.mjs"
    ]
  },
  {
    "name": "08-content-search-winners",
    "scripts": [
      "scripts/strengthen-search-console-winners.mjs",
      "scripts/upgrade-business-environment-notes.mjs",
      "scripts/upgrade-accounting-equation-notes.mjs",
      "scripts/upgrade-controlling-notes.mjs",
      "scripts/upgrade-net-indirect-tax.mjs",
      "scripts/upgrade-national-income-calculator.mjs",
      "scripts/upgrade-debt-equity-ratio.mjs",
      "scripts/upgrade-factor-cost-market-price.mjs",
      "scripts/upgrade-online-batch.mjs",
      "scripts/upgrade-economics-tuition-mehsana.mjs",
      "scripts/upgrade-gseb-economics-tuition-mehsana.mjs",
      "scripts/upgrade-commerce-coaching-pathways.mjs",
      "scripts/upgrade-cbse-commerce-mehsana-proof.mjs",
      "scripts/upgrade-book-demo-trust.mjs",
      "scripts/consolidate-case-study-canonical.mjs",
      "scripts/upgrade-bst-case-study-hub.mjs",
      "scripts/upgrade-bst-chapter1-case-study.mjs",
      "scripts/upgrade-bst-chapter2-case-study.mjs",
      "scripts/upgrade-bst-planning-case-study.mjs",
      "scripts/upgrade-bst-mcq-hub.mjs",
      "scripts/upgrade-gseb-growth-indicators.mjs",
      "scripts/upgrade-gseb-foreign-trade-mcq.mjs",
      "scripts/upgrade-mehsana-student-resources.mjs"
    ]
  },
  {
    "name": "09-sharing-brand-links",
    "scripts": [
      "scripts/add-resource-sharing.mjs",
      "scripts/clean-homepage-student-language.mjs",
      "scripts/optimize-search-console-ctr.mjs",
      "scripts/strengthen-brand-authority.mjs",
      "scripts/normalize-internal-links.mjs"
    ]
  },
  {
    "name": "10-final-validation",
    "scripts": [
      "scripts/normalize-premium-pricing.mjs",
      "scripts/final-adsense-polish.mjs",
      "scripts/dedupe-structured-data.mjs",
      "scripts/audit-adsense-content.mjs",
      "scripts/audit-seo-integrity.mjs",
      "scripts/tests/architecture-contracts.mjs",
      "scripts/tests/critical-journeys.mjs"
    ]
  }
];

export const BUILD_STAGES = [...PREBUILD_STAGES, ...POSTBUILD_STAGES];
