const pptxgen = require("pptxgenjs");

// ─── COLORS ───────────────────────────────────────────────────────
const C = {
  bg:        "030112",   // deep navy (matches website)
  card:      "0A0E2A",   // slightly lighter navy for cards
  cardBorder:"1A2060",   // card border
  gold:      "D4AF37",   // primary gold
  goldLight: "F0C040",   // lighter gold
  white:     "FFFFFF",
  muted:     "8899BB",   // muted text
  dim:       "3A4A70",   // very dim (separators)
  green:     "10B981",   // for "exam tip" highlights
  accent:    "6366F1",   // indigo accent
};

// Reusable shadow factory (NEVER reuse — pptxgen mutates in-place)
const shadow = () => ({ type: "outer", color: "000000", blur: 18, offset: 4, angle: 135, opacity: 0.35 });
const softShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.2 });

// ─── HELPER: Add branded header bar ──────────────────────────────
function addHeader(slide, title, subtitle) {
  // Top gold accent line
  slide.addShape("rect", { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.gold } });

  // Header left gold bar
  slide.addShape("rect", { x: 0.45, y: 0.18, w: 0.07, h: 0.55, fill: { color: C.gold } });

  // Slide title
  slide.addText(title, {
    x: 0.62, y: 0.13, w: 7.5, h: 0.65,
    fontSize: 24, bold: true, color: C.white,
    fontFace: "Calibri", margin: 0, valign: "middle",
  });

  // Subtitle / chapter label
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.62, y: 0.72, w: 7.5, h: 0.3,
      fontSize: 11, color: C.muted, fontFace: "Calibri",
      margin: 0, charSpacing: 1,
    });
  }

  // Logo text top-right
  slide.addShape("rect", {
    x: 8.4, y: 0.14, w: 1.4, h: 0.6,
    fill: { color: C.gold, transparency: 85 },
    line: { color: C.gold, width: 1 },
    rectRadius: 0.08,
  });
  slide.addText("SMIT SIR\nCOMMERCE", {
    x: 8.4, y: 0.14, w: 1.4, h: 0.6,
    fontSize: 8, bold: true, color: C.gold,
    fontFace: "Calibri", align: "center", valign: "middle",
    charSpacing: 0.5,
  });

  // Divider line
  slide.addShape("line", { x: 0.45, y: 1.05, w: 9.1, h: 0, line: { color: C.dim, width: 0.8 } });
}

// ─── HELPER: Add bottom bar ───────────────────────────────────────
function addFooter(slide, pageNum, totalPages, chapterName) {
  slide.addShape("rect", { x: 0, y: 5.3, w: 10, h: 0.32, fill: { color: C.card } });
  slide.addShape("rect", { x: 0, y: 5.3, w: 10, h: 0.015, fill: { color: C.dim } });

  slide.addText(chapterName || "Smit Sir Commerce", {
    x: 0.4, y: 5.3, w: 7, h: 0.32,
    fontSize: 9, color: C.muted, fontFace: "Calibri", valign: "middle", margin: 0,
  });
  slide.addText(`${pageNum} / ${totalPages}`, {
    x: 8.5, y: 5.3, w: 1.1, h: 0.32,
    fontSize: 9, color: C.gold, fontFace: "Calibri",
    align: "right", valign: "middle", margin: 0,
  });
}

// ─── HELPER: Gold card ────────────────────────────────────────────
function addCard(slide, x, y, w, h) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: C.card },
    line: { color: C.cardBorder, width: 1 },
    shadow: softShadow(),
  });
}

// ─── HELPER: Gold number circle ──────────────────────────────────
function addNumberCircle(slide, num, x, y) {
  slide.addShape("ellipse", {
    x, y, w: 0.38, h: 0.38,
    fill: { color: C.gold },
  });
  slide.addText(String(num), {
    x, y, w: 0.38, h: 0.38,
    fontSize: 13, bold: true, color: C.bg,
    fontFace: "Calibri", align: "center", valign: "middle", margin: 0,
  });
}

