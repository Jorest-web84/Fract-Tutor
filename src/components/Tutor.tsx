interface TutorProps {
  name: string;
  message: string;
  compact?: boolean;
}

export function Tutor({ name, message, compact = false }: TutorProps) {
  return (
    <div className={`tutor ${compact ? 'tutor--compact' : ''}`}>
      <div className="tutor__avatar" aria-hidden="true">
        <span className="tutor__eye tutor__eye--left" />
        <span className="tutor__eye tutor__eye--right" />
        <span className="tutor__smile" />
        <span className="tutor__spark">✳</span>
      </div>
      <div className="tutor__bubble">
        <span className="tutor__name">{name} <span className="tutor__online">· tutor</span></span>
        <p aria-live="polite">{message}</p>
      </div>
    </div>
  );
}
