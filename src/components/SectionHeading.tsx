export function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="section-heading">
      <span className="section-heading__number mono">{number}</span>
      <h2 className="section-heading__title">{title}</h2>
    </div>
  );
}
