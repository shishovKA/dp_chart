import { Canvas } from "./Canvas";
import { Data } from "./Data";
import { Series } from "./Series";
import { Plot } from "./Plot";
import { Axis } from "./Axis";
import { Transformer } from "./Transformer";

export class Chart {
    
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

        this.reDraw = this.reDraw.bind(this);

        this.xAxis.changed.add(this.reDraw);
        this.yAxis.changed.add(this.reDraw);
        this.canvas.changed.add(this.reDraw);

        this.reDraw();
    }

    reDraw() {
        this.canvas.clear();
        this.canvas.resize();
        this.dataDraw();
        this.axisDraw();
    }

    axisDraw() {
        this.xAxis.drawAxis(this.canvas.ctx, this.canvas.viewport);
        this.yAxis.drawAxis(this.canvas.ctx, this.canvas.viewport);
    }

    dataDraw() {
        const axisRanges: number[] = [this.xAxis.min, this.xAxis.max, this.yAxis.min, this.yAxis.max];
        this.data.storage.forEach((series) => {
            const matrix: number[] = this._transformer.formMatrix(axisRanges, series.findExtremes(), this.canvas.viewport);
            const plotRect = this._transformer.transformRect(this.canvas.viewport, matrix);
            series.plots.forEach((plotId) => {
                const plot: Plot | null = this.findPlotById(plotId);
                if (plot) plot.drawPlot(this.canvas.ctx, plot.convertSeriesToCoord(series, plotRect));   
            })
        })
    }

    addSeries(id: string, seriesData: number[][], ...plotIds: string[]) {
        this.data.addSeries(id, seriesData, ...plotIds);
        this.data.findSeriesById(id)?.changed.add(this.reDraw);
        this.reDraw();
    }

    removeSeries(id: string) {
        this.data.removeSeries(id);
        this.reDraw();  
    }

    addPlot(id: string, ...options: any) {
        const plot = new Plot(id, ...options);
        this.plots.push(plot);
    }

    findPlotById(id: string):Plot | null {
        const plots: Plot[] = this.plots.filter((plot) => {
            return plot.id === id
        });
        if (plots.length !== 0) return plots[0];
        return null;
    }


}