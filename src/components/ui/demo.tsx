"use client";

import React from "react";
import { ArrowRight, BookOpen, BrainCircuit, FileQuestion, Sparkles } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-[#faf6ee] via-white to-[#f7f4ed]">
      <ContainerScroll
        titleComponent={
          <div className="px-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-black tracking-[0.14em] text-amber-800">
              <Sparkles className="h-3.5 w-3.5" /> STUDY EXPERIENCE
            </span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl md:text-5xl">
              Everything you need to study Commerce,
              <br className="hidden sm:block" />
              <span className="mt-2 block text-4xl font-black leading-none text-slate-950 sm:text-5xl md:text-[5.5rem]">
                in one place.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Scroll to bring your notes, quizzes, test practice and Premium resources into focus.
            </p>
          </div>
        }
      >
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-950">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=82"
            alt="Students studying together with notebooks and laptops"
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-7 md:p-10">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] font-bold backdrop-blur-md sm:text-xs">
                <BookOpen className="h-3.5 w-3.5" /> Notes
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] font-bold backdrop-blur-md sm:text-xs">
                <FileQuestion className="h-3.5 w-3.5" /> Quizzes & Tests
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] font-bold backdrop-blur-md sm:text-xs">
                <BrainCircuit className="h-3.5 w-3.5" /> Smart Practice
              </span>
            </div>

            <p className="text-xs font-black tracking-[0.15em] text-amber-300 sm:text-sm">SMIT SIR COMMERCE</p>
            <h3 className="mt-2 max-w-2xl text-2xl font-black leading-tight sm:text-4xl md:text-5xl">
              Learn. Practise. Revise. Repeat.
            </h3>
            <a
              href="/study-material"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-50"
            >
              Explore study material <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}

const Demo = HeroScrollDemo;

export { Demo };
