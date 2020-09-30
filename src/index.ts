
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

//импорт ключевого класса Chart
import {Chart} from "./classes/Chart"

//работа с Chart
const chart = new Chart(document.querySelector('.chart__container'), [0, 900], [0, 2000]);

chart.canvas.setPaddings(50, 80, 50, 80); // задаем отступы для области отрисовки

// создаем Plot
chart.addPlot('plot1', 'line', 1, 'red', 'red');
chart.addPlot('plot1a', 'area', 0.5, '#ffe6e6', '#ffe6e6', 0.5);
chart.addPlot('plot5', 'line', 1, 'blue', 'blue', 1);
chart.addPlot('plot5a', 'area', 0.5, '#e6edff', '#e6edff', 0.5);

// создаем Tooltip
chart.addTooltip('red_tt', 'x', [3, '#ffffff', 'red', 4]);
chart.addTooltip('blue_tt', 'x', [3, '#ffffff', 'blue', 4]);
chart.addTooltip('xLine_tt', 'v_line', [1, '#b3b3b3', '#b3b3b3'], xLabels);

// создаем Series
chart.addSeries('cyberHedge5', [cbh5], ['plot5a']);
chart.addSeries('cyberHedge1', [cbh1], ['plot1a']);
chart.addSeries('cyberHedge5', [cbh5], ['plot5'], ['blue_tt']);
chart.addSeries('cyberHedge1', [cbh1], ['plot1'], ['xLine_tt','red_tt']);

// настраиваем оси
chart.yAxis.setMinMax(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max));
chart.xAxis.ticks.setCustomTicksOptions(xLabels);




console.log(chart);

//drawRect(chart.canvas.viewport, '#d40da5');
//элементы управления

const panel1 = new Panel(document.querySelector('.panel'),'X axis','Min','Max', 'duration', 0, 900, 1000);

panel1.submitBtn.addEventListener("click", (event) => {
  event.preventDefault()
  console.log(panel1.values);

  if (panel1.duration != 0) {
      chart.xAxis.setMinMax(panel1.values, panel1.duration);
      chart.yAxis.setMinMax(chart.data.findExtremes('ind', panel1.values[0], panel1.values[1]), panel1.duration);
    } else {
      chart.xAxis.setMinMax(panel1.values);
      chart.yAxis.setMinMax(chart.data.findExtremes('ind', panel1.values[0], panel1.values[1]));
      }
  console.log(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max))
})

const lastLb = xLabels[xLabels.length-1]

//кнопка 6M
const SixMBtn = new Btn(document.querySelector('.panel'),'6M','#e5e6e1');

SixMBtn.element.addEventListener("click", (event) => {
    const maxDate = dateParser(lastLb);
    const minDate = maxDate.setMonth(maxDate.getMonth() - 6);
    const max = xLabels.length-1;
    const min = findDateInd(minDate);
    chart.xAxis.setMinMax([min,max], 500);
    chart.yAxis.setMinMax(chart.data.findExtremes('ind', min, max), 500);
  })

//кнопка 1Y
const OneYBtn = new Btn(document.querySelector('.panel'),'1Y','#e5e6e1');

OneYBtn.element.addEventListener("click", (event) => {
    const maxDate = dateParser(lastLb);
    const minDate = maxDate.setFullYear(maxDate.getFullYear() - 1);
    const max = xLabels.length-1;
    const min = findDateInd(minDate);
    chart.xAxis.setMinMax([min,max], 500);
    chart.yAxis.setMinMax(chart.data.findExtremes('ind', min, max), 500);
  })

//кнопка 2Y
const TwoYBtn = new Btn(document.querySelector('.panel'),'2Y','#e5e6e1');

TwoYBtn.element.addEventListener("click", (event) => {
    const maxDate = dateParser(lastLb);
    const minDate = maxDate.setFullYear(maxDate.getFullYear() - 2);
    const max = xLabels.length-1;
    const min = findDateInd(minDate);
    chart.xAxis.setMinMax([min,max], 500);
    chart.yAxis.setMinMax(chart.data.findExtremes('ind', min, max), 500);
  })

//кнопка Max
const MaxBtn = new Btn(document.querySelector('.panel'),'MAX','#e5e6e1');

MaxBtn.element.addEventListener("click", (event) => {
    const max = xLabels.length-1;
    const min = 0;
    chart.xAxis.setMinMax([min,max], 500);
    chart.yAxis.setMinMax(chart.data.findExtremes('ind', min, max), 500);
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




