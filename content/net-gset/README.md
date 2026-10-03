# NET / GSET Commerce practice bank

Published route: `/net-gset-commerce-tests`.

The bank contains 40 unit tests: 50 Easy, 50 Moderate, 50 Hard and 50 Extreme questions for each of the 10 official Commerce units. Ten 50-question combined tests and two 100-question subject mocks select Moderate and Hard questions from this bank. Mixed mocks deliberately reuse unit questions. They are original practice rather than official previous-year papers.

## Authorship and source scope

`unit-N.tsv` contains original foundational definitions and valid/invalid application statements. `advanced-N.tsv` contains original nuanced cases with plausible misconceptions. The generators assemble these records into MCQs, rotate choices, and generate original numericals. Learning targets and cases recur across levels: 2,000 distinct composite stems does not mean 2,000 independent source scenarios.

The supplied KVS Madaan Commerce Paper 2 book was read as reference material. Its PDF unit ranges are recorded in each item as broad unit references, not exact quotations or item-level page citations. The book's 2021–2023 paper sections include matching, multi-statement, calculation and other question formats. The official GSET Commerce Code 17 syllabus and UGC Commerce syllabus index are the scope references. Official paper archive indexes were consulted; a complete item-by-item study of every NET/GSET paper from 2016–2025 has **not** been verified. No ten-year frequency model or exact official-paper-equivalence claim is made.

Difficulty is an editorial task-demand estimate. Easy tests identify concepts. Moderate tests mix matching, assertion–reason and two-statement application. Hard uses three advanced case statements and multi-step calculations. Extreme uses five advanced case statements and longer calculations. These labels have not been empirically calibrated with candidate results or independently reviewed by a subject expert.

## Tax and legal context

Tax questions specify historical Income-tax Act, 1961 / AY 2025–26 / old-regime assumptions where relevant. Transition statements specify their own context. The Income-tax Department's transition FAQ was checked; the 2025 Act is not silently treated as the 1961 Act. Supplied rates in hypothetical computations are assumptions, not representations of current statutory rates. Current-year ordinary business loss and brought-forward business loss have different set-off scope; the latter was checked against the Department's loss FAQ and section 72 reference. Current company-law deadlines, monetary-policy rates, tax slabs, penalty amounts and similar changing figures are not inferred from old book answers.

## Verification

Run:

```sh
node scripts/net-gset/build-bank.mjs
node scripts/net-gset/audit-bank.mjs
node scripts/net-gset/verify-numericals.mjs
npm run quality:audit
npm run build
node scripts/net-gset/browser-check.mjs
```

The browser check uses Playwright. Optional `SSC_PLAYWRIGHT_MODULE`, `SSC_BROWSER_EXECUTABLE` and `SSC_CHROMIUM_PACKAGE` variables select installed runtime dependencies without adding browser binaries to the repository.

The structural audit checks counts, unique stems and IDs, four distinct options, valid answer indexes, source IDs, tax scope, identical mock/source records and balanced mock composition. All 210 numerical answer keys are independently recomputed from published stem inputs across 42 problem families, rather than accepted from the generator's stored expected answer. Browser checks exercise selection, review marks, answer clearing, navigation, saved attempts, expiry, submission and result review on desktop and mobile.

Structural and arithmetic checks are evidence of those properties, not proof that every judgement of wording, syllabus relevance or difficulty is flawless. Maintain the visible issue-report link and review reported ambiguities before changing the source record and incrementing manifest version. Incrementing version safely invalidates incompatible saved attempts.

## Delivery behaviour

The browser loads the manifest and only the selected test. Answers and explanations appear after submission in the normal interface. Correct answers score two; incorrect and unanswered score zero. There is no server-side examination security claim: static question JSON includes answer keys. The deadline persists in browser storage and keeps running when the learner leaves. Storage failure does not prevent a test from working, but progress cannot then survive reload. Paper 1 is separate from these subject mocks; equal per-unit weight and practice durations are design choices, not predicted official weightage.
