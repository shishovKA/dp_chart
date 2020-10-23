import { Point } from "./Point";
import { Signal } from "signals"
import { Rectangle } from "./Rectangle";

export class Label {
    display: boolean = true;
    
    color: string = 'black';
    font: string = '16px serif';
    fontSize: number = 16;
    position: string = 'bottom';
    offset: number = 15;
    units?: string;

    onOptionsSetted: Signal;

    constructor(type?: string) {
        
        this.onOptionsSetted = new Signal();

        switch (type) {
            case 'vertical':
                this.position = 'left';
            break;

            case 'horizontal':
                this.position = 'bottom';
            break;
        }

    }

    setOptions(color?: string, position?: string, offset?: number, fontOptions?: string[]) {
        this.color = color || 'black';
        this.position = position || 'bottom';
        this.offset = offset || 0;

        if (fontOptions) {
            this.font = `${fontOptions[0]}px ${fontOptions[1]}`;
            this.fontSize = +fontOptions[0];
        }

        this.onOptionsSetted.dispatch();
    }

    draw(ctx: CanvasRenderingContext2D, coord:Point, labeltext:string) {
        
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        
        ctx.textBaseline = 'middle';

        const text = ctx.measureText(labeltext);

        const labelCoord = new Point (coord.x - text.width*0.5 ,coord.y);

        switch (this.position) {
            case 'top':
                labelCoord.y = labelCoord.y - this.offset - this.fontSize*0.5;
            break;

            case 'bottom':
                labelCoord.y = labelCoord.y + this.offset + this.fontSize*0.5;
            break;

            case 'left':
                labelCoord.x = labelCoord.x  - this.offset;
            break;

            case 'right':
                labelCoord.x = labelCoord.x  + this.offset;
            break;
        }
        
        let printText = labeltext;
        if (this.units) printText = labeltext+this.units;
        ctx.fillText(printText, labelCoord.x, labelCoord.y);

    }

    getlabelRect(ctx: CanvasRenderingContext2D, coord:Point, labeltext:string): Rectangle {
        ctx.font = this.font;
        const text = ctx.measureText(labeltext);

        const labelCoord = new Point (coord.x - text.width*0.5 ,coord.y);

        switch (this.position) {
            case 'top':
                labelCoord.y = labelCoord.y - this.offset - this.fontSize*0.5;
            break;

            case 'bottom':
                labelCoord.y = labelCoord.y + this.offset + this.fontSize*0.5;
            break;

            case 'left':
                labelCoord.x = labelCoord.x - this.offset;
            break;

            case 'right':
                labelCoord.x = labelCoord.x + this.offset;
            break;
        }

        return new Rectangle(labelCoord.x, labelCoord.y-this.fontSize*0.5, labelCoord.x+text.width, labelCoord.y+this.fontSize*0.5);
    }


}