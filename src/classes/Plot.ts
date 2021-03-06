import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Tooltip } from "./Tooltip";
import { Label } from "./Label";

interface plotOptions {
    lineWidth: number;
    lineColor: string;
    lineDash: number[];
    brushColor: string;
    mainSize: number;
    fontSize: number;
    char: string;
    lineJoin: CanvasLineJoin;
}

//описание класса

export class Plot {

    _id: string;
    type: string;
    _options: plotOptions;
    tooltips: Tooltip[];
    label: Label;

    constructor(id: string, type: string, ...options: any) {

        this._id = id;
        this.type = type;

        this._options = {
            lineWidth: 0.5,
            lineColor: '#000000',
            brushColor: '#000000',
            mainSize: 1,
            fontSize: 10,
            char: '1',
            lineDash: [],
            lineJoin: 'miter',
        };

        this.setOptions(options);
        this.tooltips = [];

        this.label = new Label(this.type);
        return this;
    }


    setOptions(options: any[]) {

        switch (this.type) {
            case 'dotted':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
                break;

            case 'line':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.lineDash = options[2];
                if (options[3]) this._options.lineJoin = options[3];
                break;

            case 'area':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                break;

            case 'area_bottom':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                break;

            case 'unicode':
                this._options.fontSize = options[0];
                this._options.brushColor = options[1];
                this._options.char = options[2];
                break;

            case 'text':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                break;
        }

    }

    get id(): string {
        return this._id;
    }



    drawPlot(ctx: CanvasRenderingContext2D, plotData: Point[], vp: Rectangle, labels: string[], highlighted?: boolean) {

        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.globalAlpha = 1;
        ctx.fillStyle = this._options.brushColor;
        ctx.lineJoin = this._options.lineJoin;

        switch (this.type) {
            case 'dotted':
                this.drawDotted(ctx, plotData);
                break;

            case 'line':
                this.drawLine(ctx, plotData);
                break;

            case 'area':
                this.drawArea(ctx, plotData, vp);
                break;

            case 'area_bottom':
                this.drawArea(ctx, plotData, vp);
                break;

            case 'unicode':
                this.drawUnicode(ctx, plotData, highlighted);
                break;

            case 'text':
                this.drawText(ctx, plotData, labels);
                break;
        }

    }

    drawDotted(ctx: CanvasRenderingContext2D, plotData: Point[]) {

        for (let i = 0; i < plotData.length; i++) {
            ctx.beginPath();
            ctx.arc(plotData[i].x, plotData[i].y, this._options.mainSize, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    drawUnicode(ctx: CanvasRenderingContext2D, plotData: Point[], highlighted?: boolean) {
        ctx.font = `${this._options.fontSize}px serif`;
        ctx.textBaseline = 'middle';

        const text = ctx.measureText(this._options.char);
        for (let i = 0; i < plotData.length; i++) {
            ctx.globalAlpha = 1;
            ctx.fillText(this._options.char, plotData[i].x - text.width * 0.5, plotData[i].y);
            if (highlighted) {
                ctx.lineWidth = 7;
                ctx.globalAlpha = 0.3;
                ctx.strokeText(this._options.char, plotData[i].x - text.width * 0.5, plotData[i].y);
                ctx.globalAlpha = 1;
                ctx.fillText(this._options.char, plotData[i].x - text.width * 0.5, plotData[i].y);
            }
        }
    }


    drawText(ctx: CanvasRenderingContext2D, plotData: Point[], labels: string[]) {

        for (let i = 0; i < plotData.length; i++) {

            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.moveTo(plotData[i].x, plotData[i].y - 10);
            ctx.lineTo(plotData[i].x, plotData[i].y - 25)
            ctx.stroke();
            
        }

        for (let i = 0; i < plotData.length; i++) {

            let printText = labels[i]
            if (!printText) printText = '';
            let printTextArr = printText.split('\\n');

            printTextArr.forEach((row, ind, mas)=> {
                const coord: Point = new Point(plotData[i].x, plotData[i].y - (mas.length - ind - 1)*this.label.getRowHeight(ctx))
                this.label.draw(ctx, coord, row);
            });
            
        }

    }

    drawLine(ctx: CanvasRenderingContext2D, plotData: Point[]) {

        ctx.setLineDash(this._options.lineDash);
        ctx.beginPath();
        ctx.moveTo(plotData[0].x, plotData[0].y);

        for (let i = 1; i < plotData.length; i++) {
            ctx.lineTo(plotData[i].x, plotData[i].y)
        }

        ctx.stroke();
    }

    drawArea(ctx: CanvasRenderingContext2D, plotData: Point[], vp: Rectangle) {

        ctx.beginPath();

        if (this.type == 'area_bottom') {
            ctx.lineTo(vp.x1, vp.zeroY);
        }

        ctx.lineTo(plotData[0].x, plotData[0].y);

        for (let i = 1; i < plotData.length; i++) {
            ctx.lineTo(plotData[i].x, plotData[i].y)
        }

        if (this.type == 'area_bottom') {
            ctx.lineTo(vp.x2, vp.zeroY);
            //ctx.lineTo(vp.x1, vp.zeroY);
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

}