export default function SectionDivider() {
  return (
    <div className="relative h-0 overflow-visible pointer-events-none" aria-hidden="true">
      <div className="absolute left-1/2 -translate-x-1/2 -top-px h-px" style={{ width: 'min(760px, 78vw)', background: 'linear-gradient(90deg, transparent, rgba(183,121,31,0.18), rgba(224,167,43,0.52), rgba(183,121,31,0.18), transparent)' }} />
    </div>
  );
}
