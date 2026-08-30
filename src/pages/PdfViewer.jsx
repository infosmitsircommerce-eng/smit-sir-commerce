import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, FileWarning } from 'lucide-react';

export default function PdfViewer() {
  const [searchParams] = useSearchParams();
  const requestedFile = searchParams.get('file') || '';
  const title = searchParams.get('title') || 'Study Material';

  const fileUrl = useMemo(() => {
    const cleanPath = requestedFile.split('#')[0].split('?')[0];
    return cleanPath.startsWith('/materials/') && cleanPath.toLowerCase().endsWith('.pdf')
      ? cleanPath
      : '';
  }, [requestedFile]);

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
    <div className="min-h-screen py-6" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-container">
        <div className="card-paper p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/study-material" className="tile-paper p-2.5 flex-shrink-0" aria-label="Back to study material">
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--charcoal)' }} />
            </Link>
            <div className="min-w-0">
              <div className="text-xs mb-1" style={{ color: 'var(--gold)' }}>PDF Viewer</div>
              <h1 className="text-lg font-semibold truncate" style={{ color: 'var(--ink)' }}>{title}</h1>
            </div>
          </div>

          <div className="flex gap-2">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="tile-paper px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2" style={{ color: 'var(--charcoal)' }}>
              <ExternalLink className="w-4 h-4" /> Open directly
            </a>
            <a href={fileUrl} download className="btn-primary px-4 py-2.5 text-sm inline-flex items-center gap-2">
              <Download className="w-4 h-4" /> Download
            </a>
          </div>
        </div>

        <div className="card-paper overflow-hidden" style={{ height: 'calc(100vh - 190px)', minHeight: '650px' }}>
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
