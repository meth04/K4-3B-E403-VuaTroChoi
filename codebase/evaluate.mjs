import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateQuiz } from './gemini.mjs';
import { GOLDEN_SET } from '../eval/golden-set.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const evalDir = resolve(root, 'eval');

async function nextRunId() {
  const existing = await readFile(resolve(evalDir, 'run-index.txt'), 'utf8').catch(() => '0');
  const run = Number(existing.trim() || '0') + 1;
  await writeFile(resolve(evalDir, 'run-index.txt'), String(run), 'utf8');
  return String(run).padStart(3, '0');
}

function evaluateCase(testCase, response) {
  const result = response.result;
  const statusMatches = result.status === testCase.expectedStatus;
  const hasExpectedSources = !testCase.minSources || result.provenance.length >= testCase.minSources;
  const structurallyValid = result.status !== 'generated' || (
    result.answers.length === 4 && Number.isInteger(result.correctIndex) && result.provenance.length > 0
  );
  const passed = statusMatches && hasExpectedSources && structurallyValid;
  return {
    ...testCase,
    status: result.status,
    passed,
    automatedReason: passed ? 'Đạt contract và hành vi kỳ vọng.' : `Kỳ vọng ${testCase.expectedStatus}; nhận ${result.status}.`,
    result,
    trace: response.trace,
    manualReviewRequired: true
  };
}

await mkdir(evalDir, { recursive: true });
if (!process.env.GEMINI_API_KEY) {
  console.error('Không chạy eval: thiếu GEMINI_API_KEY. Không tạo kết quả giả.');
  process.exitCode = 2;
} else {
  const runId = await nextRunId();
  const rows = [];
  for (const testCase of GOLDEN_SET) {
    try {
      const response = await generateQuiz({ lessonKey: testCase.lessonKey, task: testCase.task, caseId: testCase.id });
      rows.push(evaluateCase(testCase, response));
      console.log(`${testCase.id}: ${rows.at(-1).passed ? 'PASS' : 'FAIL'}`);
    } catch (error) {
      rows.push({ ...testCase, status: 'error', passed: false, automatedReason: error.message, manualReviewRequired: true });
      console.log(`${testCase.id}: ERROR`);
    }
  }

  const passed = rows.filter((row) => row.passed).length;
  const generated = rows.filter((row) => row.status === 'generated');
  const provenanceCorrect = generated.filter((row) => row.result.provenance.length > 0).length;
  const blocked = rows.filter((row) => row.expectedStatus === 'out_of_scope' && row.status === 'out_of_scope').length;
  const summary = {
    runId,
    generatedAt: new Date().toISOString(),
    dataset: 'Synthetic fixture set — not a substitute for protected data-pack cases.',
    total: rows.length,
    passed,
    passRate: Number(((passed / rows.length) * 100).toFixed(1)),
    provenanceCorrect: `${provenanceCorrect}/${generated.length}`,
    outOfScopeBlocked: `${blocked}/3`,
    manualReviewRequired: 'Hai người phải review độc lập ít nhất 5 case khó trước khi dùng số này trong CP3.',
    rows
  };
  const traceLog = rows.map((row) => ({ caseId: row.id, status: row.status, passed: row.passed, trace: row.trace ?? null, error: row.status === 'error' ? row.automatedReason : null }));
  await writeFile(resolve(evalDir, `run-${runId}-results.json`), JSON.stringify(summary, null, 2), 'utf8');
  await writeFile(resolve(evalDir, `ai-call-log-run-${runId}.json`), JSON.stringify(traceLog, null, 2), 'utf8');
  console.log(`Đã lưu eval/run-${runId}-results.json và ai-call-log-run-${runId}.json`);
}
