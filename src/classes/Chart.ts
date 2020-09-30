import { Canvas } from "./Canvas";
import { Data } from "./Data";
import { Plot } from "./Plot";
import { Axis } from "./Axis";
import { Transformer } from "./Transformer";
import { Point } from "./Point";

export class Chart {
    
    canvas: Canvas;
    canvasTT: Canvas;
    data: Data;
    plots: Plot[];
    xAxis: Axis;
    yAxis: Axis;

    constructor(container: HTMLElement | null, xMinMax: number[], yMinMax: number[]) {
        
        this.canvas = new Canvas(container);
        this.canvasTT = new Canvas(container);

        this.data = new Data();
        this.plots = [];

        this.xAxis = new Axis(xMinMax, 'horizontal');
        this.yAxis = new Axis(yMinMax, 'vertical');

        this.reDraw = this.reDraw.bind(this);
        this.tooltipsDraw = this.tooltipsDraw.bind(this);

        this.xAxis.changed.add(this.reDraw);
        this.yAxis.changed.add(this.reDraw);
        this.canvas.changed.add(this.reDraw);

        this.canvasTT.mouseMoved.add(this.tooltipsDraw);

        window.addEventListener('resize', () => { this.reSize() });

        this.reSize();
    }

    reSize() {
        this.canvas.resize();
        this.canvasTT.resize();
        this.reDraw();
    }

    reDraw() {
        this.canvas.clear();
        this.plotsDraw();
        this.axisDraw();
    }

    axisDraw() {
        this.xAxis.drawAxis(this.canvas.ctx, this.canvas.viewport);
        this.yAxis.drawAxis(this.canvas.ctx, this.canvas.viewport);
    }

    plotsDraw() {
        this.data.storage.forEach((series) => {

            const transformer = new Transformer();
            const plotRect = transformer.getPlotRect(this.xAxis, this.yAxis, series, this.canvas.viewport);
            
            series.plots.forEach((plotId) => {
                const plot: Plot | null = this.findPlotById(plotId);
                if (plot) {
                        plot.convertSeriesToCoord(series, plotRect).drawPlot(this.canvas.viewport, this.canvas.ctx);
                    };   
                })
            })
    }


    tooltipsDraw() {
        this.canvasTT.clear();
        this.data.storage.forEach((series) => {

            const transformer = new Transformer();
            const mouseX = this.canvasTT.mouseCoords[0];
            const seriesX = this.xAxis.min + mouseX*(this.xAxis.length)/this.canvasTT.viewport.width;
            const tipXY = series.getClosestData(seriesX);
            const pointData = new Point(tipXY[0], tipXY[1]);
            
            const tooltipCoord = transformer.getVeiwportCoord(this.xAxis, this.yAxis, tipXY, this.canvasTT.viewport);
  
            series.plots.forEach((plotId) => {
                const plot: Plot | null = this.findPlotById(plotId);
                if (plot) {
                        plot.tooltipsDraw(this.canvasTT.ctx, this.canvasTT.viewport, tooltipCoord, pointData);
                    };   
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


    findPlotById(id: string):Plot | null {
        const plots: Plot[] = this.plots.filter((plot) => {
            return plot.id === id
        });
        if (plots.length !== 0) return plots[0];
        return null;
    }

}