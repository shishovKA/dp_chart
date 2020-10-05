import { Signal } from "signals"
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Label } from "./Label";
import { Transformer } from "./Transformer";


export class Ticks {

    display: boolean = false;
    hasCustomLabels: boolean = false;

    type: string;
    distributionType: string;
    count: number;
    step: number;

    coords: Point[];
    values: number[];
    labels: string[];

    customLabels?: string[];

    onOptionsSetted: Signal;
    onCustomLabelsAdded: Signal;

    constructor(axistype: string) {
        this.onOptionsSetted = new Signal();
        this.onCustomLabelsAdded = new Signal();
        
        this.coords = [];
        this.values = [];
        this.labels = [];

        this.type = axistype;

        this.distributionType = 'default';
        this.count = 5;
        this.step = 100;
    }

    setCustomLabels(labels:string[]) {
        this.hasCustomLabels = true;
        this.customLabels = labels;
        this.onCustomLabelsAdded.dispatch();
    }


    setOptions(distributionType: string, distParam: number, duration?: number) {
        switch (distributionType) {
            case 'default':
                this.distributionType = distributionType;
                this.count = distParam;
            break;

            case 'fixedStep':
                this.distributionType = distributionType;
            /*
                if (duration) {
                    this.tickStepAnimation(this.step, distParam, duration);
                return;
                }
            */
                this.step = distParam;
            break;
        }
        this.onOptionsSetted.dispatch();
    }


    createTicks(min: number, max: number, vp: Rectangle) {
        switch (this.distributionType) {
            case 'default':
                this.generateFixedCountTicks(min, max, vp);
                return this
            break;

            case 'fixedStep':
                this.generateFixedStepTicks(min, max, vp);
                return this
            break;

            case 'fixedCount':
                this.generateFixedCountTicks(min, max, vp);
                return this
            break;
        }
    }


    generateFixedCountTicks(min:number, max:number, vp: Rectangle) {
        this.coords = [];
        this.values = [];
        this.labels = [];
        let stepCoord = 0;
        let rectXY: number[] = [];
        const transformer = new Transformer();
       
        let stepValue = Math.abs(max-min)/this.count;

        switch (this.type) {
            case 'vertical':
                stepCoord = vp.height/this.count;
                rectXY = [0,min,1,max];
            break;

            case 'horizontal':
                stepCoord = vp.width/this.count;
                rectXY = [min,0,max,1];
            break;
        }

        const fromRect = new Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
        

        for (let i=0; i<=this.count; i++) {
 
            let pointXY: number[] = [];

            let value = min+i*stepValue;

                if (this.hasCustomLabels) {
                    value = Math.round(value);
                    this.labels.push(this.customLabels[value]);
                } else {
                        this.labels.push(value.toFixed(2).toString());
                    }

            switch (this.type) {
                case 'vertical':
                    pointXY = [0,value];
                break;
    
                case 'horizontal':
                    pointXY = [value, 0];
                break;
            }

            const valuePoint = new Point(pointXY[0], pointXY[1]);
            const coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
            this.coords.push(coordPoint);
            this.values.push(value);
 
        }

        return this;
    }

    
    generateFixedStepTicks(min:number, max:number, vp: Rectangle) {
        this.coords = [];
        this.values = [];
        this.labels = [];
        let rectXY: number[] = [];
        const transformer = new Transformer();
       
        switch (this.type) {
            case 'vertical':
                rectXY = [0,min,1,max];
            break;

            case 'horizontal':
                rectXY = [min,0,max,1];
            break;
        }

        const fromRect = new Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);

        const startValue = 0;
        let curValue = startValue;
        
        while (curValue < max) {
            if ((curValue >= min) && (curValue <= max)) { 
                

                let pointXY: number[] = [];
                let value = curValue;

                if (this.hasCustomLabels) {
                    value = Math.round(curValue);
                    this.labels.push(this.customLabels[value]);
                } else {
                        this.labels.push(value.toFixed(2).toString());
                    }

                switch (this.type) {
                    case 'vertical':
                        pointXY = [0,value];
                    break;
        
                    case 'horizontal':
                        pointXY = [value, 0];
                    break;
                }

                const valuePoint = new Point(pointXY[0], pointXY[1]);
                const coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                this.coords.push(coordPoint);
                this.values.push(value);    
            }

            curValue = curValue + this.step;
        } 

        return this;
    }


    draw(ctx: CanvasRenderingContext2D, label: Label) {
        this.coords.forEach((tickCoord, i)=>{
            if (this.display) this.drawTick(ctx, tickCoord);
            if (label.display) label.draw(ctx, tickCoord, this.labels[i]);
        }); 
    }


    drawTick(ctx: CanvasRenderingContext2D, tick:Point) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        let r = 10;
        ctx.moveTo(tick.x-r, tick.y);
        ctx.lineTo(tick.x+r, tick.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tick.x, tick.y-r);
        ctx.lineTo(tick.x, tick.y+r);
        ctx.stroke();
    }

    // Метод анимации изменение параметра step
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

  }