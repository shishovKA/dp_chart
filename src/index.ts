// @ts-ignore
import WebFont from 'webfontloader';

// импорт стилей
//import "./styles/normalize.css";
//import "./styles/style.css";
//import "./styles/fonts.css";

//элементы управления

const bezier = require('bezier-easing');

const easing = bezier(0.65, 0, 0.35, 1);

import { Chart } from "./classes/Chart"
import { ChartPanel } from "./interface/ChartPanel"

const usCsv = require('./data/cbhPlotData_US.csv');
const euCsv = require('./data/cbhPlotData_EU.csv');

const WebFont = require('webfontloader')
const gapY: number = 0.08;


//объявляем данные
let chart: Chart;

let cbh1: number[] = [];
let cbh5: number[] = [];
let xLabels: Date[] = [];
let zeroSeries: number[] = [];


// рукописная загрузка из CSV
function customLoadDataFromCsv(filePath: string) {

return fetch(filePath).then((response) => {
    var contentType = response.headers.get("content-type");
    if(contentType && (contentType.includes("text/csv") || contentType.includes("application/octet-stream"))) {
      return response.ok ? response.text() : Promise.reject(response.status);
    }
    throw new TypeError("Oops, we haven't got CSV!");
  })
}

// csv to array
// @ts-ignore
function csvToCols(strData, strDelimiter) {
	strDelimiter = strDelimiter || ",";
	let rowData = strData.split("\n");

	let colResult = [];
	for (let i = rowData[0].split(strDelimiter).length - 1; i >= 0; i--) colResult.push([]);
	for (let i = 0, l = rowData.length; i < l; i++) {
		if (rowData[i].length) {
      let row = rowData[i].split(strDelimiter);
      // @ts-ignore
			for (let j = row.length - 1; j >= 0; j--) colResult[j].push(row[j]);
		}
  }
	return colResult;
}


// проверка подгрузки шрифта
WebFont.load({
  custom: {
    families: ['Transcript Pro'],
    urls: ['./styles/fonts.css']
  },

  active: function () {

    customLoadDataFromCsv(usCsv).then((data) => {
      // @ts-ignore
      let chartData = csvToCols(data);

      cbh1 = chartData[2].slice(1).map((el) => { return +el });
      cbh5 = chartData[1].slice(1).map((el) => { return +el });
      xLabels = chartData[0].slice(1).map((el) => { return new Date(el) });
      zeroSeries = cbh1.map(() => 0);

      chart = CbhChart(cbh1, cbh5, xLabels, zeroSeries);
      const chartPanel = new ChartPanel(document.querySelector('.panel'), chart);
      chart.tooltipsDraw(true);

    })
      .catch((err) => {
        console.log(err);
      })

      
  },

});


// подготавливаем данные как на сайте CyberHedge
// @ts-ignore
function reorganizeChart(cbh5, cbh1, min, max) {
  let data = prepareDataforCbh(cbh5, cbh1, min);
  let {
    serie5star,
    area5starTop,
    area5starBottom,
    serie1star,
    area1starTop,
    area1starBottom
  } = data;

  chart.data.findSeriesById('cyberHedge5_area')?.replaceSeriesData([area5starTop, area5starBottom]);
  chart.data.findSeriesById('cyberHedge1_area')?.replaceSeriesData([area1starTop, area1starBottom]);
  chart.data.findSeriesById('cyberHedge5_line')?.replaceSeriesData([serie5star]);
  chart.data.findSeriesById('cyberHedge1_line')?.replaceSeriesData([serie1star]);
  // @ts-ignore
  chart.xAxis.ticks.setCustomLabels(xLabels);
  chart.data.findSeriesById('zero_line')?.replaceSeriesData([zeroSeries]);

  chart.xAxis.setMinMax([min,max], false);

  const MinMaxY = chart.data.findExtremes('ind', min, max);
  const lengthY = Math.abs(MinMaxY[0] - MinMaxY[1]);
  chart.yAxis.setMinMax([MinMaxY[0]-gapY*lengthY, MinMaxY[1]+gapY*lengthY], true);
}


//вспомогательные функции для работы

function findDateInd(date: Date) {
  const ind =  xLabels.reduce((prev, curr, i) => {
    // @ts-ignore
    const curDif = Math.abs(curr-date);
    // @ts-ignore
    const prevDif = Math.abs(xLabels[prev]-date);
    if (curDif < prevDif) return i
    return prev
      }, 0);
  return ind;
}


function calculateDeviations(rowData: number[], fromIndex: number) {
  let chartDataVariation = [];
  let zeroPoint = rowData[fromIndex];
  chartDataVariation = [];
  for (let j = 0, m = rowData.length; j < m; j++) {
    chartDataVariation.push(100 * (rowData[j] - zeroPoint) / zeroPoint);
  }
  return chartDataVariation;
}


function prepareDataforCbh(star5: number[], star1: number[], fromIndex: number) {
  const arrLength = star5.length;
  let serie5star = calculateDeviations(star5, fromIndex),
    serie1star = calculateDeviations(star1, fromIndex),
    area5starTop = [],
    area5starBottom = [],
    area1starTop = [],
    area1starBottom = [];

  for (let i = 0, l = arrLength; i < l; i++) {
    let item5star = serie5star[i],
      item1star = serie1star[i];


    let elTop5 = (item5star > 0) ? ((item5star > item1star) ? item5star : item5star) : 0
    area5starTop.push(elTop5);

    let elBot5 = (item5star > 0) ? ((item1star > 0) ? ((item1star > item5star) ? item5star : item1star) : 0) : item5star
    area5starBottom.push(elBot5);

    let elTop1 = (item1star > 0) ? item1star : ((item5star > 0) ? 0 : ((item5star < item1star) ? item1star : item5star));
    area1starTop.push(elTop1);

    let elBot1 = (item1star > 0) ? 0 : ((item5star < item1star) ? item1star : item1star);
    area1starBottom.push(elBot1);
  }
  return { serie5star, area5starTop, area5starBottom, serie1star, area1starTop, area1starBottom };
}

