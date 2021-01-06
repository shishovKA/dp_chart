import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { Signal } from "signals"

export class Grid {
    
    display: boolean = false;

    type: string;
    width: number;
    color: string;
    lineDash: number[];
    onOptionsSetted: Signal;

    constructor(type: string) {
        this.onOptionsSetted = new Signal();
        this.type = type;
        this.width = 1;
        this.color = 'black';
        this.lineDash = [1,0];
    }

    setOptions(display: boolean, color:string, width: number, lineDash: number[]) {
        this.display = display;
        this.width = width;
        this.color = color;
        this.lineDash = lineDash;
        this.onOptionsSetted.dispatch(); 
    }

    draw(ctx: CanvasRenderingContext2D, vp:Rectangle, coords: Point[]) {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.setLineDash(this.lineDash);

        coords.forEach((tick)=>{
            ctx.beginPath();
            switch (this.type) {
                case 'vertical':
                    ctx.moveTo(vp.x1, tick.y);
                    ctx.lineTo(vp.x2, tick.y);
                break;
    
                case 'horizontal':
                    ctx.moveTo(tick.x, vp.y1);
                    ctx.lineTo(tick.x, vp.y2);
                break;
            };
            ctx.stroke();
        })

        ctx.setLineDash([]);
    }


}