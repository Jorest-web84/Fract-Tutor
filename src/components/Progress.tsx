interface ProgressProps {
  labels: string[];
  current: number;
}

export function Progress({ labels, current }: ProgressProps) {
  return (
    <nav className="lesson-progress" aria-label="Lesson sections">
      {labels.map((label, index) => (
        <div className={`lesson-progress__step ${index < current ? 'is-done' : ''} ${index === current ? 'is-current' : ''}`} key={label}>
          <span className="lesson-progress__dot" aria-hidden="true">{index < current ? '✓' : `0${index + 1}`}</span>
          <span className="lesson-progress__label">{label}</span>
        </div>
      ))}
    </nav>
  );
}
