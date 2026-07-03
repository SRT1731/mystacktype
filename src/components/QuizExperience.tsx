import { useMemo, useState } from 'react';
import { QUIZ_CONFIG, RESULT_SCREEN_FOOTER } from '../config/quiz';
import { trackQuizEvent } from '../lib/analytics';
import { calculateQuizOutcome } from '../lib/scoring';
import { EmailCaptureForm } from './EmailCaptureForm';
import { RadarChart } from './RadarChart';

type AnswerMap = Record<string, string>;

const resultToneLabels = {
  normal: '기본 결과',
  strong: '핵심 결과',
  roast: '공유용 결과',
} as const;

interface QuizExperienceProps {
  onClose: () => void;
}

export function QuizExperience({ onClose }: QuizExperienceProps) {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const questions = QUIZ_CONFIG.questions;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;
  const currentAnswer = answers[currentQuestion.id];

  const selectedOptionIds = useMemo(() => Object.values(answers), [answers]);
  const outcome = useMemo(
    () => calculateQuizOutcome(selectedOptionIds),
    [selectedOptionIds]
  );

  function handleAnswer(questionId: string, optionId: string) {
    setAnswers((current) => {
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
      type: 'check_complete',
      resultType: outcome.resultType,
      stackScore: outcome.stackScore,
    });
    trackQuizEvent({
      type: 'result_view',
      resultType: outcome.resultType,
    });
  }

  const shareCopy = outcome.result.shareCopy[outcome.tone].replace(
    '{score}',
    String(outcome.stackScore)
  );

  async function handleShare() {
    const shareText = `${shareCopy}\n${window.location.href}`;
    const canNativeShare = 'share' in navigator;

    trackQuizEvent({
      type: 'share_click',
      resultType: outcome.resultType,
      channel: canNativeShare ? 'native' : 'link',
    });

    if (canNativeShare) {
      await navigator.share({
        title: `KeepLine: ${outcome.result.name}`,
        text: shareText,
        url: window.location.href,
      });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    alert('공유 문구를 복사했어요.');
  }

  function handleReset() {
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
  }

  function goToPreviousQuestion() {
    setCurrentIndex((index) => Math.max(index - 1, 0));
    setShowResult(false);
  }

  function goToNextQuestion() {
    if (!currentAnswer) return;
    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
  }

  return (
    <section
      className="fixed inset-0 z-[100] bg-[#030503]/78 p-3 text-[#111614] backdrop-blur-xl sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="KeepLine 자가 점검"
    >
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-white/50 bg-[#fbf7f3] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#b76e79]/20 bg-white/85 px-4 py-3 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#be7c70]">
              무료 점검
            </p>
            <p className="mt-1 text-[12px] text-[#66706a]">
              {answeredCount}/{questions.length} 완료
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b76e79]/20 bg-[#fbf7f3] text-[22px] leading-none text-[#40382f] transition hover:bg-white"
            aria-label="자가 점검 닫기"
          >
            ×
          </button>
        </div>

        <div className="grid flex-1 gap-8 overflow-y-auto p-4 sm:p-6 lg:grid-cols-[0.78fr_1.22fr] lg:p-8">
        <div className="lg:sticky lg:top-0 lg:self-start">
          <p className="mb-5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#be7c70]">
            {QUIZ_CONFIG.eyebrow}
          </p>
          <h2
            className="max-w-xl text-[34px] font-bold leading-[1.22] text-[#40382f] sm:text-[48px]"
            style={{ fontFamily: '"Noto Serif KR", Georgia, serif', letterSpacing: 0 }}
          >
            {QUIZ_CONFIG.title}
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#6b5f56]">
            {QUIZ_CONFIG.subtitle}
          </p>
          <div className="mt-8 h-2 w-full max-w-md overflow-hidden rounded-full bg-[#f0ded7]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#dba99d] to-[#b76e79] transition-all"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
            <p className="mt-3 text-[13px] text-[#9c8b82]">
              {currentIndex + 1}번째 질문 · {answeredCount}/{questions.length} 완료
            </p>
        </div>

        <div className="space-y-5">
          {!showResult ? (
            <div
              key={currentQuestion.id}
              className="rounded-[20px] border border-[#b76e79]/20 bg-white p-5 shadow-sm sm:p-6"
            >
              <p className="mb-3 text-[11px] font-bold uppercase text-[#be7c70]">
                {currentQuestion.eyebrow}
              </p>
              <h3 className="text-[20px] font-bold leading-snug text-[#40382f]">
                {currentQuestion.title}
              </h3>
              {currentQuestion.helper ? (
                <p className="mt-2 text-[13px] leading-relaxed text-[#66706a]">
                  {currentQuestion.helper}
                </p>
              ) : null}

              <div className="mt-5 grid gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleAnswer(currentQuestion.id, option.id)}
                      className={`min-h-[58px] rounded-[16px] border px-4 py-3 text-left text-[14px] transition ${
                        isSelected
                          ? 'border-[#b76e79] bg-[#fbf0ec] text-[#40382f]'
                          : 'border-[#b76e79]/20 bg-[#fbf7f3] text-[#5a4f47] hover:border-[#dba99d] hover:bg-white'
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
          ) : null}

          {!showResult ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToPreviousQuestion}
                disabled={currentIndex === 0}
                className="h-[54px] rounded-full border border-[#b76e79]/25 px-6 text-[15px] font-bold text-[#5a4f47] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                이전
              </button>
              {currentIndex === questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleReveal}
                  disabled={!isComplete}
                  className="h-[54px] flex-1 rounded-full bg-gradient-to-br from-[#dba99d] to-[#b76e79] px-6 text-[15px] font-bold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#c9bbb3]"
                >
                  결과 보기
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goToNextQuestion}
                  disabled={!currentAnswer}
                  className="h-[54px] flex-1 rounded-full bg-[#40382f] px-6 text-[15px] font-bold text-white transition hover:bg-[#5a4b45] disabled:cursor-not-allowed disabled:bg-[#c9bbb3]"
                >
                  다음
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="h-[54px] rounded-full border border-[#b76e79]/25 px-6 text-[15px] font-bold text-[#5a4f47] transition hover:bg-white"
              >
                다시 시작
              </button>
            </div>
          ) : null}

          {showResult ? (
            <div className="rounded-[22px] border border-[#b76e79]/20 bg-[#40382f] p-6 text-white sm:p-8">
              <div className="grid gap-8 md:grid-cols-[1fr_260px] md:items-center">
                <div>
                  <p className="text-[13px] uppercase text-white/50">
                    {resultToneLabels[outcome.tone]}
                  </p>
                  <div className="mt-5 text-[52px] leading-none">
                    {outcome.result.emoji}
                  </div>
                  <h3
                    className="mt-5 text-[42px] font-black leading-[1.02] sm:text-[58px]"
                    style={{ letterSpacing: 0 }}
                  >
                    {outcome.result.name}
                  </h3>
                  <p className="mt-4 text-[18px] text-[#f0c6bd]">
                    {outcome.result.tagline}
                  </p>
                  <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-white/70">
                    {outcome.result.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 text-[13px]">
                    <span className="border border-white/18 px-3 py-2">
                      요요 위험 점수 {outcome.stackScore}
                    </span>
                    <span className="border border-white/18 px-3 py-2">
                      희귀도 {outcome.result.rarity}%
                    </span>
                  </div>
                </div>
                <RadarChart dimensions={outcome.dimensions} size={260} />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="border border-white/14 p-4">
                  <p className="text-[12px] uppercase text-white/42">한 줄 결과</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/82">
                    {outcome.result.description}
                  </p>
                </div>
                <div className="border border-white/14 p-4">
                  <p className="text-[12px] uppercase text-white/42">대기명단</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/82">
                    {outcome.result.paywallHeadline}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="border border-white/14 p-4">
                  <p className="text-[12px] uppercase text-white/42">맞춤 인사이트</p>
                  <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-white/78">
                    {outcome.insights.map((insight) => (
                      <li key={insight}>• {insight}</li>
                    ))}
                  </ul>
                </div>
                <div className="border border-white/14 p-4">
                  <p className="text-[12px] uppercase text-white/42">
                    진료 때 물어볼 질문
                  </p>
                  <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-white/78">
                    {outcome.doctorQuestions.map((question) => (
                      <li key={question}>• {question}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleShare}
                  className="h-[50px] rounded-full bg-[#f0c6bd] px-5 text-[14px] font-bold text-[#40382f] transition hover:bg-white"
                >
                  결과 공유
                </button>
                <a
                  href="#pricing"
                  className="flex h-[50px] items-center justify-center border border-white/18 px-5 text-[14px] font-bold text-white transition hover:bg-white/10"
                >
                  대기명단 보기
                </a>
              </div>

              <div className="mt-6 rounded-[18px] border border-white/14 bg-white/[0.06] p-5">
                <p className="text-[12px] uppercase text-white/42">킵라인 레터</p>
                <h4 className="mt-2 text-[20px] font-semibold text-white">
                  빼는 법 말고, 지키는 법만 보냅니다.
                </h4>
                <p className="mt-2 text-[13px] leading-relaxed text-white/62">
                  주 1회, 식욕이 돌아오는 신호와 끊은 뒤에도 라인을 지키는 루틴을 보내드려요.
                </p>
                <div className="mt-4">
                  <EmailCaptureForm
                    mode="newsletter"
                    source="quiz_result"
                    buttonLabel="무료로 받아보기"
                    caption="스팸 없음 · 원클릭 구독 해지"
                    successMessage="등록됐어요. 다음 레터부터 보내드릴게요."
                    compact
                  />
                </div>
              </div>

              <p className="mt-6 border-t border-white/12 pt-5 text-[12px] leading-relaxed text-white/42">
                {RESULT_SCREEN_FOOTER}
              </p>
            </div>
          ) : null}
        </div>
        </div>
      </div>
    </section>
  );
}
