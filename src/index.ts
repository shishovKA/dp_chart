import { csv } from "d3-fetch"
import path from 'path';
import "./styles/style.css";
import "./styles/normalize.css";

import {Canvas} from "./classes/Canvas"
import {Axis} from "./classes/Axis"

import {Plot} from "./classes/Plot"
import {Series} from "./classes/Series"

//создаем экземпляр класса Chart

const testCanvas = new Canvas(document.querySelector('.chart__container'), 50, 50, 50, 50);

const xAxis = new Axis(0, 1, 'horizontal');
const yAxis = new Axis(0, 1, 'vertical');
const testPlot = new Plot('default');

xAxis.drawAxis(testCanvas.ctx, testCanvas.viewport);
yAxis.drawAxis(testCanvas.ctx, testCanvas.viewport);


/*

window.addEventListener('resize', function(){
    console.log('resize');
    newGraf.resize();
});

*/

import {cbh} from "./data/csvArr"
console.log('cbh', cbh);

const ind = [];
const val = [];
        
cbh.forEach((element, index) => {
            ind.push(index);
            val.push(element);
        });

        console.log('ind', ind);

        const testSeries = new Series ('cyberHedge', [ind, val])
        console.log(testSeries.seriesData)


        testPlot.drawPlot(testCanvas.ctx, testPlot.convertSeriesToCoord(testSeries, testCanvas.viewport));

