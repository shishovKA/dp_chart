import { Point } from "./Point";
import { Tooltip } from "./Tooltip";

interface plotOptions {
    lineWidth: number;
    lineColor: string;
    brushColor: string;
    mainSize: number;
    fontSize: number;
    char: string;
}

//описание класса

export class Plot {
    hasAnimation: boolean = false;
    animationDuration: number = 300;

    _id: string;
    type: string;
    _options: plotOptions;
    tooltips: Tooltip[];

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
        };

        this.setOptions(options);
        this.tooltips = [];
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
                break;

            case 'area':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                break;

            case 'unicode':
                this._options.fontSize = options[0];
                this._options.brushColor = options[1];
                this._options.char = options[2];
                break;
        }
    }

    get id(): string {
        return this._id;
    }



    drawPlot(ctx: CanvasRenderingContext2D, plotData: Point[], highlighted?: boolean) {

        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.globalAlpha = 1;
        ctx.fillStyle = this._options.brushColor;

        switch (this.type) {
            case 'dotted':
                this.drawDotted(ctx, plotData);
                break;

            case 'line':
                this.drawLine(ctx, plotData);
                break;

            case 'area':
                this.drawArea(ctx, plotData);
                break;

            case 'unicode':
                this.drawUnicode(ctx, plotData, highlighted);
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
        
        if (highlighted) { 
            ctx.lineWidth = 3;
            ctx.font = `${this._options.fontSize+2*ctx.lineWidth}px serif`;
            ctx.globalAlpha = 0.3;
        }

        const text = ctx.measureText(this._options.char);
        for (let i = 0; i < plotData.length; i++) {
            ctx.fillText(this._options.char, plotData[i].x  - text.width*0.5  , plotData[i].y);
            if (highlighted) {
                ctx.strokeText(this._options.char, plotData[i].x  - text.width*0.5  , plotData[i].y);
                ctx.globalAlpha = 1;
            }
        }

        
    }

    drawLine(ctx: CanvasRenderingContext2D, plotData: Point[]) {

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(plotData[0].x, plotData[0].y);

        for (let i = 1; i < plotData.length; i++) {
            ctx.lineTo(plotData[i].x, plotData[i].y)
        }

        ctx.stroke();
    }

    drawArea(ctx: CanvasRenderingContext2D, plotData: Point[]) {

        ctx.beginPath();
        ctx.lineTo(plotData[0].x, plotData[0].y);

        for (let i = 1; i < plotData.length; i++) {
            ctx.lineTo(plotData[i].x, plotData[i].y)
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