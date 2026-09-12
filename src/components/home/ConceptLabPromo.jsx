import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../../styles/conceptLab.css';

export default function ConceptLabPromo() {
  return <section className="lab-promo-section" aria-labelledby="concept-lab-promo"><div className="lab-promo"><div><small>NEW · COMMERCE CONCEPT LAB</small><h2 id="concept-lab-promo">Don’t just read it. Try changing it.</h2><p>Can an income rise leave you buying less? Move the sliders, spot the clue in everyday situations and practise a fresh question.</p><div className="lab-promo-mini" aria-hidden="true"><span>Experiment</span> → <span>Understand</span> → <span>Apply</span></div></div><Link to="/concept-lab">Try Concept Lab <ArrowRight size={17} aria-hidden="true" /></Link></div></section>;
}
