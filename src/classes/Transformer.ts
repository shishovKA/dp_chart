import { Rectangle } from "./Rectangle";

export class Transformer {

    constructor() {

    }

    formMatrix(axisRanges: number[], seriesRanges: number[], vp: Rectangle): number[] {

        const axisWidth: number = Math.abs(axisRanges[1]-axisRanges[0]);
        console.log('axisWidth',axisWidth);
        const seriesWidth: number = Math.abs(seriesRanges[1]-seriesRanges[0]);
        console.log('seriesWidth', seriesWidth);
        const axisHeight: number = Math.abs(axisRanges[3]-axisRanges[2]);
        console.log('axisHeight', axisHeight);
        const seriesHeight: number = Math.abs(seriesRanges[3]-seriesRanges[2]);
        console.log('seriesHeight', seriesHeight);

        let tx: number = Math.abs(seriesRanges[0] - axisRanges[0]);
        console.log('tx', tx);
        let ty: number = Math.abs(seriesRanges[2] - axisRanges[2]);
        console.log('ty', ty);

        //const scaleX = axisWidth / seriesWidth;
        //const scaleY = axisHeight / seriesHeight;

        const scaleX = seriesWidth / axisWidth;
        const scaleY = seriesHeight / axisHeight;

        console.log('scaleX', scaleX);
        console.log('scaleY', scaleY);

        tx = Math.round(tx*vp.width/axisWidth); 
        ty = Math.round(ty*vp.height/axisHeight);
        
        
        console.log('tx', tx);
        console.log('ty', ty);
        
        const transMatrix: number[] = [scaleX, 0, tx, 0, scaleY, ty];       
        return transMatrix;
    }

    trans(x: number, y: number, coeff: number[]): number {
        let res:number;
        return res = coeff[0]*x + coeff[1]*y + coeff[2];
    }

    transformRect(viewport: Rectangle, transMatrix: number[]): Rectangle {

        let matrix: number[] = [1, 0, 0, 0, 1, 0];

        if (transMatrix) {matrix = transMatrix;}

        console.log('transformRect matrix', matrix);

        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;

        console.log('matrix.slice(0,3)', matrix.slice(0,3));
        console.log('matrix.slice(3)', matrix.slice(3));
        
        
        x1 = this.trans(viewport.x1, viewport.y1, matrix.slice(0,3))
        y1 = this.trans(viewport.x1, viewport.y1, matrix.slice(3))
        
        x2 = this.trans(viewport.x2, viewport.y2, matrix.slice(0,3))
        y2 = this.trans(viewport.x2, viewport.y2, matrix.slice(3))

        return new Rectangle(x1, y1, x2, y2);
    }

}