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


    setMinMax(MinMax: number[], duration?:number) {
        let to:number[];
        let from:number[];

        from = [this.min, this.max];

        switch (MinMax.length) {
            case 0:
                to = [0, 100];
            break;

            case 1:
                to = [MinMax[0], 100];
            break;

            case 2:
                to = [MinMax[0], MinMax[1]];
            break;
        }

        if (duration) {
            this.axisRangeAnimation(from, to, duration);
            return;
        }

        this.min = to[0];
        this.max = to[1];
        
        this.changed.dispatch();
        
        /*
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
        */


    }

    axisRangeAnimation(from: number[], to: number[], duration: number) {
        let start = performance.now();
        
        // define some FRAME_PERIOD in units of ms - may be floating point
        // if you want uSecond resolution
        const animate = (time) => {

            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;
            // вычисление текущего состояния анимации
        
            this.min = from[0]+(to[0] - from[0])*timeFraction;
            this.max = from[1]+(to[1] - from[1])*timeFraction;

            this.changed.dispatch(); // отрисовать её
            // return if the desired time hasn't elapsed
            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }

        }

        requestAnimationFrame(animate);

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