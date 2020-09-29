import { Rectangle } from "./Rectangle";

export class Transformer {

    constructor() {

    }

    formMatrix(axisRanges: number[], seriesRanges: number[], vp: Rectangle): number[] {

        const axisWidth: number = Math.abs(axisRanges[1]-axisRanges[0]);
        const seriesWidth: number = Math.abs(seriesRanges[1]-seriesRanges[0]);
        const axisHeight: number = Math.abs(axisRanges[3]-axisRanges[2]);
        const seriesHeight: number = Math.abs(seriesRanges[3]-seriesRanges[2]);

        let tx: number = (seriesRanges[0] - axisRanges[0]);
        let ty: number = -(seriesRanges[3] - axisRanges[3]);

        const scaleX = seriesWidth / axisWidth;
        const scaleY = seriesHeight / axisHeight;

        tx = Math.round(tx*vp.width/axisWidth); 
        ty = Math.round(ty*vp.height/axisHeight);
        
        const transMatrix: number[] = [scaleX, 0, tx, 0, scaleY, ty];       
        return transMatrix;
    }



    transformRect(viewport: Rectangle, transMatrix: number[]): Rectangle {

        function trans(x: number, y: number, coeff: number[]): number {
            let res:number;
            return res = coeff[0]*x + coeff[1]*y + coeff[2];
        }

        let matrix: number[] = [1, 0, 0, 0, 1, 0];

        if (transMatrix) {matrix = transMatrix;}

        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;

        const startRect = new Rectangle (0, 0, viewport.width, viewport.height);     
        
        x1 = trans(startRect.x1, startRect.y1, matrix.slice(0,3))+viewport.x1;
        y1 = trans(startRect.x1, startRect.y1, matrix.slice(3))+viewport.y1;
        
        x2 = trans(startRect.x2, startRect.y2, matrix.slice(0,3))+viewport.x1;
        y2 = trans(startRect.x2, startRect.y2, matrix.slice(3))+viewport.y1;

        return new Rectangle(x1, y1, x2, y2);
    }

}