import { runScriptPipeline } from './run-script-pipeline.mjs';
import { POSTBUILD_STAGES } from './build-stages.mjs';

for (const stage of POSTBUILD_STAGES) {
  await runScriptPipeline(stage.name, stage.scripts);
}
