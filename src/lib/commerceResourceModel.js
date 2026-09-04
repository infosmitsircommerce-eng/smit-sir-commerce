export const COMMERCE_RESOURCE_TYPES = [
  'Notes & PDF',
  'Official Syllabus',
  'MCQs',
  'Important Questions',
  'PYQ',
  'Mock Test',
  'Revision Sheet',
  'Formula Sheet',
  'Case Study',
  'Research Material',
];

export const COMMERCE_RESOURCE_STAGES = [
  { value: 'college', label: 'College Commerce' },
  { value: 'competitive', label: 'Competitive Commerce' },
  { value: 'school', label: 'School Commerce' },
];

export const COMMERCE_DEGREES = ['B.Com', 'M.Com'];
export const COMMERCE_EXAMS = ['UGC NET Commerce', 'GSET Commerce'];

export function slugifyResource(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

export function buildCommerceResourcePath(resource) {
  const slug = slugifyResource(resource.slug || resource.title || 'resource');

  if (resource.stage === 'college') {
    const university = slugifyResource(resource.university || 'university');
    const degree = slugifyResource(resource.degree || 'commerce');
    const semester = resource.semester ? `semester-${Number(resource.semester)}` : 'semester';
    const subject = slugifyResource(resource.subject || 'commerce');
    return `/college/${university}/${degree}/${semester}/${subject}/${slug}`;
  }

  if (resource.stage === 'competitive') {
    const exam = slugifyResource(resource.exam || 'commerce-exam');
    const unit = resource.unit ? `unit-${Number(resource.unit)}` : 'syllabus';
    return `/competitive/${exam}/${unit}/${slug}`;
  }

  const board = slugifyResource(resource.board || 'commerce');
  const classLevel = resource.classLevel ? `class-${Number(resource.classLevel)}` : 'school';
  const subject = slugifyResource(resource.subject || 'commerce');
  return `/school-resource/${board}/${classLevel}/${subject}/${slug}`;
}

export function commerceResourceContext(resource) {
  if (resource.stage === 'college') {
    return [
      resource.university,
      resource.degree,
      resource.semester ? `Semester ${resource.semester}` : null,
      resource.subject,
    ].filter(Boolean).join(' · ');
  }

  if (resource.stage === 'competitive') {
    return [
      resource.exam,
      resource.unit ? `Unit ${resource.unit}` : 'Syllabus / General',
      resource.subject,
    ].filter(Boolean).join(' · ');
  }

  return [
    resource.board,
    resource.classLevel ? `Class ${resource.classLevel}` : null,
    resource.subject,
  ].filter(Boolean).join(' · ');
}

export function normalizeCommerceResource(rowOrPayload = {}) {
  const row = rowOrPayload.payload ? rowOrPayload : null;
  const payload = row ? row.payload || {} : rowOrPayload;
  const slug = slugifyResource(row?.slug || payload.slug || payload.title || 'resource');
  const normalized = {
    ...payload,
    slug,
    status: row?.status || payload.status || 'published',
    updatedAt: row?.updated_at || payload.updatedAt || payload.updated_at || null,
  };
  normalized.path = payload.path || buildCommerceResourcePath(normalized);
  return normalized;
}

export function validateCommerceResource(resource, { publishing = false } = {}) {
  const errors = [];
  if (!resource.title?.trim()) errors.push('Add a resource title.');
  if (!resource.stage) errors.push('Choose School, College or Competitive.');
  if (!resource.resourceType) errors.push('Choose a resource type.');
  if (!resource.description?.trim()) errors.push('Add a short description.');

  if (resource.stage === 'college') {
    if (!resource.university?.trim()) errors.push('Add the university.');
    if (!COMMERCE_DEGREES.includes(resource.degree)) errors.push('Choose B.Com or M.Com.');
    if (!Number(resource.semester)) errors.push('Choose the semester.');
    if (!resource.subject?.trim()) errors.push('Add the exact subject.');
  }

  if (resource.stage === 'competitive') {
    if (!resource.exam?.trim()) errors.push('Choose or enter the exam.');
    if (resource.resourceType !== 'Official Syllabus' && !Number(resource.unit)) {
      errors.push('Choose the Commerce unit for non-syllabus exam material.');
    }
  }

  if (resource.stage === 'school') {
    if (!resource.board?.trim()) errors.push('Add the board.');
    if (![11, 12].includes(Number(resource.classLevel))) errors.push('Choose Class 11 or 12.');
    if (!resource.subject?.trim()) errors.push('Add the subject.');
  }

  if (resource.externalUrl && !/^https?:\/\//i.test(resource.externalUrl.trim())) {
    errors.push('External resource links must start with http:// or https://.');
  }

  if (resource.isOfficial && !resource.sourceLabel?.trim()) {
    errors.push('Official-source material needs a clear source or publisher label.');
  }

  const hasInlineMaterial = String(resource.notes || '').trim().length >= 120;
  if (publishing && !resource.fileUrl && !resource.externalUrl && !hasInlineMaterial) {
    errors.push('Published resources need an uploaded PDF, a verified external link, or at least 120 characters of real inline study material.');
  }

  return errors;
}

export function resourceSeoTitle(resource) {
  if (resource.stage === 'college') {
    const semester = resource.semester ? `Sem ${resource.semester}` : '';
    return [resource.title, resource.degree, semester, resource.university].filter(Boolean).join(' | ');
  }
  if (resource.stage === 'competitive') {
    return [resource.title, resource.exam, resource.unit ? `Unit ${resource.unit}` : null].filter(Boolean).join(' | ');
  }
  return [resource.title, resource.board, resource.classLevel ? `Class ${resource.classLevel}` : null].filter(Boolean).join(' | ');
}
