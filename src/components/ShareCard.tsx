import { toPng } from 'html-to-image';
import { useRef } from 'react';
import type { QuizOutcome } from '../config/quiz';
import { RESULT_SCREEN_FOOTER } from '../config/quiz';
import { trackQuizEvent } from '../lib/analytics';
import { RadarChart } from './RadarChart';

export type ShareCardFormat = 'feed' | 'story';

interface ShareCardProps {
  outcome: QuizOutcome;
  format?: ShareCardFormat;
}

export function ShareCard({ outcome, format = 'feed' }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { result, tone, dimensions, stackScore } = outcome;
  const shareCopy = result.shareCopy[tone].replace('{score}', String(stackScore));
  const isStory = format === 'story';
  const width = 1080;
  const height = isStory ? 1920 : 1080;

  async function handleDownload() {
    if (!cardRef.current) return;

    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 1,
      width,
      height,
      canvasWidth: width,
      canvasHeight: height,
    });

    const link = document.createElement('a');
    link.download = `stack-clarity-${result.id}-${format}.png`;
    link.href = dataUrl;
    link.click();
    trackQuizEvent({
      type: 'share_click',
      resultType: result.id,
      channel: 'image',
    });
  }

  return (
    <div className="space-y-3">
      <div
        ref={cardRef}
        style={{ width, height }}
        className="relative overflow-hidden bg-[#0b0f0d] text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(144,255,190,0.28),transparent_28%),radial-gradient(circle_at_80%_72%,rgba(255,255,255,0.12),transparent_32%)]" />
        <div className="relative flex h-full flex-col justify-between p-20">
          <div>
            <p className="text-4xl uppercase tracking-[0.22em] text-white/58">
              Stack Clarity
            </p>
            <div className="mt-12 text-[112px] leading-none">{result.emoji}</div>
            <h2 className="mt-10 max-w-[840px] text-[86px] font-semibold leading-[0.98]">
              {result.name}
            </h2>
            <p className="mt-8 max-w-[760px] text-[42px] leading-tight text-white/72">
              {result.tagline}
            </p>
          </div>

          <div className="grid grid-cols-[1fr_360px] items-end gap-12">
            <div>
              <p className="text-[42px] leading-tight text-[#90ffbe]">
                {shareCopy}
              </p>
              <div className="mt-10 flex gap-4 text-[32px] text-white/64">
                <span>위험 점수 {stackScore}</span>
                <span>·</span>
                <span>{result.rarity}% rarity</span>
              </div>
            </div>
            <RadarChart dimensions={dimensions} size={360} />
          </div>

          <p className="border-t border-white/14 pt-8 text-[26px] text-white/42">
            교육용 진단 · 의학적 조언 아님
          </p>
          <span className="sr-only">{RESULT_SCREEN_FOOTER}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        className="rounded border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
      >
        공유 이미지 저장
      </button>
    </div>
  );
}
