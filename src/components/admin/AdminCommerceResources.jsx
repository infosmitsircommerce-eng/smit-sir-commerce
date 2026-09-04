import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, FileText, Loader2, Save, Trash2, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  buildCommerceResourcePath,
  COMMERCE_DEGREES,
  COMMERCE_EXAMS,
  COMMERCE_RESOURCE_STAGES,
  COMMERCE_RESOURCE_TYPES,
  slugifyResource,
  validateCommerceResource,
} from '../lib/commerceResourceModel';

const emptyResource = () => ({
  title: '',
  slug: '',
  stage: 'college',
  university: '',
  degree: 'B.Com',
  semester: 1,
  exam: 'UGC NET Commerce',
  unit: 1,
  board: 'CBSE',
  classLevel: 11,
  subject: '',
  subjectCode: '',
  resourceType: 'Notes & PDF',
  description: '',
  academicYear: '',
  sourceLabel: '',
  externalUrl: '',
  storagePath: '',
  fileUrl: '',
  isOfficial: false,
  isFree: true,
  pages: '',
  keyTopicsText: '',
  notes: '',
  seoTitle: '',
  seoDescription: '',
  publishedAt: '',
  _rowId: null,
});

function resourceSlugSeed(form) {
  if (form.stage === 'college') {
    return [form.title, form.university, form.degree, form.semester ? `sem-${form.semester}` : ''].filter(Boolean).join(' ');
  }
  if (form.stage === 'competitive') {
    return [form.title, form.exam, form.unit ? `unit-${form.unit}` : 'syllabus'].filter(Boolean).join(' ');
  }
  return [form.title, form.board, form.classLevel ? `class-${form.classLevel}` : ''].filter(Boolean).join(' ');
}

function storageFolder(form) {
  if (form.stage === 'college') {
    return [
      'college',
      slugifyResource(form.university || 'university'),
      slugifyResource(form.degree || 'commerce'),
      `semester-${Number(form.semester) || 0}`,
      slugifyResource(form.subject || 'subject'),
    ].join('/');
  }
  if (form.stage === 'competitive') {
    return [
      'competitive',
      slugifyResource(form.exam || 'commerce-exam'),
      form.unit ? `unit-${Number(form.unit)}` : 'syllabus',
    ].join('/');
  }
  return [
    'school',
    slugifyResource(form.board || 'board'),
    form.classLevel ? `class-${Number(form.classLevel)}` : 'class',
    slugifyResource(form.subject || 'subject'),
  ].join('/');
}

function rowToForm(row) {
  const payload = row.payload || {};
  return {
    ...emptyResource(),
    ...payload,
    slug: row.slug,
    keyTopicsText: Array.isArray(payload.keyTopics) ? payload.keyTopics.join('\n') : '',
    _rowId: row.id,
  };
}

