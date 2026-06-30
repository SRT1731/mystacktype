import { useMemo, useState } from 'react';
import { QUIZ_CONFIG, RESULT_SCREEN_FOOTER } from '../config/quiz';
import { trackQuizEvent } from '../lib/analytics';
import { calculateQuizOutcome } from '../lib/scoring';
import { RadarChart } from './RadarChart';

type AnswerMap = Record<string, string>;

const resultToneLabels = {
  normal: 'Normal',
  strong: 'Strong',
  roast: 'Roast',
} as const;

export function QuizExperience() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showResult, setShowResult] = useState(false);
  const questions = QUIZ_CONFIG.questions;
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;

  const selectedOptionIds = useMemo(() => Object.values(answers), [answers]);
  const outcome = useMemo(
    () => calculateQuizOutcome(selectedOptionIds),
    [selectedOptionIds]
  );

  function handleAnswer(questionId: string, optionId: string) {
    setAnswers((current) => {
      const isFirstAnswer = Object.keys(current).length === 0;
      if (isFirstAnswer) {
        trackQuizEvent({ type: 'quiz_start' });
      }

      return {
        ...current,
        [questionId]: optionId,
      };
    });
    setShowResult(false);
  }

  function handleReveal() {
    if (!isComplete) return;
    setShowResult(true);
    trackQuizEvent({
      type: 'quiz_finish',
      resultType: outcome.resultType,
      stackScore: outcome.stackScore,
    });
    trackQuizEvent({
      type: 'result_view',
      resultType: outcome.resultType,
    });
  }

  async function handleShare() {
    const shareText = `${outcome.result.shareCopy[outcome.tone]}\n${window.location.href}`;
    const canNativeShare = 'share' in navigator;

    trackQuizEvent({
      type: 'share_click',
      resultType: outcome.resultType,
      channel: canNativeShare ? 'native' : 'link',
    });

    if (canNativeShare) {
      await navigator.share({
        title: `MyStackType: ${outcome.result.name}`,
        text: shareText,
        url: window.location.href,
      });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    alert('Share text copied.');
  }

  function handleReset() {
    setAnswers({});
    setShowResult(false);
  }

  return (
    <section
      id="quiz"
      className="relative bg-[#f8faf6] px-4 py-24 text-[#111614] sm:px-6 md:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-5 text-[12px] font-bold uppercase text-[#3166ff]">
            Free stack type quiz
          </p>
          <h2
            className="max-w-xl text-[46px] uppercase leading-[0.92] sm:text-[64px]"
            style={{ fontFamily: '"Anton SC", sans-serif', letterSpacing: 0 }}
          >
            Find your supplement stack type
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#4d5852]">
            Answer 10 quick questions. You will get a stack type, Stack Score,
            share line, and a cleaner next-step frame.
          </p>
          <div className="mt-8 h-2 w-full max-w-md overflow-hidden rounded-full bg-[#dfe7df]">
            <div
              className="h-full rounded-full bg-[#57c84d] transition-all"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
          <p className="mt-3 text-[13px] text-[#66706a]">
            {answeredCount}/{questions.length} answered
          </p>
        </div>

        <div className="space-y-5">
          {questions.map((question) => (
            <div
              key={question.id}
              className="border border-[#dbe4dc] bg-white p-5 shadow-sm sm:p-6"
            >
              <p className="mb-3 text-[11px] font-bold uppercase text-[#66706a]">
                {question.eyebrow}
              </p>
              <h3 className="text-[20px] font-bold leading-snug text-[#111614]">
                {question.title}
              </h3>
              {question.helper ? (
                <p className="mt-2 text-[13px] leading-relaxed text-[#66706a]">
                  {question.helper}
                </p>
              ) : null}

              <div className="mt-5 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleAnswer(question.id, option.id)}
                      className={`min-h-[58px] border px-4 py-3 text-left text-[14px] transition ${
                        isSelected
                          ? 'border-[#3166ff] bg-[#edf3ff] text-[#111614]'
                          : 'border-[#dbe4dc] bg-[#f8faf6] text-[#3f4742] hover:border-[#57c84d] hover:bg-white'
                      }`}
                    >
                      <span className="block font-bold">{option.label}</span>
                      {option.helper ? (
                        <span className="mt-1 block text-[12px] text-[#66706a]">
                          {option.helper}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleReveal}
              disabled={!isComplete}
              className="h-[54px] flex-1 bg-[#3166ff] px-6 text-[15px] font-bold text-white transition hover:bg-[#2455dc] disabled:cursor-not-allowed disabled:bg-[#b9c2bb]"
            >
              Reveal My Stack Type
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="h-[54px] border border-[#dbe4dc] px-6 text-[15px] font-bold text-[#3f4742] transition hover:bg-white"
            >
              Reset
            </button>
          </div>

          {showResult ? (
            <div className="border border-[#111614] bg-[#111614] p-6 text-white sm:p-8">
              <div className="grid gap-8 md:grid-cols-[1fr_260px] md:items-center">
                <div>
                  <p className="text-[13px] uppercase text-white/50">
                    {resultToneLabels[outcome.tone]} result
                  </p>
                  <div className="mt-5 text-[52px] leading-none">
                    {outcome.result.emoji}
                  </div>
                  <h3
                    className="mt-5 text-[48px] uppercase leading-[0.92] sm:text-[64px]"
                    style={{ fontFamily: '"Anton SC", sans-serif', letterSpacing: 0 }}
                  >
                    {outcome.result.name}
                  </h3>
                  <p className="mt-4 text-[18px] text-[#90ffbe]">
                    {outcome.result.tagline}
                  </p>
                  <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-white/70">
                    {outcome.result.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 text-[13px]">
                    <span className="border border-white/18 px-3 py-2">
                      Stack Score {outcome.stackScore}
                    </span>
                    <span className="border border-white/18 px-3 py-2">
                      Rarity {outcome.result.rarity}%
                    </span>
                  </div>
                </div>
                <RadarChart dimensions={outcome.dimensions} size={260} />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="border border-white/14 p-4">
                  <p className="text-[12px] uppercase text-white/42">Share line</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/82">
                    {outcome.result.shareCopy[outcome.tone]}
                  </p>
                </div>
                <div className="border border-white/14 p-4">
                  <p className="text-[12px] uppercase text-white/42">Reset angle</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/82">
                    {outcome.result.paywallHeadline}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleShare}
                  className="h-[50px] bg-[#57c84d] px-5 text-[14px] font-bold text-[#111614] transition hover:bg-[#6ee064]"
                >
                  Share Result
                </button>
                <a
                  href="#pricing"
                  onClick={() =>
                    trackQuizEvent({
                      type: 'paywall_view',
                      resultType: outcome.resultType,
                    })
                  }
                  className="flex h-[50px] items-center justify-center border border-white/18 px-5 text-[14px] font-bold text-white transition hover:bg-white/10"
                >
                  See Reset Report
                </a>
              </div>

              <p className="mt-6 border-t border-white/12 pt-5 text-[12px] leading-relaxed text-white/42">
                {RESULT_SCREEN_FOOTER}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
