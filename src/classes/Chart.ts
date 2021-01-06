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
import { SeriesBase } from "./series/SeriesBase";
import { SeriesXY } from "./series/SeriesXY";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

export class Chart {

    container: HTMLElement
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
        //signals
        this.tooltipsDataIndexUpdated = new Signal();
        this.container = container;
        
        this.canvasTT = new Canvas(container);
        this.canvasTT.turnOnListenres();
        this.canvasTT.canvas.style.zIndex = "4";

        this.data = new Data();
        this.plots = [];

        this.xAxis = new Axis(xMinMax, 'horizontal', container);
        this.yAxis = new Axis(yMinMax, 'vertical', container);

        //bind
        this.tooltipsDraw = this.tooltipsDraw.bind(this);
        this.seriesReDraw = this.seriesReDraw.bind(this);    

        //call methods
        this.bindChildSignals();
        this.tooltipsDraw(true);
    }


    refresh() {
       this.xAxis.refresh();
       this.yAxis.refresh(); 
    }


    switchResolution() {
        this.xAxis.canvas.squareRes = true;
        this.yAxis.canvas.squareRes = true;
        this.canvasTT.squareRes = true;

        if (this.background) this.background.canvas.squareRes = true;

        this.data.seriesStorage.forEach((series, ind) => {
            series.canvas.squareRes = true;
        });

    }


    bindChildSignals() {

        this.xAxis.onRefreshed.add(() => {
            this.seriesUpdatePlotData();
            this.tooltipsDraw(true);
        });

        this.yAxis.onRefreshed.add(() => {
            this.seriesUpdatePlotData();
            this.tooltipsDraw(true);
        });
        
        //min max
        this.xAxis.onMinMaxSetted.add((hasPlotAnimation) => {
            // @ts-ignore
            if (hasPlotAnimation) this.seriesUpdatePlotData();
            this.tooltipsDraw(true);
        });

        //min max
        this.yAxis.onMinMaxSetted.add((hasPlotAnimation) => {
            if (hasPlotAnimation) this.seriesUpdatePlotData();
            this.tooltipsDraw(true);
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



    // генерируем PlotData у series
    seriesUpdatePlotData() {
        this.data.seriesStorage.forEach((series, ind) => {
            series.updatePlotData(this.axisRect, series.canvas.viewport);
        })
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
                    plot.drawPlot(canvas.ctx, series.plotDataArr, canvas.viewport, series.plotLabels);
                };
            })   
        this.tooltipsDraw(true);
    }

    setCanvasPaddings(...paddings: number[]) {
        this.canvasTT.setPaddings(...paddings);
        this.xAxis.canvas.setPaddings(...paddings);
        this.yAxis.canvas.setPaddings(...paddings);

        if (this.background) this.background.canvas.setPaddings(...paddings);

        this.data.seriesStorage.forEach((series, ind) => {
            series.canvas.setPaddings(...paddings);
        })
    }


    addBackGround(type: string) {
        this.background = new BackGround(type, this.container);
        //ticks
        this.xAxis.ticks.onCoordsChanged.add(() => {
            this.backgroundDraw();
        });

        this.yAxis.ticks.onCoordsChanged.add(() => {
            this.backgroundDraw();
        });

        this.background.canvas.resized.add(() => {
            this.backgroundDraw();
        })

        this.backgroundDraw();
    }

    backgroundDraw() {
        if (this.background) this.background.draw(this.xAxis.ticks.coords, this.yAxis.ticks.coords)
    }


    addPlot(id: string, type: string, ...options: any) {
        const plot = new Plot(id, type, ...options);
        this.plots.push(plot);
        return plot;
    }


    findPlotById(id: string): Plot | null {
        const plots: Plot[] = this.plots.filter((plot) => {
            return plot.id === id
        });
        if (plots.length !== 0) return plots[0];
        return null;
    }


    addSeries(id: string, seriesData: number[][], labels?:string[]) {
        const newSeries: Series = new SeriesXY(id, this.container, seriesData, labels);
        this.data.seriesStorage.push(newSeries);
        newSeries.canvas.setPaddings(this.canvasTT.top, this.canvasTT.right, this.canvasTT.bottom, this.canvasTT.left);
        newSeries.updatePlotData(this.axisRect, newSeries.canvas.viewport, true);
        newSeries.onPlotDataChanged.add( this.seriesReDraw );
        newSeries.onSeriesDataChanged.add((series) => {
            series.updatePlotData(this.axisRect, series.canvas.viewport);
        });
        newSeries.canvas.resized.add(() => {
            newSeries.updatePlotData(this.axisRect, newSeries.canvas.viewport, true);
        })

        newSeries.canvas.onPaddingsSetted.add(() => {
            newSeries.updatePlotData(this.axisRect, newSeries.canvas.viewport, true);
        })
        return newSeries;
    }

    addSeriesRow(id: string, seriesData: number[][]) {
        const newSeries: Series = new SeriesBase(id, this.container, seriesData);

        this.data.seriesStorage.push(newSeries);
        newSeries.canvas.setPaddings(this.canvasTT.top, this.canvasTT.right, this.canvasTT.bottom, this.canvasTT.left);
        newSeries.updatePlotData(this.axisRect, newSeries.canvas.viewport, true);
        newSeries.onPlotDataChanged.add( this.seriesReDraw );

        newSeries.onSeriesDataChanged.add((series) => {
            series.updatePlotData(this.axisRect, series.canvas.viewport);
        });
        newSeries.canvas.resized.add(() => {
            newSeries.updatePlotData(this.axisRect, newSeries.canvas.viewport, true);
        })

        newSeries.canvas.onPaddingsSetted.add(() => {
            newSeries.updatePlotData(this.axisRect, newSeries.canvas.viewport, true);
        })

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
            const seriesY = this.yAxis.max - mouseXY.y * (this.yAxis.length) / this.canvasTT.viewport.height;
            const sriesP = new Point(seriesX, seriesY);
            
            const [pointData, tt_ind] = series.getClosestDataPointX(sriesP);
            const [pointDataXY, tt_ind_XY] = series.getClosestDataPointXY(sriesP);
            const tooltipCoordX = series.getClosestPlotPointX(new Point(mouseXY.x+this.canvasTT.left, mouseXY.y+this.canvasTT.top));
            const tooltipCoordXY = series.getClosestPlotPointXY(new Point(mouseXY.x+this.canvasTT.left, mouseXY.y+this.canvasTT.top));

            this.tooltipsDataIndexUpdated.dispatch(pointData.x);
            const tooltipCoord = transformer.getVeiwportCoord(this.axisRect, this.canvasTT.viewport, pointData);

            series.plots.forEach((plotId) => {
                const plot: Plot | null = this.findPlotById(plotId);
                if (plot) {
                    plot.tooltips.forEach((tooltip) => {

                        if (drawLast) {

                            switch (tooltip.type) {

                                case 'data_y_end':
                                    data_y_end_buf.push([tooltip, tooltipCoordX, pointData]);
                                    break;

                                case 'circle_series':
                                    // @ts-ignore
                                    tooltip.drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, new Point(tooltipCoordX.x, tooltipCoordX.y), pointData);
                                    break;

                            }

                        } else {

                            switch (tooltip.type) {

                                case 'delta_abs':
                                    if (delta_abs_buf.length == 0) {
                                        delta_abs_buf.push(pointData);
                                        delta_abs_buf_coord.push(tooltipCoordX);
                                    } else {
                                        const ttCoord: Point = (delta_abs_buf_coord[0].y < tooltipCoordX.y) ? delta_abs_buf_coord[0] : tooltipCoordX;
                                        const absData = new Point(Math.abs(pointData.x - delta_abs_buf[0].x), Math.abs(pointData.y - delta_abs_buf[0].y));
                                        // @ts-ignore
                                        tooltip.drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, ttCoord, absData);
                                        delta_abs_buf.pop();
                                        delta_abs_buf_coord.pop();
                                    }
                                    break;

                                case 'data_y_end':
                                    data_y_end_buf.push([tooltip, tooltipCoordX, pointData]);
                                    break;

                                case 'label_x_start':
                                    // @ts-ignore
                                    tooltip.drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, new Point(tooltipCoordX.x, tooltipCoordX.y), pointData, tt_ind);
                                    break;

                                case 'line_vertical_full':
                                    // @ts-ignore
                                    tooltip.drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, new Point(tooltipCoordX.x, tooltipCoordX.y), pointData);
                                    break;

                                case 'data_label':
                                    // @ts-ignore
                                    tooltip.drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, new Point(tooltipCoordXY.x, tooltipCoordXY.y), pointDataXY, tt_ind_XY);
                                    // @ts-ignore
                                    if (plot.type == 'unicode') plot.drawPlot(this.canvasTT.ctx, [tooltipCoordXY], this.canvasTT.viewport, '', true);
                                    break;

                                default:
                                    // @ts-ignore
                                    tooltip.drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, new Point(tooltipCoordX.x, tooltipCoordX.y), pointData);

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

        let hasOverlap = true;
        let counter = 0;

        while ((hasOverlap) && (counter < data_y_end_buf.length*data_y_end_buf.length)) {
            // код
            // также называемый "телом цикла"
            
            counter = counter + 1 ;
            for (let i = 0; i < data_y_end_buf.length - 1; i++) {
                // @ts-ignore
                const rect1 = data_y_end_buf[i][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i][1], data_y_end_buf[i][2], 0, false);
                // @ts-ignore
                const rect2 = data_y_end_buf[i + 1][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i + 1][1], data_y_end_buf[i + 1][2], 0, false);

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

            hasOverlap = false;

            for (let i = 0; i < data_y_end_buf.length - 1; i++) {
                // @ts-ignore
                const rect1 = data_y_end_buf[i][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i][1], data_y_end_buf[i][2], 0, false);
                // @ts-ignore
                const rect2 = data_y_end_buf[i + 1][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i + 1][1], data_y_end_buf[i + 1][2], 0, false);
                if (rect1.y2 > rect2.y1) {
                    hasOverlap = true;
                }
            }

        }

        

// @ts-ignore
        data_y_end_buf.forEach((ttRow) => {
            ttRow[0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, ttRow[1], ttRow[2], 0, true);
        })
    }


}