// ─── HELPER: Gold dot bullet row ─────────────────────────────────
function addBulletRow(slide, text, x, y, w) {
  slide.addShape("ellipse", {
    x: x, y: y + 0.08, w: 0.1, h: 0.1,
    fill: { color: C.gold },
  });
  slide.addText(text, {
    x: x + 0.2, y: y, w: w - 0.2, h: 0.3,
    fontSize: 13, color: C.white, fontFace: "Calibri", margin: 0, valign: "middle",
  });
}

// ═══════════════════════════════════════════════════════════════════
// BUILD PRESENTATION
// ═══════════════════════════════════════════════════════════════════
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Smit Sir Commerce — Lecture Template";
pres.author = "Smit Sir Commerce";

const CHAPTER = "Chapter Name Here";
const SUBJECT = "Accountancy / Business Studies / Economics";
const CLASS   = "Class 12";
const TOTAL   = 9;

// ──────────────────────────────────────────────────────────────────
// SLIDE 1 — TITLE SLIDE
// ──────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Big decorative gold circles (bg)
  s.addShape("ellipse", { x: 7.5, y: -1.5, w: 5, h: 5, fill: { color: C.gold, transparency: 92 }, line: { color: "000000", width: 0 } });
  s.addShape("ellipse", { x: -1.5, y: 3.5, w: 4, h: 4, fill: { color: C.accent, transparency: 92 }, line: { color: "000000", width: 0 } });

  // Top full gold bar
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.05, fill: { color: C.gold } });

  // Left thick gold accent
  s.addShape("rect", { x: 0.5, y: 1.1, w: 0.1, h: 3.2, fill: { color: C.gold } });

  // "Smit Sir Commerce" brand label
  s.addText("SMIT SIR COMMERCE", {
    x: 0.78, y: 1.1, w: 8, h: 0.45,
    fontSize: 13, color: C.gold, bold: true, fontFace: "Calibri",
    charSpacing: 6, margin: 0,
  });

  // Subject + class pill
  s.addShape("rect", {
    x: 0.78, y: 1.6, w: 2.4, h: 0.38,
    fill: { color: C.gold, transparency: 85 },
    line: { color: C.gold, width: 1 },
  });
  s.addText(`${SUBJECT.split("/")[0].trim()}  •  ${CLASS}`, {
    x: 0.78, y: 1.6, w: 2.4, h: 0.38,
    fontSize: 10, color: C.gold, fontFace: "Calibri",
    align: "center", valign: "middle", margin: 0,
  });

  // Chapter name (HUGE)
  s.addText(CHAPTER, {
    x: 0.78, y: 2.1, w: 8.5, h: 1.5,
    fontSize: 46, bold: true, color: C.white,
    fontFace: "Calibri", valign: "middle", margin: 0,
  });

  // Tagline
  s.addText("Clear Concepts · Real Examples · Board Exam Focused", {
    x: 0.78, y: 3.65, w: 8, h: 0.4,
    fontSize: 13, color: C.muted, fontFace: "Calibri", margin: 0, charSpacing: 1,
  });

  // Bottom gold line
  s.addShape("rect", { x: 0, y: 5.58, w: 10, h: 0.045, fill: { color: C.gold } });

  // Bottom footer text
  s.addText("smitsircommerce.vercel.app", {
    x: 0.5, y: 5.25, w: 5, h: 0.3,
    fontSize: 9, color: C.muted, fontFace: "Calibri", margin: 0,
  });
}

// ──────────────────────────────────────────────────────────────────
// SLIDE 2 — WHAT WE WILL LEARN TODAY
// ──────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "What We Will Learn Today", `${CHAPTER}  •  ${CLASS}`);
  addFooter(s, 2, TOTAL, CHAPTER);

  const topics = [
    "Introduction & Meaning",
    "Key Concepts & Definitions",
    "Important Formulas",
    "Real-Life Examples",
    "Common Mistakes to Avoid",
    "Board Exam Important Points",
  ];

  topics.forEach((topic, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    const x = col === 0 ? 0.5 : 5.3;
    const y = 1.35 + row * 1.1;

    addCard(s, x, y, 4.5, 0.8);
    // left gold bar
    s.addShape("rect", { x, y, w: 0.07, h: 0.8, fill: { color: C.gold } });
    addNumberCircle(s, i + 1, x + 0.2, y + 0.21);
    s.addText(topic, {
      x: x + 0.72, y: y, w: 3.6, h: 0.8,
      fontSize: 14, color: C.white, fontFace: "Calibri",
      valign: "middle", margin: 0,
    });
  });
}

