
import { generateQuiz } from './codebase/gemini.mjs';

async function main() {
  try {
    const res = await generateQuiz({ lessonKey: 'dataPack', task: 'Sinh cau hoi', caseId: 'test' });
    console.log(res);
  } catch(e) {
    console.error(e);
  }
}
main();
