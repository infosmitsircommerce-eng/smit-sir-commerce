import { ExternalLink, Newspaper } from 'lucide-react';

const publications = [
  {
    outlet: 'OnlineCultus',
    title: 'Why Resource Libraries Need a Clear Learning Path',
    description:
      'Smit Thaker explains how Learn → Recall → Apply → Review turns a collection of digital resources into a usable learning system for students.',
    url: 'https://www.onlinecultus.com/why-resource-libraries-need-a-clear-learning-path/',
    note: 'Published 17 September 2026',
  },
  {
    outlet: 'HandwritingTool',
    title: 'Why Handwritten Retrieval Still Matters in a Digital Study Workflow',
    description:
      'An editorial article by Smit Thaker on combining digital learning with handwritten recall, gap-checking and application practice.',
    url: 'https://www.handwritingtool.com/blog/why-handwritten-retrieval-still-matters-digital-study-workflow',
    note: 'Published September 2026',
  },
];

export default function PublishedWork() {
  return (
    <section className="section-padding" style={{ background: 'var(--paper, #fbfaf7)' }} aria-labelledby="published-work-heading">
      <div className="page-container">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <span className="eyebrow">Published work</span>
          <h2 id="published-work-heading" className="headline mt-6">
            Teaching ideas published <em>beyond this website.</em>
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-7" style={{ color: 'var(--muted)' }}>
            Independent publications are listed here only after they are live. Open the original article on the publisher&apos;s website and judge the work for yourself.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-4">
          {publications.map((publication) => (
            <article
              key={publication.url}
              className="card-paper p-5 sm:p-7"
              style={{ border: '1px solid rgba(184,135,47,0.22)' }}
            >
              <div className="flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between">
                <div className="flex gap-4 min-w-0">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.2)' }}
                    aria-hidden="true"
                  >
                    <Newspaper className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={1.9} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold uppercase tracking-[0.13em]" style={{ color: 'var(--gold)' }}>
                      {publication.outlet} · {publication.note}
                    </div>
                    <h3
                      className="text-lg sm:text-xl mt-2 leading-snug"
                      style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)', fontWeight: 800 }}
                    >
                      {publication.title}
                    </h3>
                    <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>
                      {publication.description}
                    </p>
                  </div>
                </div>

                <a
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-ink inline-flex items-center justify-center gap-2 flex-shrink-0"
                  aria-label={`Read ${publication.title} on ${publication.outlet}`}
                >
                  Read published article <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="max-w-3xl mx-auto text-center mt-6 text-xs sm:text-sm leading-6" style={{ color: 'var(--muted)' }}>
          This section is a record of verified external publications, not paid placement claims or invented media logos.
        </p>
      </div>
    </section>
  );
}
