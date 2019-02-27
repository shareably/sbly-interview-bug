const fs = require('fs');
const adInsightsGenerator = require('./adInsightsGenerator');

const AD_INSIGHTS_FILE_NAME = 'adInsights.json';

var loadInsightsPromise;

const writeNewInsightsToFile = () => {
  const adInsights = adInsightsGenerator.generateAdDataForDates('2019-01-25', '2019-01-31');
  const stringified = JSON.stringify(adInsights);
  return promiseToWriteToFile(AD_INSIGHTS_FILE_NAME, stringified);
}

const loadInsights = () => {
  if (loadInsightsPromise) { return loadInsightsPromise }
  loadInsightsPromise = promiseToLoadInsights();
  return loadInsightsPromise;
}

const promiseToLoadInsights = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(AD_INSIGHTS_FILE_NAME, function(err, buf) {
      if (err) {
        console.log(err);
        reject(err)
      } else {
        resolve(JSON.parse(buf.toString()));
      }
    });
  })
}

const promiseToWriteToFile = (name, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(name, data, function(err, data){
        if (err) {
          console.log(err)
          reject(err)
        } else {
          console.log("Successfully Written to File.");
          resolve();
        }
    });
  })
}

module.exports = {
  writeNewInsightsToFile,
  loadInsights
}
