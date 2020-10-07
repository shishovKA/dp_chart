import { Signal } from "signals"
import { Rectangle } from "./Rectangle";
import { Ticks } from "./Ticks";


interface axisOptions  {
    lineWidth: number;
    lineColor: string;
}

//описание класса

export class Axis {

    display: boolean = false;

    min: number;
    max: number;
    type: string;
    _options: axisOptions;
    gridOn: boolean = false;

    ticks: Ticks;

    onOptionsSetted: Signal;
    onMinMaxSetted: Signal;
    onCustomLabelsAdded: Signal;
    onAnimated: Signal;
    
    constructor( MinMax: number[], type: string, ...options: any) {
        
        this.onOptionsSetted = new Signal();
        this.onMinMaxSetted = new Signal();
        this.onCustomLabelsAdded = new Signal();
        this.onAnimated = new Signal();

        this.min = 0;
        this.max = 0;
        this.setMinMax(MinMax);
        this.type = type;

        this._options = {
            lineWidth: 1,
            lineColor: '#000000'
        };

        this.ticks = new Ticks(this.type);
        
        

        this.setOptions(...options);
        this.bindChildSignals();
    }

    bindChildSignals() {
        this.ticks.onOptionsSetted.add(() => {
            this.onOptionsSetted.dispatch();
        });

        this.ticks.onCustomLabelsAdded.add(() => {
            this.onCustomLabelsAdded.dispatch();
        });

        this.ticks.onAnimated.add(() => {
            this.onAnimated.dispatch();
        });
    }

    get length():number {
        return Math.abs(this.max-this.min);
    }

    setOptions(...options: any[]) {

        switch(options.length) {
            case 1:
                this._options.lineWidth = options[0];
            break;
          
            case 2:
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
            break;
        }

        this.onOptionsSetted.dispatch();
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
        
        this.onMinMaxSetted.dispatch();

    }

    draw(ctx: CanvasRenderingContext2D, viewport: Rectangle) {
        if (this.display) this.drawAxis(ctx, viewport);
        this.ticks.createTicks(this.min, this.max, viewport, ctx).draw(ctx, viewport);
    }

    drawAxis(ctx: CanvasRenderingContext2D, viewport: Rectangle) {
        ctx.beginPath();
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.moveTo(viewport.x1, viewport.y2);

        switch(this.type) {
            case 'vertical':
                ctx.lineTo(viewport.x1, viewport.y1);
            break;
          
            case 'horizontal':
                ctx.lineTo(viewport.x2, viewport.y2);
            break;
        }

        ctx.closePath();
        ctx.stroke();
    }


    axisRangeAnimation(from: number[], to: number[], duration: number) {
        
        let start = performance.now();
        
        const animate = (time) => {
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;
            this.min = from[0]+(to[0] - from[0])*timeFraction;
            this.max = from[1]+(to[1] - from[1])*timeFraction;
            this.onMinMaxSetted.dispatch();
            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }


  }