import { runScriptPipeline } from './run-script-pipeline.mjs';
import { PREBUILD_STAGES } from './build-stages.mjs';

for (const stage of PREBUILD_STAGES) {
  await runScriptPipeline(stage.name, stage.scripts);
}
