import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, BrainCircuit, Download, ExternalLink, FileWarning, GraduationCap } from 'lucide-react';
import { getHubMaterials, seoMaterials } from '../data/seoMaterials';
import { getGrowthPagesForMaterial } from '../data/contentGrowth';

export default function PdfViewer() {
  const [searchParams] = useSearchParams();
  const requestedFile = searchParams.get('file') || '';
  const requestedTitle = searchParams.get('title') || 'Study Material';
  const [online, setOnline] = useState(() => navigator.onLine);

  const fileUrl = useMemo(() => {
    const cleanPath = requestedFile.split('#')[0].split('?')[0];
    return cleanPath.startsWith('/materials/') && cleanPath.toLowerCase().endsWith('.pdf') ? cleanPath : '';
  }, [requestedFile]);

  const material = useMemo(() => seoMaterials.find((item) => item.file_url === fileUrl) || null, [fileUrl]);
  const title = material?.title || requestedTitle;
  const siblings = material ? getHubMaterials(material.hubId) : [];
  const currentIndex = material ? siblings.findIndex((item) => item.id === material.id) : -1;
  const previous = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;
  const practicePages = material ? getGrowthPagesForMaterial(material.id).slice(0, 3) : [];

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
          <h1 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>PDF not available</h1>
          <p className="mb-6" style={{ color: 'var(--muted)' }}>This PDF link is missing or invalid.</p>
          <Link to="/cbse-notes" className="btn-primary inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Free Notes</Link>
        </div>
      </div>
    );
  }

  const backPath = material?.seo_path || '/study-material';
  const embeddedFile = `${fileUrl}#toolbar=1&navpanes=0&view=FitH`;

  return (
    <div className="min-h-screen py-3 sm:py-6" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-container pdf-learning-viewer">
        <div className="card-paper p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link to={backPath} className="tile-paper p-2.5 flex-shrink-0" aria-label="Back to chapter page">
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--charcoal)' }} />
            </Link>
            <div className="min-w-0">
              <div className="text-xs mb-1 font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>Step 1 · Read the notes</div>
              <h1 className="text-base sm:text-lg font-semibold truncate" style={{ color: 'var(--ink)' }}>{title}</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="tile-paper min-h-11 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2" style={{ color: 'var(--charcoal)' }}>
              <ExternalLink className="w-4 h-4" /> Open full
            </a>
            <a href={fileUrl} download className="btn-primary min-h-11 px-3 sm:px-4 py-2.5 text-xs sm:text-sm inline-flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download
            </a>
          </div>
        </div>

        {!online && (
          <div className="card-paper p-4 mb-3 text-sm" role="status" style={{ color: '#b42318', borderColor: '#f4c7c3' }}>
            You are offline. Reconnect to load the PDF; downloaded files can still be opened from your phone.
          </div>
        )}

        <div className="card-paper overflow-hidden pdf-reader-frame" style={{ height: 'clamp(560px, 74dvh, 920px)' }}>
          {online ? (
            <iframe src={embeddedFile} title={title} className="w-full h-full" style={{ border: 0, background: '#eef1f5' }} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-7">
              <FileWarning className="w-12 h-12 mb-4" style={{ color: 'var(--gold)' }} />
              <h2 className="text-xl mb-2" style={{ color: 'var(--ink)' }}>PDF waiting for connection</h2>
              <p className="text-sm max-w-md" style={{ color: 'var(--muted)' }}>Reconnect and this reader will become available without leaving the chapter flow.</p>
            </div>
          )}
        </div>

        <section className="card-paper p-5 sm:p-7 mt-4 sm:mt-5" aria-labelledby="pdf-next-step-heading">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Step 2 · Test your memory</span>
              <h2 id="pdf-next-step-heading" className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                Finished reading? Practise before moving on.
              </h2>
              <p className="text-sm mt-2 max-w-2xl" style={{ color: 'var(--muted)' }}>A short practice round right after reading is more useful than opening another PDF immediately.</p>
            </div>
            {material && <Link to={material.seo_path} className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: 'var(--gold)' }}>Chapter overview <ArrowRight className="w-4 h-4" /></Link>}
          </div>

          {practicePages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              {practicePages.map((page) => (
                <Link key={page.path} to={page.path} className="tile-paper p-4 min-h-20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0"><BrainCircuit className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)' }} /><span className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{page.label}</span></div>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <Link to="/daily-practice" className="tile-paper p-4 flex items-center justify-between gap-3"><span className="flex items-center gap-2 font-semibold text-sm" style={{ color: 'var(--ink)' }}><BrainCircuit className="w-5 h-5" style={{ color: 'var(--gold)' }} />Daily 10 Practice</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>
              <Link to="/exam-mode" className="tile-paper p-4 flex items-center justify-between gap-3"><span className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>Advanced Exam Mode</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 sm:mt-5 mb-5">
          <div className="card-paper p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4"><BookOpen className="w-5 h-5" style={{ color: 'var(--gold)' }} /><h2 className="text-xl" style={{ color: 'var(--ink)' }}>Continue the subject</h2></div>
            <div className="space-y-2">
              {previous && <Link to={previous.seo_path} className="tile-paper p-3 flex items-center gap-2 text-sm"><ArrowLeft className="w-4 h-4" style={{ color: 'var(--gold)' }} />Chapter {previous.chapterNumber}: {previous.chapter}</Link>}
              {next && <Link to={next.seo_path} className="tile-paper p-3 flex items-center justify-between gap-2 text-sm"><span>Chapter {next.chapterNumber}: {next.chapter}</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>}
              {!previous && !next && <Link to="/cbse-notes" className="tile-paper p-3 flex items-center justify-between gap-2 text-sm"><span>Browse all free CBSE notes</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>}
            </div>
          </div>

          <div className="card-paper p-5 sm:p-6" style={{ background: 'linear-gradient(135deg, #101828, #182230)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3 mb-3"><GraduationCap className="w-5 h-5" style={{ color: 'var(--gold-bright)' }} /><span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gold-bright)' }}>Step 3 · Get help if needed</span></div>
            <h2 className="text-xl sm:text-2xl mb-2" style={{ color: '#fff' }}>Still confused after reading?</h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted-on-ink)' }}>Don’t keep rereading the same page. Use a free demo class to understand the concept with guided explanation.</p>
            <Link to="/book-demo" className="btn-primary w-full min-h-12">Book Free Demo Class <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
