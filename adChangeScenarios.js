const _ = require('lodash');
const { changeTypes, frequencyTypes } = require('./constants');

const SCENARIOS = [{
  name: 'Strictly increasing',
  changeDistribution: [{
    changeType: changeTypes.INCREASE,
    frequency: frequencyTypes.STRICTLY
  }]
},
{
  name: 'Strictly increasing or stable',
  changeDistribution: [{
    changeType: changeTypes.INCREASE,
    frequency: frequencyTypes.STRICTLY
  }, {
    changeType: changeTypes.STABLE,
    frequency: frequencyTypes.STRICTLY
  }]
},
{
  name: 'Mostly increasing or stable with occasional decreases',
  changeDistribution: [{
    changeType: changeTypes.INCREASE,
    frequency: frequencyTypes.MOSTLY
  }, {
    changeType: changeTypes.STABLE,
    frequency: frequencyTypes.MOSTLY
  }, {
    changeType: changeTypes.DECREASE,
    frequency: frequencyTypes.OCCASIONALLY
  }]
},
{
  name: 'Mostly stable with occasional increases and decreases',
  changeDistribution: [{
    changeType: changeTypes.STABLE,
    frequency: frequencyTypes.MOSTLY
  }, {
    changeType: changeTypes.INCREASE,
    frequency: frequencyTypes.OCCASIONALLY
  }, {
    changeType: changeTypes.DECREASE,
    frequency: frequencyTypes.OCCASIONALLY
  }]
},
{
  name: 'Mostly decreasing or stable with occasional increases',
  changeDistribution: [{
    changeType: changeTypes.DECREASE,
    frequency: frequencyTypes.MOSTLY
  }, {
    changeType: changeTypes.STABLE,
    frequency: frequencyTypes.MOSTLY
  }, {
    changeType: changeTypes.INCREASE,
    frequency: frequencyTypes.OCCASIONALLY
  }]
},{
  name: 'Strictly decreasing or stable',
  changeDistribution: [{
    changeType: changeTypes.INCREASE,
    frequency: frequencyTypes.STRICTLY
  }, {
    changeType: changeTypes.STABLE,
    frequency: frequencyTypes.STRICTLY
  }]
},{
  name: 'Strictly decreasing',
  changeDistribution: [{
    changeType: changeTypes.DECREASE,
    frequency: frequencyTypes.STRICTLY
  }]
},{
  name: 'Random - Increasing or decreasing',
  changeDistribution: [{
    changeType: changeTypes.INCREASE,
    frequency: frequencyTypes.STRICTLY
  }, {
    changeType: changeTypes.DECREASE,
    frequency: frequencyTypes.STRICTLY
  }]
},{
  name: 'Random - Increasing, Decreasing, Stable',
  changeDistribution: [{
    changeType: changeTypes.INCREASE,
    frequency: frequencyTypes.STRICTLY
  }, {
    changeType: changeTypes.DECREASE,
    frequency: frequencyTypes.STRICTLY
  }, {
    changeType: changeTypes.STABLE,
    frequency: frequencyTypes.STRICTLY
  }]
}]

const MAX_PROBABILITY = 1.0;
const MOSTLY_VS_OCCASIONALLY_RATIO = 2.25;

const getNextChangeForScenario = (scenario) => {
  const changeDistribution = scenario.changeDistribution;
  const probabilityBracket = createProbabilityBracket(changeDistribution);
  const randomValue = Math.random();
  const nextChange = _.find(probabilityBracket, (change) => inInterval(change.probabilityInterval, randomValue));
  return nextChange;
}

const createProbabilityBracket = (changeDistribution) => {
  const changesWithStrictlyFrequency = changeDistribution.filter(change => change.frequency === frequencyTypes.STRICTLY);
  if (changesWithStrictlyFrequency.length > 0) {
    const probabilityIncrement = MAX_PROBABILITY / changesWithStrictlyFrequency.length;
    changesWithStrictlyFrequency.forEach((change, index) => {
      const startRange = probabilityIncrement * index;
      const endRange = probabilityIncrement * (index + 1);
      change.probabilityInterval = [startRange, endRange];
    })
    return changesWithStrictlyFrequency
  }

  const changesWithMostlyFrequency = changeDistribution.filter(change => change.frequency === frequencyTypes.MOSTLY);
  const changesWithOccasionallyFrequency = changeDistribution.filter(change => change.frequency === frequencyTypes.OCCASIONALLY);
  const probabilityIncrement = MAX_PROBABILITY / (changesWithMostlyFrequency.length * MOSTLY_VS_OCCASIONALLY_RATIO + changesWithOccasionallyFrequency.length);

  var endRange = 0;
  changesWithMostlyFrequency.forEach(change => {
    var startRange = endRange;
    endRange = startRange + probabilityIncrement * MOSTLY_VS_OCCASIONALLY_RATIO;
    change.probabilityInterval = [startRange, endRange];
  });
  changesWithOccasionallyFrequency.forEach(change => {
    var startRange = endRange;
    endRange = startRange + probabilityIncrement;
    change.probabilityInterval = [startRange, endRange];
  })
  return changeDistribution
}

const inInterval = (interval, value) => {
  return value >= interval[0] && value <= interval[1];
}

module.exports = {
  scenarios: SCENARIOS,
  getNextChangeForScenario,
};