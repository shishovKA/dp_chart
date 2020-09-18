import { Rectangle } from "./Rectangle";

export class Transformer {

    constructor() {

    }

    formMatrix(axisRanges: number[], seriesRanges: number[], vw: number, vh: number): number[] {

        const axisWidth: number = Math.abs(axisRanges[1]-axisRanges[0]);
        const seriesWidth: number = Math.abs(seriesRanges[1]-seriesRanges[0]);
        const axisHeight: number = Math.abs(axisRanges[3]-axisRanges[2]);
        const seriesHeight: number = Math.abs(seriesRanges[3]-seriesRanges[2]);

        let tx: number = Math.abs(seriesRanges[0] - axisRanges[0]);
        let ty: number = Math.abs(seriesRanges[2] - axisRanges[2]);

        const scaleX = axisWidth / seriesWidth;
        const scaleY = axisHeight / seriesHeight;

        tx = tx*vw/axisWidth; // округлить?
        ty = ty*vh/axisHeight; // округлить?
        
        const transMatrix: number[] = [scaleX, 0, 0, scaleY, tx, ty];       
        return transMatrix;
    }

    trans(x: number, y: number, coeff: number[]): number {
        let res:number;
        return res = coeff[0]*x + coeff[1]*y + coeff[2];
    }

    transformMatrix(viewport: Rectangle, transMatrix: number[]): Rectangle {
        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;
        
        x1 = this.trans(viewport.x1, viewport.y1, transMatrix.slice(0,3))
        y1 = this.trans(viewport.x1, viewport.y1, transMatrix.slice(3))
        
        x2 = this.trans(viewport.x2, viewport.y2, transMatrix.slice(0,3))
        y2 = this.trans(viewport.x2, viewport.y2, transMatrix.slice(3))

        return new Rectangle(x1, y2, x2, y2);
    }

}