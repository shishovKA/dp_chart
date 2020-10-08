import { Canvas } from "./Canvas";
import { Data } from "./Data";
import { Plot } from "./Plot";
import { Axis } from "./Axis";
import { Transformer } from "./Transformer";
import { Rectangle } from "./Rectangle";

export class Chart {
    
    canvas: Canvas;
    canvasA: Canvas;
    canvasTT: Canvas;
    data: Data;
    plots: Plot[];
    xAxis: Axis;
    yAxis: Axis;

    constructor(container: HTMLElement | null, xMinMax: number[], yMinMax: number[]) {
        
        this.canvas = new Canvas(container);
        this.canvasA = new Canvas(container);
        this.canvasTT = new Canvas(container);

        this.data = new Data();
        this.plots = [];

        this.xAxis = new Axis(xMinMax, 'horizontal');
        this.yAxis = new Axis(yMinMax, 'vertical');

        this.reDraw = this.reDraw.bind(this);
        //this.tooltipsDraw = this.tooltipsDraw.bind(this);
        
        this.bindChildSignals();

        //  this.canvasTT.mouseMoved.add(this.tooltipsDraw);

        window.addEventListener('resize', () => { this.reSize() });

        this.reSize();
    }

    bindChildSignals() {
        this.xAxis.onOptionsSetted.add(this.reDraw);
        this.xAxis.onMinMaxSetted.add(this.reDraw);
        this.xAxis.onCustomLabelsAdded.add(this.reDraw);
        this.xAxis.onAnimated.add(this.reDraw);

        this.yAxis.onOptionsSetted.add(this.reDraw);
        this.yAxis.onMinMaxSetted.add(this.reDraw);
        this.yAxis.onCustomLabelsAdded.add(this.reDraw);

        this.canvas.changed.add(this.reDraw);
        this.canvasA.changed.add(this.reDraw);
    }

    get axisRect(): Rectangle {
        return (new Rectangle(this.xAxis.min, this.yAxis.min, this.xAxis.max, this.yAxis.max))
    }

    reSize() {
        this.canvas.resize();
        this.canvasA.resize();
        this.canvasTT.resize();
        this.reDraw();
    }

    reDraw() {
        this.canvas.clear();
        this.canvasA.clear();
        this.plotsDraw();
        this.axisDraw();

        this.canvas.clipCanvas();  
    }

    axisDraw() {
        this.xAxis.draw(this.canvasA.ctx, this.canvasA.viewport);
        this.yAxis.draw(this.canvasA.ctx, this.canvasA.viewport);
    }

    plotsDraw() {
        this.data.storage.forEach((series) => {

            const transformer = new Transformer();
            const plotRect = transformer.getPlotRect(this.axisRect, series.dataRect, this.canvas.viewport);
            
            series.plots.forEach((plotId) => {
                const plot: Plot | null = this.findPlotById(plotId);
                if (plot) {
                        plot.convertSeriesToCoord(series, plotRect).drawPlot(this.canvas.viewport, this.canvas.ctx);
                    };   
                })
            })
    }


/*
    tooltipsDraw() {
        this.canvasTT.clear();
        this.data.storage.forEach((series) => {

            const transformer = new Transformer();
            const mouseX = this.canvasTT.mouseCoords[0];
            
            const seriesX = this.xAxis.min + mouseX*(this.xAxis.length)/this.canvasTT.viewport.width;
            const tipXY = series.getClosestPoint(seriesX);
            const pointData = tipXY;
            
            const tooltipCoord = transformer.getVeiwportCoord(this.xAxis, this.yAxis, tipXY, this.canvasTT.viewport);
  
            series.plots.forEach((plotId) => {
                const plot: Plot | null = this.findPlotById(plotId);
                if (plot) {
                        plot.tooltipsDraw(this.canvasTT.ctx, this.canvasTT.viewport, tooltipCoord, pointData);
                    };   
                })
            })
    }
*/

    setCanvasPaddings(...paddings: number[]) {
        this.canvas.setPaddings(...paddings);
        this.canvasTT.setPaddings(...paddings);
        this.canvasA.setPaddings(...paddings);
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