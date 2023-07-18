// the argument has to be an object type for TS
export function algoMetrics(metrics: any) {
const metricsObj: any = {};

const obj:any = {100: '100', 200: '98', 300: '96', 400: '94', 500: '92', 600: '90', 700: '88', 800: '86', 900: '84', 1000: '82',
1100: '80', 1200: '78', 1300: '76', 1400: '74', 1500: '72', 1600: '70', 1700: '68', 1800: '66', 1900: '64', 2000: '62',
2100: '60', 2200: '58', 2300: '56', 2400: '54', 2500: '52', 2600: '50', 2700: '48', 2800: '46', 2900: '44', 3000: '42' }


// FCP metrics
if (metrics.FCP <= 1800) {
  metricsObj.FCP = 'First contentful paint: ' + metrics.FCP + ' rating: good';
  metricsObj.FCPNum = metrics.FCP;
  let roundScore = Math.round(metrics.FCP / 100) * 100
  console.log(roundScore);
  metricsObj.FCPScore = obj[roundScore];
  metricsObj.FCPColor = 'green'
}
else if (metrics.FCP <= 3000) {
  metricsObj.FCP = 'First contentful paint: ' + metrics.FCP + ' rating: average';
  metricsObj.FCPNum = metrics.FCP;
  let roundScore = Math.round(metrics.FCP / 100) * 100
  metricsObj.FCPScore = obj[roundScore];
  metricsObj.FCPColor = 'yellow'
} else {
  metricsObj.FCP = 'First contentful paint: ' + metrics.FCP + ' rating: bad';
  metricsObj.FCPNum = metrics.FCP;
  let roundScore = Math.round(metrics.FCP / 100) * 100
  metricsObj.FCPScore = obj[roundScore];
  metricsObj.FCPColor = 'red'
}


// console.log(metricsObj);
return metricsObj;
}