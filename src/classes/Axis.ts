import { Signal } from "signals"

import { Rectangle } from "./Rectangle";
import { Ticks } from "./Ticks";



interface axisOptions  {
    lineWidth: number;
    lineColor: string;
    // и тд
}

//описание класса

export class Axis {

    min: number;
    max: number;
    type: string;
    _options: axisOptions;
    ticks: Ticks;
    changed: Signal;
    
    
    constructor( MinMax: number[], type: string, ...options: any) {
        
        this.changed = new Signal();
        
        this.min = 0;
        this.max = 0;

        this.setMinMax(MinMax);

        this.type = type;

        this._options = {
            lineWidth: 1,
            lineColor: '#000000'
        };

        this.setOptions(...options);
        this.ticks = new Ticks();

        
    }

    setOptions(...options: any[]) {
        //разбираем пакет опций для графика

        switch(options.length) {
            case 1:
                this._options.lineWidth = options[0];
            break;
          
            case 2:
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
            break;
        }
    }


    setMinMax(MinMax: number[]) {
        switch (MinMax.length) {
            case 0:
                this.min = 0;
                this.max = 100;
            break;

            case 1:
                this.min = MinMax[0];
                this.max = 100;
            break;

            case 2:
                this.min = MinMax[0];
                this.max = MinMax[1];
            break;
        }
        
        this.changed.dispatch();
    }


    drawAxis(ctx: CanvasRenderingContext2D, viewport: Rectangle) {
        ctx.beginPath();
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.moveTo(viewport.x1, viewport.y2);

        switch(this.type) {
            case 'vertical':
                ctx.lineTo(viewport.x1, viewport.y1);
                this.ticks.generateTicks(this.min, this.max, viewport.height);
            break;
          
            case 'horizontal':
                ctx.lineTo(viewport.x2, viewport.y2);
                this.ticks.generateTicks(this.min, this.max, viewport.width);
            break;
          }
        ctx.closePath();
        ctx.stroke();

        this.ticks.drawTicks(this.ticks.ticks, this.type,ctx, viewport);
        
    }

  }