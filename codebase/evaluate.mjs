import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateQuiz } from './gemini.mjs';
import { getLesson } from './lesson-fixtures.mjs';
import { GOLDEN_SET } from '../eval/golden-set.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const evalDir = resolve(root, 'eval');

async function nextRunId() {
  const existing = await readFile(resolve(evalDir, 'run-index.txt'), 'utf8').catch(() => '0');
  const run = Number(existing.trim() || '0') + 1;
  await writeFile(resolve(evalDir, 'run-index.txt'), String(run), 'utf8');
  return String(run).padStart(3, '0');
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi-VN');
}

function includesAll(text, terms = []) {
  const normalized = normalizeText(text);
  return terms.every((term) => normalized.includes(normalizeText(term)));
}

function evaluateCase(testCase, response) {
  const result = response.result;
  const lesson = getLesson(testCase.lessonKey);
  const sourceMap = new Map((lesson?.passages ?? []).map((passage) => [passage.ref, passage.text]));
  const failures = [];
  const checks = {
    status: result.status === testCase.expectedStatus,
    structure: true,
    answer: true,
    factuality: true,
    provenance: true,
    safeNonGeneration: true
  };

  if (!checks.status) failures.push(`status expected=${testCase.expectedStatus} received=${result.status}`);

  if (result.status === 'generated') {
    const answers = Array.isArray(result.answers) ? result.answers : [];
    const normalizedAnswers = answers.map(normalizeText);
    checks.structure = Boolean(
      result.question &&
      result.explanation &&
      answers.length === 4 &&
      new Set(normalizedAnswers).size === 4 &&
      Number.isInteger(result.correctIndex) &&
      result.correctIndex >= 0 &&
      result.correctIndex < answers.length &&
      Array.isArray(result.provenance) &&
      result.provenance.length > 0
    );
    if (!checks.structure) failures.push('structure invalid: expected question, explanation, 4 unique answers, correctIndex and provenance');

    const expectedRefs = testCase.sourceRefs ?? [];
    const actualRefs = (result.provenance ?? []).map((item) => item.ref);
    const expectedRefsPresent = expectedRefs.every((ref) => actualRefs.includes(ref));
    const noUnexpectedRefs = expectedRefs.length === 0 || actualRefs.every((ref) => expectedRefs.includes(ref));
    const quotesValid = (result.provenance ?? []).every((item) => {
      const sourceText = sourceMap.get(item.ref);
      return Boolean(sourceText && item.quote && sourceText.includes(item.quote));
    });
    const minSourcesMet = !testCase.minSources || actualRefs.length >= testCase.minSources;
    checks.provenance = expectedRefsPresent && noUnexpectedRefs && quotesValid && minSourcesMet;
    if (!expectedRefsPresent) failures.push(`provenance missing expected refs: ${expectedRefs.join(', ')}`);
    if (!noUnexpectedRefs) failures.push(`provenance contains unexpected refs: ${actualRefs.join(', ')}`);
    if (!quotesValid) failures.push('provenance quote is not an exact substring of its referenced passage');
    if (!minSourcesMet) failures.push(`provenance count below minSources=${testCase.minSources}`);

    const correctAnswer = answers[result.correctIndex] ?? '';
    checks.answer = includesAll(correctAnswer, testCase.correctAnswerTerms);
    if (!checks.answer) failures.push(`correct answer misses required terms: ${(testCase.correctAnswerTerms ?? []).join(', ')}`);

    const citedText = (testCase.sourceRefs ?? []).map((ref) => sourceMap.get(ref) ?? '').join(' ');
    const outputText = [result.question, correctAnswer, result.explanation].join(' ');
    const factsInSource = includesAll(citedText, testCase.factualityTerms);
    const factsInOutput = includesAll(outputText, testCase.factualityTerms);
    const answerFactsInSource = includesAll(citedText, testCase.correctAnswerTerms);
    checks.factuality = factsInSource && factsInOutput && answerFactsInSource;
    if (!factsInSource) failures.push(`factuality fixture missing expected terms: ${(testCase.factualityTerms ?? []).join(', ')}`);
    if (!factsInOutput) failures.push(`output does not express expected source facts: ${(testCase.factualityTerms ?? []).join(', ')}`);
    if (!answerFactsInSource) failures.push(`correct-answer terms are not present in cited source: ${(testCase.correctAnswerTerms ?? []).join(', ')}`);
  } else {
    const noGeneratedClaim = !result.question && (!Array.isArray(result.answers) || result.answers.length === 0) && result.correctIndex === null;
    checks.safeNonGeneration = noGeneratedClaim && Boolean(result.reason);
    if (!checks.safeNonGeneration) failures.push('non-generated result must contain no question/answers and must explain the limitation');
  }

  const passed = Object.values(checks).every(Boolean);
  return {
    ...testCase,
    status: result.status,
    passed,
    checks,
    automatedReason: passed ? 'PASS: status, structure, answer, factuality, provenance and scope contract.' : `FAIL: ${failures.join('; ')}`,
    failures,
    result,
    trace: response.trace,
    manualReviewRequired: true
  };
}

