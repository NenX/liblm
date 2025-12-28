import { set, get } from 'lodash';
import { getLineArea } from './func';

export const bmiData1 = {
  bmiIntro: '体重过轻,建议孕期体重增长目标:12.5-18kg',
  bmiBottomLine: [
    { x: 0, y: 0 },
    { x: 12, y: 1.5 },
    { x: 39, y: 12.5 },
  ],
  bmiTopLine: [
    { x: 0, y: 0 },
    { x: 12, y: 3 },
    { x: 39, y: 18 },
  ],
  bmiLinesPoints: [
    { x: 0, y: 0 },
    { x: 12, y: 1.5 },
    { x: 39, y: 12.5 },
    { x: 39, y: 18 },
    { x: 12, y: 3 },
    { x: 0, y: 0 },
  ],
};
export const bmiData2 = {
  bmiIntro: '体重正常，建议增长体重增长目标11.5-16kg',
  bmiBottomLine: [
    { x: 0, y: 0 },
    { x: 12, y: 1.5 },
    { x: 39, y: 11.5 },
  ],
  bmiTopLine: [
    { x: 0, y: 0 },
    { x: 12, y: 3 },
    { x: 39, y: 16 },
  ],
  bmiLinesPoints: [
    { x: 0, y: 0 },
    { x: 12, y: 1.5 },
    { x: 39, y: 11.5 },
    { x: 39, y: 16 },
    { x: 12, y: 3 },
    { x: 0, y: 0 },
  ],
};
export const bmiData3 = {
  bmiIntro: '体重超重，建议增长体重增长目标7-11.5kg',
  bmiBottomLine: [
    { x: 0, y: 0 },
    { x: 12, y: 1.5 },
    { x: 39, y: 7 },
  ],
  bmiTopLine: [
    { x: 0, y: 0 },
    { x: 12, y: 3 },
    { x: 39, y: 11.5 },
  ],
  bmiLinesPoints: [
    { x: 0, y: 0 },
    { x: 12, y: 1.5 },
    { x: 39, y: 7 },
    { x: 39, y: 11.5 },
    { x: 12, y: 3 },
    { x: 0, y: 0 },
  ],
};
export const bmiData4 = {
  bmiIntro: '体重肥胖，建议增长体重增长目标5-9kg',
  bmiBottomLine: [
    { x: 0, y: 0 },
    { x: 12, y: 1.5 },
    { x: 39, y: 5 },
  ],
  bmiTopLine: [
    { x: 0, y: 0 },
    { x: 12, y: 3 },
    { x: 39, y: 9 },
  ],
  bmiLinesPoints: [
    { x: 0, y: 0 },
    { x: 12, y: 1.5 },
    { x: 39, y: 5 },
    { x: 39, y: 9 },
    { x: 12, y: 3 },
    { x: 0, y: 0 },
  ],
};

export const acData = {
  bottomLine: [
    { x: 5.5, y: 8 },
    { x: 10, y: 12.8 },
    { x: 15, y: 18 },
    { x: 20, y: 22.8 },
    { x: 25, y: 27.2 },
    { x: 30, y: 31 },
  ],
  middleLine: [
    { x: 5.5, y: 9.3 },
    { x: 10, y: 14.4 },
    { x: 15, y: 20 },
    { x: 20, y: 25.2 },
    { x: 25, y: 30 },
    { x: 30, y: 34 },
  ],
  topLine: [
    { x: 5.5, y: 10.5 },
    { x: 10, y: 15.8 },
    { x: 15, y: 22 },
    { x: 20, y: 27.7 },
    { x: 25, y: 32.8 },
    { x: 30, y: 37 },
  ],
};
set(acData, 'lineArea', getLineArea(get(acData, 'bottomLine'), get(acData, 'topLine')));

export const flData = {
  bottomLine: [
    { x: 2, y: 2.5 },
    { x: 5.5, y: 13.3 },
    { x: 10, y: 26.4 },
    { x: 15, y: 38.6 },
    { x: 20, y: 49.5 },
    { x: 25, y: 59.2 },
    { x: 30, y: 67 },
  ],
  middleLine: [
    { x: 2, y: 6 },
    { x: 5.5, y: 17.4 },
    { x: 10, y: 30.7 },
    { x: 15, y: 43 },
    { x: 20, y: 54 },
    { x: 25, y: 63.5 },
    { x: 30, y: 72 },
  ],
  topLine: [
    { x: 2, y: 9 },
    { x: 5.5, y: 20.7 },
    { x: 10, y: 34 },
    { x: 15, y: 47.5 },
    { x: 20, y: 58.5 },
    { x: 25, y: 68.8 },
    { x: 30, y: 77 },
  ],
};
set(flData, 'lineArea', getLineArea(get(flData, 'bottomLine'), get(flData, 'topLine')));

