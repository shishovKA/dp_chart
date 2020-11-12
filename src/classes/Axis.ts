import { Signal } from "signals"
import { Rectangle } from "./Rectangle";
import { Ticks } from "./Ticks";
import { Canvas } from "./Canvas";


interface axisOptions  {
    lineWidth: number;
    lineColor: string;
    lineDash: number[];
}

//описание класса

export class Axis {

    canvas: Canvas;

    display: boolean = false;
    position: string = 'start'

    min: number;
    max: number;
    type: string;
    optionsDraw: axisOptions;
    gridOn: boolean = false;

    ticks: Ticks;
    customTicks: Ticks[] = [];

    onOptionsSetted: Signal;
    onMinMaxSetted: Signal;
    onCustomLabelsAdded: Signal;
    onAnimated: Signal;
    
    constructor( MinMax: number[], type: string, canvas: Canvas) {
        
        this.onOptionsSetted = new Signal();
        this.onMinMaxSetted = new Signal();
        this.onCustomLabelsAdded = new Signal();
        this.onAnimated = new Signal();

        this.min = 0;
        this.max = 0;
        this.setMinMax(MinMax);

        this.type = type;

        this.canvas = canvas;

        this.optionsDraw = {
            lineWidth: 1,
            lineColor: '#000000',
            lineDash: []
        };

        this.ticks = new Ticks(this.type);
        this.bindChildSignals();
    }

    bindChildSignals() {
        this.ticks.onOptionsSetted.add(() => {
            this.onOptionsSetted.dispatch();
            this.canvas.clear();
            this.createTicks();
            this.draw();
        });

        this.ticks.onCustomLabelsAdded.add(() => {
            this.onCustomLabelsAdded.dispatch();
            this.canvas.clear();
            this.createTicks();
            this.draw();
        });

        this.ticks.onAnimated.add(() => {
            this.onAnimated.dispatch();
        });

        //подключаем перестройку ticks к сигналам
        this.canvas.resized.add(() => {
            this.createTicks();
            this.draw();
        });

        this.onMinMaxSetted.add(() => {
            this.canvas.clear();
            this.createTicks();
            this.draw();
        })

    }

    get length():number {
        return Math.abs(this.max-this.min);
    }

    setOptions(lineWidth?: number, lineColor?: string, lineDash?: number[]) {
        if (lineWidth) this.optionsDraw.lineWidth = lineWidth;
        if (lineColor) this.optionsDraw.lineColor = lineColor;
        if (lineDash) this.optionsDraw.lineDash = lineDash;
        this.onOptionsSetted.dispatch();
    }


    setMinMax(MinMax: number[], hasPlotAnimation?:boolean) {
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

        /*
        if (duration) {
            this.axisRangeAnimation(from, to, duration);
            return;
        }
        */
    // @ts-ignore
        this.min = to[0];
        // @ts-ignore
        this.max = to[1];
        
        this.onMinMaxSetted.dispatch(hasPlotAnimation);

    }

    draw() {
        const axisVp = this.axisViewport;
        if (this.display) this.drawAxis();
        this.ticks.draw(this.canvas.ctx, this.canvas.viewport);
        this.customTicks.forEach((ticks) => {
            ticks.draw(this.canvas.ctx, this.canvas.viewport);
        })
    }

    createTicks() {
        this.ticks.createTicks(this.min, this.max, this.axisViewport, this.canvas.ctx);
        this.customTicks.forEach((ticks) => {
            ticks.createTicks(this.min, this.max, this.axisViewport, this.canvas.ctx);
        })
    }

    addCustomTicks(ticks: Ticks) {
        this.customTicks.push(ticks);
    }

    get axisViewport(): Rectangle {
        const vp: Rectangle = this.canvas.viewport;
        let axisVP: Rectangle = new Rectangle(0, 0, 0, 0);
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

        return axisVP;
    }

    drawAxis() {
        const ctx = this.canvas.ctx;
        const viewport = this.axisViewport;

        if (ctx) {
            ctx.strokeStyle = this.optionsDraw.lineColor;
            ctx.lineWidth = this.optionsDraw.lineWidth;
            ctx.setLineDash(this.optionsDraw.lineDash);
            ctx.beginPath();
            ctx.moveTo(viewport.x1, viewport.y1);
            ctx.lineTo(viewport.x2, viewport.y2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

/*
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
*/

  }