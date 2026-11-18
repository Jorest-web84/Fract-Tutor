import { useState } from 'react';
import lesson from './content/fractions.lesson.json';
import { FractionInput } from './components/FractionInput';
import { Progress } from './components/Progress';
import { Tutor } from './components/Tutor';
import { checkAnswer, type CheckResult } from './lib/answer-checker';
import type { LessonContent, PracticeStep } from './types/lesson';

const content = lesson as LessonContent;
type Stage = 'explain' | 'worked' | 'together' | 'independent' | 'complete';
const stages: Stage[] = ['explain', 'worked', 'together', 'independent', 'complete'];

export default function App() {
  const [stage, setStage] = useState<Stage>('explain');
  const [explainIndex, setExplainIndex] = useState(0);
  const [workedIndex, setWorkedIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [tutorMessage, setTutorMessage] = useState(content.explain.tutorLines[0]);

  const stageIndex = stages.indexOf(stage);
  const section = content.sections.find((item) => item.id === stage);
  const practice: { title: string; prompt: string; intro: string; steps: PracticeStep[]; finish: string } | null =
    stage === 'together' ? content.together : stage === 'independent' ? content.independent : null;
  const currentStep = practice?.steps[practiceIndex];
  const isPracticeCorrect = result?.kind === 'correct';

  function goTo(next: Stage) {
    setStage(next);
    setResult(null);
    setInput('');
    setHintLevel(0);
    if (next === 'explain') setTutorMessage(content.explain.tutorLines[0]);
    if (next === 'worked') setTutorMessage(content.worked.intro);
    if (next === 'together') setTutorMessage(content.together.intro);
    if (next === 'independent') setTutorMessage(content.independent.intro);
  }

  function goBack() {
    if (stage === 'explain' && explainIndex > 0) {
      setExplainIndex((index) => index - 1);
      setTutorMessage(content.explain.tutorLines[Math.max(0, explainIndex - 1) % content.explain.tutorLines.length]);
      return;
    }
    if (stage === 'worked' && workedIndex > 0) { setWorkedIndex((index) => index - 1); return; }
    if ((stage === 'together' || stage === 'independent') && practiceIndex > 0) {
      setPracticeIndex((index) => index - 1);
      setInput(''); setResult(null); setHintLevel(0);
      return;
    }
    if (stageIndex > 0) goTo(stages[stageIndex - 1]);
  }

  function advance() {
    if (stage === 'explain') {
      if (explainIndex < content.explain.cards.length - 1) {
        const next = explainIndex + 1;
        setExplainIndex(next);
        setTutorMessage(content.explain.tutorLines[next % content.explain.tutorLines.length]);
      } else goTo('worked');
    } else if (stage === 'worked') {
      if (workedIndex < content.worked.steps.length - 1) {
        const next = workedIndex + 1;
        setWorkedIndex(next);
        setTutorMessage(content.worked.steps[next].explanation);
      } else goTo('together');
    } else if (stage === 'together' && practiceIndex < content.together.steps.length - 1) {
      setPracticeIndex((index) => index + 1); setInput(''); setResult(null); setHintLevel(0);
      setTutorMessage(content.together.intro);
    } else if (stage === 'together') {
      setPracticeIndex(0); goTo('independent');
    } else if (stage === 'independent' && practiceIndex < content.independent.steps.length - 1) {
      setPracticeIndex((index) => index + 1); setInput(''); setResult(null); setHintLevel(0);
      setTutorMessage(content.independent.intro);
    } else if (stage === 'independent') goTo('complete');
    else goTo('explain');
  }

  function check() {
    if (!currentStep) return;
    const checked = checkAnswer(input, currentStep, content.feedbackDefaults);
    setResult(checked);
    setTutorMessage(checked.message);
  }

  function showHint() {
    if (!currentStep) return;
    const next = Math.min(hintLevel + 1, 2);
    setHintLevel(next);
    const message = next === 1
      ? currentStep.helper
      : currentStep.mistakes[0]?.feedback ?? content.feedbackDefaults.hint;
    setTutorMessage(message);
  }

  const sectionProgressIndex = Math.min(stageIndex, content.sections.length - 1);
  const buttonLabel = stage === 'explain'
    ? explainIndex === content.explain.cards.length - 1 ? 'Watch an example' : 'Next idea'
    : stage === 'worked'
      ? workedIndex === content.worked.steps.length - 1 ? 'Try one together' : 'Next line'
      : stage === 'together'
        ? practiceIndex === content.together.steps.length - 1 ? 'Try one solo' : 'Next line'
        : stage === 'independent'
          ? practiceIndex === content.independent.steps.length - 1 ? 'Finish lesson' : 'Next line'
          : 'Start again';

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={(event) => { event.preventDefault(); goTo('explain'); }} aria-label="Frac-Ground, start lesson">
          <span className="brand__mark">fg<span>·</span></span>
          <span className="brand__name">frac-<br />ground</span>
        </a>
        <div className="topbar__lesson"><span className="topbar__dot" /> MATHS · FRACTIONS</div>
        <button className="reset-button" onClick={() => { setExplainIndex(0); setWorkedIndex(0); setPracticeIndex(0); goTo('explain'); }} aria-label="Restart lesson">↻ <span>Restart</span></button>
      </header>

      <main className="lesson-layout" id="top">
        <aside className="lesson-rail">
          <div className="rail-heading"><span className="rail-heading__index">LESSON 01</span><span className="rail-heading__rule" /></div>
          <h1>{content.title}</h1>
          <p className="rail-subtitle">{content.subtitle}</p>
          <Progress labels={content.sections.map((item) => item.label)} current={sectionProgressIndex} />
          <div className="rail-note"><span className="rail-note__asterisk">✳</span><span>Take it one line<br />at a time.</span></div>
        </aside>

        <section className="lesson-main" aria-label="Tutorial lesson">
          <div className="mobile-progress">
            <div className="mobile-progress__top"><span>{section?.eyebrow ?? 'LESSON COMPLETE'}</span><span>{String(Math.min(stageIndex + 1, 5)).padStart(2, '0')} / 05</span></div>
            <div className="mobile-progress__track"><span style={{ width: `${((stageIndex + 1) / stages.length) * 100}%` }} /></div>
          </div>

          {stage !== 'complete' && <div className="section-eyebrow"><span>{section?.eyebrow}</span><span className="section-eyebrow__line" /></div>}

          {stage === 'explain' && (
            <div className="stage-content stage-content--explain" key={`explain-${explainIndex}`}>
              <div className="stage-heading"><span className="stage-heading__number">0{explainIndex + 1}</span><h2>{content.explain.title}</h2></div>
              <div className="concept-card">
                <div className="concept-card__mark">{content.explain.cards[explainIndex].mark}</div>
                <div><h3>{content.explain.cards[explainIndex].heading}</h3><p>{content.explain.cards[explainIndex].body}</p></div>
              </div>
              <div className="card-pagination" aria-label={`Idea ${explainIndex + 1} of ${content.explain.cards.length}`}>
                {content.explain.cards.map((card, index) => <span key={card.heading} className={index === explainIndex ? 'is-active' : ''} />)}
                <span className="card-pagination__count">{explainIndex + 1} / {content.explain.cards.length}</span>
              </div>
              <div className="math-preview"><span className="math-preview__label">THE MOVE</span><div className="math-preview__equation"><Fraction n="2" d="3" /><span>+</span><Fraction n="1" d="4" /><span className="math-preview__arrow">→</span><span className="math-preview__answer">8/12 + 3/12</span></div></div>
              <Tutor name={content.tutorName} message={tutorMessage} />
            </div>
          )}

          {stage === 'worked' && (
            <div className="stage-content" key={`worked-${workedIndex}`}>
              <div className="stage-heading"><span className="stage-heading__number">02</span><h2>{content.worked.title}</h2></div>
              <p className="stage-intro">{content.worked.intro}</p>
              <div className="worked-problem"><span className="worked-problem__label">EXAMPLE</span><span className="worked-problem__math">{content.worked.prompt}</span></div>
              <div className="working-list">
                {content.worked.steps.slice(0, workedIndex + 1).map((step, index) => (
                  <div className={`working-row ${index === workedIndex ? 'working-row--current' : ''}`} key={step.expression}>
                    <span className="working-row__number">{String(index + 1).padStart(2, '0')}</span>
                    <div className="working-row__body"><strong>{step.expression}</strong>{index === workedIndex && <p>{step.explanation}</p>}</div>
                    {index < workedIndex && <span className="working-row__check" aria-label="Completed">✓</span>}
                  </div>
                ))}
              </div>
              {workedIndex === content.worked.steps.length - 1 && <p className="worked-wrap">{content.worked.wrapUp}</p>}
              <Tutor name={content.tutorName} message={content.worked.steps[workedIndex].explanation} compact />
            </div>
          )}

          {practice && currentStep && (
            <div className="stage-content" key={`${stage}-${practiceIndex}`}>
              <div className="stage-heading"><span className="stage-heading__number">0{stage === 'together' ? '3' : '4'}</span><h2>{practice.title}</h2></div>
              <p className="stage-intro">{practice.intro}</p>
              <div className="practice-problem">
                <span className="practice-problem__label">ADD THESE</span>
                <div className="practice-problem__math">{practice.prompt}</div>
                <span className="practice-problem__step">LINE {practiceIndex + 1} <i /> {practice.steps.length}</span>
              </div>
              <div className="prompt-row"><span className="prompt-row__step">0{practiceIndex + 1}</span><div><h3>{currentStep.prompt}</h3><p id="entry-helper">{currentStep.helper}</p></div></div>
              <FractionInput value={input} onChange={(value) => { setInput(value); if (result) setResult(null); }} onSubmit={check} disabled={isPracticeCorrect} />
              <div className="practice-actions">
                <button className="hint-button" onClick={showHint}> <span>✳</span> Need a hint?</button>
                {!isPracticeCorrect && <button className="check-button" onClick={check}>Check line <span>↗</span></button>}
              </div>
              {result && <div className={`feedback feedback--${result.kind}`} role="status"><span className="feedback__icon">{result.kind === 'correct' ? '✓' : result.kind === 'equivalent' ? '↗' : '·'}</span><p>{result.message}</p></div>}
              {stage === 'together' && practiceIndex === practice.steps.length - 1 && isPracticeCorrect && <p className="worked-wrap">{practice.finish}</p>}
              <Tutor name={content.tutorName} message={tutorMessage} compact />
            </div>
          )}

          {stage === 'complete' && (
            <div className="stage-content completion" key="completion">
              <div className="completion__seal"><span>✳</span></div>
              <span className="section-eyebrow__solo">LESSON COMPLETE</span>
              <h2>{content.completion.title}</h2>
              <p className="completion__body">{content.completion.body}</p>
              <div className="takeaway"><span>KEEP THIS</span><p>{content.completion.takeaway}</p></div>
              <Tutor name={content.tutorName} message={content.completion.tutorLine} />
            </div>
          )}

          <div className="bottom-controls">
            <button className="back-button" onClick={goBack} disabled={stage === 'explain' && explainIndex === 0}>← <span>Back</span></button>
            {(stage === 'explain' || stage === 'worked') && <button className="forward-button" onClick={advance}>{buttonLabel}<span>→</span></button>}
            {practice && isPracticeCorrect && <button className="forward-button" onClick={advance}>{buttonLabel}<span>→</span></button>}
            {stage === 'complete' && <button className="forward-button" onClick={advance}>{buttonLabel}<span>↻</span></button>}
          </div>
          <footer className="lesson-footer"><span>FRAC-GROUND <i>·</i> A SMALL MATHS LESSON</span><span>MADE TO TAKE ONE STEP AT A TIME</span></footer>
        </section>
      </main>
    </div>
  );
}

function Fraction({ n, d }: { n: string; d: string }) {
  return <span className="fraction"><span>{n}</span><i /><span>{d}</span></span>;
}
