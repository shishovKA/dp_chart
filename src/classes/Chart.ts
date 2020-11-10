
import { Canvas } from "./Canvas";
import { Data } from "./Data";
import { Plot } from "./Plot";
import { Axis } from "./Axis";
import { Transformer } from "./Transformer";
import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { Series } from "./Series";
import { BackGround } from "./BackGround";
import { Signal } from "signals";

export class Chart {


    container: HTMLElement
    canvas: Canvas;
    canvasA: Canvas;
    canvasTT: Canvas;
    data: Data;
    plots: Plot[];
    xAxis: Axis;
    yAxis: Axis;
    hasBorder: boolean = false;
    clipSeriesCanvas: boolean = false;
    background?: BackGround;
    tooltipsDataIndexUpdated: Signal;

    constructor(container: HTMLElement, xMinMax: number[], yMinMax: number[]) {
        this.container = container;
        this.canvas = new Canvas(container);
        this.canvasA = new Canvas(container);
        this.canvasTT = new Canvas(container);
        this.canvasTT.turnOnListenres();
        this.canvasTT.canvas.style.zIndex = "10";
        this.data = new Data();
        this.plots = [];
        this.xAxis = new Axis(xMinMax, 'horizontal');
        this.yAxis = new Axis(yMinMax, 'vertical');

        this.tooltipsDraw = this.tooltipsDraw.bind(this);
        this.seriesReDraw = this.seriesReDraw.bind(this);    

        window.addEventListener('resize', () => { this.reSize() });

        this.reSize();
        this.bindChildSignals();
        this.tooltipsDraw(true);

        this.tooltipsDataIndexUpdated = new Signal();
    }



    bindChildSignals() {
        
        // axis
        this.xAxis.onOptionsSetted.add(() => {
        // @ts-ignore
            this.xAxis.createTicks(this.xAxis.min, this.xAxis.max, this.xAxis.getaxisViewport(this.canvasA.viewport), this.canvasA.ctx);
            this.axisReDraw();
        });

        //min max
        this.xAxis.onMinMaxSetted.add((hasPlotAnimation) => {
            // @ts-ignore
            this.xAxis.createTicks(this.xAxis.min, this.xAxis.max, this.xAxis.getaxisViewport(this.canvasA.viewport), this.canvasA.ctx);

            if (hasPlotAnimation) this.seriesUpdatePlotData();
            
            this.axisReDraw();
            this.tooltipsDraw(true);
        });

        this.xAxis.onCustomLabelsAdded.add(() => {
            // @ts-ignore
            this.xAxis.createTicks(this.xAxis.min, this.xAxis.max, this.xAxis.getaxisViewport(this.canvasA.viewport), this.canvasA.ctx);
            this.axisReDraw();
        });

        this.xAxis.onAnimated.add(() => {
            this.axisReDraw();
        });


        this.yAxis.onOptionsSetted.add(() => {
            // @ts-ignore
            this.yAxis.createTicks(this.yAxis.min, this.yAxis.max, this.yAxis.getaxisViewport(this.canvasA.viewport), this.canvasA.ctx);
            this.axisReDraw();
        });

        //min max
        this.yAxis.onMinMaxSetted.add((hasPlotAnimation) => {
            // @ts-ignore
            this.yAxis.createTicks(this.yAxis.min, this.yAxis.max, this.yAxis.getaxisViewport(this.canvasA.viewport), this.canvasA.ctx);
            this.axisReDraw();
            if (hasPlotAnimation) this.seriesUpdatePlotData();
            this.tooltipsDraw(true);
        });

        this.yAxis.onCustomLabelsAdded.add(() => {
            // @ts-ignore
            this.yAxis.createTicks(this.yAxis.min, this.yAxis.max, this.yAxis.getaxisViewport(this.canvasA.viewport), this.canvasA.ctx);
            this.axisReDraw();
        });

        this.yAxis.onAnimated.add(() => {
            this.axisReDraw();
        });

        // canvas

        this.canvasTT.mouseMoved.add(this.tooltipsDraw);
        this.canvasTT.mouseOuted.add(() => {
            this.tooltipsDraw(true);
        });
        this.canvasTT.touchEnded.add(() => {
            this.tooltipsDraw(true);
        });
    }

