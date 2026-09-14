import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const file = join(process.cwd(), 'dist', 'gseb-class-11-accountancy-premium.html');
let html = await readFile(file, 'utf8');

if (html.includes('data-premium-why="free-lunch"')) {
  console.log('Premium Why section already present.');
  process.exit(0);
}

const anchor = '<section class="section"><div class="wrap"><div class="card" style="padding:30px"><span class="eyebrow">WHAT PREMIUM ADDS</span>';
if (!html.includes(anchor)) {
  throw new Error('Could not find Premium benefits section anchor.');
}

const whySection = `
    <section class="section" data-premium-why="free-lunch">
      <div class="wrap">
        <div style="background:linear-gradient(145deg,#0b1734,#1b315b);color:white;border-radius:28px;padding:clamp(26px,5vw,46px);box-shadow:0 24px 70px rgba(9,21,47,.18);position:relative;overflow:hidden">
          <div style="position:absolute;width:240px;height:240px;border-radius:50%;background:rgba(244,207,104,.10);right:-90px;top:-110px"></div>
          <span style="display:inline-flex;align-items:center;gap:8px;background:#f4cf68;color:#172033;padding:8px 13px;border-radius:999px;font-size:11px;font-weight:950;letter-spacing:.13em">WHY PREMIUM?</span>
          <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:clamp(34px,5vw,52px);line-height:1.05;letter-spacing:-.035em;margin:18px 0 10px;color:white">“There is no such thing as a free lunch.”</h2>
          <p style="font-size:17px;line-height:1.75;color:#d9e1ef;max-width:850px;margin:0">In economics, this famous idea reminds us that valuable resources always require someone's time, effort and cost. The free notes on Smit Sir Commerce will stay useful and genuinely free. <strong style="color:#f4cf68">Premium is for the student who wants the deeper layer</strong> — more explanation, more practice, more structure and more support inside one organised study system.</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-top:26px">
            <div style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.13);border-radius:16px;padding:16px"><strong style="display:block;color:#f4cf68;margin-bottom:6px">Detailed learning</strong><span style="color:#d9e1ef;font-size:13px;line-height:1.55">Deeper accounting explanations instead of short summary-only notes.</span></div>
            <div style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.13);border-radius:16px;padding:16px"><strong style="display:block;color:#f4cf68;margin-bottom:6px">Worked numericals</strong><span style="color:#d9e1ef;font-size:13px;line-height:1.55">Step-by-step working, accounting logic and final answers for practical chapters.</span></div>
            <div style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.13);border-radius:16px;padding:16px"><strong style="display:block;color:#f4cf68;margin-bottom:6px">Proper tables & formats</strong><span style="color:#d9e1ef;font-size:13px;line-height:1.55">Journal, Cash Book, Ledger, Trial Balance and other accounting formats presented correctly.</span></div>
            <div style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.13);border-radius:16px;padding:16px"><strong style="display:block;color:#f4cf68;margin-bottom:6px">Complete organised access</strong><span style="color:#d9e1ef;font-size:13px;line-height:1.55">All 10 Part 1 chapters, question-answer practice, MCQs, revision drills and the 720-page master book.</span></div>
          </div>
          <p style="margin:22px 0 0;color:#bac6da;font-size:13px;line-height:1.6"><strong style="color:white">Simple difference:</strong> Free helps you start learning. Premium is built for students who want to go further and practise seriously.</p>
        </div>
      </div>
    </section>

`;

html = html.replace(anchor, `${whySection}${anchor}`);
await writeFile(file, html, 'utf8');
console.log('Added Why Premium / free-lunch section.');
