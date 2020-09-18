import { csv } from "d3-fetch"
import path from 'path';
import "./styles/style.css";
import "./styles/normalize.css";

import {Canvas} from "./classes/Canvas"
import {Axis} from "./classes/Axis"
import {Plot} from "./classes/Plot"
import {Series} from "./classes/Series"
import {Transformer} from "./classes/Transformer"
import {cbh1} from "./data/cbh1"
import {cbh5} from "./data/cbh5"     
import { Rectangle } from "./classes/Rectangle";

//создание элементов

//Canvas
const testCanvas = new Canvas(document.querySelector('.chart__container'), 50, 50, 50, 50);

//Axis
const xAxis = new Axis(0, 2000, 'horizontal', 1, 'gray');
const yAxis = new Axis(0, 2000, 'vertical', 1, 'gray');

//Plots
const plot1 = new Plot('default', 1, 'red', 'red', 1);
const plot2 = new Plot('default', 1, 'blue', 'blue', 1);

//Series
const cbh1Series = new Series ('cyberHedge', [cbh1]);
const cbh5Series = new Series ('cyberHedge', [cbh5]);

//Transformer
const transformer = new Transformer();

console.log('cbh1Series.findExtremes()', cbh1Series.findExtremes());

const axisRanges: number[] = [xAxis.min, xAxis.max, yAxis.min, yAxis.max];


const matrix: number[] = transformer.formMatrix(axisRanges, cbh1Series.findExtremes(), testCanvas.viewport);

console.log('matrix', matrix);

const plotRect1 = transformer.transformRect(testCanvas.viewport, matrix);
console.log('testCanvas.viewport', testCanvas.viewport);
console.log('plotRect1', plotRect1);


//Отрисовка в тестовом виде

window.addEventListener('resize', function(){
    render();
});


function render() {
    testCanvas.resize();
    testCanvas.clear();
    xAxis.drawAxis(testCanvas.ctx, testCanvas.viewport);
    yAxis.drawAxis(testCanvas.ctx, testCanvas.viewport);
    plot1.drawPlot(testCanvas.ctx, plot1.convertSeriesToCoord(cbh1Series, plotRect1));
    plot2.drawPlot(testCanvas.ctx, plot2.convertSeriesToCoord(cbh5Series, testCanvas.viewport));

    drawRect(testCanvas.viewport, '#d40da5');
    drawRect(plotRect1, '#1dbf45')
};

function drawRect(rect: Rectangle, color: string) {
    testCanvas.ctx.strokeStyle = color;
    testCanvas.ctx.lineWidth = 2;
    testCanvas.ctx.strokeRect(rect.x1, rect.y1, rect.width, rect.height)
}

render();

