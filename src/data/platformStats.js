import { seoMaterials } from './seoMaterials.js';
import { gsebMaterials, gsebPremiumEconomicsMaterials } from './gsebMaterials.js';
import { ccspMaterials } from './ccspMaterials.js';
import { verifiedQuizPacks } from './quizCatalog.js';
import { cbse12AccountancyPremiumMaterials } from './cbse12AccountancyPremium.js';
import { gseb11AccountancyPremiumMaterials } from './gsebAccountancyPremium.js';
import { commerceTools } from './allCommerceTools.js';
import { netGsetFreePdfCount } from './netGsetStats.js';

export const freeNoteCount = seoMaterials.length
  + gsebMaterials.length
  + ccspMaterials.length
  + netGsetFreePdfCount;

const cbseEconomicsGuideCount = verifiedQuizPacks.filter(
  (pack) => pack.board === 'CBSE' && pack.subject === 'Economics',
).length;

export const premiumResourceCount = cbseEconomicsGuideCount
  + gsebPremiumEconomicsMaterials.length
  + cbse12AccountancyPremiumMaterials.length
  + gseb11AccountancyPremiumMaterials.length;

export const totalNoteCount = freeNoteCount + premiumResourceCount;
export const quizQuestionCount = verifiedQuizPacks.reduce(
  (total, pack) => total + Object.values(pack.levelCounts || {}).reduce((sum, count) => sum + Number(count || 0), 0),
  0,
);
export const quizChapterCount = verifiedQuizPacks.length;
export const toolCount = commerceTools.length;
