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
//import { ChartPanel } from "./interface/ChartPanel"

const sqrData = require('./data/cbhVulnerability_test.csv');

const WebFont = require('webfontloader')
const gapY: number = 0.08;


//объявляем данные
let chart: Chart;

let x: number[] = [];
let y: number[] = [];


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

    customLoadDataFromCsv(sqrData).then((data) => {
      // @ts-ignore
      let chartData = csvToCols(data);

      x = chartData[0].slice(1).map((el) => { return +el });
      y = chartData[1].slice(1).map((el) => { return +el });
      
      

      chart = CbhChart(x, y);
      chart.reSize();
      //const chartPanel = new ChartPanel(document.querySelector('.panel'), chart);

    })
      .catch((err) => {
        console.log(err);
      })

      
  },

});


//функция создает и настраивает Chart как на сайте
// @ts-ignore
function CbhChart(x, y): Chart {
// @ts-ignore
const chart = new Chart(document.getElementById('indexChart'), [0, 5], [0, 5]);
chart.setCanvasPaddings(25, 60, 40, 20); // задаем отступы для области отрисовки

// ось X
chart.xAxis.setOptions(1, 'black');
chart.xAxis.ticks.display = true;
chart.xAxis.display = true;
chart.xAxis.ticks.settickDrawOptions(6, 1, 'black');
chart.xAxis.ticks.label.setOptions('#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"']);
chart.xAxis.ticks.grid.display = true;

// ось Y
chart.yAxis.setOptions(1, '#B2B2B2');
chart.yAxis.ticks.display = true;
chart.yAxis.display = true;
chart.yAxis.position = 'end';
chart.yAxis.ticks.label.setOptions('#B2B2B2', 'right', 20, ['12', '"Transcript Pro"']);
chart.yAxis.ticks.grid.display = true;

// создаем Plots
chart.addPlot('uni_circles', 'unicode', 20, '#454e56', '#454e56');

//tt
chart.findPlotById('uni_circles')?.addTooltip('ttId', 'data_label', 0.5, 'black', '#ebebeb', 4).label.setOptions('black', 'right', 40, ['12', '"Transcript Pro"']);
//chart.findPlotById('uni_circles')?.addTooltip('ttId', 'data_y_end', 0.5, '#0070FF', '#0070FF', 4).label.setOptions('white', 'right', 30, ['12', '"Transcript Pro"']);

// создаем Series
chart.addSeries('portfolio', [x, y]).setPlotsIds('uni_circles');


//настраиваем параметры осей

// настраиваем Min Max осей


//включаем анимацию
chart.xAxis.ticks.switchAnimation(true, 300);
chart.yAxis.ticks.switchAnimation(true, 300);
chart.switchDataAnimation(true, 300);
chart.data.changeAllSeriesAnimationTimeFunction(easing);

return chart;

}

