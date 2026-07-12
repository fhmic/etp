export function SectionHeader({ title, eyebrow, action }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <p>{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}
