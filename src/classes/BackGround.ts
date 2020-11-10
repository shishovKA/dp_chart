import { Point } from "./Point";

export class BackGround {
    
    type: string = 'default'


    constructor(type: string) {
        this.type = type;
    }

    draw(ctx: CanvasRenderingContext2D, xCoord: Point[], yCoord: Point[]) {
        switch (this.type) {
            case 'coloredGrid_cbh':
                this.drawColoredGrid(ctx, xCoord, yCoord);
            break;
        }

    }

    drawColoredGrid(ctx: CanvasRenderingContext2D, xCoord: Point[], yCoord: Point[]) {
        
        for (let i=1; i<xCoord.length; i++) {
            for (let j=1; j<yCoord.length; j++) {
                let r = (246-233)/((xCoord.length-1)*(xCoord.length-1));
                let g = (246-220)/((xCoord.length-1)*(xCoord.length-1));
                let b = (230-216)/((xCoord.length-1)*(xCoord.length-1));
                ctx.fillStyle = `rgb(${233+r*i*j}, ${246-g*i*j}, ${230-b*i*j})`
                ctx.fillRect(xCoord[i].x, yCoord[j].y, xCoord[i-1].x - xCoord[i].x, yCoord[j-1].y - yCoord[j].y);
            }

        }
    }

}