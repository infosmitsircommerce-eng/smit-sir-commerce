# Smit Sir Commerce — Six-Month Runbook

This is the minimum maintenance plan for keeping `www.smitsircommerce.in` stable without frequent development work.

## What is intentionally protected

- Production is deployed from the `main` branch on Vercel.
- The canonical production domain is `https://www.smitsircommerce.in`.
- NET/GSET PDFs are frozen into each production deployment during prebuild. The external Floot asset host is only a build-time source/fallback, not the normal student download path after a successful build.
- The production build already runs SEO, content, architecture and critical-journey audits.
- A daily GitHub Actions smoke test checks the homepage, study material, quizzes, NET/GSET library, sitemap, robots file, frozen PDF manifest and representative PDFs.

## Monthly 10-minute check

1. Open the homepage on mobile and desktop.
2. Open Study Material and one normal PDF.
3. Open Quizzes and complete one quiz.
4. Open `/net-gset-commerce` and open one Unit 1 and one Unit 10 PDF.
5. Check sign-in and one Premium screen if Premium is actively being sold.
6. If payments are active, perform a small real checkout only when necessary and verify access is granted correctly.
7. Check the GitHub Actions `Site health` workflow. A green latest run means the core public paths passed the automated smoke test.

## If the website suddenly looks old or broken

- First test in a private/incognito browser. Do not repeatedly redeploy just to clear a phone cache.
- Check the latest Vercel production deployment. If the newest deployment failed, do not keep pushing random fixes; restore or promote the last known-good production deployment.
- Check the GitHub Actions `Site health` failure output to see which route failed.
- If only one third-party feature fails, keep the rest of the site online and repair that dependency separately.

## Critical account settings that must remain valid

- Domain/DNS and Vercel project ownership.
- Supabase URL/keys used for authentication and Premium access.
- `SUPABASE_SERVICE_ROLE_KEY` if Premium Business Studies PDFs are being served from privileged Supabase storage.
- Cashfree credentials/webhook configuration if online payments are active.
- Google Analytics/Search Console/AdSense IDs if those services are being used.

Never commit secret keys, passwords, service-role keys, payment secrets or private tokens to this public GitHub repository.

## Safe change rule

For the next six months, prefer stability over redesigns. Make one small change at a time, wait for the production deployment to become READY, then test the affected route before making another change. Do not change the canonical domain, URL structure, payment flow, authentication system or Premium access logic without a specific reason and a rollback plan.

## Known non-blocking item

Vercel previously logged a Node `url.parse()` deprecation warning on `/api/premium-study`. No direct `url.parse()` call was found in the repository code, and recent production error/warning logs were clean. Treat it as dependency/platform technical debt unless it starts causing real failures.
