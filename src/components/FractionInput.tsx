import { useRef } from 'react';

interface FractionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function FractionInput({ value, onChange, onSubmit, disabled = false }: FractionInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function insertSlash() {
    const input = inputRef.current;
    if (!input) return onChange(`${value}/`);
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;
    const next = `${value.slice(0, start)}/${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + 1, start + 1);
    });
  }

  return (
    <div className="answer-entry">
      <label className="sr-only" htmlFor="working-answer">Your line of working</label>
      <input
        ref={inputRef}
        id="working-answer"
        className="answer-entry__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Enter') onSubmit(); }}
        placeholder="Type your working…"
        autoComplete="off"
        enterKeyHint="done"
        disabled={disabled}
        aria-describedby="entry-helper"
      />
      <button className="answer-entry__slash" type="button" onClick={insertSlash} disabled={disabled} aria-label="Insert fraction slash">a⁄b</button>
    </div>
  );
}
