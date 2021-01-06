import { Chart } from "../classes/Chart"
import { Legend } from '../classes/Legend';
import { Point } from '../classes/Point';
import { Rectangle } from '../classes/Rectangle';
import { Ticks } from "../classes/Ticks"

export let chart: Chart;

// @ts-ignore
export function prepareData(data): any[] {
  //разбираем CSV по рядам
  let x, y, labels;
  const oneX: number[] = [1.3];
  const oneY: number[] = [2.5];
  // @ts-ignore
  x = data[0].slice(1).map((el) => { return +el });
  // @ts-ignore
  y = data[1].slice(1).map((el) => { return +el });
  // @ts-ignore
  labels = data[2].slice(1).map((el) => { return el });
  return [x, y, oneX, oneY, labels];
}

//функция создает и настраивает Chart квадратный
// @ts-ignore
export function createChart(container, data) {
  // @ts-ignore
  chart = new Chart(container, [0, 5], [0, 5]);

  let x, y, oneX, oneY, labels;
  [x, y, oneX, oneY, labels] = [...data];

  // ось X
  chart.xAxis.setOptions('end', 1, 'black');
  chart.xAxis.ticks.setOptions(false, 'fixedCount', 5);
  chart.xAxis.ticks.label.setOptions(false, '#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"']);
  chart.xAxis.grid.setOptions(true, 'black', 0.5, []);
  chart.xAxis.setName('Capital Managment', 'start').label.setOptions(true, 'black', 'top', -30, ['18', '"Transcript Pro"']);

  //легенда для оси X
  const lowRisk = new Legend(['Low', 'Risk'], function (vp: Rectangle): Point { return new Point(vp.x1 - 25, vp.y2 + 25) })
  lowRisk.label.setOptions(true, 'black', 'top', 0, ['14', '"Transcript Pro"']);
  chart.xAxis.addLegend(lowRisk);

  const highRisk = new Legend(['High', 'Risk'], function (vp: Rectangle): Point { return new Point(vp.x2 + 25, vp.y1 - 25) })
  highRisk.label.setOptions(true, 'black', 'top', 0, ['14', '"Transcript Pro"']);
  chart.xAxis.addLegend(highRisk);

  //добавляем custom ticks для X
  const newTicks = new Ticks(chart.xAxis.type);
  newTicks.setOptions(false, 'midStep', 5);
  newTicks.label.setOptions(true, '#B2B2B2', 'top', 17, ['25', '"Transcript Pro"'], ['#60bb4c', '#accd5a', '#eed15c', '#ee9c58', '#e94f49']);
  newTicks.setCustomLabels(['●'])
  chart.xAxis.addCustomTicks(newTicks);

  // ось Y
  chart.yAxis.setOptions('end', 1, '#B2B2B2');
  chart.yAxis.ticks.setOptions(false, 'fixedCount', 5);
  chart.yAxis.ticks.label.setOptions(false, '#B2B2B2', 'right', 20, ['12', '"Transcript Pro"']);
  chart.yAxis.grid.setOptions(true, 'black', 0.5, []);

  chart.yAxis.setName('Vulnerability', 'start').label.setOptions(true, 'black', 'right', -10, ['18', '"Transcript Pro"']);
  chart.yAxis.label.rotationAngle = -90;

  //добавляем custom ticks для Y
  const newYTicks = new Ticks(chart.yAxis.type);
  newYTicks.setOptions(false, 'midStep', 5);
  newYTicks.label.setOptions(true, '#B2B2B2', 'right', 30, ['25', '"Transcript Pro"'], ['#60bb4c', '#accd5a', '#eed15c', '#ee9c58', '#e94f49']);
  newYTicks.setCustomLabels(['●'])
  chart.yAxis.addCustomTicks(newYTicks);

  // контур графика
  chart.hasBorder = true;

  // создаем Plots
  chart.addPlot('uni_circles', 'unicode', 20, '#454e56', '●');
  chart.addPlot('uni_triangle', 'unicode', 20, '#454e56', '▼');

  //tt
  chart.findPlotById('uni_circles')?.addTooltip('ttId', 'data_label', 0.5, 'black', '#ebebeb', labels).label.setOptions(true, 'black', 'top', 15, ['12', '"Transcript Pro"']);
  //chart.findPlotById('uni_triangle')?.addTooltip('ttId', 'data_label', 0.5, 'black', '#ebebeb', labels).label.setOptions('black', 'top', 15, ['12', '"Transcript Pro"']);

  // создаем Series
  chart.addSeries('portfolio', [x, y]).setPlotsIds('uni_circles');
  chart.addSeries('portfolio_1', [oneX, oneY]).setPlotsIds('uni_triangle');

  //включаем анимацию
  const bezier = require('bezier-easing');
  const easing = bezier(0.65, 0, 0.35, 1);

  chart.xAxis.ticks.switchAnimation(false, 300);
  chart.yAxis.ticks.switchAnimation(false, 300);
  chart.switchDataAnimation(true, 300);
  chart.data.changeAllSeriesAnimationTimeFunction(easing);


  // задаем отступы для области отрисовки
  chart.setCanvasPaddings(60, 60, 60, 60);

  // делаем квадратное соотношение
  chart.switchResolution();
 
  //обавляем фон
  chart.addBackGround('coloredGrid_cbh');

  chart.refresh();

  // элементы управления
  const randBtn = document.getElementById('rand_btn');
  //@ts-ignore
  randBtn.addEventListener('click', () => {
    reorganizeChart();
  });

  
}


export function reorganizeChart() {
  let x, y, oneX, oneY, labels;

  x = [];
  y = [];
  labels = [];

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  const newLength = 1 + Math.round(Math.random() * 16);

  for (let i = 0; i < newLength; i++) {
    x.push(0.1 + Math.random() * 4.8);
    y.push(0.1 + Math.random() * 4.8);
    labels.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
  }

  oneX = [0.1 + Math.random() * 4.8];
  oneY = [0.1 + Math.random() * 4.8];

  chart.data.findSeriesById('portfolio')?.replaceSeriesData([x, y], true);
  chart.data.findSeriesById('portfolio_1')?.replaceSeriesData([oneX, oneY], true);
  // @ts-ignore
  chart.findPlotById('uni_circles')?.findTooltipById('ttId').labels = labels;
}



/* index.ts


// @ts-ignore
import WebFont from 'webfontloader';

import { customLoadDataFromCsv, csvToCols } from "./scripts/helpers"
import { Chart } from "./classes/Chart"

// выбираем config
import { prepareData, createChart, reorganizeChart } from "./configs/square-chart"

//подгрузка CSV файла
const sqrData = require('./data/cbhVulnerability_test.csv');


//объявляем переменные
let chart: Chart;
const chartContainer = document.getElementById('indexChart');
const fonts = ['Transcript Pro'];


// проверка подгрузки шрифта
const WebFont = require('webfontloader')

WebFont.load({
  custom: {
    families: fonts,
  },

  active: function () {

    customLoadDataFromCsv(sqrData).then((data) => {
      // @ts-ignore
      let chartData = csvToCols(data);
      //разбираем CSV по рядам
      chartData = prepareData(chartData);
      //создаем chart
      chart = createChart(chartContainer, [...chartData]);
    })
      .catch((err) => {
        console.log(err);
      })
  },
});






*/