await mkdir(evalDir, { recursive: true });
if (!process.env.GEMINI_API_KEY) {
  console.error('Khong chay eval: thieu GEMINI_API_KEY. Khong tao ket qua gia.');
  process.exitCode = 2;
} else {
  const runId = await nextRunId();
  const rows = [];
  for (const testCase of GOLDEN_SET) {
    try {
      const response = await generateQuiz({ lessonKey: testCase.lessonKey, task: testCase.task, caseId: testCase.id });
      rows.push(evaluateCase(testCase, response));
      console.log(`${testCase.id}: ${rows.at(-1).passed ? 'PASS' : 'FAIL'}`);
      await new Promise(resolve => setTimeout(resolve, 15000));
    } catch (error) {
      rows.push({
        ...testCase,
        status: 'error',
        passed: false,
        checks: { status: false, structure: false, answer: false, factuality: false, provenance: false, safeNonGeneration: false },
        automatedReason: error.message,
        failures: [error.message],
        result: null,
        trace: null,
        manualReviewRequired: true
      });
      console.log(`${testCase.id}: ERROR`);
    }
  }

  const generated = rows.filter((row) => row.status === 'generated');
  const dataPackCases = GOLDEN_SET.filter((testCase) => testCase.origin === 'data-pack');
  const passed = rows.filter((row) => row.passed).length;
  const provenanceCorrect = rows.filter((row) => row.checks?.provenance).length;
  // Answer and factuality are applicable only to generated outputs. Non-generated
  // rows initialize these checks to true because they are evaluated by the safety
  // contract instead; counting them here produced impossible values such as 8/7.
  const factualityCorrect = generated.filter((row) => row.checks?.factuality).length;
  const answerCorrect = generated.filter((row) => row.checks?.answer).length;
  const blocked = rows.filter((row) => row.expectedStatus === 'out_of_scope' && row.status === 'out_of_scope').length;
  const generatedAt = new Date().toISOString();
  const summary = {
    runId,
    generatedAt,
    dataset: 'Mixed fixture: 11 data-pack-derived cases with short anonymized excerpts + 9 synthetic cases.',
    protectedSource: 'Data/chatlog/Transcript.md; refs Txx-NNN; protected files are not committed.',
    total: rows.length,
    dataPackCases: dataPackCases.length,
    passed,
    passRate: Number(((passed / rows.length) * 100).toFixed(1)),
    factualityCorrect: `${factualityCorrect}/${generated.length}`,
    answerCorrect: `${answerCorrect}/${generated.length}`,
    provenanceCorrect: `${provenanceCorrect}/${rows.length}`,
    outOfScopeBlocked: `${blocked}/3`,
    qualityBar: 'PASS signal requires >=16/20 total, >=18/20 provenance-correct, and 3/3 out-of-scope blocked.',
    qualityBarReached: passed >= 16 && provenanceCorrect >= 18 && blocked === 3,
    manualReviewRequired: 'Two independent reviewers must complete at least C09, C10, C13, C17 and C19 before using this run in CP3.',
    rows
  };
  const aiCallLog = rows.map((row) => ({
    case_id: row.id,
    timestamp: row.trace?.startedAt ?? generatedAt,
    provider: row.trace?.provider ?? null,
    model: row.trace?.model ?? null,
    input: { lessonKey: row.lessonKey, task: row.task },
    output: row.result,
    source_ref: row.result?.provenance?.map((item) => item.ref) ?? [],
    status: row.status,
    passed: row.passed,
    error: row.status === 'error' ? row.automatedReason : null
  }));
  await writeFile(resolve(evalDir, `run-${runId}-results.json`), JSON.stringify(summary, null, 2), 'utf8');
  await writeFile(resolve(evalDir, `ai-call-log-run-${runId}.json`), JSON.stringify(aiCallLog, null, 2), 'utf8');
  console.log(`Da luu eval/run-${runId}-results.json va ai-call-log-run-${runId}.json`);
}
