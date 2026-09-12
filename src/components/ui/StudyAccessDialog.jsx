import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import StudyAccessFinder from './StudyAccessFinder';

export default function StudyAccessDialog({ onClose }) {
  const panel = useRef(null);
  useEffect(() => {
    const previous = document.activeElement, overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; panel.current?.focus();
    return () => { document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus(); };
  }, []);
  function keyDown(event) {
    if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
    if (event.key !== 'Tab') return;
    const nodes = [...panel.current.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),summary')];
    const first = nodes[0], last = nodes.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return createPortal(<div className="fixed inset-0 z-[180] flex items-center justify-center p-3 sm:p-6" style={{ background: 'rgba(30,24,18,.72)' }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div role="dialog" aria-modal="true" aria-label="Quick access to notes and tests" tabIndex={-1} ref={panel} onKeyDown={keyDown} className="w-full max-w-3xl rounded-2xl overflow-y-auto p-3 sm:p-5" style={{ maxHeight: 'calc(100dvh - 24px)', background: 'var(--bg-ivory)', color: 'var(--ink)', overscrollBehavior: 'contain' }}>
      <div className="flex justify-end mb-2"><button type="button" onClick={onClose} aria-label="Close resource finder" className="btn-secondary min-h-11"><X className="w-4 h-4" /> Close</button></div>
      <StudyAccessFinder onNavigate={onClose} />
    </div>
  </div>, document.body);
}