// ──────────────────────────────────────────────────────────────────
// SLIDE 3 — KEY DEFINITION
// ──────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Key Definition", `${CHAPTER}  •  ${CLASS}`);
  addFooter(s, 3, TOTAL, CHAPTER);

  // Big quote / definition card
  s.addShape("rect", {
    x: 0.5, y: 1.25, w: 9, h: 2.1,
    fill: { color: C.card },
    line: { color: C.gold, width: 2 },
    shadow: shadow(),
  });
  // Top-left gold corner accent
  s.addShape("rect", { x: 0.5, y: 1.25, w: 0.12, h: 2.1, fill: { color: C.gold } });

  // Large quote mark
  s.addText("“", {
    x: 0.75, y: 1.1, w: 1, h: 1,
    fontSize: 72, color: C.gold, fontFace: "Georgia",
    margin: 0, valign: "top",
  });

  // Definition text
  s.addText("Write the definition of your concept here. Keep it simple — one or two sentences maximum. Students should be able to remember this easily.", {
    x: 1.0, y: 1.55, w: 8.1, h: 1.4,
    fontSize: 18, color: C.white, fontFace: "Calibri",
    valign: "middle", margin: 0, italic: true,
  });

  // "According to NCERT" tag
  s.addShape("rect", {
    x: 0.5, y: 3.55, w: 2.5, h: 0.35,
    fill: { color: C.gold, transparency: 85 },
    line: { color: C.gold, width: 1 },
  });
  s.addText("According to NCERT", {
    x: 0.5, y: 3.55, w: 2.5, h: 0.35,
    fontSize: 10, color: C.gold, fontFace: "Calibri",
    align: "center", valign: "middle", margin: 0, bold: true,
  });

  // Memory tip card
  addCard(s, 0.5, 4.05, 9, 0.9);
  s.addShape("rect", { x: 0.5, y: 4.05, w: 0.07, h: 0.9, fill: { color: C.green } });
  s.addText("Memory Tip:", {
    x: 0.72, y: 4.05, w: 1.4, h: 0.9,
    fontSize: 12, bold: true, color: C.green,
    fontFace: "Calibri", valign: "middle", margin: 0,
  });
  s.addText("Write a simple trick or mnemonic to remember this definition.", {
    x: 2.1, y: 4.05, w: 7.2, h: 0.9,
    fontSize: 12, color: C.white, fontFace: "Calibri",
    valign: "middle", margin: 0,
  });
}

// ──────────────────────────────────────────────────────────────────
// SLIDE 4 — THEORY CONTENT (two-column)
// ──────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Main Concepts", `${CHAPTER}  •  ${CLASS}`);
  addFooter(s, 4, TOTAL, CHAPTER);

  // Left column
  addCard(s, 0.5, 1.2, 4.3, 3.8);
  s.addShape("rect", { x: 0.5, y: 1.2, w: 4.3, h: 0.07, fill: { color: C.gold } });
  s.addText("Point 1 — Heading", {
    x: 0.65, y: 1.25, w: 4.0, h: 0.5,
    fontSize: 14, bold: true, color: C.gold,
    fontFace: "Calibri", margin: 0, valign: "middle",
  });

  const leftPoints = [
    "Explain your first concept here clearly",
    "Use simple language — no complicated words",
    "One idea per bullet point only",
    "Keep each point under 10 words",
  ];
  leftPoints.forEach((pt, i) => {
    addBulletRow(s, pt, 0.65, 1.85 + i * 0.55, 3.9);
  });

  // Right column
  addCard(s, 5.2, 1.2, 4.3, 3.8);
  s.addShape("rect", { x: 5.2, y: 1.2, w: 4.3, h: 0.07, fill: { color: C.accent } });
  s.addText("Point 2 — Heading", {
    x: 5.35, y: 1.25, w: 4.0, h: 0.5,
    fontSize: 14, bold: true, color: "A5B4FC",
    fontFace: "Calibri", margin: 0, valign: "middle",
  });

  const rightPoints = [
    "Explain your second concept here",
    "Connect it to real-life if possible",
    "Compare with the first concept",
    "Add a board exam angle here",
  ];
  rightPoints.forEach((pt, i) => {
    s.addShape("ellipse", {
      x: 5.35, y: 1.93 + i * 0.55, w: 0.1, h: 0.1,
      fill: { color: "6366F1" },
    });
    s.addText(pt, {
      x: 5.55, y: 1.85 + i * 0.55, w: 3.8, h: 0.3,
      fontSize: 13, color: C.white, fontFace: "Calibri", margin: 0, valign: "middle",
    });
  });
}

