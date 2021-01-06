import { Point } from "./Point";
//import { Signal } from "signals"
import { Rectangle } from "./Rectangle";
import { Label } from "./Label";

export class Legend {
    
    text: string[];
    label: Label;
    getCoord: (viewport: Rectangle) => Point;

    constructor( text:string[], getCoord: (viewport: Rectangle) => Point ) {
        this.text = text;
        this.label = new Label();
        this.getCoord = getCoord;

        return this;
    }

    draw(ctx: CanvasRenderingContext2D, vp:Rectangle) {
        const coord = this.getCoord(vp);
        this.text.forEach((textrow) => {
            this.label.draw(ctx, coord, textrow);
            coord.y = coord.y + this.label.fontSize;
        })
        
    }


}