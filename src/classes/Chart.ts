import { Canvas } from "./Canvas";
import { Data } from "./Data";
import { Series } from "./Series";
import { Plot } from "./Plot";
import { Axis } from "./Axis";
import { Transformer } from "./Transformer";

export class Rectangle {
    
    canvas: Canvas;
    data: Data;
    plots: Plot[];
    xAxis: Axis;
    yAxis: Axis;
    _transformer: Transformer;

    constructor(container: HTMLElement | null, xMinMax: number[], yMinMax: number[]) {
        this.canvas = new Canvas(container);
        this.data = new Data();
        this.plots = [];

        this.xAxis = new Axis(xMinMax, 'horizontal');
        this.yAxis = new Axis(yMinMax, 'vertical');

        this._transformer = new Transformer();
    }

    axisDraw() {
        this.xAxis.drawAxis(this.canvas.ctx, this.canvas.viewport);
        this.yAxis.drawAxis(this.canvas.ctx, this.canvas.viewport);
    }

    dataDraw() {
        
    }


}