import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const technologies = [
  {
    id: "react",
    description: "React",
    image: "https://cdn.simpleicons.org/react/087EA4",
  },
  {
    id: "vite",
    description: "Vite",
    image: "https://cdn.simpleicons.org/vite/646CFF",
  },
  {
    id: "supabase",
    description: "Supabase",
    image: "https://cdn.simpleicons.org/supabase/3FCF8E",
  },
  {
    id: "github",
    description: "GitHub",
    image: "https://cdn.simpleicons.org/github/181717",
  },
  {
    id: "vercel",
    description: "Vercel",
    image: "https://cdn.simpleicons.org/vercel/000000",
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
            {technologies.map((technology) => (
              <div key={technology.id} className="flex w-36 shrink-0 items-center justify-center gap-3 rounded-xl border border-stone-200/80 bg-white px-4 py-3 shadow-sm sm:w-40">
                <img
                  src={technology.image}
                  alt=""
                  width="28"
                  height="28"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 object-contain"
                />
                <span className="text-sm font-black" style={{ color: "var(--charcoal)" }}>{technology.description}</span>
              </div>
            ))}
          </InfiniteSlider>
          <ProgressiveBlur className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#fbfaf7] to-transparent sm:w-32" direction="left" blurIntensity={0.6} />
          <ProgressiveBlur className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#fbfaf7] to-transparent sm:w-32" direction="right" blurIntensity={0.6} />
        </div>
      </div>
    </section>
  );
}