// ──────────────────────────────────────────────────────────────────
// SLIDE 5 — FORMULA / CALCULATION
// ──────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Formula & Calculation", `${CHAPTER}  •  ${CLASS}`);
  addFooter(s, 5, TOTAL, CHAPTER);

  // Formula box (big, centered, gold-bordered)
  s.addShape("rect", {
    x: 1.5, y: 1.3, w: 7, h: 1.5,
    fill: { color: "0D1035" },
    line: { color: C.gold, width: 3 },
    shadow: shadow(),
  });
  s.addText("Formula = Value A + Value B\n÷ Value C × 100", {
    x: 1.5, y: 1.3, w: 7, h: 1.5,
    fontSize: 26, bold: true, color: C.goldLight,
    fontFace: "Calibri", align: "center", valign: "middle", margin: 0,
  });

  // Formula label
  s.addShape("rect", {
    x: 3.8, y: 1.15, w: 2.4, h: 0.35,
    fill: { color: C.bg },
    line: { color: C.gold, width: 1 },
  });
  s.addText("FORMULA", {
    x: 3.8, y: 1.15, w: 2.4, h: 0.35,
    fontSize: 10, bold: true, color: C.gold,
    fontFace: "Calibri", align: "center", valign: "middle", margin: 0, charSpacing: 3,
  });

  // Three "where" explanation cards
  const vars = [
    { label: "Value A", desc: "Explain what this represents" },
    { label: "Value B", desc: "Explain what this represents" },
    { label: "Value C", desc: "Explain what this represents" },
  ];
  vars.forEach((v, i) => {
    const x = 0.5 + i * 3.15;
    addCard(s, x, 3.1, 2.8, 1.0);
    s.addShape("rect", { x, y: 3.1, w: 2.8, h: 0.07, fill: { color: C.gold } });
    s.addText(v.label, {
      x: x + 0.15, y: 3.2, w: 2.5, h: 0.4,
      fontSize: 15, bold: true, color: C.gold, fontFace: "Calibri", margin: 0,
    });
    s.addText(v.desc, {
      x: x + 0.15, y: 3.6, w: 2.5, h: 0.4,
      fontSize: 12, color: C.muted, fontFace: "Calibri", margin: 0,
    });
  });

  // Exam note
  addCard(s, 0.5, 4.35, 9, 0.65);
  s.addShape("rect", { x: 0.5, y: 4.35, w: 0.07, h: 0.65, fill: { color: C.green } });
  s.addText("⭐  Board Exam Note:", {
    x: 0.72, y: 4.35, w: 2.0, h: 0.65,
    fontSize: 11, bold: true, color: C.green,
    fontFace: "Calibri", valign: "middle", margin: 0,
  });
  s.addText("Write the specific way this formula appears in board exam questions here.", {
    x: 2.8, y: 4.35, w: 6.5, h: 0.65,
    fontSize: 11, color: C.white, fontFace: "Calibri",
    valign: "middle", margin: 0,
  });
}

