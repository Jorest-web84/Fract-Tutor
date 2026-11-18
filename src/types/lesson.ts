export type AcceptedAnswer = string | { value: string; feedback: string };

export interface PracticeStep {
  prompt: string;
  helper: string;
  accepted: AcceptedAnswer[];
  equivalent?: { value: string; feedback: string }[];
  mistakes: { answer: string; feedback: string }[];
  correctFeedback: string;
}

export interface LessonContent {
  title: string;
  subtitle: string;
  tutorName: string;
  feedbackDefaults: { empty: string; fallback: string; hint: string };
  sections: { id: string; label: string; eyebrow: string }[];
  explain: { title: string; cards: { heading: string; body: string; mark: string }[]; tutorLines: string[] };
  worked: {
    title: string;
    prompt: string;
    intro: string;
    steps: { expression: string; explanation: string; focus: string }[];
    wrapUp: string;
  };
  together: { title: string; prompt: string; intro: string; steps: PracticeStep[]; finish: string };
  independent: { title: string; prompt: string; intro: string; steps: PracticeStep[]; finish: string };
  completion: { title: string; body: string; takeaway: string; tutorLine: string };
}
