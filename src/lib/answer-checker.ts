import type { PracticeStep } from '../types/lesson';

export type CheckResult = { kind: 'correct' | 'equivalent' | 'incorrect' | 'empty'; message: string };

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[\s=]/g, '').replace(/×/g, '*').replace(/÷/g, '/');
}

export function checkAnswer(value: string, step: PracticeStep, defaults: { empty: string; fallback: string }): CheckResult {
  const answer = normalize(value);
  if (!answer) return { kind: 'empty', message: defaults.empty };

  const accepted = step.accepted.find((item) => normalize(typeof item === 'string' ? item : item.value) === answer);
  if (accepted) {
    return { kind: 'correct', message: typeof accepted === 'string' ? step.correctFeedback : accepted.feedback };
  }

  const equivalent = step.equivalent?.find((item) => normalize(item.value) === answer);
  if (equivalent) return { kind: 'equivalent', message: equivalent.feedback };

  const mistake = step.mistakes.find((item) => normalize(item.answer) === answer);
  return mistake
    ? { kind: 'incorrect', message: mistake.feedback }
    : { kind: 'incorrect', message: defaults.fallback };
}
