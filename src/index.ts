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
import { Label } from './classes/Label';
import { Ticks } from "./classes/Ticks"

//import { ChartPanel } from "./interface/ChartPanel"

const sqrData = require('./data/cbhVulnerability_test.csv');

const WebFont = require('webfontloader')
const gapY: number = 0.08;


//объявляем данные
let chart: Chart;

let x: number[] = [];
let y: number[] = [];
let labels: string[] = [];

let oneX: number[] = [1.3];
let oneY: number[] = [2.5];



// рукописная загрузка из CSV
function customLoadDataFromCsv(filePath: string) {

  return fetch(filePath).then((response) => {
    var contentType = response.headers.get("content-type");
    if (contentType && (contentType.includes("text/csv") || contentType.includes("application/octet-stream"))) {
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
  },

  active: function () {

    customLoadDataFromCsv(sqrData).then((data) => {
      // @ts-ignore
      let chartData = csvToCols(data);

      x = chartData[0].slice(1).map((el) => { return +el });
      y = chartData[1].slice(1).map((el) => { return +el });
      labels = chartData[2].slice(1).map((el) => { return el });

      console.log(labels)

      chart = CbhChart(x, y);
      chart.reSize();
      //const chartPanel = new ChartPanel(document.querySelector('.panel'), chart);

    })
      .catch((err) => {
        console.log(err);
      })


  },

});


const randBtn = document.getElementById('rand_btn');
randBtn.addEventListener('click', () => {

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;

  const newLength = 1+Math.round(Math.random()*16);

  x.splice(0, x.length);
  y.splice(0, y.length);
  labels.splice(0, labels.length)

  for (let i=0; i<newLength-1; i++) {
    x.push(0.1+Math.random()*4.8);
    y.push(0.1+Math.random()*4.8);
    labels.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
  }

  oneX = [0.1+Math.random()*4.8];
  oneY = [0.1+Math.random()*4.8];
  
  reorganizeChart();
})

function reorganizeChart() {
  chart.data.findSeriesById('portfolio')?.replaceSeriesData([x, y]);
  chart.data.findSeriesById('portfolio_1')?.replaceSeriesData([oneX, oneY]);
  chart.findPlotById('uni_circles')?.findTooltipById('ttId')?.labels = labels;
}


//функция создает и настраивает Chart квадратный
// @ts-ignore
function CbhChart(x, y): Chart {
  // @ts-ignore
  const chart = new Chart(document.getElementById('indexChart'), [0, 5], [0, 5]);
  chart.setCanvasPaddings(60, 60, 60, 60); // задаем отступы для области отрисовки

  // ось X
  chart.xAxis.setOptions(1, 'black');
  chart.xAxis.ticks.setOptions('fixedCount', 5);
  chart.xAxis.ticks.label.setOptions('#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"']);
  chart.xAxis.ticks.grid.display = true;
  chart.xAxis.ticks.grid.setOptions('black', 0.5, []);
  chart.xAxis.ticks.label.display = false;
  chart.xAxis.position = 'end'

//добавляем custom ticks для X
  const newTicks = new Ticks(chart.xAxis.type);
  newTicks.setOptions('midStep', 5);
  newTicks.label.setOptions('#B2B2B2', 'top', 17, ['25', '"Transcript Pro"'], ['#60bb4c', '#accd5a', '#eed15c', '#ee9c58', '#e94f49']);
  newTicks.setCustomLabels(['●'])
  chart.xAxis.addCustomTicks(newTicks);

  // ось Y
  chart.yAxis.setOptions(1, '#B2B2B2');
  chart.yAxis.ticks.setOptions('fixedCount', 5);
  chart.yAxis.position = 'end';
  chart.yAxis.ticks.label.setOptions('#B2B2B2', 'right', 20, ['12', '"Transcript Pro"']);
  chart.yAxis.ticks.grid.display = true;
  chart.yAxis.ticks.grid.setOptions('black', 0.5, []);
  chart.yAxis.ticks.label.display = false;

  //добавляем custom ticks для Y
  const newYTicks = new Ticks(chart.yAxis.type);
  newYTicks.setOptions('midStep', 5);
  newYTicks.label.setOptions('#B2B2B2', 'right', 30, ['25', '"Transcript Pro"'], ['#60bb4c', '#accd5a', '#eed15c', '#ee9c58', '#e94f49']);
  newYTicks.setCustomLabels(['●'])
  chart.yAxis.addCustomTicks(newYTicks);

  // контур графика
  chart.hasBorder = true;

  // создаем Plots
  chart.addPlot('uni_circles', 'unicode', 20, '#454e56', '●');
  chart.addPlot('uni_triangle', 'unicode', 20, '#454e56', '▼');

  //tt
  chart.findPlotById('uni_circles')?.addTooltip('ttId', 'data_label', 0.5, 'black', '#ebebeb', labels).label.setOptions('black', 'top', 15, ['12', '"Transcript Pro"']);

  // создаем Series
  chart.addSeries('portfolio', [x, y]).setPlotsIds('uni_circles');
  chart.addSeries('portfolio_1', [oneX, oneY]).setPlotsIds('uni_triangle');

  //включаем анимацию
  chart.xAxis.ticks.switchAnimation(false, 300);
  chart.yAxis.ticks.switchAnimation(false, 300);
  chart.switchDataAnimation(true, 300);
  chart.data.changeAllSeriesAnimationTimeFunction(easing);

  //обавляем фон
  chart.addBackGround('coloredGrid_cbh');

  return chart;

}