// ──────────────────────────────────────────────────────────────────
// SLIDE 6 — REAL-LIFE EXAMPLE
// ──────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Real-Life Example", `${CHAPTER}  •  ${CLASS}`);
  addFooter(s, 6, TOTAL, CHAPTER);

  // Story banner
  s.addShape("rect", {
    x: 0.5, y: 1.2, w: 9, h: 0.55,
    fill: { color: C.card },
    line: { color: C.cardBorder, width: 1 },
  });
  s.addShape("rect", { x: 0.5, y: 1.2, w: 0.07, h: 0.55, fill: { color: C.gold } });
  s.addText("🏪   The Story:", {
    x: 0.72, y: 1.2, w: 2, h: 0.55,
    fontSize: 13, bold: true, color: C.gold, fontFace: "Calibri",
    valign: "middle", margin: 0,
  });
  s.addText("Rahul opened a small shop in Mehsana. Here's how this concept applies...", {
    x: 2.7, y: 1.2, w: 6.6, h: 0.55,
    fontSize: 13, color: C.white, fontFace: "Calibri",
    valign: "middle", margin: 0,
  });

  // Step-by-step process
  const steps = [
    { n: 1, title: "Situation",    desc: "Describe the real-world situation here in simple words." },
    { n: 2, title: "Application",  desc: "How does the concept apply to this situation?" },
    { n: 3, title: "Calculation",  desc: "Show the working if numbers are involved." },
    { n: 4, title: "Conclusion",   desc: "What does the result tell us? Relate back to the concept." },
  ];

  steps.forEach((step, i) => {
    const x = i < 2 ? 0.5 : 5.25;
    const y = i < 2 ? 2.0 + (i * 1.35) : 2.0 + ((i - 2) * 1.35);
    addCard(s, x, y, 4.4, 1.1);
    addNumberCircle(s, step.n, x + 0.18, y + 0.36);
    s.addText(step.title, {
      x: x + 0.72, y: y + 0.08, w: 3.5, h: 0.4,
      fontSize: 14, bold: true, color: C.gold,
      fontFace: "Calibri", margin: 0,
    });
    s.addText(step.desc, {
      x: x + 0.72, y: y + 0.5, w: 3.5, h: 0.5,
      fontSize: 11, color: C.muted, fontFace: "Calibri", margin: 0,
    });
  });
}

// ──────────────────────────────────────────────────────────────────
// SLIDE 7 — COMPARISON / DIFFERENCE TABLE
// ──────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Difference Between A and B", `${CHAPTER}  •  ${CLASS}`);
  addFooter(s, 7, TOTAL, CHAPTER);

  // Table header
  const headers = [
    [
      { text: "Basis", options: { bold: true, color: C.bg, fontSize: 13, fontFace: "Calibri", align: "center", fill: { color: C.gold } } },
      { text: "Concept A",    options: { bold: true, color: C.bg, fontSize: 13, fontFace: "Calibri", align: "center", fill: { color: C.gold } } },
      { text: "Concept B",   options: { bold: true, color: C.bg, fontSize: 13, fontFace: "Calibri", align: "center", fill: { color: C.gold } } },
    ],
  ];

  const rows = [
    ["Meaning",    "Write meaning of A here",     "Write meaning of B here"],
    ["Objective",  "Objective of A",               "Objective of B"],
    ["Nature",     "Nature of A",                  "Nature of B"],
    ["Example",    "Example of A",                 "Example of B"],
    ["Board Tip",  "How A appears in board exam",  "How B appears in board exam"],
  ];

  const tableData = [
    ...headers,
    ...rows.map((r, i) => r.map(cell => ({
      text: cell,
      options: {
        fontSize: 11, fontFace: "Calibri",
        color: i % 2 === 0 ? C.white : "C8D8FF",
        fill: { color: i % 2 === 0 ? C.card : "080F28" },
        align: "center", valign: "middle",
      },
    }))),
  ];

  s.addTable(tableData, {
    x: 0.5, y: 1.2, w: 9.0,
    rowH: 0.52,
    border: { pt: 1, color: C.dim },
    colW: [2.2, 3.4, 3.4],
  });
}

