
import { Rectangle } from "./Rectangle";
import { Series } from "./Series";
import { Point } from "./Point";
import { Tooltip } from "./Tooltip";

interface plotOptions  {
    lineWidth: number;
    lineColor: string;
    brushColor: string;
    mainSize: number;
}

//описание класса

export class Plot {

    _id: string;
    type: string;
    _options: plotOptions;
    plotData: Point[];
    tooltips: Tooltip[];
    
    constructor(id: string, type: string, ...options: any) {
        this._id = id;
        this.type = type;

        this._options = {
            lineWidth: 0.5,
            lineColor: '#000000',
            brushColor: '#000000',
            mainSize:  1,
        };

        this.setOptions(options);

        this.plotData = [];
        this.tooltips = [];
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

    convertSeriesToCoord(series: Series, plotArea: Rectangle) {
        let extremes = series.findExtremes();
        let kx: number = plotArea.width / Math.abs(extremes[1] - extremes[0]);
        let ky: number = plotArea.height / Math.abs(extremes[3] - extremes[2]);

        if (!ky) ky = 1;
        if (!kx) kx = 1;

        let plotData: Point[] = [];

        switch (this.type) {
            case 'dotted': 
                for (let i = 0; i < series.seriesData.length; i=i+2 ) {
                    series.seriesData[i].forEach((element, ind) => {
                        const x: number = (series.seriesData[i][ind]-extremes[0])*kx + plotArea.x1;
                        const y: number = plotArea.zeroY - (series.seriesData[i+1][ind]-extremes[2])*ky;
                        plotData.push(new Point(x,y));
                    });
                }
            break;

            case 'line': 
                for (let i = 0; i < series.seriesData.length; i=i+2 ) {
                    series.seriesData[i].forEach((element, ind) => {
                        const x: number = (series.seriesData[i][ind]-extremes[0])*kx + plotArea.x1;
                        const y: number = plotArea.zeroY - (series.seriesData[i+1][ind]-extremes[2])*ky;
                        plotData.push(new Point(x,y));
                    });
                }
            break;

            case 'area': 
                for (let i = 0; i < series.seriesData.length; i=i+2 ) {
                    let dataRowInd = series.seriesData[i];
                    let dataRowVal = series.seriesData[i+1];
                    if (i == 2) {   
                        dataRowInd = dataRowInd.slice().reverse();
                        dataRowVal = dataRowVal.slice().reverse();
                    }
                    series.seriesData[i].forEach((element, ind) => {
                        const x: number = (dataRowInd[ind]-extremes[0])*kx + plotArea.x1;
                        const y: number = plotArea.zeroY - (dataRowVal[ind]-extremes[2])*ky;
                        plotData.push(new Point(x,y));
                    });
                }
            break;
        }



        this.plotData = plotData;
        return this;
    }

    drawPlot(vp:Rectangle, ctx: CanvasRenderingContext2D) {
        
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.globalAlpha = 1;
        ctx.fillStyle = this._options.brushColor;

        switch (this.type) {
            case 'dotted': 
                this.drawDotted(ctx);
            break;

            case 'line': 
                this.drawLine(ctx);
            break;

            case 'area': 
            this.drawArea(vp, ctx);
            break;
        }

    }

    drawDotted(ctx: CanvasRenderingContext2D){

        for (let i = 1; i < this.plotData.length; i++ ) {
            ctx.beginPath();
            ctx.arc(this.plotData[i].x, this.plotData[i].y, this._options.mainSize, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    drawLine(ctx: CanvasRenderingContext2D) {        

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(this.plotData[0].x, this.plotData[0].y);

        for (let i = 1; i < this.plotData.length; i++ ) {
            ctx.lineTo(this.plotData[i].x, this.plotData[i].y) 
        }
    
        ctx.stroke();
    }

    drawArea(vp:Rectangle, ctx: CanvasRenderingContext2D) {

        ctx.beginPath();
        //ctx.moveTo(this.plotData[0].x, vp.zeroY);
        ctx.lineTo(this.plotData[0].x, this.plotData[0].y);
        
        for (let i = 1; i < this.plotData.length; i++ ) {
            ctx.lineTo(this.plotData[i].x, this.plotData[i].y) 
        }

        //ctx.lineTo(this.plotData[this.plotData.length-1].x, vp.zeroY);
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }


    addTooltip(id: string, type: string, ...options: any): Tooltip {
        const tooltip = new Tooltip(id, type, ...options);
        this.tooltips.push(tooltip);
        return tooltip;
    }

    findTooltipById(id: string):Tooltip | null {
        const tooltips: Tooltip[] = this.tooltips.filter((tooltip) => {
            return tooltip.id === id
        });
        if (tooltips.length !== 0) return tooltips[0];
        return null;
    }


  }