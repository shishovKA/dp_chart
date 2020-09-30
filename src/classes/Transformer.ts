import { Axis } from "./Axis";
import { Series } from "./Series";
import { Rectangle } from "./Rectangle";
import { Point } from "./Point";

export class Transformer {

    matrix: number[];

    constructor() {
        this.matrix = [];
    }

    getPlotRect(axisX: Axis, axisY: Axis, series: Series, vp: Rectangle): Rectangle {

        const seriesExtremes = series.findExtremes();

        const seriesWidth: number = Math.abs(seriesExtremes[1]-seriesExtremes[0]);
        const seriesHeight: number = Math.abs(seriesExtremes[3]-seriesExtremes[2]);

        let tx: number = (seriesExtremes[0] - axisX.min);
        let ty: number = -(seriesExtremes[3] - axisY.max);

        const scaleX = seriesWidth / axisX.length;
        const scaleY = seriesHeight / axisY.length;

        tx = Math.round(tx*vp.width/axisX.length); 
        ty = Math.round(ty*vp.height/axisY.length);
        
        const transMatrix: number[] = [scaleX, 0, tx, 0, scaleY, ty]; 

        this.matrix = transMatrix;

        return this.transform(vp);
    }


    getVeiwportCoord(axisX: Axis, axisY: Axis, data: number[], vp: Rectangle): Point {

        let tx: number = (data[0] - axisX.min);
        let ty: number = -(data[1] - axisY.max);

        const scaleX = 0;
        const scaleY = 0;

        tx = Math.round(tx*vp.width/axisX.length); 
        ty = Math.round(ty*vp.height/axisY.length);
        
        const transMatrix: number[] = [0, 0, tx, 0, 0, ty];

        this.matrix = transMatrix;

        const coordRect = this.transform(vp);
        const coord = new Point(coordRect.zeroX, coordRect.zeroY)

        return coord;
    }



    transform(viewport: Rectangle): Rectangle {

        function trans(x: number, y: number, coeff: number[]): number {
            let res:number;
            return res = coeff[0]*x + coeff[1]*y + coeff[2];
        }

        let matrix: number[] = [1, 0, 0, 0, 1, 0];

        if (this.matrix) {matrix = this.matrix;}

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