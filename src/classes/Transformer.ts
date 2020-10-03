import { Rectangle } from "./Rectangle";
import { Point } from "./Point";

export class Transformer {

    matrix: number[];

    constructor() {
        this.matrix = [];
    }

    getPlotRect(axisRect: Rectangle, seriesRect: Rectangle, vp: Rectangle): Rectangle {
        let tx: number = (seriesRect.x1 - axisRect.x1);
        let ty: number = -(seriesRect.y2 - axisRect.y2);
        const scaleX = seriesRect.width / axisRect.width;
        const scaleY = seriesRect.height / axisRect.height;
        tx = Math.round(tx*vp.width/axisRect.width); 
        ty = Math.round(ty*vp.height/axisRect.height);
        this.matrix = [scaleX, 0, tx, 0, scaleY, ty]; 
        return this.transform(vp);
    }


    getVeiwportCoord(fromRect: Rectangle, toRect: Rectangle, point: Point): Point {
        let tx: number = (point.x - fromRect.x1);
        let ty: number = -(point.y - fromRect.y2);
        tx = Math.round(tx*toRect.width/fromRect.width); 
        ty = Math.round(ty*toRect.height/fromRect.height);
        this.matrix = [0, 0, tx, 0, 0, ty];
        const coordRect = this.transform(toRect);
        const coord = new Point(coordRect.zeroX, coordRect.zeroY)
        return coord;
    }



    transform(viewport: Rectangle): Rectangle {

        let matrix: number[] = [1, 0, 0, 0, 1, 0];

        if (this.matrix) {matrix = this.matrix;}

        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;   
    
        x1 = this.transFunc(0, 0, matrix.slice(0,3))+viewport.x1;
        y1 = this.transFunc(0, 0, matrix.slice(3))+viewport.y1;
        x2 = this.transFunc(viewport.width, viewport.height, matrix.slice(0,3))+viewport.x1;
        y2 = this.transFunc(viewport.width, viewport.height, matrix.slice(3))+viewport.y1;

        return new Rectangle(x1, y1, x2, y2);
    }

    transFunc(x: number, y: number, coeff: number[]): number {  
        let res:number;
        return res = coeff[0]*x + coeff[1]*y + coeff[2];
    }

}