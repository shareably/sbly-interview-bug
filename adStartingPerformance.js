const { baseTypes } = require('./constants')
const utils = require('./utils');
const _ = require('lodash')

const STARTING_BASE_TYPES = [
  baseTypes.POSITIVE,
  baseTypes.NEUTRAL,
  baseTypes.NEGATIVE
]

const NEGATIVE_RANGE = [-1, -0.05];
const NEUTRAL_RANGE = [-0.25, 0.25];
const POSITIVE_RANGE = [0.05, 0.75];

const profitabilityRangeForType = (baseType) => {
  if (baseType === baseTypes.POSITIVE) {
    return POSITIVE_RANGE
  } else if (baseType === baseTypes.NEUTRAL) {
    return NEUTRAL_RANGE
  } else {
    return NEGATIVE_RANGE
  }
}

const generateSeedInsight = (spend, baseType) => {
  const seedPerformance = generateSeedPerformance(baseType);
  return generateSeedInsightForSeedPerformance(spend, seedPerformance);
}

const generateSeedInsightForSeedPerformance = (spend, seedPerformance) => {
  const impressions = Math.floor(spend / seedPerformance.costPerImpression);
  const clicks = Math.floor(impressions * seedPerformance.clickThroughRate);
  const revenue = _.round(spend * (seedPerformance.profitability + 1), 2);

  return {
    spend,
    revenue,
    impressions,
    clicks,
    seedPerformance
  }
}

const generateSeedPerformance = (baseType) => {
  const profitabilityRange = profitabilityRangeForType(baseType);
  const costPerImpressionRange = [0.0017, 0.0023];
  const clickThroughRateRange = [0.03, 0.16];

  const profitability = utils.gaussianRandom(profitabilityRange[0], profitabilityRange[1]);
  const costPerImpression = utils.gaussianRandom(costPerImpressionRange[0], costPerImpressionRange[1]);
  const clickThroughRate = utils.gaussianRandom(clickThroughRateRange[0], clickThroughRateRange[1]);

  return {
    profitability,
    costPerImpression,
    clickThroughRate
  }
}

module.exports = {
  startingBaseTypes: STARTING_BASE_TYPES,
  generateSeedInsight,
  generateSeedInsightForSeedPerformance,
}