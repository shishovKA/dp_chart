
// импорт стилей
import "./styles/normalize.css";
import "./styles/style.css";

// импорт данных
import {cbh1} from "./data/cbh1"
import {cbh5} from "./data/cbh5"
import {xLabels} from "./data/xLabels"

// импорт элементов управления графиком
import {Panel} from "./control/Panel"
import {Btn} from "./control/Btn"
import {ChartPanel} from "./control/ChartPanel"

// импорт ключевого класса Chart
import {Chart} from "./classes/Chart"

// работа с Chart
const chart = new Chart(document.querySelector('.chart__container'), [0, 900], [0, 2000]);
chart.canvas.setPaddings(50, 80, 50, 80); // задаем отступы для области отрисовки
chart.canvasTT.setPaddings(50, 80, 50, 80);

//настраиваем параметры осей
chart.yAxis.grid.display = true;
chart.yAxis.ticks.setOptions('fixedStep', 200);
chart.yAxis.grid.setOptions('#bfbfbf', 2, [3,3]);
chart.xAxis.ticks.setCustomLabels(xLabels);

// создаем Plot
chart.addPlot('red_line', 'line', 1, 'red', 'red');
chart.addPlot('red_area', 'area', 0.5, '#ffe6e6', '#ffe6e6', 0.5);
chart.addPlot('blue_line', 'line', 1, 'blue', 'blue', 1);
chart.addPlot('blue_area', 'area', 0.5, '#e6edff', '#e6edff', 0.5);

// создаем Tooltip
chart.findPlotById('red_line')?.addTooltip('xLine_tt', 'v_line', [1, '#b3b3b3', '#b3b3b3'], xLabels);
chart.findPlotById('blue_line')?.addTooltip('blue_tt', 'x', [3, '#ffffff', 'blue', 4]);
chart.findPlotById('red_line')?.addTooltip('red_tt', 'x', [3, '#ffffff', 'red', 4]);


// создаем Series
chart.addSeries('cyberHedge5', [cbh5], ['blue_area']);
chart.addSeries('cyberHedge1', [cbh1], ['red_area']);
chart.addSeries('cyberHedge5', [cbh5], ['blue_line']);
chart.addSeries('cyberHedge1', [cbh1], ['red_line']);

// настраиваем оси
chart.xAxis.setMinMax(chart.data.findExtremes('val'));
chart.yAxis.setMinMax(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max));
//chart.yAxis.ticks.setOptions('fixedStep', [100]);
//chart.xAxis.ticks.setOptions('labeled', [5, xLabels]);


//drawRect(chart.canvas.viewport, '#d40da5');
//элементы управления

const chartPanel = new ChartPanel(document.querySelector('.panel'), chart);


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



