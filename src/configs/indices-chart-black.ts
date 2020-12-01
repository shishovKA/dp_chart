import { Chart } from "../classes/Chart"
import { Ticks } from "../classes/Ticks"

export let chart: Chart;
let cbhRow: number[] = [];
let xLabels: Date[] = [];
let zeroSeries: number[] = [];

let seriesLabeled: number[][];
let seriesText: string[]
const gapY: number = 0.08;

const bezier = require('bezier-easing');
const easing = bezier(0.65, 0, 0.35, 1);

// @ts-ignore
export function createChart(container, data) {

  // @ts-ignore
  chart = new Chart(container, [0, 900], [0, 2000]);

  [xLabels, cbhRow, zeroSeries, seriesLabeled, seriesText] = [...data];

  // ось X
  chart.xAxis.setOptions('start', 0.5, 'black');
  chart.xAxis.display = true;
  chart.xAxis.ticks.display = true;
  // @ts-ignore
  chart.xAxis.ticks.setCustomLabels(xLabels);
  chart.xAxis.ticks.setOptions(true, 'customDateTicks', ['half month', 'year', 'half year', 'third year', 'quarter year']);
  chart.xAxis.ticks.settickDrawOptions(-6, 0.5, 'black');
  chart.xAxis.ticks.label.setOptions(true, '#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"'])
  chart.xAxis.ticks.label.isUpperCase = true;
  chart.xAxis.grid.setOptions(true, '#B2B2B2', 1, [1, 2]);

  // ось Y
  chart.yAxis.setOptions('end', 1, '#B2B2B2', [1, 2]);
  chart.yAxis.display = true;
  chart.yAxis.position = 'end';
  chart.yAxis.ticks.setOptions(true, 'niceCbhStep', [1, 5, 10, 15, 20, 25, 30]);
  chart.yAxis.ticks.settickDrawOptions(-50, 1, '#B2B2B2', [1, 2]);
  chart.yAxis.ticks.label.setOptions(true, '#B2B2B2', 'right', 0, ['12', '"Transcript Pro"']);
  chart.yAxis.ticks.label.setOffset(30, 10);
  chart.yAxis.ticks.label.units = '%';
  chart.yAxis.grid.setOptions(true, '#B2B2B2', 1, [1, 2]);

  //добавляем custom ticks для Y
  const zeroTick = new Ticks(chart.yAxis.type);
  zeroTick.setOptions(true, 'zero');
  zeroTick.settickDrawOptions(-50, 1, '#000000', [2, 1]);
  zeroTick.label.display = false;
  zeroTick.hasAnimation = true;
  zeroTick.timeFunc = easing;
  chart.yAxis.addCustomTicks(zeroTick);

  const minTick = new Ticks(chart.yAxis.type);
  minTick.setOptions(true, 'min');
  minTick.settickDrawOptions(-50, 0.5, 'black', []);
  minTick.label.display = false;
  chart.yAxis.addCustomTicks(minTick);

  // создаем Plots
  chart.addPlot('black_line', 'line', 1, '#000000', []); //черная линия
  chart.addPlot('light_gray_area', 'area_bottom', 0, '#F2F2F2', '#F2F2F2', 0); //серая заливка области
  chart.addPlot('zero_line', 'line', 1, '#000000', [2, 1]); //пунктирная линия 0
  chart.addPlot('labeled', 'text', 1, '#000000', '#000000') //график с лейблами
    .label.setOptions(true, 'black', 'top', 10+15+10, ['18', '"Transcript Pro"'])
    .setOutline({ width: 5, color: 'white' })

  let seriesRow = calculateDeviationsVal(cbhRow, cbhRow[0]);
  let seriesL = [seriesLabeled[0], calculateDeviationsVal(seriesLabeled[1], cbhRow[0])];

  // создаем Series и привязвыаем к ним инструменты отрисовки Plots
  chart.addSeriesRow('cyberHedge_area', [seriesRow]).setPlotsIds('light_gray_area');
  chart.addSeriesRow('cyberHedge_line', [seriesRow]).setPlotsIds('black_line');
  chart.addSeriesRow('zero_line', [zeroSeries]).setPlotsIds('zero_line');
  chart.addSeries('cyberHedge_labels', seriesL, seriesText).setPlotsIds('labeled');



  // настраиваем Min Max осей
  chart.xAxis.setMinMax(chart.data.findExtremes('val'), false); //по экстремумам оси X
  chart.yAxis.setMinMax(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max), false); //scale to fit по Y
  chart.yAxis.setMinMax([chart.yAxis.min - gapY * chart.yAxis.length, chart.yAxis.max + gapY * chart.yAxis.length], false); //добавляем по отступам как на сайте


  //включаем анимацию
  chart.xAxis.ticks.switchAnimation(true, 300);
  chart.yAxis.ticks.switchAnimation(true, 300);
  chart.switchDataAnimation(true, 300);
  chart.data.changeAllSeriesAnimationTimeFunction(easing);
  chart.setCanvasPaddings(25, 80, 40, 20); // задаем отступы для области отрисовки

}


