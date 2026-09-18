import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, CheckCircle2, Clock3, FileQuestion, Flame, Target, Zap } from "lucide-react";
import SEO from "../components/ui/SEO";

const chapters = [
  "Nature and Significance of Management",
  "Principles of Management",
  "Business Environment",
  "Planning",
  "Organising",
  "Staffing",
  "Directing",
  "Controlling",
  "Financial Management",
  "Financial Markets",
  "Marketing Management",
  "Consumer Protection",
];

const rescue = [
  { icon: Zap, title: "60-Second Revision", text: "Recall the chapter before you open the book.", to: "/cbse/class-12/business-studies-important-questions" },
  { icon: Target, title: "Important Questions", text: "Focus first on questions worth practising.", to: "/cbse/class-12/business-studies-important-questions" },
  { icon: FileQuestion, title: "Case Study Practice", text: "Train the skill students actually struggle with.", to: "/cbse/class-12/business-studies-case-study-questions" },
  { icon: Brain, title: "MCQ Challenge", text: "Check what you remember without passive reading.", to: "/cbse/class-12/business-studies-mcq" },
  { icon: CheckCircle2, title: "Keywords & Common Mistakes", text: "Write answers with the terms examiners expect.", to: "/cbse/class-12/business-studies-case-study-keywords" },
  { icon: Clock3, title: "Exam Mode", text: "Finish with a timed test and a real score.", to: "/exam-mode" },
];

export default function ExamTomorrow() {
  const [chapter, setChapter] = useState(chapters[0]);
  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Class 12 Business Studies Exam Tomorrow Revision",
    description: "Fast CBSE Class 12 Business Studies revision with important questions, case studies, MCQs, keywords and timed practice.",
    educationalLevel: "Class 12",
    teaches: "CBSE Business Studies exam revision",
    provider: { "@type": "EducationalOrganization", name: "Smit Sir Commerce", url: "https://www.smitsircommerce.in/" }
  };
  return <>
    <SEO title="Class 12 Business Studies Exam Tomorrow Revision" description="Exam tomorrow? Revise CBSE Class 12 Business Studies fast with important questions, case studies, MCQs, keywords, common mistakes and timed practice." path="/exam-tomorrow" structuredData={schema} />
    <main className="page-container section-padding">
      <section className="card-paper p-6 sm:p-10 text-center max-w-5xl mx-auto">
        <span className="eyebrow"><Flame className="w-4 h-4 inline mr-1" /> Exam Tomorrow</span>
        <h1 className="mt-5">Don't study everything.<br/><em>Revise what matters.</em></h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto" style={{color:"var(--muted)"}}>A fast rescue desk for CBSE Class 12 Business Studies. Pick your chapter, revise actively, practise, then test yourself.</p>
        <div className="mt-7 max-w-xl mx-auto text-left">
          <label htmlFor="rescue-chapter" className="text-sm font-bold" style={{color:"var(--ink)"}}>Which chapter is worrying you?</label>
          <select id="rescue-chapter" value={chapter} onChange={e=>setChapter(e.target.value)} className="input-field mt-2 w-full">
            {chapters.map((item,i)=><option key={item} value={item}>Chapter {i+1} · {item}</option>)}
          </select>
          <p className="text-xs mt-2" style={{color:"var(--muted)"}}>Selected: {chapter}. Use the rescue path below in order.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-7">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div><span className="eyebrow">Your rescue path</span><h2 className="text-2xl sm:text-3xl mt-2" style={{fontFamily:"var(--font-serif)",color:"var(--ink)"}}>Read less. Recall more.</h2></div>
          <span className="text-xs font-semibold hidden sm:block" style={{color:"var(--muted)"}}>FREE · NO LOGIN NEEDED</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rescue.map(({icon:Icon,title,text,to},i)=><Link key={title} to={to} className="card-paper p-5 block group">
            <div className="flex items-start justify-between"><span className="w-10 h-10 rounded-full inline-flex items-center justify-center" style={{background:"var(--bg-ivory)",color:"var(--gold)"}}><Icon className="w-5 h-5"/></span><small style={{color:"var(--muted)"}}>0{i+1}</small></div>
            <h3 className="text-lg font-bold mt-4" style={{color:"var(--ink)"}}>{title}</h3>
            <p className="text-sm mt-2" style={{color:"var(--muted)"}}>{text}</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold mt-4" style={{color:"var(--gold)"}}>Start <ArrowRight className="w-4 h-4"/></span>
          </Link>)}
        </div>
      </section>

      <section className="card-paper max-w-5xl mx-auto mt-7 p-6 sm:p-8">
        <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">
          <div><span className="eyebrow">Still have time?</span><h2 className="text-2xl mt-2" style={{fontFamily:"var(--font-serif)",color:"var(--ink)"}}>Turn panic into a plan.</h2><p className="mt-2 text-sm" style={{color:"var(--muted)"}}>Use the 7-day revision plan when the exam is close but not literally tomorrow.</p></div>
          <Link to="/class-12-commerce-7-day-revision-plan" className="btn-primary inline-flex items-center justify-center gap-2">Open 7-day plan <BookOpen className="w-4 h-4"/></Link>
        </div>
      </section>
    </main>
  </>;
}
