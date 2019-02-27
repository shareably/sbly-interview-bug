const _ = require('lodash');
const moment = require('moment');
const utils = require('./utils');

const { changeTypes, frequencyTypes, baseTypes } = require('./constants')
const { scenarios, getNextChangeForScenario } = require('./adChangeScenarios');
const { startingBaseTypes, generateSeedInsight, generateSeedInsightForSeedPerformance } = require('./adStartingPerformance');

const BUDGET = 10;

const generateSeedAdInsights = () => {
  return _.flatten(scenarios.map(scenario => {
    return startingBaseTypes.map(startingBaseType => {
      return  {
        scenario,
        startingBaseType,
        insight: generateAdInsightForScenarioWithStartingType(scenario, startingBaseType)
      }
    })
  }))
}

const generateAdInsightForScenarioWithStartingType = (scenario, startingBaseType) => {
  const spend = generateSpend();
  const startingPerformance = generateSeedInsight(spend, startingBaseType);
  startingPerformance.id = utils.uniqueId();
  return startingPerformance;
}

const getNextProfitablityForChange = (profitability, change) => {
  var profitabilityChange;

  if (change.changeType === changeTypes.INCREASE) {
    const centeredAround = profitabilityChangeCenterForIncrease(profitability) * 3 / 4;
    const spread = centeredAround * 1;
    profitabilityChange = utils.gaussianRandom(centeredAround - spread, centeredAround + spread);

  } else if (change.changeType === changeTypes.DECREASE) {
    const centeredAround = profitabilityChangeCenterForDecrease(profitability) * 3 / 4;
    const spread = centeredAround * 1;
    profitabilityChange = utils.gaussianRandom(centeredAround - spread, centeredAround + spread);

  } else {
    profitabilityChange = utils.gaussianRandom(-0.15, 0.15);
  }

  return Math.max(profitability + profitabilityChange, -1);
}

const profitabilityChangeCenterForIncrease = (profitability) => {
  const rescaledProfitability = profitability * 100 + 100;
  return (-6.867546 + (50.00575 + 6.867546)/(1 + Math.pow(rescaledProfitability /130.5744, 1.067217))) / 100;
}

const profitabilityChangeCenterForDecrease = (profitability) => {
  const rescaledProfitability = profitability * 100 + 100;
  return -(20597.08 + (0.09348613 - 20597.08)/Math.pow(1 + Math.pow(rescaledProfitability/404999.8, 0.6820505), 0.433269)) / 100;
}

const generateNextInsight = (seedPerformance, scenario) => {
  const { costPerImpression, clickThroughRate, profitability } = seedPerformance;

  const maximumMovementForCPI = 0.0007;
  const maximumMovementForCTR = 0.05;

  const minimumCPI = 0.001;
  const maximumCTR = 0.25;
  const minimumCTR = 0.005;

  const rawNewCPI = utils.gaussianRandom(costPerImpression - maximumMovementForCPI, costPerImpression + maximumMovementForCPI);
  const rawNewCTR = utils.gaussianRandom(clickThroughRate - maximumMovementForCTR, clickThroughRate + maximumMovementForCTR);

  const boundCPI = Math.max(rawNewCPI, minimumCPI);
  const boundCTR = Math.max(Math.min(rawNewCTR, maximumCTR), minimumCTR);

  const rawCPIMovement = rawNewCPI - costPerImpression;
  const rawCTRMovement = rawNewCTR - clickThroughRate;
  const netCPIMovement = boundCPI - costPerImpression;
  const netCTRMovement = boundCTR - clickThroughRate;

  const nextChange = getNextChangeForScenario(scenario);
  const nextProfitability = getNextProfitablityForChange(profitability, nextChange);
  const nextSpend = generateSpend();

  const nextSeedPerformance = {
    profitability: nextProfitability,
    costPerImpression: boundCPI,
    clickThroughRate: boundCTR,
    difference: {
      profitability: nextProfitability - profitability,
      rawCPI: rawCPIMovement,
      rawCTR: rawCTRMovement,
      netCPI: netCPIMovement,
      netCTR: netCTRMovement
    }
  }

  return generateSeedInsightForSeedPerformance(nextSpend, nextSeedPerformance)
}

const generateSpend = () => {
  return spendForBudget(BUDGET, 8, 2, 0, 10);
}

const spendForBudget = (budget, lowerSpread, upperSpread, minimum, maximum) => {
  const rawSpend = utils.gaussianRandom(budget - lowerSpread, budget + upperSpread);
  return _.round(Math.max(minimum, Math.min(rawSpend, maximum)), 2)
}

const generateAdDataForDates = (startDate, endDate) => {
  const seedAdInsights = generateSeedAdInsights();
  const allDates = utils.enumerateDaysBetweenDates(startDate, endDate);

  seedAdInsights.forEach(seedInsight => {
    seedInsight.insight.date = startDate;
  })

  const insightsOverTimeArray = seedAdInsights.map(seedInsight => {
    const initialInsightScenario = seedInsight.scenario;
    const initialInsight = seedInsight.insight;

    var insightsOverTime = []
    allDates.forEach((date, index) => {
      if (date === startDate) { 
        insightsOverTime.push(initialInsight);
      } else {
        const previousInsight = insightsOverTime[index - 1];
        const nextInsight = generateNextInsight(previousInsight.seedPerformance, initialInsightScenario);
        nextInsight.id = previousInsight.id;
        nextInsight.date = date;
        insightsOverTime.push(nextInsight);
      }
    })

    return insightsOverTime;
  })

  const allInsights = _.flatten(insightsOverTimeArray);

  allInsights.forEach(insight => {
    delete insight.seedPerformance;
  })

  return _.groupBy(allInsights, 'date');
}

module.exports = {
  generateAdDataForDates
}