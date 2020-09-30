
import { Rectangle } from "./Rectangle";

interface tooltipOptions  {
    lineWidth: number;
    lineColor: string;
    brushColor: string;
    mainSize: number;
}

//описание класса

export class Tooltip {

    _id: string;
    type: string;
    _options: tooltipOptions;
    labels?: string[];
    
    constructor(id: string, type: string, options: any[], labels?:string[]) {
        this._id = id;
        this.type = type;

        this._options = {
            lineWidth: 1,
            lineColor: '#000000',
            brushColor: '#000000',
            mainSize:  2,
        };

        if (labels) this.labels = labels;

        this.setOptions(options);
    }

    get id(): string {
        return this._id;
    }

    setOptions(options: any[]) {
        switch(options.length) {
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


    drawTooltip(ctx: CanvasRenderingContext2D, vp:Rectangle, tooltipRect: Rectangle, xyData: number[]) {
        switch (this.type) {
            case 'x': 
                this.drawX(ctx, vp, tooltipRect);
            break;

            case 'v_line': 
                this.drawVerticalLine(ctx, vp, tooltipRect, xyData);
            break;
        }
    }

    drawX(ctx: CanvasRenderingContext2D, vp:Rectangle, tooltipRect: Rectangle){
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(tooltipRect.zeroX, tooltipRect.zeroY, this._options.mainSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawVerticalLine(ctx: CanvasRenderingContext2D, vp:Rectangle, tooltipRect: Rectangle, xyData: number[]){
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(tooltipRect.zeroX, vp.y1);
        ctx.lineTo(tooltipRect.zeroX, vp.zeroY);
        ctx.stroke();

        ctx.setLineDash([]);
        
        ctx.font = "14px serif";
        const text = ctx.measureText(this.labels[xyData[0]); // TextMetrics object

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#ededed';

        ctx.strokeRect(tooltipRect.zeroX - text.width/2-5, vp.zeroY+20-15, text.width+10, 20);
        ctx.fillRect(tooltipRect.zeroX - text.width/2-5, vp.zeroY+20-15, text.width+10, 20)

        ctx.fillStyle = 'black';
        ctx.fillText(this.labels[xyData[0]], tooltipRect.zeroX - text.width/2, vp.zeroY+20);
    }

  }