import { renderSearchTeachingGuide } from '../../data/searchTeachingGuides';

export default function SearchTeachingGuide({ path }) {
  const html = renderSearchTeachingGuide(path);
  // Only our escaped static teaching data is rendered; no user input or network HTML.
  return html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null;
}
