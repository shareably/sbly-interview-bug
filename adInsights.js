const adInsightsIO = require('./adInsightsIO');
const adInsightsByDatePromise = adInsightsIO.loadInsights();

const getAdInsights = (date, metrics) => {
  return adInsightsByDatePromise.then(adInsights => {
    const adInsightsForDate = adInsights[date] || [];

    const filteredInsight = {};
    const filteredInsights = adInsightsForDate.map(adInsight => {
      metrics.forEach(metric => {
        const insightValueForMetric = adInsight[metric];
        if (insightValueForMetric) {
          filteredInsight[metric] = insightValueForMetric;
        }
      })
      filteredInsight.id = adInsight.id;
      return filteredInsight;
    })

    return filteredInsights;
  })
}

module.exports = {
  getAdInsights
}
