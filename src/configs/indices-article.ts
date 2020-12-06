import { Chart } from "../classes/Chart";
import { Ticks } from "../classes/Ticks";
import { customLoadDataFromCsv, csvToCols } from "../scripts/helpers";

export let chart: Chart;
let cbh1: number[] = [];
let cbh5: number[] = [];
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
  //chart = new Chart(container, [0, 900], [0, 2000]);
  chart = new Chart(container, [0, 900], [0, 2000]);

  [xLabels, cbh5, cbh1, zeroSeries, seriesLabeled, seriesText] = [...data];

  // перевести данные в % если нужно (точка 0 = cbh5[0] и cbh1[0] соответсвенно)
  //let serie5star = calculateDeviationsVal(cbh5, cbh5[0]);
  //let serie1star = calculateDeviationsVal(cbh1, cbh1[0]);

  // оставить исходные данные
  let serie5star = cbh5;
  let serie1star = cbh1;
  
  setLastUpdateDate(xLabels[xLabels.length - 1]);

  // ось X
  chart.xAxis.setOptions('start', 0.5, 'black');
  // @ts-ignore
  chart.xAxis.ticks.setCustomLabels(xLabels);
  chart.xAxis.display = true;
  chart.xAxis.ticks.setOptions(true, 'customDateTicks', ['half month', 'year', 'half year', 'third year', 'quarter year']);
  chart.xAxis.ticks.display = true;
  chart.xAxis.ticks.settickDrawOptions(-6, 0.5, 'black');
  chart.xAxis.ticks.label.setOptions(true, '#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"'])
  chart.xAxis.ticks.label.isUpperCase = true;


  // ось Y
  chart.yAxis.setOptions('end', 1, '#B2B2B2', [1, 2]);
  chart.yAxis.display = true;
  chart.yAxis.position = 'end';
  chart.yAxis.ticks.settickDrawOptions(-50, 1, '#B2B2B2', [1, 2]);
  chart.yAxis.ticks.setOptions(true, 'niceCbhStep', [1, 5, 10, 15, 20, 25, 30]);
  chart.yAxis.ticks.label.setOptions(true, '#B2B2B2', 'right', 0, ['12', '"Transcript Pro"']).setOffset(30, 10);
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
  chart.addPlot('red_line', 'line', 1, '#FF2222', []);
  chart.addPlot('red_area', 'area_bottom', 0, '#FFE5E5', '#FFE5E5', 0);
  chart.addPlot('blue_line', 'line', 1, '#0070FF', []);
  chart.addPlot('blue_area', 'area_bottom', 0, '#D9EAFF', '#D9EAFF', 0);
  chart.addPlot('zero_line', 'line', 1, '#000000', [2, 1]); //пунктирная линия 0
  chart.addPlot('labeled', 'text', 1, '#000000', '#000000') //график с лейблами
    .label.setOptions(true, 'black', 'top', 10 + 15 + 10, ['18', '"Transcript Pro"'])
    .setOutline({ width: 5, color: 'white' })

  // создаем Tooltips
  
  // lines
  chart.findPlotById('blue_line')?.addTooltip('ttId', 'line_vertical_full', 1, '#B2B2B2', [1, 2]);
  chart.findPlotById('red_line')?.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);
  chart.findPlotById('blue_line')?.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);

  // circles
  chart.findPlotById('blue_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#0070FF', 4);
  chart.findPlotById('red_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#FF2222', 4);
  chart.findPlotById('black_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', 'black', 4);

  chart.findPlotById('blue_line')?.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#0070FF', 4);
  chart.findPlotById('red_line')?.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#FF2222', 4);

  // labels
  chart.findPlotById('red_line')?.addTooltip('ttId', 'label_x_start', 0.5, 'black', '#ebebeb', 4, xLabels).label.setOptions(true, 'black', 'bottom', 14, ['12', '"Transcript Pro"']);

  // data
  chart.findPlotById('red_line')?.addTooltip('ttId', 'data_y_end', 0.5, '#FF2222', '#FF2222', 4).label.setOptions(true, 'white', 'right', 30, ['12', '"Transcript Pro"']);
  chart.findPlotById('blue_line')?.addTooltip('ttId', 'data_y_end', 0.5, '#0070FF', '#0070FF', 4).label.setOptions(true, 'white', 'right', 30, ['12', '"Transcript Pro"']);

  // delta
  chart.findPlotById('red_line')?.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions(true, 'black', 'right', 35, ['12', '"Transcript Pro"']);
  chart.findPlotById('blue_line')?.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions(true, 'black', 'right', 35, ['12', '"Transcript Pro"']);

  // создаем Series
  chart.addSeriesRow('cyberHedge5_area', [serie5star]).setPlotsIds('blue_area');
  chart.addSeriesRow('cyberHedge1_area', [serie1star]).setPlotsIds('red_area');
  chart.addSeriesRow('cyberHedge5_line', [serie5star]).setPlotsIds('blue_line');
  chart.addSeriesRow('cyberHedge1_line', [serie1star]).setPlotsIds('red_line');
  chart.addSeriesRow('zero_line', [zeroSeries]).setPlotsIds('zero_line');
  
  chart.addSeries('cyberHedge_labels', seriesLabeled, seriesText).setPlotsIds('labeled');

  // настраиваем Min Max осей
  chart.xAxis.setMinMax(chart.data.findExtremes('val'), true); //по экстремумам оси X
  chart.yAxis.setMinMax(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max), true); //scale to fit по Y
  chart.yAxis.setMinMax([chart.yAxis.min - gapY * chart.yAxis.length, chart.yAxis.max + gapY * chart.yAxis.length], true); //добавляем по отступам как на сайте

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

