import { Signal } from "signals"
import { Rectangle } from "./Rectangle";

interface tick  {
    coord: number;
    value: number;
    label: string;
}

export class Ticks {
    
    ticksArr: tick[];
    type: string;
    labels?: string[];
    changed: Signal;

    constructor() {
        this.changed = new Signal();
        this.ticksArr = [];
        this.type = 'default';
    }

    setCustomTicksOptions(labels: string[]) {
        this.type = 'custom';
        this.labels = labels;
        this.changed.dispatch();
    }

    createTicks(min: number, max: number, vpLength: number): tick[] {
        switch (this.type) {
            case 'default':
                return this.generateDefaultTicks(min, max, vpLength);
            break;

            case 'custom':
                return this.generateCustomTicks(min, max, vpLength);
            break;
        }
    }

    generateDefaultTicks(min: number, max: number, vpLength: number): tick[] {
        const ticks: tick[] = [];
        const tickCount = 5;
        let stepValue = Math.abs(max-min)/tickCount;
        let stepCoord = vpLength/tickCount;
        for (let i=0; i<=tickCount; i++) {
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

    generateCustomTicks(min: number, max: number, vpLength: number): tick[] {
        const ticks: tick[] = [];
        const tickCount = 5;
        let stepValue = Math.abs(max-min)/tickCount;
        let stepCoord = vpLength/tickCount;
        const valToCoord:number = vpLength/Math.abs(max-min);

        
        for (let i=0; i<=tickCount; i++) {

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

    drawTicks(ticks: tick[], type: string, ctx: CanvasRenderingContext2D, vp: Rectangle) {
        
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

        function drawLabel(xy:number[], label:string, ctx: CanvasRenderingContext2D) {
            ctx.fillStyle = 'black';
            ctx.font = "14px serif";
            ctx.fillText(label, xy[0]+5, xy[1]-5);
        }

        
        switch (type) {
            case 'vertical':
                ticks.forEach((t, i)=>{
                    drawOneTick([vp.x1, vp.zeroY-t.coord], ctx);
                    drawLabel([vp.x1-55, vp.zeroY-t.coord], t.label, ctx);
                });
            break;

            case 'horizontal':
                ticks.forEach((t, i)=>{
                    drawOneTick([vp.x1+t.coord, vp.zeroY], ctx);
                    drawLabel([vp.x1+t.coord, vp.zeroY+20], t.label, ctx);
                });
            break;
        } 
    }

  }