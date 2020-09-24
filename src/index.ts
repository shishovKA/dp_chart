
import "./styles/normalize.css";
import "./styles/style.css";


import {cbh1} from "./data/cbh1"
import {cbh5} from "./data/cbh5"

import {Panel} from "./control/Panel"
import {Btn} from "./control/Btn"
import {SeriesCtrl} from "./control/SeriesCtrl"

import {Chart} from "./classes/Chart"

//работа с Chart
const chart = new Chart(document.querySelector('.chart__container'), [0, 900], [0, 2000]);
chart.canvas.setPaddings(50, 80, 50, 80);

//chart.addPlot('plot1', 1, 'red', 'red', 1);
//chart.addPlot('plot5', 1, 'blue', 'blue', 1);

//chart.addSeries('cyberHedge1', [cbh1], 'plot1');
//chart.addSeries('cyberHedge5', [cbh5], 'plot5');

chart.reDraw();

window.addEventListener('resize', function(){
    chart.reDraw();
});

console.log(chart);
//drawRect(chart.canvas.viewport, '#d40da5');



//элементы управления

const panel1 = new Panel(document.querySelector('.panel'),'X axis','Min','Max', 'duration', 0, 900, 1000);
const panel2 = new Panel(document.querySelector('.panel'),'Y axis','Min','Max', 'duration', 0, 2000, 1000);

const addSeriesBtn = new Btn(document.querySelector('.panel'), 'Add Series', '#d1d1d1')

//const blueBtn = new Btn(document.querySelector('.panel'), 'Синий график', '#34b6f7')
//const redBtn = new Btn(document.querySelector('.panel'), 'Красный график', '#ff474e')

panel1.submitBtn.addEventListener("click", (event) => {
  event.preventDefault()
  console.log(panel1.values);
  if (panel1.duration != 0) {
      chart.xAxis.setMinMax(panel1.values, panel1.duration);
    } else {
      chart.xAxis.setMinMax(panel1.values);
      }
})

panel2.submitBtn.addEventListener("click", (event) => {
  event.preventDefault()
  console.log(panel2.values);
  if (panel2.duration != 0) {
      chart.yAxis.setMinMax(panel2.values, panel2.duration);
    } else {
        chart.yAxis.setMinMax(panel2.values);
      }
})


addSeriesBtn.element.addEventListener("click", (event) => {
  event.preventDefault();
  const plotId = `f${(~~(Math.random()*1e8)).toString(16)}`;
  const plotColor = "#"+Math.floor(Math.random()*16777215).toString(16);
  chart.addPlot(plotId, 1, plotColor, plotColor, 1)

  const series = randomSeries();
  const seriesId = `f${(~~(Math.random()*1e8)).toString(16)}`;
  chart.addSeries(seriesId, [series], plotId);

  const newBtn = new SeriesCtrl(document.querySelector('.series'), seriesId, plotColor);
  newBtn.upBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const series = chart.data.findSeriesById(seriesId);
    series.replaceSeriesData([generateArr(series?.seriesData[1], 150)], 300)
  })

  newBtn.downBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const series = chart.data.findSeriesById(seriesId);
    series.replaceSeriesData([generateArr(series?.seriesData[1], -150)], 300)
  })

  newBtn.delBtn.addEventListener("click", (event) => {
    event.preventDefault();
    chart.removeSeries(seriesId);
    newBtn.element.remove();
  })
})


function generateArr(from: number[], d:number): number[] {
  let r =0.5+ 0.5*Math.random() 
  let n:number[] = []
  from.forEach((el,ind) => {
    n.push(from[ind]+d);
  })
  return n;
}

function randomSeries(): number[] {
  const arr:number[] = [];
  const n = Math.random();
  cbh1.forEach((el,ind)=>{
    arr.push(cbh1[ind] + n*(cbh5[ind]-cbh1[ind]));
  })

  return arr;
}

