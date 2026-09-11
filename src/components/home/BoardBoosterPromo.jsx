import BoosterInlineCTA from "../growth/BoosterInlineCTA";
import { Link } from "react-router-dom";

const SUBJECT_TESTS = [
  ["CBSE Business Studies", "/cbse/class-12/business-studies-diagnostic-test"],
  ["CBSE Economics", "/cbse/class-12/economics-diagnostic-test"],
  ["GSEB Economics", "/gseb/class-12/economics-diagnostic-test"],
];

export default function BoardBoosterPromo() {
  return (
    <section
      className="section-padding"
      style={{ background: "linear-gradient(180deg,#fffaf0,#f7f8fc)" }}
    >
      <div className="page-container">
        <BoosterInlineCTA placement="homepage" />
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          {SUBJECT_TESTS.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              className="tile-paper p-4 text-center text-sm font-bold hover:-translate-y-0.5 transition-transform"
              style={{ color: "var(--ink)" }}
            >
              {label} free test
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
