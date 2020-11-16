import { Signal } from "signals"
import { Rectangle } from "./Rectangle";
import { Ticks } from "./Ticks";
import { Canvas } from "./Canvas";
import { Grid } from "./Grid";
import { Label } from "./Label";
import { Point } from "./Point";
import { throws } from "assert";


interface axisOptions  {
    lineWidth: number;
    lineColor: string;
    lineDash: number[];
}

//описание класса

export class Axis {

    canvas: Canvas;

    name?: string;
    namePosition?: string;

    label: Label;

    display: boolean = false;
    position: string = 'start'

    min: number;
    max: number;
    type: string;
    optionsDraw: axisOptions;
    gridOn: boolean = false;

    ticks: Ticks;
    customTicks: Ticks[] = [];

    grid: Grid;

    onOptionsSetted: Signal;
    onMinMaxSetted: Signal;
    onCustomTicksAdded: Signal;
    onNameSetted: Signal;
    
    constructor( MinMax: number[], type: string, container: HTMLElement) {
        
        this.onOptionsSetted = new Signal();
        this.onMinMaxSetted = new Signal();
        this.onCustomTicksAdded = new Signal();
        this.onNameSetted = new Signal();

        this.min = 0;
        this.max = 0;
        this.setMinMax(MinMax);

        this.type = type;

        this.label = new Label(this.type);

        this.canvas = new Canvas(container);
        this.canvas.canvas.style.zIndex = "2";

        this.optionsDraw = {
            lineWidth: 1,
            lineColor: '#000000',
            lineDash: []
        };

        this.ticks = new Ticks(this.type);
        this.grid = new Grid(this.type);

        this.bindChildSignals();
        this.bindSignals();
    }

    bindSignals() {
        
        this.onMinMaxSetted.add(() => {
            this.createTicks();
            this.draw();
        })

        this.onOptionsSetted.add(() => {
            this.draw();
        })

        this.onCustomTicksAdded.add(()=>{
            this.createTicks();
            this.draw();
        })

        this.onNameSetted.add(() => {
            this.draw();
        })

    }

    bindChildSignals() {

        //canvas
        this.canvas.resized.add(() => {
            this.createTicks();
            this.draw();
        });

        this.canvas.onPaddingsSetted.add(() => {
            this.createTicks();
            this.draw();
        });

        //ticks
        this.ticks.onOptionsSetted.add(() => {
            this.createTicks();
            this.draw();
        });

        this.ticks.onCustomLabelsAdded.add(() => {
            this.createTicks();
            this.draw();
        });

        this.ticks.onCoordsChanged.add(() => {
            this.draw();
        });

        //label
        this.label.onOptionsSetted.add(() => {
            this.draw();
        });

        //ticks.labels
        this.ticks.label.onOptionsSetted.add(() => {
            this.draw();
        });

        //grid
        this.grid.onOptionsSetted.add(()=>{
            this.draw();
        });


    }


    get length():number {
        return Math.abs(this.max-this.min);
    }

    setName(name:string, namePosition:string) {
        this.name = name;
        this.namePosition = namePosition;
        return this;
    }

    setOptions(position?: string, lineWidth?: number, lineColor?: string, lineDash?: number[]) {
        if (position) this.position = position;
        if (lineWidth) this.optionsDraw.lineWidth = lineWidth;
        if (lineColor) this.optionsDraw.lineColor = lineColor;
        if (lineDash) this.optionsDraw.lineDash = lineDash;
        this.onOptionsSetted.dispatch();
    }


    setMinMax(MinMax: number[], hasPlotAnimation?:boolean) {
        let to:number[] = [];
        let from:number[] = [];

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
   
        this.min = to[0];
        
        this.max = to[1];
        
        this.onMinMaxSetted.dispatch(hasPlotAnimation);

    }

    draw() {
        const ctx = this.canvas.ctx;

        if (ctx) {

            this.canvas.clear();
            const axisVp = this.axisViewport;
            
            if (this.display) this.drawAxis();
            this.ticks.draw(ctx, this.canvas.viewport);
            this.customTicks.forEach((ticks) => {
                ticks.draw(ctx, this.canvas.viewport);
            })
            if (this.grid.display) this.grid.draw(ctx, this.canvas.viewport, this.ticks.coords);
            
            this.drawAxisName();
        }
    }

    createTicks() {
        const ctx = this.canvas.ctx;

        if (ctx) {
            this.ticks.createTicks(this.min, this.max, this.axisViewport, ctx);
            this.customTicks.forEach((ticks) => {
                ticks.createTicks(this.min, this.max, this.axisViewport, ctx);
            })
        }
    }

    addCustomTicks(ticks: Ticks) {
        this.customTicks.push(ticks);
        this.onCustomTicksAdded.dispatch();
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

    drawAxisName() {
        const ctx = this.canvas.ctx;
        const viewport = this.canvas.viewport;

        let xCoord = 0;
        let yCoord = 0;

        (this.type == 'horizontal') ? xCoord = viewport.midX : ((this.namePosition == 'start') ? xCoord = viewport.x1 : xCoord = viewport.x2); 
        (this.type == 'vertical') ? yCoord = viewport.midY : ((this.namePosition == 'start') ? yCoord = viewport.y2 : yCoord = viewport.y1);
        
        const coord = new Point(xCoord, yCoord);

        if ((this.name) && (ctx)) {
            this.label.draw(ctx, coord, this.name);
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