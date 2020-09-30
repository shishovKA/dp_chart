import { Canvas } from "./Canvas";
import { Data } from "./Data";
import { Plot } from "./Plot";
import { Axis } from "./Axis";
import { Transformer } from "./Transformer";
import { Tooltip } from "./Tooltip";

export class Chart {
    
    canvas: Canvas;
    data: Data;
    plots: Plot[];
    tooltips: Tooltip[];
    xAxis: Axis;
    yAxis: Axis;
    _transformer: Transformer;

    constructor(container: HTMLElement | null, xMinMax: number[], yMinMax: number[]) {
        this.canvas = new Canvas(container);
        this.data = new Data();
        this.plots = [];
        this.tooltips = [];

        this.xAxis = new Axis(xMinMax, 'horizontal');
        this.yAxis = new Axis(yMinMax, 'vertical');

        this._transformer = new Transformer();

        this.reDraw = this.reDraw.bind(this);
        this.tooltipsDraw = this.tooltipsDraw.bind(this);

        this.xAxis.changed.add(this.reDraw);
        this.yAxis.changed.add(this.reDraw);
        this.canvas.changed.add(this.reDraw);
        this.canvas.mouseMoved.add(this.reDraw);

        window.addEventListener('resize', () => { this.reSize() });

        this.reSize();
    }

    reSize() {
        this.canvas.resize();
        this.reDraw();
    }

    reDraw() {
        this.canvas.clear();
        this.dataDraw();
        this.axisDraw();
        this.tooltipsDraw();
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
                if (plot) plot.drawPlot(this.canvas.viewport, this.canvas.ctx, plot.convertSeriesToCoord(series, plotRect));   
            })
        })
    }

    tooltipsDraw() {
        const axisRanges: number[] = [this.xAxis.min, this.xAxis.max, this.yAxis.min, this.yAxis.max];
        this.data.storage.forEach((series) => {
            const mouseVpX = this.canvas.mouseCoords[0];
            const seriesX = this.xAxis.min + mouseVpX*(axisRanges[1]-axisRanges[0])/this.canvas.viewport.width;
            const tipXY = series.getClosestData(seriesX);
            const matrix: number[] = this._transformer.formMatrix(axisRanges, [tipXY[0],tipXY[0],tipXY[1],tipXY[1]], this.canvas.viewport);
            const tooltipRect = this._transformer.transformRect(this.canvas.viewport, matrix);
            series.tooltips.forEach((tooltipId) => {
                const tooltip: Tooltip | null = this.findTooltipById(tooltipId);
                if (tooltip) tooltip.drawTooltip(this.canvas.ctx, this.canvas.viewport, tooltipRect, tipXY);
            })
        })
    }

    
    addSeries(id: string, seriesData: number[][], plotIds: string[], tooltipsIds?: string[]) {
        this.data.addSeries(id, seriesData, plotIds, tooltipsIds);
        this.data.findSeriesById(id)?.changed.add(this.reDraw);
        this.reDraw();
    }

    removeSeries(id: string) {
        this.data.removeSeries(id);
        this.reDraw();  
    }

    addPlot(id: string, type: string, ...options: any) {
        const plot = new Plot(id, type, ...options);
        this.plots.push(plot);
    }

    addTooltip(id: string, type: string, options: any[], labels?:string[]) {
        const tooltip = new Tooltip(id, type, options, labels);
        this.tooltips.push(tooltip);
    }

    findPlotById(id: string):Plot | null {
        const plots: Plot[] = this.plots.filter((plot) => {
            return plot.id === id
        });
        if (plots.length !== 0) return plots[0];
        return null;
    }

    findTooltipById(id: string):Tooltip | null {
        const tooltips: Tooltip[] = this.tooltips.filter((tooltip) => {
            return tooltip.id === id
        });
        if (tooltips.length !== 0) return tooltips[0];
        return null;
    }


}