import { spawn } from 'node:child_process';

export async function runScriptPipeline(label, scripts) {
  const started = Date.now();
  console.log(`\n[${label}] Starting ${scripts.length} verified build steps.\n`);

  for (let index = 0; index < scripts.length; index += 1) {
    const script = scripts[index];
    console.log(`[${label}] ${index + 1}/${scripts.length}: ${script}`);
    const exitCode = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [script], { stdio: 'inherit', env: process.env });
      child.once('error', reject);
      child.once('exit', (code, signal) => {
        if (signal) reject(new Error(`${script} stopped by signal ${signal}`));
        else resolve(code ?? 1);
      });
    });
    if (exitCode !== 0) throw new Error(`[${label}] ${script} failed with exit code ${exitCode}`);
  }

  console.log(`\n[${label}] Completed in ${((Date.now() - started) / 1000).toFixed(1)}s.\n`);
}
