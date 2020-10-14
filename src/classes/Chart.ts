import { Canvas } from "./Canvas";
import { Data } from "./Data";
import { Plot } from "./Plot";
import { Axis } from "./Axis";
import { Transformer } from "./Transformer";
import { Rectangle } from "./Rectangle";
import { Point } from "./Point";

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
        this.tooltipsDraw = this.tooltipsDraw.bind(this);
        

        
        window.addEventListener('resize', () => { this.reSize() });

        this.reSize();

        this.bindChildSignals();
    }

    bindChildSignals() {
        // data
        this.data.onSeriesAdded.add(this.reDraw);

        // axis
        this.xAxis.onOptionsSetted.add(this.reDraw);
        this.xAxis.onMinMaxSetted.add(this.reDraw);
        this.xAxis.onCustomLabelsAdded.add(this.reDraw);
        this.xAxis.onAnimated.add(this.reDraw);

        this.yAxis.onOptionsSetted.add(this.reDraw);
        this.yAxis.onMinMaxSetted.add(this.reDraw);
        this.yAxis.onCustomLabelsAdded.add(this.reDraw);

        // canvas
        this.canvas.changed.add(this.reDraw);
        this.canvasA.changed.add(this.reDraw);

        this.canvasTT.mouseMoved.add(this.tooltipsDraw);
        this.canvasTT.mouseOuted.add(this.canvasTT.clear);
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
        this.canvas.clipCanvas();
        this.canvas.clear();
        this.canvasA.clear();
        this.plotsDraw();
        this.axisDraw();

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


    tooltipsDraw() {
        this.canvasTT.clear();

        const mouseXY = this.canvasTT.mouseCoords;

        const transformer = new Transformer();

        let delta_abs_buf: Point[] = [];
        let delta_abs_buf_coord: Point[] = [];

        let data_y_end_buf = [];

        this.data.storage.forEach((series) => {

            const seriesX = this.xAxis.min + mouseXY.x * (this.xAxis.length) / this.canvasTT.viewport.width;
            const pointData = series.getClosestPoint(seriesX);

            const tooltipCoord = transformer.getVeiwportCoord(this.axisRect, this.canvasTT.viewport, pointData);

            // ограничиваем координаты тултипов по границе viewport
            if (tooltipCoord.y < this.canvasTT.viewport.y1) {
                tooltipCoord.y = this.canvasTT.viewport.y1
            }

            if (tooltipCoord.y > this.canvasTT.viewport.y2) {
                tooltipCoord.y = this.canvasTT.viewport.y2
            }

            if (tooltipCoord.x < this.canvasTT.viewport.x1) {
                tooltipCoord.x = this.canvasTT.viewport.x1
            }

            if (tooltipCoord.x > this.canvasTT.viewport.x2) {
                tooltipCoord.x = this.canvasTT.viewport.x2
            }

            series.plots.forEach((plotId) => {
                const plot: Plot | null = this.findPlotById(plotId);
                if (plot) {
                    plot.tooltips.forEach((tooltip) => {

                        switch (tooltip.type) {

                            case 'delta_abs':
                                if (delta_abs_buf.length == 0) {
                                    delta_abs_buf.push(pointData);
                                    delta_abs_buf_coord.push(tooltipCoord);
                                } else {
                                    const ttCoord: Point = (delta_abs_buf_coord[0].y < tooltipCoord.y) ? delta_abs_buf_coord[0] : tooltipCoord;
                                    const absData = new Point(Math.abs(pointData.x - delta_abs_buf[0].x), Math.abs(pointData.y - delta_abs_buf[0].y));
                                    tooltip.drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, ttCoord, absData);
                                    delta_abs_buf.pop();
                                    delta_abs_buf_coord.pop();
                                }
                                break;

                            case 'data_y_end':
                                data_y_end_buf.push([tooltip, tooltipCoord, pointData]);
                                break;

                            default:
                                tooltip.drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, new Point(tooltipCoord.x, tooltipCoord.y), pointData);
                                break;

                        }

                    })
                };
            })
        })

        // рассталкиваем друг от друга боковые тултипы
        data_y_end_buf.sort((a, b) => a[1].y - b[1].y);

        for (let i = 0; i < data_y_end_buf.length - 1; i++) {
            const rect1 = data_y_end_buf[i][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i][1], data_y_end_buf[i][2], false);
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

                data_y_end_buf[i][1].y = data_y_end_buf[i][1].y + abs1;
                data_y_end_buf[i + 1][1].y = data_y_end_buf[i + 1][1].y + abs2;
            }
        }

        data_y_end_buf.forEach((ttRow) => {
            ttRow[0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, ttRow[1], ttRow[2], true);
        })
    }


    setCanvasPaddings(...paddings: number[]) {
        this.canvas.setPaddings(...paddings);
        this.canvasTT.setPaddings(...paddings);
        this.canvasA.setPaddings(...paddings);
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

}