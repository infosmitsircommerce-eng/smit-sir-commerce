import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { examTomorrowChapters } from "../src/data/examTomorrow.js";

const BASE = "https://www.smitsircommerce.in";
const SITE = "Smit Sir Commerce";
const source = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
const distRoot = new URL("../dist/", import.meta.url);

function esc(value) {
  return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function schema(chapter, path) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: chapter ? chapter.title + " Exam Tomorrow Revision" : "Class 12 Business Studies Exam Tomorrow Revision",
    description: chapter ? "Fast CBSE Class 12 Business Studies revision for " + chapter.title + " with summary, important questions, keywords, mistakes and MCQ practice." : "Fast chapter-wise CBSE Class 12 Business Studies revision with summaries, important questions, MCQs, keywords and common mistakes.",
    url: BASE + path,
    educationalLevel: "Class 12",
    learningResourceType: ["Revision guide", "Quiz", "Practice questions"],
    teaches: chapter ? chapter.title : "CBSE Class 12 Business Studies",
    provider: { "@type": "EducationalOrganization", name: SITE, url: BASE + "/" }
  };
}

function chapterBody(chapter) {
  const summary = chapter.summary.map(function(item){ return "<li>" + esc(item) + "</li>"; }).join("");
  const mistakes = chapter.mistakes.map(function(item){ return "<li>" + esc(item) + "</li>"; }).join("");
  const important = chapter.important.map(function(item){ return "<li>" + esc(item) + "</li>"; }).join("");
  const quiz = chapter.quiz.map(function(item, index){
    const options = item.options.map(function(option){ return "<li>" + esc(option) + "</li>"; }).join("");
    return "<article><h3>Question " + (index + 1) + ": " + esc(item.q) + "</h3><ul>" + options + "</ul><p><strong>Explanation:</strong> " + esc(item.why) + "</p></article>";
  }).join("");
  return "<main class=\"page-container section-padding\" data-prerendered=\"exam-tomorrow\"><nav aria-label=\"Breadcrumb\"><a href=\"/\">Home</a> / <a href=\"/exam-tomorrow\">Exam Tomorrow</a> / " + esc(chapter.title) + "</nav><article><p><strong>Exam Tomorrow · Class 12 Business Studies · Chapter " + chapter.chapter + "</strong></p><h1>" + esc(chapter.title) + " Quick Revision</h1><p>" + esc(chapter.hook) + "</p><section><h2>60-second revision</h2><ul>" + summary + "</ul></section><section><h2>Keywords to remember</h2><p>" + chapter.keywords.map(esc).join(" · ") + "</p></section><section><h2>Common mistakes</h2><ul>" + mistakes + "</ul></section><section><h2>Important questions</h2><ol>" + important + "</ol></section><section><h2>Quick MCQ check</h2>" + quiz + "</section><p><a href=\"/cbse/class-12/business-studies-case-study-questions\">Practice Business Studies case studies</a> · <a href=\"/cbse/class-12/business-studies-important-questions\">Important questions</a> · <a href=\"/exam-mode\">Timed exam mode</a></p></article></main>";
}

function hubBody() {
  const chapters = examTomorrowChapters.map(function(chapter){
    return "<li><a href=\"/exam-tomorrow/" + chapter.slug + "\">Chapter " + chapter.chapter + ": " + esc(chapter.title) + "</a> — " + esc(chapter.hook) + "</li>";
  }).join("");
  return "<main class=\"page-container section-padding\" data-prerendered=\"exam-tomorrow-hub\"><article><p><strong>Exam Tomorrow · Class 12 Business Studies</strong></p><h1>Class 12 Business Studies Exam Tomorrow Revision</h1><p>Pick a chapter for a fast 60-second summary, important questions, keywords, common mistakes and an interactive three-question challenge with instant explanations.</p><section><h2>Choose a chapter</h2><ol>" + chapters + "</ol></section><p><a href=\"/cbse/class-12/business-studies-case-study-questions\">Business Studies case studies</a> · <a href=\"/exam-mode\">Timed exam mode</a> · <a href=\"/class-12-commerce-7-day-revision-plan\">7-day revision plan</a></p></article></main>";
}

function pageHtml(chapter, path) {
  const title = chapter ? chapter.title + " Quick Revision | Class 12 BST | " + SITE : "Class 12 Business Studies Exam Tomorrow Revision | " + SITE;
  const description = chapter ? "Revise " + chapter.title + " fast for CBSE Class 12 Business Studies with a 60-second summary, important questions, keywords, common mistakes and MCQ explanations." : "Exam tomorrow? Revise CBSE Class 12 Business Studies with chapter-wise summaries, important questions, MCQs, keywords and common mistakes.";
  const url = BASE + path;
  const robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const tags = "\n<meta name=\"description\" content=\"" + esc(description) + "\"><meta name=\"robots\" content=\"" + robots + "\"><meta name=\"googlebot\" content=\"" + robots + "\"><link rel=\"canonical\" href=\"" + esc(url) + "\"><meta property=\"og:type\" content=\"article\"><meta property=\"og:site_name\" content=\"" + SITE + "\"><meta property=\"og:title\" content=\"" + esc(title) + "\"><meta property=\"og:description\" content=\"" + esc(description) + "\"><meta property=\"og:url\" content=\"" + esc(url) + "\"><meta property=\"og:image\" content=\"" + BASE + "/og-image.jpg\"><meta name=\"twitter:card\" content=\"summary_large_image\"><meta name=\"twitter:title\" content=\"" + esc(title) + "\"><meta name=\"twitter:description\" content=\"" + esc(description) + "\"><meta name=\"twitter:image\" content=\"" + BASE + "/og-image.jpg\"><script type=\"application/ld+json\">" + JSON.stringify(schema(chapter, path)).replaceAll("<","\\u003c") + "</script>";
  const body = chapter ? chapterBody(chapter) : hubBody();
  return source.replace(/<title>.*?<\/title>/s, "<title>" + esc(title) + "</title>").replace("</head>", tags + "\n</head>").replace('<div id="root"></div>', '<div id="root">' + body + '</div>');
}

async function writeRoute(path, content) {
  const relative = path.replace(/^\//, "");
  const clean = join(distRoot.pathname, relative + ".html");
  const directory = join(distRoot.pathname, relative, "index.html");
  await mkdir(dirname(clean), { recursive: true });
  await mkdir(dirname(directory), { recursive: true });
  await writeFile(clean, content, "utf8");
  await writeFile(directory, content, "utf8");
}

await writeRoute("/exam-tomorrow", pageHtml(null, "/exam-tomorrow"));
for (const chapter of examTomorrowChapters) {
  const path = "/exam-tomorrow/" + chapter.slug;
  await writeRoute(path, pageHtml(chapter, path));
}
console.log("Pre-rendered Exam Tomorrow hub plus " + examTomorrowChapters.length + " chapter rescue pages.");
