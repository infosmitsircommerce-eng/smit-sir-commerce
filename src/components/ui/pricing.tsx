import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import NumberFlow from "@number-flow/react";
import { Check, Sparkles, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  name: string;
  price: number;
  alternatePrice?: number;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular?: boolean;
  eyebrow?: string;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
  showBillingToggle?: boolean;
}

export function Pricing({
  plans,
  title = "Choose the support you need",
  description = "Start free, then upgrade only when deeper exam practice helps you.",
  showBillingToggle = false,
}: PricingProps) {
  const [alternatePricing, setAlternatePricing] = useState(false);
  const switchRef = useRef<HTMLButtonElement>(null);

  async function celebrate(originElement: HTMLElement | null) {
    if (!originElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { default: confetti } = await import("canvas-confetti");
    const rect = originElement.getBoundingClientRect();
    confetti({
      particleCount: 30,
      spread: 52,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ["#B8872F", "#E7C66C", "#173B35", "#FFF4CF"],
      ticks: 110,
      gravity: 1.15,
      decay: 0.94,
      startVelocity: 22,
    });
  }

  function handleToggle(checked: boolean) {
    setAlternatePricing(checked);
    if (checked) void celebrate(switchRef.current);
  }

  return (
    <section className="relative overflow-hidden py-14 sm:py-20" aria-labelledby="pricing-title">
      <div className="page-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Clear student pricing</span>
          <h2 id="pricing-title" className="mt-5 text-3xl font-black tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 sm:text-lg" style={{ color: "var(--muted)" }}>{description}</p>
        </div>

        {showBillingToggle ? (
          <div className="mt-8 flex items-center justify-center gap-3">
            <Label htmlFor="pricing-mode">Standard</Label>
            <Switch id="pricing-mode" ref={switchRef} checked={alternatePricing} onCheckedChange={handleToggle} aria-label="Change pricing option" />
            <span className="text-sm font-bold" style={{ color: "var(--gold)" }}>Best value</span>
          </div>
        ) : null}

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:gap-4 lg:gap-6">
          {plans.map((plan) => {
            const displayedPrice = alternatePricing && plan.alternatePrice != null ? plan.alternatePrice : plan.price;
            return (
              <article
                key={plan.name}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-[1.6rem] border bg-white p-6 shadow-[0_12px_32px_rgba(44,34,22,0.07)] sm:p-7",
                  plan.isPopular ? "border-amber-500 ring-1 ring-amber-500/35" : "border-stone-200",
                )}
              >
                {plan.isPopular ? (
                  <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-2xl bg-[#173B35] px-3 py-2 text-xs font-black text-white">
                    <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" /> Best value
                  </div>
                ) : null}
                <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: "var(--gold)" }}>{plan.eyebrow || "STUDENT PLAN"}</p>
                <h3 className="mt-3 text-2xl font-black" style={{ color: "var(--ink)" }}>{plan.name}</h3>
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black tracking-tight" style={{ color: "var(--ink)" }}>
                    <NumberFlow value={displayedPrice} format={{ style: "currency", currency: "INR", maximumFractionDigits: 0 }} />
                  </span>
                  <span className="pb-1.5 text-xs font-bold" style={{ color: "var(--muted)" }}>{plan.period}</span>
                </div>
                <p className="mt-3 min-h-12 text-sm leading-6" style={{ color: "var(--muted)" }}>{plan.description}</p>
                <div className="my-5 h-px bg-stone-200" />
                <ul className="flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50"><Check className="h-3.5 w-3.5 text-emerald-700" strokeWidth={3} /></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.href}
                  onClick={(event) => plan.isPopular && void celebrate(event.currentTarget)}
                  className={cn(buttonVariants({ variant: plan.isPopular ? "default" : "outline", size: "lg" }), "mt-7 w-full")}
                >
                  {plan.buttonText}
                </Link>
              </article>
            );
          })}
        </div>
        <p className="mt-7 text-center text-xs leading-5" style={{ color: "var(--muted)" }}>No hidden subscription. Free resources remain free.</p>
      </div>
    </section>
  );
}
