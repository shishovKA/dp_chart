import { Series } from "../Series";
import { Rectangle } from "../Rectangle";
import { Point } from "../Point";
import { Transformer } from "../Transformer";
import { SeriesBase } from "./SeriesBase";

export class SeriesXY extends SeriesBase implements Series {

    plotLabels: string[] = [];
    labels?: string[];

    constructor(id: string, container: HTMLElement, seriesData: number[][], labels?: string[]) {
        super(id, container, seriesData);
        this.canvas.canvas.style.zIndex = "3";
        if (labels) this.labels = labels; 
    }

    getInitialData(initialData: number[][]): number[][] {
        let resultData: number[][] = []

        const x: number[] = [];
        const y: number[] = [];

        initialData[0].forEach((element, index) => {
            x.push(element);
            y.push(initialData[1][index]);
        });

        resultData.push(x);
        resultData.push(y);

        return resultData;
    }

    generatePlotData(axisRect: Rectangle, vp: Rectangle): Point[][] {

        const seriesData = this.getDataRange('ind', axisRect.x1, axisRect.x2)
       // const seriesData = this.seriesData.slice();

        let plotData: Point[][] = [];

        const transformer = new Transformer();

        let plotDataRow: Point[] = []

        let dataRowX = seriesData[0];
        let dataRowY = seriesData[1];

        dataRowX.forEach((element, ind) => {
            const seriesPoint = new Point(dataRowX[ind], dataRowY[ind]);
            const plotPoint = transformer.getVeiwportCoord(axisRect, vp, seriesPoint);
            plotDataRow.push(new Point(Math.round(plotPoint.x), Math.round(plotPoint.y)));
        });

        plotData.push(plotDataRow);

        return plotData;
 
    }

    getDataRange(type:string, min:number, max:number): number[][] {
        const data: number[][] = []
        this.plotLabels.splice(0,this.plotLabels.length);
 
        const x: number[] = [];
        const y: number[] = [];

        let dataRowX = this.seriesData[0].slice();
        let dataRowY = this.seriesData[1].slice();

        dataRowX.forEach((el,i) => {
            if ((el >= min) && (el <= max)) {
                x.push(dataRowX[i]);
                y.push(dataRowY[i]);
                if (this.labels) this.plotLabels.push(this.labels[i]);
            }
        });

        data.push(x);
        data.push(y);

        return data;
    }
}


