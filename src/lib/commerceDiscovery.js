import { slugifyResource } from './commerceResourceModel.js';

function uniqueByPath(items) {
  const seen = new Map();
  for (const item of items) {
    const existing = seen.get(item.path);
    if (existing) {
      existing.count += item.count || 1;
      existing.resources = [...new Set([...(existing.resources || []), ...(item.resources || [])])];
    } else {
      seen.set(item.path, { ...item, count: item.count || 1 });
    }
  }
  return [...seen.values()];
}

export function collegeDegreePath(resource) {
  return `/college/${slugifyResource(resource.university)}/${slugifyResource(resource.degree)}`;
}

export function collegeSemesterPath(resource) {
  return `${collegeDegreePath(resource)}/semester-${Number(resource.semester)}`;
}

export function collegeSubjectPath(resource) {
  return `${collegeSemesterPath(resource)}/${slugifyResource(resource.subject)}`;
}

export function competitiveUnitPath(resource) {
  const unit = resource.unit ? `unit-${Number(resource.unit)}` : 'syllabus';
  return `/competitive/${slugifyResource(resource.exam)}/${unit}`;
}

export function deriveCommerceDiscoveryCollections(resources = []) {
  const collections = [];

  for (const resource of resources) {
    if (resource.stage === 'college' && resource.university && resource.degree && resource.semester && resource.subject) {
      const degreePath = collegeDegreePath(resource);
      const semesterPath = collegeSemesterPath(resource);
      const subjectPath = collegeSubjectPath(resource);

      collections.push({
        path: degreePath,
        type: 'college-degree',
        stage: 'college',
        university: resource.university,
        degree: resource.degree,
        title: `${resource.degree} Study Material — ${resource.university}`,
        description: `Published ${resource.degree} Commerce resources for ${resource.university}, organised by semester, subject and material type.`,
        count: 1,
        resources: [resource.slug],
      });

      collections.push({
        path: semesterPath,
        type: 'college-semester',
        stage: 'college',
        university: resource.university,
        degree: resource.degree,
        semester: Number(resource.semester),
        title: `${resource.degree} Semester ${resource.semester} Study Material — ${resource.university}`,
        description: `Published ${resource.degree} Semester ${resource.semester} Commerce resources for ${resource.university}, organised by subject and resource type.`,
        count: 1,
        resources: [resource.slug],
      });

      collections.push({
        path: subjectPath,
        type: 'college-subject',
        stage: 'college',
        university: resource.university,
        degree: resource.degree,
        semester: Number(resource.semester),
        subject: resource.subject,
        title: `${resource.subject} — ${resource.degree} Semester ${resource.semester} ${resource.university}`,
        description: `Published ${resource.subject} resources for ${resource.degree} Semester ${resource.semester} at ${resource.university}, including notes, PDFs, MCQs, PYQs and revision material when available.`,
        count: 1,
        resources: [resource.slug],
      });
    }

    if (resource.stage === 'competitive' && resource.exam) {
      const path = competitiveUnitPath(resource);
      const unitLabel = resource.unit ? `Unit ${resource.unit}` : 'Official syllabus';
      collections.push({
        path,
        type: 'competitive-unit',
        stage: 'competitive',
        exam: resource.exam,
        unit: resource.unit ? Number(resource.unit) : null,
        title: `${resource.exam} ${unitLabel} Resources`,
        description: `Published ${resource.exam} ${unitLabel.toLowerCase()} resources including notes, MCQs, PYQs, syllabus and revision material when available.`,
        count: 1,
        resources: [resource.slug],
      });
    }
  }

  return uniqueByPath(collections).sort((a, b) => a.path.localeCompare(b.path));
}

export function filterResourcesForCollection(resources = [], collection = {}) {
  return resources.filter((resource) => {
    if (collection.type?.startsWith('college')) {
      if (resource.stage !== 'college') return false;
      if (resource.university !== collection.university || resource.degree !== collection.degree) return false;
      if (collection.semester && Number(resource.semester) !== Number(collection.semester)) return false;
      if (collection.subject && slugifyResource(resource.subject) !== slugifyResource(collection.subject)) return false;
      return true;
    }

    if (collection.type === 'competitive-unit') {
      if (resource.stage !== 'competitive' || resource.exam !== collection.exam) return false;
      if (collection.unit == null) return !resource.unit;
      return Number(resource.unit) === Number(collection.unit);
    }

    return false;
  });
}

export function findCollegeCollection(resources, params) {
  const universitySlug = slugifyResource(params.universitySlug);
  const degreeSlug = slugifyResource(params.degreeSlug);
  const semesterMatch = String(params.semesterSlug || '').match(/^semester-(\d+)$/);
  const semester = semesterMatch ? Number(semesterMatch[1]) : null;
  const subjectSlug = params.subjectSlug ? slugifyResource(params.subjectSlug) : null;

  const matches = resources.filter((resource) => {
    if (resource.stage !== 'college') return false;
    if (slugifyResource(resource.university) !== universitySlug) return false;
    if (slugifyResource(resource.degree) !== degreeSlug) return false;
    if (semester && Number(resource.semester) !== semester) return false;
    if (subjectSlug && slugifyResource(resource.subject) !== subjectSlug) return false;
    return true;
  });

  return { matches, semester, subjectSlug };
}

export function findCompetitiveCollection(resources, params) {
  const examSlug = slugifyResource(params.examSlug);
  const unitSlug = String(params.unitSlug || '');
  const unitMatch = unitSlug.match(/^unit-(\d+)$/);
  const unit = unitMatch ? Number(unitMatch[1]) : null;
  const syllabus = unitSlug === 'syllabus';

  const matches = resources.filter((resource) => {
    if (resource.stage !== 'competitive') return false;
    if (slugifyResource(resource.exam) !== examSlug) return false;
    if (syllabus) return !resource.unit;
    if (unit) return Number(resource.unit) === unit;
    return false;
  });

  return { matches, unit, syllabus };
}