    get axisRect(): Rectangle {
        return (new Rectangle(this.xAxis.min, this.yAxis.min, this.xAxis.max, this.yAxis.max))
    }

    reSize() {
        this.canvas.resize();
        this.canvasA.resize();
        this.canvasTT.resize();

        this.data.seriesStorage.forEach((series, ind) => {
            series.canvas.resize();
        })

        this.seriesUpdatePlotData();
        this.ticksCreate();
        this.axisReDraw();
    }


    axisReDraw() {
        this.canvasA.clear();
        this.axisDraw();
    }

    // генерируем PlotData у series
    seriesUpdatePlotData() {
        this.data.seriesStorage.forEach((series, ind) => {
            series.updatePlotData(this.axisRect, series.canvas.viewport);
        })
    }

    // генерируем тики у Осей
    ticksCreate() {
        // @ts-ignore
        this.xAxis.createTicks(this.xAxis.min, this.xAxis.max, this.xAxis.getaxisViewport(this.canvasA.viewport), this.canvasA.ctx);
        // @ts-ignore
        this.yAxis.createTicks(this.yAxis.min, this.yAxis.max, this.yAxis.getaxisViewport(this.canvasA.viewport), this.canvasA.ctx); 
    }
    
    // отрисовываем Оси
    axisDraw() {
        if (this.background) this.background.draw(this.canvasA.ctx, this.xAxis.ticks.coords, this.yAxis.ticks.coords)
        // @ts-ignore
        this.xAxis.draw(this.canvasA.ctx, this.canvasA.viewport);
        // @ts-ignore
        this.yAxis.draw(this.canvasA.ctx, this.canvasA.viewport);

        if (this.hasBorder) this.canvasA.drawVp();

    }


    // отрисовка одной серии
    seriesReDraw(series: Series) {
            const canvas = series.canvas;
            canvas.clear();

            if (this.clipSeriesCanvas) canvas.clipCanvas();

            series.plots.forEach((plotId) => {
                const plot: Plot | null = this.findPlotById(plotId);
                if (plot) {
                    // @ts-ignore
                    plot.drawPlot(canvas.ctx, series.plotDataArr);
                };
            })
            
        this.tooltipsDraw(true);
    }

    setCanvasPaddings(...paddings: number[]) {
        this.canvas.setPaddings(...paddings);
        this.canvasTT.setPaddings(...paddings);
        this.canvasA.setPaddings(...paddings);
        
        this.data.seriesStorage.forEach((series, ind) => {
            series.canvas.setPaddings(...paddings);
        })
    }


    addBackGround(type: string) {
        this.background = new BackGround(type);
    }

    addPlot(id: string, type: string, ...options: any) {
        const plot = new Plot(id, type, ...options);
        this.plots.push(plot);
    }


    findPlotById(id: string): Plot | null {
        const plots: Plot[] = this.plots.filter((plot) => {
            return plot.id === id
        });
        if (plots.length !== 0) return plots[0];
        return null;
    }


    addSeries(id: string, seriesData: number[][]) {
        const newSeries = new Series(id, this.container, seriesData);
        this.data.seriesStorage.push(newSeries);
        newSeries.canvas.setPaddings(this.canvas.top, this.canvas.right, this.canvas.bottom, this.canvas.left);
        newSeries.updatePlotData(this.axisRect, newSeries.canvas.viewport, true);
        newSeries.onPlotDataChanged.add( this.seriesReDraw );
        return newSeries;
    }

    switchDataAnimation(hasAnimation: boolean, duration?: number) {
        this.data.seriesStorage.forEach((series, ind) => {
            series.hasAnimation = hasAnimation;
            if (duration) series.animationDuration = duration;
        })
    }


