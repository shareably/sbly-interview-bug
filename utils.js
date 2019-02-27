const moment = require('moment');
const crypto = require("crypto");

const gaussianRandomUniform = () => {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
}

const gaussianRandom = (start, end) => {
  return start + gaussianRandomUniform() * (end - start);
}

const enumerateDaysBetweenDates = (startDate, endDate, dateFormat) => {
  dateFormat = dateFormat || 'YYYY-MM-DD';
  var dates = [];

  var currDate = moment(startDate, dateFormat).clone().startOf('day');
  var lastDate = moment(endDate, dateFormat).startOf('day');

  do {
      dates.push(currDate.clone().format(dateFormat));
  }
  while(currDate.add(1, 'days').diff(lastDate) <= 0)

  return dates;
}

const uniqueId = () => {
  const s4 = () => {
    return crypto.randomBytes(2).toString("hex")
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

module.exports = {
  gaussianRandom,
  gaussianRandomUniform,
  enumerateDaysBetweenDates,
  uniqueId
}