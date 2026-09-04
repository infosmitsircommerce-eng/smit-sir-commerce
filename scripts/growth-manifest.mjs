import { seoMaterials, seoHubs } from '../src/data/seoMaterials.js';

const assertionIds = new Set([
  'class-12-business-studies-chapter-02','class-12-business-studies-chapter-03','class-12-business-studies-chapter-04','class-12-business-studies-chapter-05','class-12-business-studies-chapter-06','class-12-business-studies-chapter-07','class-12-business-studies-chapter-08','class-12-business-studies-chapter-11','class-12-business-studies-chapter-12',
  'class-11-microeconomics-chapter-02','class-11-microeconomics-chapter-05','class-11-microeconomics-chapter-06','class-11-microeconomics-chapter-07','class-11-microeconomics-chapter-08','class-11-microeconomics-chapter-09','class-11-microeconomics-chapter-13',
]);
const numericalIds = new Set([
  'class-11-microeconomics-chapter-02','class-11-microeconomics-chapter-03','class-11-microeconomics-chapter-06','class-11-microeconomics-chapter-07','class-11-microeconomics-chapter-08','class-11-microeconomics-chapter-09','class-11-microeconomics-chapter-10','class-11-microeconomics-chapter-11','class-11-microeconomics-chapter-13',
]);
const typeMeta = {
  mcqs: ['MCQs with Answers','mcqs','chapter-wise MCQ practice with answers and explanations'],
  'important-questions': ['Important Questions','important-questions','important board-style questions with answer guidance'],
  revision: ['One-shot Revision','revision','quick revision notes, checklist and recall prompts'],
  'assertion-reason': ['Assertion–Reason','assertion-reason','original assertion–reason practice with answers'],
  'case-study': ['Case Study Questions','case-study-questions','original case-study practice with answer guidance'],
  numericals: ['Numericals','numericals','worked numerical practice with step-by-step solutions'],
};

const hubMap = Object.fromEntries(seoHubs.map((hub) => [hub.id, hub]));
const slug = (material) => material.seo_path.split('/').pop().replace(/-notes$/, '');

export const growthManifest = seoMaterials.flatMap((material) => {
  const types = ['mcqs','important-questions','revision'];
  if (assertionIds.has(material.id)) types.push('assertion-reason');
  if (material.subject === 'Business Studies') types.push('case-study');
  if (numericalIds.has(material.id)) types.push('numericals');
  return types.map((type) => {
    const [label, suffix, intent] = typeMeta[type];
    const hub = hubMap[material.hubId];
    return {
      id: `${material.id}-${type}`,
      materialId: material.id,
      type,
      label,
      path: `/practice/cbse/class-${material.class_level}/${hub.subjectSlug}/${slug(material)}-${suffix}`,
      notesPath: material.seo_path,
      classLevel: material.class_level,
      subject: material.subject,
      chapter: material.chapter,
      keyTopics: material.keyTopics,
      examFocus: material.examFocus,
      summary: material.summary,
      title: `CBSE Class ${material.class_level} ${material.chapter} ${label}`,
      description: `Practice CBSE Class ${material.class_level} ${material.chapter} with ${intent}. Original study material by Smit Sir Commerce; not an official CBSE paper.`,
      updated: '2026-09-01',
      indexable: ['assertion-reason', 'numericals'].includes(type),
    };
  });
});
