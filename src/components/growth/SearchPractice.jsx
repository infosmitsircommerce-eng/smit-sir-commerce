import { searchPracticeHtml } from '../../lib/searchPracticeHtml.js';

export default function SearchPractice({ path }) {
  const html = searchPracticeHtml(path);
  return html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null;
}
