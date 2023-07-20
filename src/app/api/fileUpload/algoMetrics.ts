// the argument has to be an object type for TS
export function algoMetrics(metrics: any) {
  const metricsObj: any = {};


  const obj: any = {
    0: '100', 100: '100', 200: '98', 300: '96', 400: '94', 500: '92', 600: '90', 700: '88', 800: '86', 900: '84', 1000: '82',
    1100: '80', 1200: '78', 1300: '76', 1400: '74', 1500: '72', 1600: '70', 1700: '68', 1800: '66', 1900: '64', 2000: '62',
    2100: '60', 2200: '58', 2300: '56', 2400: '54', 2500: '52', 2600: '50', 2700: '48', 2800: '46', 2900: '44', 3000: '42'
  }

  // const requestObj:any = {: '100', 600: '98', 700: '96', 800: '94', 900: '92', 1000: '90', 1100: '88', 1200: '86', 1300: '84', 1400: '82',
  // 1500: '80', 1700: '78', 1800: '76', 1900: '74', 2000: '72', 2100: '70', 2200: '68', 2300: '66', 2400: '64', 2500: '62',
  // 2600: '60', 2700: '58', 2800: '56', 2900: '54', 3000: '52', 3100: '50', 3200: '48', 3300: '46', 3400: '44', 3500: '42' }

  const domObj: any = {
    300: '100', 400: '96', 500: '92', 600: '88', 700: '84', 800: '80', 900: '76', 1000: '72',
    1100: '68', 1200: '64', 1300: '60', 1400: '56', 1500: '52', 1600: '48', 1700: '44', 1800: '42', 1900: '38', 2000: '34'
  }

  const hydrationObj: any = {
    1: '100', 2: '98', 3: '96', 4: '94', 5: '92', 6: '90', 7: '88', 8: '86', 9: '84', 10: '82',
    11: '80', 12: '78', 13: '76', 14: '74', 15: '72', 16: '70', 17: '68', 18: '66', 19: '64', 20: '62',
    21: '60', 22: '58', 23: '56', 24: '54', 25: '52', 26: '50', 27: '48', 28: '46', 29: '44', 30: '42'
  }

  console.log(metrics);
  // FCP metrics
  if (metrics.FCP <= 1800) {
    metricsObj.FCP = 'First contentful paint: ' + metrics.FCP + ' rating: good';
    metricsObj.FCPNum = Math.round(metrics.FCP * 100) / 100; // round to the nearest hundredth
    let roundScore = Math.round(metrics.FCP / 100) * 100 // round to the nearest 100
    console.log(roundScore);
    metricsObj.FCPScore = obj[roundScore];
    metricsObj.FCPColor = 'green'
  }
  else if (metrics.FCP <= 3000) {
    metricsObj.FCP = 'First contentful paint: ' + metrics.FCP + ' rating: average';
    metricsObj.FCPNum = Math.round(metrics.FCP * 100) / 100;
    let roundScore = Math.round(metrics.FCP / 100) * 100
    metricsObj.FCPScore = obj[roundScore];
    metricsObj.FCPColor = 'yellow'
  } else {
    metricsObj.FCP = 'First contentful paint: ' + metrics.FCP + ' rating: bad';
    metricsObj.FCPNum = Math.round(metrics.FCP * 100) / 100;
    let roundScore = Math.round(metrics.FCP / 100) * 100
    metricsObj.FCPScore = obj[roundScore];
    metricsObj.FCPColor = 'red'
  }

  if (metrics.RequestTime <= 2000) {
    metricsObj.RequestTime = 'Total Request Time' + metrics.RequestTime + ' rating: good';
    metricsObj.RequestNum = Math.round(metrics.RequestTime * 100) / 100;
    let reqRoundScore = Math.round(metrics.RequestTime / 100) * 100
    metricsObj.RequestScore = obj[reqRoundScore];
    metricsObj.RequestColor = 'green'
  } else if (metrics.RequestTime <= 3500) {
    metricsObj.RequestTime = 'Total Request Time' + metrics.RequestTime + ' rating: average';
    metricsObj.RequestNum = Math.round(metrics.RequestTime * 100) / 100;
    let reqRoundScore = Math.round(metrics.RequestTime / 100) * 100
    metricsObj.RequestScore = obj[reqRoundScore];
    metricsObj.RequestColor = 'yellow'
  } else {
    metricsObj.RequestTime = 'Total Request Time' + metrics.RequestTime + ' rating: average';
    metricsObj.RequestNum = Math.round(metrics.RequestTime * 100) / 100;
    let reqRoundScore = Math.round(metrics.RequestTime / 100) * 100
    metricsObj.RequestScore = obj[reqRoundScore];
    metricsObj.RequestColor = 'red'
  }


  // DOM Score metrics
  if (metrics.DOMCompletion <= 800) {
    metricsObj.domComplete = 'DOM Completion time: ' + metrics.DOMCompletion + ' rating: good';
    metricsObj.domCompleteNum = Math.round(metrics.DOMCompletion * 100) / 100;
    let roundDom = Math.round(metrics.DOMCompletion / 100) * 100;
    console.log('roundDom: ' + roundDom);
    roundDom < 300 ? roundDom = 300 : null;
    metricsObj.domScore = obj[roundDom];
    metricsObj.domColor = 'green';
  } else if (metrics.DOMCompletion <= 1300) {
    metricsObj.domComplete = 'DOM Completion time: ' + metrics.DOMCompletion + ' rating: average';
    metricsObj.domCompleteNum = Math.round(metrics.DOMCompletion * 100) / 100
    let roundDom = Math.round(metrics.DOMCompletion / 100) * 100;
    metricsObj.domScore = obj[roundDom];
    metricsObj.domColor = 'yellow';
  } else {
    metricsObj.domComplete = 'DOM Completion time: ' + metrics.DOMCompletion + ' rating: bad';
    metricsObj.domCompleteNum = Math.round(metrics.DOMCompletion * 100) / 100
    let roundDom = Math.round(metrics.DOMCompletion / 100) * 100;
    metricsObj.domScore = obj[roundDom];
    metricsObj.domColor = 'red';
  }

  //Hydration Metrics
  if (metrics.HydrationTime <= 10) {
    metricsObj.Hydration = 'Hydration Time: ' + metrics.HydrationTime + ' rating: good';
    metricsObj.HydrationNum = Math.round(metrics.HydrationTime * 100) / 100;
    let hydrationRoundScore = Math.round(metrics.HydrationTime)
    metricsObj.HydrationScore = hydrationObj[hydrationRoundScore];
    metricsObj.HydrationColor = 'green'
  }
  else if (metrics.HydrationTime <= 24) {
    metricsObj.Hydration = 'Hydration Time: ' + metrics.HydrationTime + ' rating: average';
    metricsObj.HydrationNum = Math.round(metrics.HydrationTime * 100) / 100;
    let hydrationRoundScore = Math.round(metrics.HydrationTime)
    metricsObj.HydrationScore = hydrationObj[hydrationRoundScore];
    metricsObj.HydrationColor = 'yellow'
  } else {
    metricsObj.Hydration = 'Hydration Time: ' + metrics.HydrationTime + ' rating: bad';
    metricsObj.HydrationNum = Math.round(metrics.HydrationTime * 100) / 100;
    let hydrationRoundScore = Math.round(metrics.HydrationTime)
    metricsObj.HydrationScore = hydrationObj[hydrationRoundScore];
    metricsObj.HydrationColor = 'red'
  }

  console.log(metricsObj);
  return metricsObj;
}