import { Point } from "./Point";
import { Signal } from "signals"
import { Rectangle } from "./Rectangle";

export class Label {
    display: boolean = true;
    
    color: string = 'black';
    colorArr?: string[];
    color_counter: number = 0;
    font: string = '16px serif';
    fontSize: number = 16;
    position: string = 'bottom';
    offset: number = 0;
    units?: string;
    rotationAngle: number = 0;

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

    setOptions(display:boolean, color?: string, position?: string, offset?: number, fontOptions?: string[], colorArr?:string[]) {
        this.color = color || 'black';
        this.position = position || 'bottom';
        this.offset = offset || 0;

        this.display = display;

        if (colorArr) {
            this.colorArr = colorArr;
            this.color_counter = 0;
        }

        if (fontOptions) {
            this.font = `${fontOptions[0]}px ${fontOptions[1]}`;
            this.fontSize = +fontOptions[0];
        }

        this.onOptionsSetted.dispatch();
    }

    draw(ctx: CanvasRenderingContext2D, coord:Point, labeltext:string) {
        
        if (this.colorArr) {
            ctx.fillStyle = this.colorArr[this.color_counter];
            this.color_counter = this.color_counter + 1;
            if (this.color_counter == this.colorArr.length) this.color_counter = 0;
        }

        else {
            ctx.fillStyle = this.color; 
        }

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

        if (this.rotationAngle !== 0) {
            ctx.save();
            ctx.translate(labelCoord.x+text.width*0.5, labelCoord.y+this.fontSize*0.5);
            ctx.rotate((Math.PI / 180) * this.rotationAngle);
            ctx.translate(-labelCoord.x-text.width*0.5, -labelCoord.y-this.fontSize*0.5);
            ctx.fillText(printText, labelCoord.x, labelCoord.y);

            ctx.restore();
        } else {
            ctx.fillText(printText, labelCoord.x, labelCoord.y);
        }
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

        let textYgap = 0;
        
        if (this.font.indexOf('Transcript Pro') !== -1) {
            textYgap = 2;
        }

        const labelRect = new Rectangle(labelCoord.x, labelCoord.y-this.fontSize*0.5, labelCoord.x+text.width, labelCoord.y+this.fontSize*0.5-textYgap);

        return labelRect;
    }


}