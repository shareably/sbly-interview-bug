const _ = require('lodash');
const adInsightsIO = require('./adInsightsIO');
const adInsightsByDatePromise = adInsightsIO.loadInsights();

const getAd = (adId) => {
  return adInsightsByDatePromise.then(adInsights => {
    const allInsights = _.flatten(Object.values(adInsights));
    const allAdIds = _.uniq(allInsights.map(insight => insight.id));
    const hasAdId = allAdIds.includes(adId);
    if (hasAdId) {
      return {
        id: adId,
        budget: 10
      }
    } else {
      return Promise.reject({
        'status': 404,
        'error': `No ad with id ${adId} found.`
      })
    }
  })
}

module.exports = {
  getAd
}
