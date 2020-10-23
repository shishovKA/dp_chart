import WebFont from 'webfontloader';

// импорт стилей
import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/fonts.css";


// импорт элементов управления графиком
//import { Panel } from "./control/Panel"
//import { Btn } from "./control/Btn"

import { CbhChart } from "./chartConfig"
import { Chart } from 'dp-chart-lib';


//элементы управления
let chart: Chart;

WebFont.load({
  custom: {
    families: ['Transcript Pro'],
    urls: ['./styles/fonts.css']
  },

  active: function () {
    chart = CbhChart();
  },

});



/*
const panel = new Panel(document.querySelector('.panel'), 'X axis (0 - 974)', 3,'Min', 0, 'Max', 900, 'duration', 1000);

panel.submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const values = panel.values;


  if (values[2] != 0) {
      chart.xAxis.setMinMax([values[0],values[1]], values[2]);
      chart.yAxis.setMinMax(chart.data.findExtremes('ind', values[0], values[1]), values[2]);
    } else {
      chart.xAxis.setMinMax([values[0],values[1]]);
      chart.yAxis.setMinMax(chart.data.findExtremes('ind', values[0], values[1]));
      }

});

const panelStep = new Panel(document.querySelector('.panel'), 'Y axis ticks', 2,'Step', 100, 'duration', 1000);

panelStep.submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const values = panelStep.values;
  chart.yAxis.ticks.setOptions('fixedStep', values[0]);
});


const lastLb = xLabels[xLabels.length-1]

const btnDuration = 1000;
//кнопка 1st Y
const FirstYBtn = new Btn(document.querySelector('.panel'),'1st Y','#e5e6e1');

FirstYBtn.element.addEventListener("click", (event) => {
    const minDate = dateParser(xLabels[0]);
    const maxDate = minDate.setFullYear(minDate.getFullYear() + 1);
    const max = findDateInd(maxDate);
    const min = 0;
    chart.xAxis.setMinMax([min,max], btnDuration);
    chart.yAxis.setMinMax(chart.data.findExtremes('ind', min, max), btnDuration);
  })


//кнопка 6M
const SixMBtn = new Btn(document.querySelector('.panel'),'6M','#e5e6e1');

SixMBtn.element.addEventListener("click", (event) => {
    const maxDate = dateParser(lastLb);
    const minDate = maxDate.setMonth(maxDate.getMonth() - 6);
    const max = xLabels.length-1;
    const min = findDateInd(minDate);
    chart.xAxis.setMinMax([min,max], btnDuration);
    chart.yAxis.setMinMax(chart.data.findExtremes('ind', min, max), btnDuration);
  })

//кнопка 1Y
const OneYBtn = new Btn(document.querySelector('.panel'),'1Y','#e5e6e1');

OneYBtn.element.addEventListener("click", (event) => {
    const maxDate = dateParser(lastLb);
    const minDate = maxDate.setFullYear(maxDate.getFullYear() - 1);
    const max = xLabels.length-1;
    const min = findDateInd(minDate);
    chart.xAxis.setMinMax([min,max], btnDuration);
    chart.yAxis.setMinMax(chart.data.findExtremes('ind', min, max), btnDuration);
  })

//кнопка 2Y
const TwoYBtn = new Btn(document.querySelector('.panel'),'2Y','#e5e6e1');

TwoYBtn.element.addEventListener("click", (event) => {
    const maxDate = dateParser(lastLb);
    const minDate = maxDate.setFullYear(maxDate.getFullYear() - 2);
    const max = xLabels.length-1;
    const min = findDateInd(minDate);
    chart.xAxis.setMinMax([min,max], btnDuration);
    chart.yAxis.setMinMax(chart.data.findExtremes('ind', min, max), btnDuration);
  })

//кнопка Max
const MaxBtn = new Btn(document.querySelector('.panel'),'MAX','#e5e6e1');

MaxBtn.element.addEventListener("click", (event) => {
    const max = xLabels.length-1;
    const min = 0;
    chart.xAxis.setMinMax([min,max], btnDuration);
    chart.yAxis.setMinMax(chart.data.findExtremes('ind', min, max), btnDuration);
  })


//вспомогательные функции для работы с датами для определения области построения графика
function dateParser(myDate: string) {
  const arr = myDate.split('.');
  arr[2] = '20'+arr[2];
  const date = new Date(+arr[2], +arr[1], +arr[0]);
  return date;
}

function findDateInd(date: Date) {
  const ind =  xLabels.reduce((prev, curr, i) => {
    const curDif = Math.abs(dateParser(curr)-date);
    const prevDif = Math.abs(dateParser(xLabels[prev])-date);
    if (curDif < prevDif) return i
    return prev
      }, 0);
  return ind;
}

*/



