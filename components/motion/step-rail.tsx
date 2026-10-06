// Four-stop rail: the recurring motif (Process now, hero exit later). Static markup = completed rail.
export function StepRail({
  labels,
  className = "",
  ariaHidden = false,
  pulse = false,
}: {
  labels: string[];
  className?: string;
  ariaHidden?: boolean;
  pulse?: boolean; // small cyan dot that a scroll timeline rides along the fill's leading edge
}) {
  return (
    <div className={`rail ${className}`} aria-hidden={ariaHidden}>
      <div className="rail-line" aria-hidden="true" />
      <div className="rail-fill" aria-hidden="true" />
      {pulse && <span className="rail-pulse" aria-hidden="true" />}
      <ol aria-label="Stages">
        {labels.map((label) => (
          <li key={label}>
            <span className="rail-dot" aria-hidden="true" />
            <span className="mono">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
