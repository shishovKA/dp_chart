
import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { Label } from "./Label";

interface tooltipOptions  {
    lineWidth: number;
    lineColor: string;
    brushColor: string;
    mainSize: number;
    lineDash: number[];
}

//описание класса

export class Tooltip {

    _id: string;
    type: string;
    _options: tooltipOptions;
    labels?: string[];
    label: Label;
    
    constructor(id: string, type: string, ...options: any) {
        this._id = id;
        this.type = type;

        this._options = {
            lineWidth: 1,
            lineColor: '#000000',
            brushColor: '#000000',
            mainSize:  2,
            lineDash: [],
        };

        this.label = new Label();

        //if (labels) this.labels = labels;

        this.setOptions(options);
    }

    get id(): string {
        return this._id;
    }

    setOptions(options: any[]) {
        switch(this.type) {
            case 'circle_series':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
            break;

            case 'line_vertical_full':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.lineDash = options[2];
            break;

            case 'line_horizontal_end':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.lineDash = options[2];
            break;

            case 'label_x_start':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
                this.labels = options[4];
            break;

            case 'circle_y_end':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
            break;

            case 'data_y_end':
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.brushColor = options[2];
                this._options.mainSize = options[3];
            break;

        }
    }


    drawTooltip(ctx: CanvasRenderingContext2D, vp:Rectangle, ttCoord: Point, xyData: Point) {
        switch (this.type) {

            case 'circle_series': 
                this.drawCircleSeries(ctx, ttCoord);
            break;

            case 'line_vertical_full': 
                this.drawLineVerticalFull(ctx, vp, ttCoord);
            break;

            case 'line_horizontal_end': 
                this.drawLineHorizontalEnd(ctx, vp, ttCoord);
            break;

            case 'label_x_start': 
                this.drawLabelXStart(ctx, vp, ttCoord, xyData);
            break;

            case 'circle_y_end': 
                this.drawCircleYEnd(ctx, vp, ttCoord);
            break;

            case 'data_y_end': 
                this.drawDataYEnd(ctx, vp, ttCoord, xyData);
            break;
            
        }
    }


    drawCircleSeries(ctx: CanvasRenderingContext2D, ttCoord: Point){
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash(this._options.lineDash);

        ctx.beginPath();
        ctx.arc(ttCoord.x, ttCoord.y, this._options.mainSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawLineVerticalFull(ctx: CanvasRenderingContext2D, vp:Rectangle, ttCoord: Point){
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.setLineDash(this._options.lineDash);
        ctx.beginPath();
        ctx.moveTo(ttCoord.x, vp.y1);
        ctx.lineTo(ttCoord.x, vp.zeroY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawLineHorizontalEnd(ctx: CanvasRenderingContext2D, vp:Rectangle, ttCoord: Point){
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.setLineDash(this._options.lineDash);
        ctx.beginPath();
        ctx.moveTo(ttCoord.x, ttCoord.y);
        ctx.lineTo(vp.x2, ttCoord.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }


    drawLabelXStart(ctx: CanvasRenderingContext2D, vp:Rectangle, ttCoord: Point, seriesData: Point){
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash(this._options.lineDash);

        const labelCoord = new Point(ttCoord.x, vp.zeroY);
        const labelText = (this.labels[seriesData.x]).toString();
        const cornersRadius = this._options.mainSize;

        const labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);

        const labelCenter = new Point(labelCoord.x, labelCoord.y + this.label.offset*0.5 - this.label.fontSize);
        const rectWidth = 50;
        const rectHeight = 22;

        this.roundRect(ctx, labelCenter.x - rectWidth*0.5, labelCenter.y+rectHeight*0.5, rectWidth, rectHeight, cornersRadius)
        ctx.fill();
        ctx.stroke();
        
        this.label.draw(ctx, labelCoord, labelText);
    }

    roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      
      }

      drawCircleYEnd(ctx: CanvasRenderingContext2D, vp:Rectangle, ttCoord: Point){
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash(this._options.lineDash);

        ctx.beginPath();
        ctx.arc(vp.x2, ttCoord.y, this._options.mainSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }


    drawDataYEnd(ctx: CanvasRenderingContext2D, vp:Rectangle, ttCoord: Point, seriesData: Point){
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.fillStyle = this._options.brushColor;
        ctx.setLineDash(this._options.lineDash);

        const labelCoord = new Point(vp.x2, ttCoord.y);
        const labelText = (seriesData.y).toFixed(2);
        const cornersRadius = this._options.mainSize;

        const labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);

        const labelCenter = new Point(labelCoord.x+this.label.offset+labelRect.width*0.5, labelCoord.y);
        const rectWidth = 45;
        const rectHeight = 22;

        this.roundRect(ctx, labelCenter.x - rectWidth*0.5, labelCenter.y-rectHeight*0.5, rectWidth, rectHeight, cornersRadius)
        ctx.fill();
        ctx.stroke();
        
        this.label.draw(ctx, labelCoord, labelText);
    }

  }