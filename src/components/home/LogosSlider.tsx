import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Atom, Database, Github, Triangle, Zap, type LucideIcon } from "lucide-react";

const technologies: Array<{ id: string; description: string; icon: LucideIcon; color: string; background: string }> = [
  {
    id: "react",
    description: "React",
    icon: Atom,
    color: "#087EA4",
    background: "#E9F8FC",
  },
  {
    id: "vite",
    description: "Vite",
    icon: Zap,
    color: "#646CFF",
    background: "#F0EFFF",
  },
  {
    id: "supabase",
    description: "Supabase",
    icon: Database,
    color: "#218B63",
    background: "#E9F8F1",
  },
  {
    id: "github",
    description: "GitHub",
    icon: Github,
    color: "#181717",
    background: "#F1F1F1",
  },
  {
    id: "vercel",
    description: "Vercel",
    icon: Triangle,
    color: "#111111",
    background: "#F1F1F1",
  },
];

export default function LogosSlider() {
  return (
    <section className="border-y border-stone-200/80 bg-white/70 py-8 sm:py-10" aria-labelledby="technology-strip-title">
      <div className="page-container">
        <div className="mb-5 flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--gold)" }}>Reliable by design</p>
            <h2 id="technology-strip-title" className="mt-1 text-lg font-black sm:text-xl" style={{ color: "var(--ink)" }}>Powered by modern, trusted technology</h2>
          </div>
          <p className="max-w-md text-xs leading-5 sm:text-right" style={{ color: "var(--muted)" }}>Fast delivery, secure student access and a smooth learning experience across devices.</p>
        </div>

        <div className="relative h-[88px] w-full overflow-hidden rounded-2xl border border-stone-200 bg-[#fbfaf7] shadow-[inset_0_1px_0_rgba(255,255,255,.9)]">
          <InfiniteSlider className="flex h-full w-full items-center" duration={28} gap={22} aria-label="Technology partners">
            {technologies.map((technology) => {
              const Icon = technology.icon;
              return (
              <div key={technology.id} className="flex w-36 shrink-0 items-center justify-center gap-3 rounded-xl border border-stone-200/80 bg-white px-4 py-3 shadow-sm sm:w-40">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ color: technology.color, background: technology.background }} aria-hidden="true">
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <span className="text-sm font-black" style={{ color: "var(--charcoal)" }}>{technology.description}</span>
              </div>
              );
            })}
          </InfiniteSlider>
          <ProgressiveBlur className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#fbfaf7] to-transparent sm:w-32" direction="left" blurIntensity={0.6} />
          <ProgressiveBlur className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#fbfaf7] to-transparent sm:w-32" direction="right" blurIntensity={0.6} />
        </div>
      </div>
    </section>
  );
}
