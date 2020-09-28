
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
    
    constructor(id: string, type: string, ...options: any) {
        this._id = id;
        this.type = type;

        this._options = {
            lineWidth: 1,
            lineColor: '#000000',
            brushColor: '#000000',
            mainSize:  2,
        };

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


    drawTooltip(vp:Rectangle, ctx: CanvasRenderingContext2D, tooltipRect: Rectangle) {
        switch (this.type) {
            case 'x': 
                this.drawX(vp, ctx, tooltipRect);
            break;
        }
    }

    drawX(vp:Rectangle, ctx: CanvasRenderingContext2D, tooltipRect: Rectangle){
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;

        ctx.beginPath();
        ctx.arc(tooltipRect.zeroX, tooltipRect.zeroY, this._options.mainSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        console.log('отрисовал тул тип',tooltipRect.zeroX, tooltipRect.zeroY);
    }

  }