// преобразование данных ряда из абсолютных величин в % относительно zeroPoint
function calculateDeviationsVal(rowData: number[], zeroPoint: number) {
  let chartDataVariation = [];
  chartDataVariation = [];
  for (let j = 0, m = rowData.length; j < m; j++) {
    chartDataVariation.push(100 * (rowData[j] - zeroPoint) / zeroPoint);
  }
  return chartDataVariation;
}


// подключение слушателей к разметке как на cbh


//функция вешает слушатели на панель ranges
(function prepareRangesMenu() {
  let ranges = document.querySelectorAll('.ranges_black li');
  ranges.forEach((item) => {
    item.addEventListener('click', () => {
      // @ts-ignore
      document.querySelector('.ranges_black li.selected').classList.remove('selected');
      item.classList.add('selected');
      const lastLb = xLabels[xLabels.length - 1];
      let maxDate = lastLb,
        minDate,
        max = xLabels.length - 1,
        min = 0;

      switch (item.innerHTML) {
        case '6M':
          minDate = new Date(new Date(maxDate.getTime()).setMonth(maxDate.getMonth() - 6));
          min = findDateInd(minDate);
          break;

        case '1Y':
          minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 1));
          min = findDateInd(minDate);
          break;

        case '2Y':
          minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 2));
          min = findDateInd(minDate);
          break;

        case 'YTD':
          minDate = new Date(new Date(maxDate.getFullYear(), 0, 1).getTime()),
            min = findDateInd(minDate);
          break;

      }

      reorganizeChart(cbhRow, min, max, true);

    });
  })

}());



// настройка Chart
// @ts-ignore
function reorganizeChart(cbhRow, min, max, onlyData?: boolean) {

  let seriesRow = calculateDeviationsVal(cbhRow, cbhRow[min]);
  let seriesL = [seriesLabeled[0], calculateDeviationsVal(seriesLabeled[1], cbhRow[min])];

  // создаем Series
  chart.data.findSeriesById('cyberHedge_area')?.replaceSeriesData([seriesRow], false);
  chart.data.findSeriesById('cyberHedge_line')?.replaceSeriesData([seriesRow], false);
  chart.data.findSeriesById('zero_line')?.replaceSeriesData([zeroSeries], false);
  chart.data.findSeriesById('cyberHedge_labels')?.replaceSeriesData(seriesL, false);

  if (onlyData) {
    // @ts-ignore
    chart.xAxis.ticks.setCustomLabels(xLabels);
    chart.xAxis.setMinMax([min, max], false);
    const MinMaxY = chart.data.findExtremes('ind', min, max);
    const lengthY = Math.abs(MinMaxY[0] - MinMaxY[1]);
    chart.yAxis.setMinMax([MinMaxY[0] - gapY * lengthY, MinMaxY[1] + gapY * lengthY], true);
  }
}



//поиск индекса ближайщей даты
function findDateInd(date: Date) {
  const ind = xLabels.reduce((prev, curr, i) => {
    // @ts-ignore
    const curDif = Math.abs(curr - date);
    // @ts-ignore
    const prevDif = Math.abs(xLabels[prev] - date);
    if (curDif < prevDif) return i
    return prev
  }, 0);
  return ind;
}