//функция вешает слушатели на панель nav - USA / EU
(function prepareCsvLoadMenu() {
  let zoneItems = document.querySelectorAll('.zones_article li');

  zoneItems.forEach((item) => {
    item.addEventListener('click', () => {
      let link = item.querySelector('a');

      // @ts-ignore
      document.querySelector('.zones_article li.selected').classList.remove('selected');
      item.classList.add('selected');

      const rangeSelected = document.querySelector('.ranges_article li.selected');

      // @ts-ignore
      customLoadDataFromCsv(link.href).then((data) => {
        // @ts-ignore
        let chartData = csvToCols(data);

        cbh1 = chartData[2].slice(1).map((el) => { return +el });
        cbh5 = chartData[1].slice(1).map((el) => { return +el });
        xLabels = chartData[0].slice(1).map((el) => { return new Date(el) });
        zeroSeries = cbh1.map(() => 0);
        cbh1 = cbh1.reverse();
        cbh5 = cbh5.reverse();
        xLabels = xLabels.reverse();
        setLastUpdateDate(xLabels[xLabels.length - 1]);

        const max = xLabels.length - 1;
        const min = 0;

        reorganizeChart(cbh5, cbh1, min, max, false);
        // @ts-ignore
        rangeSelected.click(rangeSelected);
      })

    });
  });

}());

//функция вешает слушатели на панель ranges
(function prepareRangesMenu() {
  let ranges = document.querySelectorAll('.ranges_article li');
  ranges.forEach((item) => {
    item.addEventListener('click', () => {
      // @ts-ignore
      document.querySelector('.ranges_article li.selected').classList.remove('selected');
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

      reorganizeChart(cbh5, cbh1, min, max, true);

    });
  })

}());


// настройка Chart
// @ts-ignore
function reorganizeChart(cbh5, cbh1, min, max, onlyData?: boolean) {
  
  // перевести данные в % если нужно (точка 0 = cbh5[0] и cbh1[0] соответсвенно)
  // let serie5star = calculateDeviationsVal(cbh5, cbh5[min]);
  // let serie1star = calculateDeviationsVal(cbh1, cbh1[min]);

  // оставить исходные данные
  let serie5star = cbh5;
  let serie1star = cbh1;

  chart.data.findSeriesById('cyberHedge5_area')?.replaceSeriesData([serie5star], false);
  chart.data.findSeriesById('cyberHedge1_area')?.replaceSeriesData([serie1star], false);
  chart.data.findSeriesById('cyberHedge5_line')?.replaceSeriesData([serie5star], false);
  chart.data.findSeriesById('cyberHedge1_line')?.replaceSeriesData([serie1star], false);
  chart.data.findSeriesById('zero_line')?.replaceSeriesData([zeroSeries], false);

  if (onlyData) {
    // @ts-ignore
    chart.xAxis.setMinMax([min, max], false);
    // @ts-ignore
    chart.xAxis.ticks.setCustomLabels(xLabels);
    const MinMaxY = chart.data.findExtremes('ind', min, max);
    const lengthY = Math.abs(MinMaxY[0] - MinMaxY[1]);
    chart.yAxis.setMinMax([MinMaxY[0] - gapY * lengthY, MinMaxY[1] + gapY * lengthY], true);
  }
}


function setLastUpdateDate(lastDate: Date) {
  // NOTE: fill last update node
  let lastUpdateNode = document.querySelector('.last-update-article time');
  // @ts-ignore
  lastUpdateNode.datetime = lastDate.toISOString();
  // @ts-ignore
  lastUpdateNode.innerHTML = [lastDate.getDate(), lastDate.toLocaleString('en-US', { month: 'long' }), lastDate.getFullYear()].join(' ');
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

