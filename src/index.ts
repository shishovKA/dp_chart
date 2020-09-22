import "./styles/style.css";
import "./styles/normalize.css";



import {cbh1} from "./data/cbh1"
import {cbh5} from "./data/cbh5"

import {Chart} from "./classes/Chart"

//работа с Chart
const chart = new Chart(document.querySelector('.chart__container'), [500, 900], [500, 1500]);
//chart.canvas.setPaddings(50, 50, 50, 50);
chart.data.addSeries('cyberHedge1', [cbh1], 'plot1');
chart.data.addSeries('cyberHedge5', [cbh5], 'plot5');
chart.addPlot('plot1', 1, 'red', 'red', 1);
chart.addPlot('plot5', 1, 'blue', 'blue', 1);

chart.reDraw();

window.addEventListener('resize', function(){
    chart.reDraw();;
});

console.log(chart);
//drawRect(chart.canvas.viewport, '#d40da5');


function drawRect(rect: Rectangle, color: string) {
    chart.canvas.ctx.strokeStyle = color;
    chart.canvas.ctx.lineWidth = 2;
    chart.canvas.ctx.strokeRect(rect.x1, rect.y1, rect.width, rect.height)
}

/*
//создание элементов в ручную

import {Canvas} from "./classes/Canvas"
import {Axis} from "./classes/Axis"
import {Plot} from "./classes/Plot"
import {Series} from "./classes/Series"
import {Transformer} from "./classes/Transformer"
import { Rectangle } from "./classes/Rectangle";
import { Data } from "./classes/Data";

//Canvas
const testCanvas = new Canvas(document.querySelector('.chart__container'), 50, 50, 50, 50);

//Axis
const xAxis = new Axis([500, 900], 'horizontal', 1, 'gray');
const yAxis = new Axis([500, 1500], 'vertical', 1, 'gray');

const axisRanges: number[] = [xAxis.min, xAxis.max, yAxis.min, yAxis.max];

//Plots
const plot1 = new Plot('default', 1, 'red', 'red', 1);
const plot2 = new Plot('default', 1, 'blue', 'blue', 1);

//Data
const data = new Data();
data.addSeries('cyberHedge', [cbh1]);
data.addSeries('cyberHedge', [cbh5]);

//Series
const cbh1Series = new Series ('cyberHedge', [cbh1]);
const cbh5Series = new Series ('cyberHedge', [cbh5]);

//Transformer
const transformer = new Transformer();



//Отрисовка в тестовом виде

window.addEventListener('resize', function(){
    render();
});


function render() {
    testCanvas.resize();
    testCanvas.clear();
    xAxis.drawAxis(testCanvas.ctx, testCanvas.viewport);
    yAxis.drawAxis(testCanvas.ctx, testCanvas.viewport);

//    data.storage.forEach((series) => {
//        const matrix: number[] = transformer.formMatrix(axisRanges, series.findExtremes(), testCanvas.viewport);
//        const plotRect5 = transformer.transformRect(testCanvas.viewport, matrix);
 //       plot2.drawPlot(testCanvas.ctx, plot2.convertSeriesToCoord(cbh5Series, plotRect5));      
 //   })

    cbh1Series.replaceSeriesData(cbh1Series.getDataRange(xAxis.min, xAxis.max, yAxis.min, yAxis.max));
    const matrix1: number[] = transformer.formMatrix(axisRanges, cbh1Series.findExtremes(), testCanvas.viewport);
    const plotRect1 = transformer.transformRect(testCanvas.viewport, matrix1);
    plot1.drawPlot(testCanvas.ctx, plot1.convertSeriesToCoord(cbh1Series, plotRect1));
    
//    cbh5Series.replaceSeriesData(cbh5Series.getDataRange(xAxis.min, xAxis.max, yAxis.min, yAxis.max));
    const matrix5: number[] = transformer.formMatrix(axisRanges, cbh5Series.findExtremes(), testCanvas.viewport);
    const plotRect5 = transformer.transformRect(testCanvas.viewport, matrix5);
    plot2.drawPlot(testCanvas.ctx, plot2.convertSeriesToCoord(cbh5Series, plotRect5));

    drawRect(testCanvas.viewport, '#d40da5');
    drawRect(plotRect1, '#1dbf45');
    drawRect(plotRect5, '#1dbf45')
};

function drawRect(rect: Rectangle, color: string) {
    testCanvas.ctx.strokeStyle = color;
    testCanvas.ctx.lineWidth = 2;
    testCanvas.ctx.strokeRect(rect.x1, rect.y1, rect.width, rect.height)
}

render();

*/