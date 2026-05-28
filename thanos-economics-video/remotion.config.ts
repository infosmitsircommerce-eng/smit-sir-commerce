import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Output both compositions via CLI flags:
//   npx remotion render --composition=ThanosEconomics-Horizontal
//   npx remotion render --composition=ThanosEconomics-Vertical