    // отрисовываем тултипы
    tooltipsDraw(drawLast?: boolean) {
        this.canvasTT.clear();

        const mouseXY = this.canvasTT.mouseCoords;

        const transformer = new Transformer();

        let delta_abs_buf: Point[] = [];
        let delta_abs_buf_coord: Point[] = [];
        // @ts-ignore
        let data_y_end_buf = [];

        this.data.seriesStorage.forEach((series) => {

            const seriesX = this.xAxis.min + mouseXY.x * (this.xAxis.length) / this.canvasTT.viewport.width;
            const pointData = series.getClosestPointX(seriesX);

            const tooltipCoord = series.getClosestPlotPoint(mouseXY.x+this.canvasTT.left);

            this.tooltipsDataIndexUpdated.dispatch(pointData.x);
            //const tooltipCoord = transformer.getVeiwportCoord(this.axisRect, this.canvasTT.viewport, pointData);

            series.plots.forEach((plotId) => {
                const plot: Plot | null = this.findPlotById(plotId);
                if (plot) {
                    plot.tooltips.forEach((tooltip) => {

                        if (drawLast) {

                            switch (tooltip.type) {

                                case 'data_y_end':
                                    data_y_end_buf.push([tooltip, tooltipCoord, pointData]);
                                    break;

                                case 'circle_series':
                                    // @ts-ignore
                                    tooltip.drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, new Point(tooltipCoord.x, tooltipCoord.y), pointData);
                                    break;

                            }

                        } else {

                            switch (tooltip.type) {

                                case 'delta_abs':
                                    if (delta_abs_buf.length == 0) {
                                        delta_abs_buf.push(pointData);
                                        delta_abs_buf_coord.push(tooltipCoord);
                                    } else {
                                        const ttCoord: Point = (delta_abs_buf_coord[0].y < tooltipCoord.y) ? delta_abs_buf_coord[0] : tooltipCoord;
                                        const absData = new Point(Math.abs(pointData.x - delta_abs_buf[0].x), Math.abs(pointData.y - delta_abs_buf[0].y));
                                        // @ts-ignore
                                        tooltip.drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, ttCoord, absData);
                                        delta_abs_buf.pop();
                                        delta_abs_buf_coord.pop();
                                    }
                                    break;

                                case 'data_y_end':
                                    data_y_end_buf.push([tooltip, tooltipCoord, pointData]);
                                    break;

                                case 'label_x_start':
                                    // @ts-ignore
                                    tooltip.drawTooltip(this.canvasTT.ctx, this.canvasA.viewport, new Point(tooltipCoord.x, tooltipCoord.y), pointData);
                                    break;

                                case 'line_vertical_full':
                                    // @ts-ignore
                                    tooltip.drawTooltip(this.canvasTT.ctx, this.canvasA.viewport, new Point(tooltipCoord.x, tooltipCoord.y), pointData);
                                    break;

                                default:
                                    // @ts-ignore
                                    tooltip.drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, new Point(tooltipCoord.x, tooltipCoord.y), pointData);
                                    break;

                            }

                        }

                    })
                };
            })
        })

        // рассталкиваем друг от друга боковые тултипы
        // @ts-ignore
        data_y_end_buf.sort((a, b) => a[1].y - b[1].y);

        for (let i = 0; i < data_y_end_buf.length - 1; i++) {
            // @ts-ignore
            const rect1 = data_y_end_buf[i][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i][1], data_y_end_buf[i][2], false);
            // @ts-ignore
            const rect2 = data_y_end_buf[i + 1][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i + 1][1], data_y_end_buf[i + 1][2], false);

            if (rect1.y2 > rect2.y1) {

                const abs = Math.abs(rect1.y2 - rect2.y1);

                let abs1 = -abs * 0.5;
                let abs2 = abs * 0.5;

                if (Math.abs(rect1.y1 - this.canvasTT.viewport.y1) < Math.abs(abs1)) {
                    abs1 = -Math.abs(rect1.y1 - this.canvasTT.viewport.y1);
                    abs2 = (abs + abs1);
                }

                if (Math.abs(rect2.y2 - this.canvasTT.viewport.y2) < abs2) {
                    abs2 = -Math.abs(rect1.y2 - this.canvasTT.viewport.y2);
                    abs1 = -(abs - abs2);
                }
                // @ts-ignore
                data_y_end_buf[i][1].y = data_y_end_buf[i][1].y + abs1;
                // @ts-ignore
                data_y_end_buf[i + 1][1].y = data_y_end_buf[i + 1][1].y + abs2;
            }
        }
// @ts-ignore
        data_y_end_buf.forEach((ttRow) => {
            ttRow[0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, ttRow[1], ttRow[2], true);
        })
    }


}