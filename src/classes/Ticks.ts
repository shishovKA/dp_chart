import { Signal } from "signals"
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";

interface tick  {
    coord: number;
    value: number;
    label: string;
}

export class Ticks {
    
    ticksArr: tick[];
    type: string;
    count?: number;
    step?: number;
    labels?: string[];

    changed: Signal;

    constructor() {
        this.changed = new Signal();
        this.ticksArr = [];
        this.type = 'default';
        this.count = 5;
        this.step = 100;
    }

    setTicksOptions(type: string, options: any[], duration?: number) {
        switch (type) {
            case 'default':
                this.type = type;
                this.count = options[0];
            break;

            case 'fixedStep':
                this.type = type;
                if (duration) {
                    this.tickStepAnimation(this.step, options[0], duration);
                return;
                }
                this.step = options[0];
            break;

            case 'labeled':
                this.type = type;
                this.count = options[0];
                this.labels = options[1];
            break;
        }
        this.changed.dispatch();
    }


    tickStepAnimation(from: number, to: number, duration: number) {
        let start = performance.now();
        
        const animate = (time) => {

            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;
            this.step = from+(to - from)*timeFraction;
            this.changed.dispatch(); // отрисовать её
            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    createTicks(min: number, max: number, vpLength: number) {
        switch (this.type) {
            case 'default':
                this.ticksArr = this.generateFixedCountTicks(min, max, vpLength);
                return this
            break;

            case 'fixedStep':
                this.ticksArr = this.generateFixedStepTicks(min, max, vpLength);
                return this
            break;

            case 'labeled':
                this.ticksArr = this.generateLabeledTicks(min, max, vpLength);
                return this
            break;
        }
    }

    generateFixedCountTicks(min: number, max: number, vpLength: number): tick[] {
        const ticks: tick[] = [];
        let stepValue = Math.abs(max-min)/this.count;
        let stepCoord = vpLength/this.count;
        for (let i=0; i<=this.count; i++) {
            const t = {
                coord: i*stepCoord,
                value: min+i*stepValue,
                label: '',  
            }
            t.label = t.value.toFixed(2).toString();
            ticks.push(t);
        }
        this.ticksArr = ticks;
        return ticks;
    }

    generateFixedStepTicks(min: number, max: number, vpLength: number): tick[] {
        const ticks: tick[] = [];
        let coordСoeff = vpLength/Math.abs(max-min);

        const startValue = 0;
        let curValue = startValue;
        
        while (curValue < max) {
            if ((curValue >= min) && (curValue <= max)) { 
                
                const t = {
                    coord: (curValue - min)*coordСoeff,
                    value: curValue,
                    label: curValue.toFixed(2).toString()  
                    }

                ticks.push(t);

                }

            curValue = curValue + this.step;
        } 

        this.ticksArr = ticks;
        return ticks;
    }

    generateLabeledTicks(min: number, max: number, vpLength: number): tick[] {
        const ticks: tick[] = [];
        let stepValue = Math.abs(max-min)/this.count;
        let stepCoord = vpLength/this.count;
        const valToCoord:number = vpLength/Math.abs(max-min);

        
        for (let i=0; i<=this.count; i++) {

            const value: number = Math.round(min+i*stepValue);
            const coord: number = (value-min)*valToCoord;

            const t = {
                coord: coord,
                value: value,
                label: this.labels[value],  
            }

            ticks.push(t);
        }
        
        this.ticksArr = ticks;
        return ticks;
    }

    drawTicks(type: string, ctx: CanvasRenderingContext2D, vp: Rectangle) {
        
        function drawOneTick(xy:number[], ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            let r = 10;
            ctx.moveTo(xy[0]-r, xy[1]);
            ctx.lineTo(xy[0]+r, xy[1]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(xy[0], xy[1]-r);
            ctx.lineTo(xy[0], xy[1]+r);
            ctx.stroke();
        }

        function drawGrid(from: Point, to: Point, ctx: CanvasRenderingContext2D) {
            ctx.strokeStyle = '#b3b3b3';
            ctx.lineWidth = 1;
            ctx.fillStyle = '#b3b3b3';
            ctx.setLineDash([2, 3]);
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        function drawLabel(xy:number[], label:string, ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = 'black';
            ctx.font = "14px serif";
            ctx.fillText(label, xy[0]+5, xy[1]-5);
        }
        
        switch (type) {
            case 'vertical':
                this.ticksArr.forEach((t, i)=>{
                    drawOneTick([vp.x1, vp.zeroY-t.coord], ctx);
                    drawLabel([vp.x1-55, vp.zeroY-t.coord], t.label, ctx);

                    drawGrid(new Point(vp.x1, vp.zeroY-t.coord), new Point(vp.x2, vp.zeroY-t.coord), ctx)
                });
            break;

            case 'horizontal':
                this.ticksArr.forEach((t, i)=>{
                    drawOneTick([vp.x1+t.coord, vp.zeroY], ctx);
                    drawLabel([vp.x1+t.coord, vp.zeroY+20], t.label, ctx);

                });
            break;
        } 
    }

  }