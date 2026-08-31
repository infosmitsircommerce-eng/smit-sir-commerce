import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, FileWarning } from 'lucide-react';

export default function PdfViewer() {
  const [searchParams] = useSearchParams();
  const requestedFile = searchParams.get('file') || '';
  const title = searchParams.get('title') || 'Study Material';
  const [online, setOnline] = useState(() => navigator.onLine);

  const fileUrl = useMemo(() => {
    const cleanPath = requestedFile.split('#')[0].split('?')[0];
    return cleanPath.startsWith('/materials/') && cleanPath.toLowerCase().endsWith('.pdf')
      ? cleanPath
      : '';
  }, [requestedFile]);

  useEffect(() => {
    const updateConnection = () => setOnline(navigator.onLine);
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    return () => {
      window.removeEventListener('online', updateConnection);
      window.removeEventListener('offline', updateConnection);
    };
  }, []);

  if (!fileUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-ivory)' }}>
        <div className="card-paper max-w-lg w-full p-8 text-center">
          <FileWarning className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--gold)' }} />
          <h1 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
            PDF not available
          </h1>
          <p className="mb-6" style={{ color: 'var(--muted)' }}>This PDF link is missing or invalid.</p>
          <Link to="/study-material" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Study Material
          </Link>
        </div>
      </div>
    );
  }

  const embeddedFile = `${fileUrl}#toolbar=1&navpanes=0&view=FitH`;

  return (
    <div className="min-h-screen py-3 sm:py-6" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-container">
        <div className="card-paper p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/study-material" className="tile-paper p-2.5 flex-shrink-0" aria-label="Back to study material">
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--charcoal)' }} />
            </Link>
            <div className="min-w-0">
              <div className="text-xs mb-1" style={{ color: 'var(--gold)' }}>PDF Viewer</div>
              <h1 className="text-lg font-semibold truncate" style={{ color: 'var(--ink)' }}>{title}</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="tile-paper min-h-11 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2" style={{ color: 'var(--charcoal)' }}>
              <ExternalLink className="w-4 h-4" /> Open directly
            </a>
            <a href={fileUrl} download className="btn-primary min-h-11 px-3 sm:px-4 py-2.5 text-xs sm:text-sm inline-flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download
            </a>
          </div>
        </div>

        <div className="md:hidden card-paper p-6 text-center">
          <FileWarning className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <h2 className="text-xl mb-2" style={{ color: 'var(--ink)' }}>Open the mobile PDF reader</h2>
          <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>For clear text and pinch-to-zoom controls, open this PDF in your phone's built-in viewer.</p>
          <p className="text-xs mb-5" style={{ color: online ? 'var(--subtle)' : '#b42318' }} role="status" aria-live="polite">
            {online ? 'Mobile-friendly file · usually under 600 KB' : 'You are offline. Reconnect to open this PDF.'}
          </p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" aria-disabled={!online} onClick={(event) => { if (!online) event.preventDefault(); }} className={`btn-primary w-full min-h-12 inline-flex items-center justify-center gap-2 ${online ? '' : 'opacity-50 cursor-not-allowed'}`}>
            <ExternalLink className="w-4 h-4" /> Read PDF now
          </a>
        </div>

        <div className="hidden md:block card-paper overflow-hidden" style={{ height: 'calc(100vh - 190px)', minHeight: '650px' }}>
          <object data={embeddedFile} type="application/pdf" className="w-full h-full" aria-label={title}>
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <FileWarning className="w-12 h-12 mb-4" style={{ color: 'var(--gold)' }} />
              <p className="mb-4" style={{ color: 'var(--muted)' }}>
                Your browser cannot show PDFs inside the page.
              </p>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Open PDF
              </a>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
}
