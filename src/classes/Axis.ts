import { Signal } from "signals"
import { Rectangle } from "./Rectangle";
import { Ticks } from "./Ticks";


interface axisOptions  {
    lineWidth: number;
    lineColor: string;
    lineDash: number[];
}

//описание класса

export class Axis {

    display: boolean = false;
    position: string = 'start'

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
            lineColor: '#000000',
            lineDash: [1,0]
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

            case 3:
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
                this._options.lineDash = options[2];
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
        const axisVp = this.getaxisViewport(viewport);
        if (this.display) this.drawAxis(ctx, axisVp);
        this.ticks.draw(ctx, viewport);
    }

    getaxisViewport(vp: Rectangle): Rectangle {
        let axisVP;
        switch(this.position) {
            case 'start':
                switch(this.type) {
                    case 'vertical':
                        axisVP = new Rectangle(vp.x1, vp.y1, vp.x1, vp.y2);
                    break;
                  
                    case 'horizontal':
                        axisVP = new Rectangle(vp.x1, vp.y2, vp.x2, vp.y2);
                    break;
                }
            break;
          
            case 'end':
                case 'start':
                    switch(this.type) {
                        case 'vertical':
                            axisVP = new Rectangle(vp.x2, vp.y1, vp.x2, vp.y2);
                        break;
                      
                        case 'horizontal':
                            axisVP = new Rectangle(vp.x1, vp.y1, vp.x2, vp.y1);
                        break;
                    }
                break;
            break;
        }

        return axisVP
    }

    drawAxis(ctx: CanvasRenderingContext2D, viewport: Rectangle) {
        
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.setLineDash(this._options.lineDash);

        ctx.beginPath();
        ctx.moveTo(viewport.x1, viewport.y1);
        ctx.lineTo(viewport.x2, viewport.y2);
        ctx.stroke();
        ctx.setLineDash([]);
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