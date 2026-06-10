// Ledger ornament — double hairline with a gold diamond, like a rule in an old account book
export default function SectionDivider() {
  return (
    <div className="relative h-0 overflow-visible pointer-events-none" aria-hidden="true">
      <div className="absolute left-1/2 -translate-x-1/2 -top-[5px] flex items-center gap-3" style={{ width: 'min(420px, 70vw)' }}>
        <div className="flex-1" style={{ height: '3px', borderTop: '1px solid rgba(184,135,47,0.35)', borderBottom: '1px solid rgba(184,135,47,0.18)' }} />
        <div style={{
          width: '7px', height: '7px', flexShrink: 0,
          background: 'linear-gradient(135deg, #C9A050, #B8872F)',
          transform: 'rotate(45deg)',
          boxShadow: '0 0 12px rgba(184,135,47,0.45)',
        }} />
        <div className="flex-1" style={{ height: '3px', borderTop: '1px solid rgba(184,135,47,0.35)', borderBottom: '1px solid rgba(184,135,47,0.18)' }} />
      </div>
    </div>
  );
}
