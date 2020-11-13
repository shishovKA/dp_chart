import { Canvas } from "./Canvas";
import { Point } from "./Point";

export class BackGround {
    
    type: string = 'default'
    canvas: Canvas;

    constructor(type: string, container: HTMLElement) {
        this.type = type;
        this.canvas = new Canvas(container);
        this.canvas.canvas.style.zIndex = "1";
    }

    draw(xCoord: Point[], yCoord: Point[]) {
        this.canvas.clear();
        switch (this.type) {
            case 'coloredGrid_cbh':
                this.drawColoredGrid(xCoord, yCoord);
            break;
        }

    }

    drawColoredGrid(xCoord: Point[], yCoord: Point[]) {
        const ctx = this.canvas.ctx;
        
        if (ctx) {
            
            ctx.globalAlpha = 0.1;
            const colorPalette: string[] = ['#8CCB76', '#BED68D', '#E7D180', '#CC9263', '#CF5031'];

            for (let i = 0; i < xCoord.length - 1; i++) {
                ctx.fillStyle = colorPalette[i];
                ctx.fillRect(xCoord[i].x, yCoord[0].y, xCoord[i + 1].x - xCoord[i].x, yCoord[yCoord.length - 1].y - yCoord[0].y);
            }

            for (let i = 0; i < yCoord.length - 1; i++) {
                ctx.fillStyle = colorPalette[i];
                ctx.fillRect(xCoord[0].x, yCoord[i].y, xCoord[xCoord.length - 1].x - xCoord[0].x, yCoord[i + 1].y - yCoord[i].y);
            }

            ctx.globalAlpha = 1;

        }
    }

}