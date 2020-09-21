import { Rectangle } from "./Rectangle";
import { Series } from "./Series";

interface plotOptions  {
    lineWidth: number;
    lineColor: string;
    brushColor: string;
    mainSize: number;
    // и тд
}

//описание класса

export class Plot {

    _id: string;
    _options: plotOptions;
    
    constructor(id: string, ...options: any) {
        this._id = id;

        this._options = {
            lineWidth: 0.5,
            lineColor: '#000000',
            brushColor: '#000000',
            mainSize:  1,
        };

        this.setOptions(options);
    }

    setOptions(options: any[]) {
        switch(options.length) {
            case 1:
                this._options.lineWidth = options[0];
            break;

            case 2:
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
            break;

            case 3:
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
            break;

            case 4:
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
            break;
        }
    }

    get id(): string {
        return this._id;
    }

    convertSeriesToCoord(series: Series, plotArea: Rectangle): number[][] {
        let extremes = series.findExtremes();
        let kx: number = plotArea.width / Math.abs(extremes[1] - extremes[0]);
        let ky: number = plotArea.height / Math.abs(extremes[3] - extremes[2]);

        let xPlot: number[] = [];

        for (let i = 0; i < series.seriesData[0].length; i++ ) {
           const x: number = (series.seriesData[0][i]-extremes[0])*kx + plotArea.x1;
           xPlot.push(Math.round(x));
        }
        
        let yPlot: number[] = [];

        for (let i = 0; i < series.seriesData[1].length; i++ ) {
            const y: number = plotArea.zeroY - (series.seriesData[1][i]-extremes[2])*ky;
            yPlot.push(Math.round(y));
        }
        
        return [xPlot, yPlot];
    }

    drawPlot(ctx: CanvasRenderingContext2D, plotData: number[][]) {
        for (let ind = 0; ind < plotData[0].length; ind++ ) {
            ctx.beginPath();
            ctx.arc(plotData[0][ind], plotData[1][ind], this._options.mainSize, 0, Math.PI * 2, true);
            ctx.strokeStyle = this._options.lineColor;
            ctx.lineWidth = this._options.lineWidth;
            ctx.globalAlpha = 1;
            ctx.fillStyle = this._options.brushColor;
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

  }