export default function AdminCommerceResources({ user }) {
  const [form, setForm] = useState(emptyResource);
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoadingItems(true);
    const { data } = await supabase
      .from('content_items')
      .select('id,slug,status,payload,updated_at')
      .eq('type', 'resource')
      .order('updated_at', { ascending: false })
      .limit(300);
    setItems(data || []);
    setLoadingItems(false);
  };

  useEffect(() => { load(); }, []);

  const preview = useMemo(() => {
    const slug = slugifyResource(form.slug || resourceSlugSeed(form) || 'resource');
    return buildCommerceResourcePath({ ...form, slug });
  }, [form]);

  const patch = (next) => setForm((current) => ({ ...current, ...next }));

  const save = async (status) => {
    setMessage('');
    const publishing = status === 'published';
    const slug = slugifyResource(form.slug || resourceSlugSeed(form));
    let next = {
      ...form,
      slug,
      pages: form.pages ? Number(form.pages) : null,
      keyTopics: form.keyTopicsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const prospective = {
      ...next,
      fileUrl: next.fileUrl || (file ? 'pending-upload' : ''),
      path: buildCommerceResourcePath({ ...next, slug }),
    };
    const errors = validateCommerceResource(prospective, { publishing });
    if (!slug) errors.push('A URL slug could not be created.');
    if (file) {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) errors.push('Only PDF uploads are supported in the Commerce materials bucket.');
      if (file.size > 25 * 1024 * 1024) errors.push('PDF must be 25 MB or smaller.');
    }
    if (errors.length) {
      setMessage(errors.join(' '));
      return;
    }

    setBusy(true);
    const previousStoragePath = next.storagePath || '';
    let uploadedStoragePath = '';
    try {
      if (file) {
        uploadedStoragePath = `${storageFolder(next)}/${Date.now()}-${slug}.pdf`;
        const upload = await supabase.storage
          .from('commerce-materials')
          .upload(uploadedStoragePath, file, {
            contentType: 'application/pdf',
            cacheControl: '3600',
            upsert: false,
          });
        if (upload.error) throw upload.error;

        const { data } = supabase.storage.from('commerce-materials').getPublicUrl(uploadedStoragePath);
        next = {
          ...next,
          storagePath: uploadedStoragePath,
          fileUrl: data?.publicUrl || '',
        };
      }

      next.path = buildCommerceResourcePath(next);
      next.updatedAt = new Date().toISOString();
      next.publishedAt = publishing ? (next.publishedAt || new Date().toISOString()) : next.publishedAt || '';

      const payload = {
        title: next.title.trim(),
        slug,
        stage: next.stage,
        university: next.stage === 'college' ? next.university.trim() : '',
        degree: next.stage === 'college' ? next.degree : '',
        semester: next.stage === 'college' ? Number(next.semester) : null,
        exam: next.stage === 'competitive' ? next.exam.trim() : '',
        unit: next.stage === 'competitive' && next.resourceType !== 'Official Syllabus' ? Number(next.unit) : null,
        board: next.stage === 'school' ? next.board.trim() : '',
        classLevel: next.stage === 'school' ? Number(next.classLevel) : null,
        subject: next.subject.trim(),
        subjectCode: next.subjectCode.trim(),
        resourceType: next.resourceType,
        description: next.description.trim(),
        academicYear: next.academicYear.trim(),
        sourceLabel: next.sourceLabel.trim(),
        externalUrl: next.externalUrl.trim(),
        storagePath: next.storagePath,
        fileUrl: next.fileUrl,
        isOfficial: Boolean(next.isOfficial),
        isFree: Boolean(next.isFree),
        pages: next.pages,
        keyTopics: next.keyTopics,
        notes: next.notes.trim(),
        seoTitle: next.seoTitle.trim(),
        seoDescription: next.seoDescription.trim(),
        path: next.path,
        publishedAt: next.publishedAt,
        updatedAt: next.updatedAt,
      };

      let result;
      if (next._rowId) {
        result = await supabase
          .from('content_items')
          .update({ slug, status, payload, updated_at: new Date().toISOString() })
          .eq('id', next._rowId);
      } else {
        result = await supabase
          .from('content_items')
          .insert({ slug, type: 'resource', status, payload, created_by: user.id, updated_at: new Date().toISOString() });
      }

      if (result.error) throw result.error;

      if (uploadedStoragePath && previousStoragePath && previousStoragePath !== uploadedStoragePath) {
        await supabase.storage.from('commerce-materials').remove([previousStoragePath]);
      }

      setMessage(
        publishing
          ? 'Published. The resource is live immediately; its sitemap and prerendered SEO copy refresh on the next production deployment.'
          : 'Draft saved. Draft resources stay out of the public library and search.'
      );
      setForm(emptyResource());
      setFile(null);
      await load();
    } catch (error) {
      if (uploadedStoragePath) await supabase.storage.from('commerce-materials').remove([uploadedStoragePath]);
      setMessage(`Save failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete ${row.payload?.title || row.slug}?`)) return;
    setBusy(true);
    const storagePath = row.payload?.storagePath;
    const { error } = await supabase.from('content_items').delete().eq('id', row.id);
    if (!error && storagePath) await supabase.storage.from('commerce-materials').remove([storagePath]);
    setBusy(false);
    setMessage(error ? `Delete failed: ${error.message}` : 'Resource deleted.');
    await load();
  };

  const edit = (row) => {
    setForm(rowToForm(row));
    setFile(null);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grid xl:grid-cols-[1.15fr_.85fr] gap-6">
      <section className="card-premium">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black tracking-widest text-gold-400">COMMERCE RESOURCE ENGINE</div>
            <h2 className="text-2xl font-bold text-white mt-1">Upload once. Place it correctly everywhere.</h2>
            <p className="text-sm text-navy-300 mt-2 max-w-2xl">Choose the learner stage and exact academic context. Published items become public resources; drafts remain private to the admin area.</p>
          </div>
          <FileText className="w-7 h-7 text-gold-400" />
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-6">
          <select className="input-field" value={form.stage} onChange={(e) => patch({ stage: e.target.value })}>
            {COMMERCE_RESOURCE_STAGES.map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
          </select>
          <select className="input-field" value={form.resourceType} onChange={(e) => patch({ resourceType: e.target.value })}>
            {COMMERCE_RESOURCE_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>

          {form.stage === 'college' && <>
            <input className="input-field" placeholder="University — e.g. HNGU" value={form.university} onChange={(e) => patch({ university: e.target.value })} />
            <select className="input-field" value={form.degree} onChange={(e) => patch({ degree: e.target.value })}>{COMMERCE_DEGREES.map((degree) => <option key={degree}>{degree}</option>)}</select>
            <select className="input-field" value={form.semester} onChange={(e) => patch({ semester: Number(e.target.value) })}>
              {Array.from({ length: form.degree === 'B.Com' ? 6 : 4 }, (_, index) => index + 1).map((semester) => <option key={semester} value={semester}>Semester {semester}</option>)}
            </select>
            <input className="input-field" placeholder="Exact subject name" value={form.subject} onChange={(e) => patch({ subject: e.target.value })} />
          </>}

          {form.stage === 'competitive' && <>
            <select className="input-field" value={form.exam} onChange={(e) => patch({ exam: e.target.value })}>{COMMERCE_EXAMS.map((exam) => <option key={exam}>{exam}</option>)}</select>
            {form.resourceType !== 'Official Syllabus'
              ? <select className="input-field" value={form.unit} onChange={(e) => patch({ unit: Number(e.target.value) })}>{Array.from({ length: 10 }, (_, index) => index + 1).map((unit) => <option key={unit} value={unit}>Commerce Unit {unit}</option>)}</select>
              : <div className="input-field flex items-center text-sm text-navy-400">Official syllabus · exam-level resource</div>}
            <input className="input-field md:col-span-2" placeholder="Subject / paper label — e.g. Commerce Paper 2" value={form.subject} onChange={(e) => patch({ subject: e.target.value })} />
          </>}

          {form.stage === 'school' && <>
            <select className="input-field" value={form.board} onChange={(e) => patch({ board: e.target.value })}><option>CBSE</option><option>GSEB</option><option>Other</option></select>
            <select className="input-field" value={form.classLevel} onChange={(e) => patch({ classLevel: Number(e.target.value) })}><option value="11">Class 11</option><option value="12">Class 12</option></select>
            <input className="input-field md:col-span-2" placeholder="Subject" value={form.subject} onChange={(e) => patch({ subject: e.target.value })} />
          </>}

          <input className="input-field md:col-span-2" placeholder="Resource title" value={form.title} onChange={(e) => patch({ title: e.target.value })} />
          <input className="input-field" placeholder="URL slug (optional)" value={form.slug} onChange={(e) => patch({ slug: slugifyResource(e.target.value) })} />
          <input className="input-field" placeholder="Subject code (optional)" value={form.subjectCode} onChange={(e) => patch({ subjectCode: e.target.value })} />
          <input className="input-field" placeholder="Academic year / session" value={form.academicYear} onChange={(e) => patch({ academicYear: e.target.value })} />
          <input className="input-field" placeholder="Source / publisher label" value={form.sourceLabel} onChange={(e) => patch({ sourceLabel: e.target.value })} />
          <input className="input-field" type="number" min="1" placeholder="PDF pages (optional)" value={form.pages} onChange={(e) => patch({ pages: e.target.value })} />
          <input className="input-field" placeholder="Verified external URL (optional)" value={form.externalUrl} onChange={(e) => patch({ externalUrl: e.target.value })} />
          <textarea className="input-field md:col-span-2 min-h-24" placeholder="Short description — what the student gets from this resource" value={form.description} onChange={(e) => patch({ description: e.target.value })} />
          <textarea className="input-field md:col-span-2 min-h-24" placeholder="Key topics — one per line" value={form.keyTopicsText} onChange={(e) => patch({ keyTopicsText: e.target.value })} />
          <textarea className="input-field md:col-span-2 min-h-24" placeholder="Study guidance / notes (optional)" value={form.notes} onChange={(e) => patch({ notes: e.target.value })} />
          <input className="input-field" placeholder="Custom SEO title (optional)" value={form.seoTitle} onChange={(e) => patch({ seoTitle: e.target.value })} />
          <input className="input-field" placeholder="Custom SEO description (optional)" value={form.seoDescription} onChange={(e) => patch({ seoDescription: e.target.value })} />
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-widest font-bold text-gold-400">Future public URL</div>
          <code className="text-xs text-navy-200 break-all mt-2 block">{preview}</code>
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-3 mt-5">
          <label className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 cursor-pointer">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-gold-400" />
              <div>
                <div className="font-semibold text-white">{file ? file.name : form.fileUrl ? 'Replace current PDF' : 'Upload PDF'}</div>
                <div className="text-xs text-navy-400 mt-1">PDF only · maximum 25 MB</div>
              </div>
            </div>
            <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <div className="flex flex-col gap-2 min-w-48">
            <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={form.isOfficial} onChange={(e) => patch({ isOfficial: e.target.checked })} /> Official-source material</label>
            <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={form.isFree} onChange={(e) => patch({ isFree: e.target.checked })} /> Free access</label>
          </div>
        </div>

        {form.fileUrl && <a href={form.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-xs text-gold-300 inline-flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5" /> Open current PDF</a>}

        {message && <div className="mt-5 p-4 rounded-xl bg-gold-500/10 text-gold-200 text-sm leading-6">{message}</div>}

        <div className="flex flex-wrap gap-2 mt-5">
          <button disabled={busy} onClick={() => save('draft')} className="btn-secondary inline-flex items-center gap-2"><Save className="w-4 h-4" /> Save draft</button>
          <button disabled={busy} onClick={() => save('published')} className="btn-primary inline-flex items-center gap-2">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Publish resource</button>
          {form._rowId && <button disabled={busy} onClick={() => { setForm(emptyResource()); setFile(null); setMessage('Edit cancelled.'); }} className="px-4 py-2 rounded-xl bg-white/5 text-white text-sm">Cancel edit</button>}
        </div>
      </section>

      <section className="card-premium">
        <div className="flex items-center justify-between gap-3">
          <div><h2 className="text-xl font-bold text-white">Commerce resource library</h2><p className="text-xs text-navy-400 mt-1">{items.length} admin-managed item{items.length === 1 ? '' : 's'}</p></div>
          <button onClick={load} className="text-xs text-gold-300">Refresh</button>
        </div>

        {loadingItems ? <div className="py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gold-400" /></div> :
          items.length === 0 ? <div className="mt-5 p-7 rounded-xl bg-white/5 text-navy-300 text-sm text-center">No college or competitive resources yet. Your first upload will appear here.</div> :
          <div className="space-y-3 mt-5 max-h-[78vh] overflow-y-auto pr-1">
            {items.map((row) => {
              const payload = row.payload || {};
              return (
                <article key={row.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-widest font-black ${row.status === 'published' ? 'text-emerald-400' : 'text-gold-400'}`}>{row.status}</span>
                        <span className="text-[10px] uppercase tracking-widest text-navy-400">{payload.stage}</span>
                      </div>
                      <div className="font-bold text-white mt-2">{payload.title || row.slug}</div>
                      <div className="text-xs text-navy-400 mt-1">{[payload.university, payload.degree, payload.semester ? `Sem ${payload.semester}` : null, payload.exam, payload.unit ? `Unit ${payload.unit}` : null, payload.subject].filter(Boolean).join(' · ')}</div>
                      {payload.path && <code className="block text-[10px] text-navy-500 break-all mt-2">{payload.path}</code>}
                    </div>
                    <div className="flex items-start gap-2 shrink-0">
                      {row.status === 'published' && payload.path && <a href={payload.path} target="_blank" rel="noopener noreferrer" className="text-emerald-300" title="Open live resource"><ExternalLink className="w-4 h-4" /></a>}
                      <button onClick={() => edit(row)} className="text-gold-300 text-xs">Edit</button>
                      <button onClick={() => remove(row)} className="text-red-400" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>}
      </section>
    </div>
  );
}
