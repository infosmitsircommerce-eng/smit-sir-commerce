import BoosterInlineCTA from "../growth/BoosterInlineCTA";

export default function BoardBoosterPromo() {
  return (
    <section
      className="section-padding"
      style={{ background: "linear-gradient(180deg,#fffaf0,#f7f8fc)" }}
    >
      <div className="page-container">
        <BoosterInlineCTA placement="homepage" />
      </div>
    </section>
  );
}