//функция создает и настраивает Chart как на сайте
// @ts-ignore
function CbhChart(cbh1, cbh5, xLabels, zeroSeries): Chart {
  // @ts-ignore
  const chart = new Chart(document.getElementById('indexChart'), [0, 900], [0, 2000]);
  chart.setCanvasPaddings(25, 50, 35, 20); // задаем отступы для области отрисовки

  // ось X
  chart.xAxis.setOptions(2, '#7F7F7F');
  chart.xAxis.ticks.display = true;
  chart.xAxis.ticks.settickDrawOptions(6, 2, '#7F7F7F');
  chart.xAxis.ticks.label.setOptions('#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"']);

  // ось Y
  chart.yAxis.setOptions(2, '#B2B2B2', [1, 2]);
  chart.yAxis.display = true;
  chart.yAxis.position = 'end';
  chart.yAxis.ticks.label.setOptions('#B2B2B2', 'right', 20, ['12', '"Transcript Pro"']);

  // создаем Plots
  chart.addPlot('red_line', 'line', 1, '#FF2222', '#FF2222');
  chart.addPlot('red_area', 'area', 0, '#FFE5E5', '#FFE5E5', 0);
  chart.addPlot('blue_line', 'line', 1, '#0070FF', '#0070FF', 1);
  chart.addPlot('blue_area', 'area', 0, '#D9EAFF', '#D9EAFF', 0);
  chart.addPlot('black_line', 'line', 1, '#000000', '#000000', 1);

  // создаем Tooltipы

  // lines
  chart.findPlotById('red_line')?.addTooltip('ttId', 'line_vertical_full', 1, '#B2B2B2', [1, 2]);
  chart.findPlotById('red_line')?.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);
  chart.findPlotById('blue_line')?.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);

  // circles
  chart.findPlotById('blue_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#0070FF', 4);
  chart.findPlotById('red_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#FF2222', 4);
  chart.findPlotById('black_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', 'black', 4);

  chart.findPlotById('blue_line')?.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#0070FF', 4);
  chart.findPlotById('red_line')?.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#FF2222', 4);

  // labels
  chart.findPlotById('red_line')?.addTooltip('ttId', 'label_x_start', 0.5, 'black', '#ebebeb', 4, xLabels).label.setOptions('black', 'bottom', 11, ['12', '"Transcript Pro"']);

  // data
  chart.findPlotById('red_line')?.addTooltip('ttId', 'data_y_end', 0.5, '#FF2222', '#FF2222', 4).label.setOptions('white', 'right', 11, ['12', '"Transcript Pro"']);
  chart.findPlotById('blue_line')?.addTooltip('ttId', 'data_y_end', 0.5, '#0070FF', '#0070FF', 4).label.setOptions('white', 'right', 11, ['12', '"Transcript Pro"']);

  // delta
  chart.findPlotById('red_line')?.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions('black', 'right', 20, ['12', '"Transcript Pro"']);
  chart.findPlotById('blue_line')?.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions('black', 'right', 20, ['12', '"Transcript Pro"']);

  // подготавливаем данные как на сайте CyberHedge
  let data = prepareDataforCbh(cbh5, cbh1, 0);
  let {
      serie5star,
      area5starTop,
      area5starBottom,
      serie1star,
      area1starTop,
      area1starBottom
  } = data;

  // создаем Series
  chart.addSeries('cyberHedge5_area', area5starTop, area5starBottom).setPlotsIds('blue_area');
  chart.addSeries('cyberHedge1_area', area1starTop, area1starBottom).setPlotsIds('red_area');
  chart.addSeries('cyberHedge5_line', serie5star).setPlotsIds('blue_line');
  chart.addSeries('cyberHedge1_line', serie1star).setPlotsIds('red_line');
  chart.addSeries('zero_line', zeroSeries).setPlotsIds('black_line');

  //настраиваем параметры осей
  chart.yAxis.ticks.setOptions('niceCbhStep', [1, 5, 10, 15, 20, 25, 30]);
  chart.yAxis.ticks.label.units = '%';

  chart.xAxis.ticks.setCustomLabels(xLabels);
  chart.xAxis.ticks.setOptions('customDateTicks', ['half month', 'year', 'half year', 'third year', 'quarter year']);
  chart.xAxis.display = true;

  // настраиваем Min Max осей
  chart.xAxis.setMinMax(chart.data.findExtremes('val'), true); //по экстремумам оси X
  chart.yAxis.setMinMax(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max), true); //scale to fit по Y
  chart.yAxis.setMinMax([chart.yAxis.min-gapY*chart.yAxis.length, chart.yAxis.max+gapY*chart.yAxis.length], true); //добавляем по отступам как на сайте

  //включаем анимацию
  chart.xAxis.ticks.switchAnimation(true, 300);
  chart.yAxis.ticks.switchAnimation(true, 300);
  chart.switchDataAnimation(true, 300);
  chart.data.changeAllSeriesAnimationTimeFunction(easing);

  return chart;

}