export const bpdData = {
  bottomLine: [
    { x: 2, y: 14.8 },
    { x: 5.5, y: 26.7 },
    { x: 10, y: 41.5 },
    { x: 15, y: 56.5 },
    { x: 20, y: 70 },
    { x: 25, y: 80.8 },
    { x: 27.5, y: 84.7 },
    { x: 30, y: 87 },
  ],
  middleLine: [
    { x: 2, y: 20.5 },
    { x: 5.5, y: 32.7 },
    { x: 10, y: 47.5 },
    { x: 15, y: 63 },
    { x: 20, y: 76.7 },
    { x: 25, y: 87.5 },
    { x: 27.5, y: 91.7 },
    { x: 30, y: 94 },
  ],
  topLine: [
    { x: 2, y: 25 },
    { x: 5.5, y: 38 },
    { x: 10, y: 53.5 },
    { x: 15, y: 69.2 },
    { x: 20, y: 82.5 },
    { x: 25, y: 93.4 },
    { x: 27.5, y: 97.6 },
    { x: 30, y: 100.8 },
  ],
};
set(bpdData, 'lineArea', getLineArea(get(bpdData, 'bottomLine'), get(bpdData, 'topLine')));

export const fundalHeightData = {
  topSolidLine: [
    { x: 1, y: 7 },
    { x: 2, y: 8 },
    { x: 3, y: 8 },
    { x: 5, y: 10 },
    { x: 7, y: 11.5 },
    { x: 9, y: 13.5 },
    { x: 11, y: 15 },
    { x: 13, y: 16.5 },
    { x: 15, y: 18 },
    { x: 17, y: 19.5 },
    { x: 19, y: 20.5 },
    { x: 21, y: 21.5 },
    { x: 23, y: 22.5 },
    { x: 25, y: 23.5 },
    { x: 26, y: 23 },
    { x: 27, y: 23 },
  ],
  bottomSolidLine: [
    { x: 1, y: 0 },
    { x: 3, y: 1 },
    { x: 5, y: 3 },
    { x: 7, y: 4.5 },
    { x: 9, y: 6 },
    { x: 11, y: 7 },
    { x: 13, y: 8.5 },
    { x: 15, y: 10.5 },
    { x: 17, y: 12.5 },
    { x: 19, y: 13.5 },
    { x: 21, y: 15 },
    { x: 23, y: 16 },
    { x: 25, y: 17.5 },
    { x: 27, y: 17 },
  ],
  topDashLine: [
    { x: 1, y: 5.5 },
    { x: 2, y: 7 },
    { x: 3, y: 7 },
    { x: 5, y: 8.5 },
    { x: 7, y: 10 },
    { x: 9, y: 12 },
    { x: 11, y: 13.5 },
    { x: 13, y: 15 },
    { x: 15, y: 16.5 },
    { x: 17, y: 18.5 },
    { x: 19, y: 19 },
    { x: 21, y: 20.5 },
    { x: 23, y: 21 },
    { x: 25, y: 22.5 },
    { x: 26, y: 22 },
    { x: 27, y: 22 },
  ],
  bottomDashLine: [
    { x: 1, y: 1.5 },
    { x: 3, y: 2.5 },
    { x: 5, y: 4.5 },
    { x: 7, y: 6 },
    { x: 9, y: 7.5 },
    { x: 11, y: 8.5 },
    { x: 13, y: 10 },
    { x: 15, y: 12.5 },
    { x: 17, y: 14.5 },
    { x: 19, y: 14.5 },
    { x: 21, y: 16 },
    { x: 23, y: 17.5 },
    { x: 25, y: 18.5 },
    { x: 26, y: 18 },
    { x: 27, y: 17.5 },
  ],
};
set(
  fundalHeightData,
  'lineArea',
  getLineArea(get(fundalHeightData, 'bottomSolidLine'), get(fundalHeightData, 'topSolidLine')),
);