// ──────────────────────────────────────────────────────────────────
// SLIDE 8 — COMMON MISTAKES
// ──────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Common Mistakes Students Make", `${CHAPTER}  •  ${CLASS}`);
  addFooter(s, 8, TOTAL, CHAPTER);

  const mistakes = [
    { wrong: "Write a wrong approach here",    right: "Write the correct approach here" },
    { wrong: "Another common mistake here",    right: "The correct way to do it" },
    { wrong: "Third common mistake here",       right: "How to avoid it" },
  ];

  mistakes.forEach((m, i) => {
    const y = 1.25 + i * 1.3;

    // Wrong card (red tint)
    s.addShape("rect", {
      x: 0.5, y, w: 4.3, h: 1.0,
      fill: { color: "1A0A0A" },
      line: { color: "7F1D1D", width: 1.5 },
    });
    s.addShape("rect", { x: 0.5, y, w: 0.07, h: 1.0, fill: { color: "EF4444" } });
    s.addText("❌  Wrong:", {
      x: 0.72, y: y + 0.05, w: 1.5, h: 0.35,
      fontSize: 11, bold: true, color: "EF4444", fontFace: "Calibri", margin: 0,
    });
    s.addText(m.wrong, {
      x: 0.72, y: y + 0.42, w: 3.8, h: 0.45,
      fontSize: 12, color: C.white, fontFace: "Calibri", margin: 0, valign: "top",
    });

    // Arrow
    s.addShape("line", { x: 4.95, y: y + 0.5, w: 0.6, h: 0, line: { color: C.gold, width: 2.5 } });
    s.addText("→", {
      x: 4.87, y: y + 0.3, w: 0.5, h: 0.4,
      fontSize: 18, color: C.gold, fontFace: "Calibri", align: "center", margin: 0,
    });

    // Right card (green tint)
    s.addShape("rect", {
      x: 5.2, y, w: 4.3, h: 1.0,
      fill: { color: "061A10" },
      line: { color: "166534", width: 1.5 },
    });
    s.addShape("rect", { x: 5.2, y, w: 0.07, h: 1.0, fill: { color: C.green } });
    s.addText("✅  Correct:", {
      x: 5.42, y: y + 0.05, w: 1.6, h: 0.35,
      fontSize: 11, bold: true, color: C.green, fontFace: "Calibri", margin: 0,
    });
    s.addText(m.right, {
      x: 5.42, y: y + 0.42, w: 3.8, h: 0.45,
      fontSize: 12, color: C.white, fontFace: "Calibri", margin: 0, valign: "top",
    });
  });
}

// ──────────────────────────────────────────────────────────────────
// SLIDE 9 — BOARD EXAM QUESTIONS
// ──────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Full gold top bar (thicker on this slide)
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.gold } });

  addHeader(s, "Board Exam Questions", `${CHAPTER}  •  Important for Exam`);
  addFooter(s, 9, TOTAL, CHAPTER);

  const questions = [
    { marks: "1M",  q: "Write a one-mark question about this concept here." },
    { marks: "3M",  q: "Write a three-mark question — students must write 3 points." },
    { marks: "4M",  q: "Write a four-mark question with application or calculation." },
    { marks: "5M",  q: "Write a five-mark question — comparison, full explanation, or case study." },
    { marks: "HOT", q: "Higher Order Thinking — write a real-life scenario based question." },
  ];

  const markColors = { "1M": "10B981", "3M": "6366F1", "4M": "F59E0B", "5M": "EF4444", "HOT": C.gold };

  questions.forEach((q, i) => {
    const y = 1.15 + i * 0.83;
    const mc = markColors[q.marks];
    addCard(s, 0.5, y, 9.0, 0.72);
    // Mark badge
    s.addShape("rect", {
      x: 0.5, y, w: 0.7, h: 0.72,
      fill: { color: mc, transparency: 80 },
      line: { color: mc, width: 1 },
    });
    s.addText(q.marks, {
      x: 0.5, y, w: 0.7, h: 0.72,
      fontSize: 11, bold: true, color: mc,
      fontFace: "Calibri", align: "center", valign: "middle", margin: 0,
    });
    // Q number
    s.addText(`Q${i + 1}.`, {
      x: 1.35, y, w: 0.45, h: 0.72,
      fontSize: 13, bold: true, color: C.gold,
      fontFace: "Calibri", valign: "middle", margin: 0,
    });
    s.addText(q.q, {
      x: 1.8, y, w: 7.5, h: 0.72,
      fontSize: 13, color: C.white, fontFace: "Calibri",
      valign: "middle", margin: 0,
    });
  });
}

// ──────────────────────────────────────────────────────────────────
// WRITE FILE
// ──────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "SmitSirCommerce_LectureTemplate.pptx" })
  .then(() => console.log("✅  SmitSirCommerce_LectureTemplate.pptx created!"))
  .catch(err => console.error("Error:", err));
