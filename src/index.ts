
import "./styles/normalize.css";
import "./styles/style.css";


import {cbh1} from "./data/cbh1"
import {cbh5} from "./data/cbh5"

//import {xDate} from "./data/xDate"

import {Panel} from "./control/Panel"
import {Btn} from "./control/Btn"
import {SeriesCtrl} from "./control/SeriesCtrl"

import {Chart} from "./classes/Chart"

//работа с Chart
const chart = new Chart(document.querySelector('.chart__container'), [0, 900], [0, 2000]);
chart.canvas.setPaddings(50, 80, 50, 80);

chart.addPlot('plot1', 'line', 0.5, 'red', 'red', 0.5);
chart.addPlot('plot5', 'line', 0.5, 'blue', 'blue', 0.5);

chart.addSeries('cyberHedge1', [cbh1], 'plot1');
chart.addSeries('cyberHedge5', [cbh5], 'plot5');

chart.yAxis.setMinMax(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max));

console.log(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max))

window.addEventListener('resize', function(){
    chart.reDraw();
});

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