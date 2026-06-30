import { QUIZ_RESULTS, RESULT_SCREEN_FOOTER } from '../src/config/quiz.ts';

const BANNED_COPY = /\b(take|dose|dosage|treat|cure|prescrib|should take|recommend)\b/i;

interface CopyEntry {
  label: string;
  text: string;
}

const entries: CopyEntry[] = [
  { label: 'result.footer', text: RESULT_SCREEN_FOOTER },
  ...QUIZ_RESULTS.flatMap((result) => [
    { label: `${result.id}.name`, text: result.name },
    { label: `${result.id}.tagline`, text: result.tagline },
    { label: `${result.id}.description`, text: result.description },
    { label: `${result.id}.resetHint`, text: result.resetHint },
    { label: `${result.id}.paidReportAngle`, text: result.paidReportAngle },
    { label: `${result.id}.paywallHeadline`, text: result.paywallHeadline },
    { label: `${result.id}.share.normal`, text: result.shareCopy.normal },
    { label: `${result.id}.share.strong`, text: result.shareCopy.strong },
    { label: `${result.id}.share.roast`, text: result.shareCopy.roast },
    ...result.signals.map((signal, index) => ({
      label: `${result.id}.signals.${index}`,
      text: signal,
    })),
  ]),
];

const violations = entries.filter((entry) => BANNED_COPY.test(entry.text));

if (violations.length > 0) {
  console.error('Safety copy lint failed. Remove medical-action words from result/paywall/share copy.');
  for (const violation of violations) {
    console.error(`- ${violation.label}: ${violation.text}`);
  }
  process.exit(1);
}

console.log(`Safety copy lint passed (${entries.length} strings checked).`);
