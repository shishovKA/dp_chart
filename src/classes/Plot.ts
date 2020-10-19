import { Transformer } from "./Transformer";
import { Rectangle } from "./Rectangle";
import { Series } from "./Series";
import { Point } from "./Point";
import { Tooltip } from "./Tooltip";
import { Signal } from "signals"

interface plotOptions {
    lineWidth: number;
    lineColor: string;
    brushColor: string;
    mainSize: number;
}

//описание класса

export class Plot {
    hasAnimation: boolean = false;
    animationDuration: number = 300;

    _id: string;
    type: string;
    _options: plotOptions;
    plotData: Point[];
    tooltips: Tooltip[];
    onAnimated: Signal;

    constructor(id: string, type: string, ...options: any) {
        this.onAnimated = new Signal();
        this._id = id;
        this.type = type;

        this._options = {
            lineWidth: 0.5,
            lineColor: '#000000',
            brushColor: '#000000',
            mainSize: 1,
        };

        this.setOptions(options);

        this.plotData = [];
        this.tooltips = [];
    }


    setOptions(options: any[]) {
        switch (options.length) {
            case 1:
                this._options.lineWidth = options[0];
                break;

            case 2:
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                break;

            case 3:
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                break;

            case 4:
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
                break;
        }
    }

    get id(): string {
        return this._id;
    }

    convertSeriesToCoord(series: Series, axisRect: Rectangle, vp: Rectangle, noAnimation?: boolean) {

        let plotData: Point[] = [];

        const transformer = new Transformer();

        switch (this.type) {
            case 'dotted':
                for (let i = 0; i < series.seriesData.length; i = i + 2) {
                    series.seriesData[i].forEach((element, ind) => {
                        const seriesPoint = new Point(series.seriesData[i][ind], series.seriesData[i + 1][ind]);
                        const plotPoint = transformer.getVeiwportCoord(axisRect, vp, seriesPoint);
                        plotData.push(plotPoint);
                    });
                }
                break;

            case 'line':
                for (let i = 0; i < series.seriesData.length; i = i + 2) {
                    series.seriesData[i].forEach((element, ind) => {
                        const seriesPoint = new Point(series.seriesData[i][ind], series.seriesData[i + 1][ind]);
                        const plotPoint = transformer.getVeiwportCoord(axisRect, vp, seriesPoint);
                        plotData.push(plotPoint);
                    });
                }
                break;

            case 'area':
                for (let i = 0; i < series.seriesData.length; i = i + 2) {
                    let dataRowInd = series.seriesData[i];
                    let dataRowVal = series.seriesData[i + 1];
                    if (i == 2) {
                        dataRowInd = dataRowInd.slice().reverse();
                        dataRowVal = dataRowVal.slice().reverse();
                    }
                    series.seriesData[i].forEach((element, ind) => {
                        const seriesPoint = new Point(dataRowInd[ind], dataRowVal[ind]);
                        const plotPoint = transformer.getVeiwportCoord(axisRect, vp, seriesPoint);
                        plotData.push(plotPoint);
                    });
                }
                break;
        }


        //если нужна анимация графиков
        if (noAnimation) {
            this.plotData = plotData;
            return this;
        }

        if (this.hasAnimation) {
            const from = this.makeFromPointArr(this.plotData, plotData);

            if (from.length == 0) {
                this.plotData = plotData;
                return this;
            }

            this.plotData = from;
            this.сoordAnimation(from, plotData, this.animationDuration);

            return this
        }

        this.plotData = plotData;

        return this;
    }

    drawPlot(ctx: CanvasRenderingContext2D) {

        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.globalAlpha = 1;
        ctx.fillStyle = this._options.brushColor;

        switch (this.type) {
            case 'dotted':
                this.drawDotted(ctx);
                break;

            case 'line':
                this.drawLine(ctx);
                break;

            case 'area':
                this.drawArea(ctx);
                break;
        }

    }

    drawDotted(ctx: CanvasRenderingContext2D) {

        for (let i = 1; i < this.plotData.length; i++) {
            ctx.beginPath();
            ctx.arc(this.plotData[i].x, this.plotData[i].y, this._options.mainSize, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    drawLine(ctx: CanvasRenderingContext2D) {

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(this.plotData[0].x, this.plotData[0].y);

        for (let i = 1; i < this.plotData.length; i++) {
            ctx.lineTo(this.plotData[i].x, this.plotData[i].y)
        }

        ctx.stroke();
    }

    drawArea(ctx: CanvasRenderingContext2D) {

        ctx.beginPath();
        ctx.lineTo(this.plotData[0].x, this.plotData[0].y);

        for (let i = 1; i < this.plotData.length; i++) {
            ctx.lineTo(this.plotData[i].x, this.plotData[i].y)
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }


    addTooltip(id: string, type: string, ...options: any): Tooltip {
        const tooltip = new Tooltip(id, type, ...options);
        this.tooltips.push(tooltip);
        return tooltip;
    }

    findTooltipById(id: string): Tooltip | null {
        const tooltips: Tooltip[] = this.tooltips.filter((tooltip) => {
            return tooltip.id === id
        });
        if (tooltips.length !== 0) return tooltips[0];
        return null;
    }


    // Метод анимации изменение набора координат
    сoordAnimation(from: Point[], to: Point[], duration: number) {

        let start = performance.now();

        const animate = (time) => {

            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            const tek = from.map((el, i) => {
                return new Point(from[i].x + (to[i].x - from[i].x) * timeFraction, from[i].y + (to[i].y - from[i].y) * timeFraction);
            });

            this.plotData = tek;

            this.onAnimated.dispatch();

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            } else {

            }

        }

        requestAnimationFrame(animate);

    }


    makeFromPointArr(from: Point[], to: Point[]): Point[] {
        const resultArr: Point[] = [];

        to.forEach((toPoint) => {
            if (from.length !== 0) {
                const minP = from.reduce((fromPoint, cur) => {
                    if (fromPoint.findDist(toPoint) < cur.findDist(toPoint)) return fromPoint
                    return cur;
                }, from[0])
                resultArr.push(minP);
            }
        });

        return resultArr;
    }


}