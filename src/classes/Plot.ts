import { Rectangle } from "./Rectangle";
import { Series } from "./Series";

interface plotOptions  {
    lineWidth: any;
    lineColor: any;
    brushColor?: string;
    mainSize?: any;
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
            brushColor: "black"
        };

        this.drawDot = this.drawDot.bind(this);
        //this._spreadOptions(options);
    }

    _spreadOptions(options: any[]) {
        //разбираем пакет опций для графика
    }

    setOptions(...options: any) {
        this._spreadOptions(options);
    }

    get id(): string {
        return this._id;
    }

    convertSeriesToCoord(series: Series, plotArea: Rectangle): number[][] {
        let extremes = series.findExtremes();
        let kx: number = plotArea.width / Math.abs(extremes[1] - extremes[0]);
        let ky: number = plotArea.height / Math.abs(extremes[3] - extremes[2]);
        
        console.log('extremes: ', extremes);
        console.log('LOG: ',plotArea.width, kx, ky);

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

        console.log('plotArea.zeroY: ', plotArea.zeroY);
        
        console.log('plotData: ',[xPlot, yPlot]);
        return [xPlot, yPlot];
    }

    drawPlot(ctx: CanvasRenderingContext2D, plotData: number[][]) {
        for (let ind = 0; ind < plotData[0].length; ind++ ) {
            this.drawDot(ctx, [plotData[0][ind], plotData[1][ind]]);
        }
    }

    //метод рисует точку графика по заданным координатам центра
    
    drawDot (ctx: CanvasRenderingContext2D, p:number[]) {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 2, 0, Math.PI * 2, true);
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'red';
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        //console.log(p);
    }

  }