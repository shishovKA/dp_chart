import WebFont from 'webfontloader';

// импорт стилей
import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/fonts.css";

// импорт данных
import { cbh1 } from "./data/cbh1"
import { cbh5 } from "./data/cbh5"
import { xLabels } from "./data/xLabels"

// импорт элементов управления графиком
import { Panel } from "./control/Panel"
import { Btn } from "./control/Btn"
import { ChartPanel } from "./control/ChartPanel"

// импорт ключевого класса Chart
import { Chart } from "./classes/Chart"

const zeroSeries = cbh1.map(() => {
  return 0;
})

// работа с Chart
const chart = new Chart(document.querySelector('.chart__container'), [0, 900], [0, 2000]);
chart.setCanvasPaddings(50, 80, 50, 80); // задаем отступы для области отрисовки

// ось X
chart.xAxis.setOptions(2, '#7F7F7F');
chart.xAxis.ticks.display = true;
chart.xAxis.ticks.settickDrawOptions(6, 2, '#7F7F7F');
chart.xAxis.ticks.label.setOptions('#B2B2B2', 'bottom', 11, ['11', '"Transcript Pro"']);

// ось Y
chart.yAxis.setOptions(2, '#B2B2B2', [1, 2]);
chart.yAxis.display = true;
chart.yAxis.position = 'end';
chart.yAxis.ticks.label.setOptions('#B2B2B2', 'right', 13, ['11', '"Transcript Pro"']);

// создаем Plot
chart.addPlot('red_line', 'line', 1, '#FF2222', '#FF2222');
chart.addPlot('red_area', 'area', 0.5, '#FFE5E5', '#FFE5E5', 0.5);
chart.addPlot('blue_line', 'line', 1, '#0070FF', '#0070FF', 1);
chart.addPlot('blue_area', 'area', 0.5, '#D9EAFF', '#D9EAFF', 0.5);
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
chart.findPlotById('red_line')?.addTooltip('ttId', 'label_x_start', 0.5, 'black', '#ebebeb', 4, xLabels).label.setOptions('black', 'bottom', 11, ['11', '"Transcript Pro"']);

// data
chart.findPlotById('red_line')?.addTooltip('ttId', 'data_y_end', 0.5, '#FF2222', '#FF2222', 4).label.setOptions('white', 'right', 11, ['11', '"Transcript Pro"']);
chart.findPlotById('blue_line')?.addTooltip('ttId', 'data_y_end', 0.5, '#0070FF', '#0070FF', 4).label.setOptions('white', 'right', 11, ['11', '"Transcript Pro"']);

// delta
chart.findPlotById('red_line')?.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions('black', 'right', 20, ['11', '"Transcript Pro"']);
chart.findPlotById('blue_line')?.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions('black', 'right', 20, ['11', '"Transcript Pro"']);


// создаем Series
chart.data.addSeries('cyberHedge5_area', cbh5, zeroSeries).setPlotsIds('blue_area');
chart.data.addSeries('cyberHedge1_area', cbh1, zeroSeries).setPlotsIds('red_area');
chart.data.addSeries('cyberHedge5_line', cbh5).setPlotsIds('blue_line');
chart.data.addSeries('cyberHedge1_line', cbh1).setPlotsIds('red_line');
chart.data.addSeries('zero_line', zeroSeries).setPlotsIds('black_line');

// настраиваем Min Max осей
chart.xAxis.setMinMax(chart.data.findExtremes('val')); //по экстремумам оси X
chart.yAxis.setMinMax(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max));

//настраиваем параметры осей
chart.yAxis.ticks.setOptions('fixedStep', 50);
chart.xAxis.ticks.setCustomLabels(xLabels);
chart.xAxis.ticks.setOptions('customDateTicks', ['half month', 'year', 'half year', 'third year', 'quarter year']);
chart.xAxis.display = true;

//элементы управления
const chartPanel = new ChartPanel(document.querySelector('.panel'), chart);

console.log('before');

WebFont.load({
  custom: {
    families: ['Transcript Pro'],
    urls: ['./styles/fonts.css']
  },

  active: function () {
    chart.addOnPage();
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



