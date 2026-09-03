import { commerceTools as phase1Tools } from './commerceTools.js';
import { commerceToolsPhase2 } from './commerceToolsPhase2.js';

export const commerceTools = [...phase1Tools, ...commerceToolsPhase2];
export const commerceToolCategories = [...new Set(commerceTools.map((tool) => tool.category))];
export const commerceToolBySlug = Object.fromEntries(commerceTools.map((tool) => [tool.slug, tool]));
