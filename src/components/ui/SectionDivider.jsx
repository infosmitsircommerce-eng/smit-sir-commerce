export default function SectionDivider() {
  return (
    <div className="relative h-px overflow-visible pointer-events-none">
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.15) 30%, rgba(245,158,11,0.35) 50%, rgba(245,158,11,0.15) 70%, transparent 100%)' }} />
      <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-48 h-6 rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)', filter: 'blur(4px)' }} />
    </div>
  );
}
