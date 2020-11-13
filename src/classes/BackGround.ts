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
            /*
            for (let i=1; i<xCoord.length; i++) {
                for (let j=1; j<yCoord.length; j++) {
                    let r = (246-233)/((xCoord.length-1)*(xCoord.length-1));
                    let g = (246-220)/((xCoord.length-1)*(xCoord.length-1));
                    let b = (230-216)/((xCoord.length-1)*(xCoord.length-1));
                    ctx.fillStyle = `rgb(${233+r*i*j}, ${246-g*i*j}, ${230-b*i*j})`
                    ctx.fillRect(xCoord[i].x, yCoord[j].y, xCoord[i-1].x - xCoord[i].x, yCoord[j-1].y - yCoord[j].y);
                }
            }
            */
        }
    }

}