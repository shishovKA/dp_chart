import { Signal } from "signals"
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Label } from "./Label";
import { Grid } from "./Grid";
import { Transformer } from "./Transformer";


export class Ticks {

    display: boolean = false;
    hasCustomLabels: boolean = false;
    hasAnimation: boolean = false;
    animationDuration: number = 300;


    label: Label;
    grid: Grid;

    type: string;
    distributionType: string;
    count: number;
    step: number;

    coords: Point[];
    values: number[];
    labels: string[];

    customLabels?: string[];

    customTicksOptions?: any[];

    // параметры отрисовки тика
    linewidth: number = 2;
    tickSize: number = 5;
    color: string = 'black'

    onOptionsSetted: Signal;
    onCustomLabelsAdded: Signal;
    onAnimated: Signal;

    constructor(axistype: string) {
        this.onOptionsSetted = new Signal();
        this.onCustomLabelsAdded = new Signal();
        this.onAnimated = new Signal();

        this.coords = [];
        this.values = [];
        this.labels = [];

        this.type = axistype;

        this.label = new Label(this.type);
        this.grid = new Grid(this.type);

        this.distributionType = 'default';
        this.count = 5;
        this.step = 100;

        this.bindChildSignals();
    }

    switchAnimation(hasAnimation: boolean, duration?: number) {
        this.hasAnimation = hasAnimation;
        if (duration) this.animationDuration = duration;
    }

    bindChildSignals() {
        this.label.onOptionsSetted.add(() => {
            this.onOptionsSetted.dispatch();
        });

        this.grid.onOptionsSetted.add(() => {
            this.onOptionsSetted.dispatch();
        });
    }

    setCustomLabels(labels:string[]) {
        this.hasCustomLabels = true;
        this.customLabels = labels;
        this.onCustomLabelsAdded.dispatch();
    }

    settickDrawOptions(length: number, width: number, color: string) {
        this.linewidth = width;
        this.tickSize = length;
        this.color = color;
    }


    setOptions(distributionType: string, ...options: any[]) {
        switch (distributionType) {
            case 'default':
                this.distributionType = distributionType;
                this.count = options[0];
            break;

            case 'fixedCount':
                this.distributionType = distributionType;
                this.count = options[0];
            break;

            case 'fixedStep':
                this.distributionType = distributionType;
                this.step = options[0];
            break;

            case 'customDateTicks':
                this.distributionType = distributionType;
                if (options.length !== 0) this.customTicksOptions = options[0];
            break;

            case 'niceCbhStep':
                this.distributionType = distributionType;
                if (options.length !== 0) this.customTicksOptions = options[0];
            break;
        }
        this.onOptionsSetted.dispatch();
    }


    createTicks(min: number, max: number, vp: Rectangle, ctx: CanvasRenderingContext2D) {
        let coords = [];

        switch (this.distributionType) {
            case 'default':
                coords = this.generateFixedCountTicks(min, max, vp);
            break;

            case 'fixedStep':
                coords = this.generateFixedStepTicks(min, max, vp);
            break;

            case 'fixedCount':
                coords = this.generateFixedCountTicks(min, max, vp);
            break;

            case 'customDateTicks':
                coords = this.generateCustomDateTicks(min, max, vp, ctx);
            break;

            case 'niceCbhStep':
                coords = this.generateNiceCbhTicks(min, max, vp);
            break;
        }

        //если нужна анимация тиков
        if (this.hasAnimation) {
            const from = this.makeFromPointArr(this.coords, coords);

            if (from.length == 0) {
                this.coords = coords;
                return this;
            }

            this.coords = from;
            this.tickCoordAnimation(from, coords, this.animationDuration);

            return this
        }

        this.coords = coords;
    }


    generateFixedCountTicks(min:number, max:number, vp: Rectangle) {
        let coords = [];
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
            coords.push(coordPoint);
            this.values.push(value);
 
        }

        return coords;
    }

    
    generateFixedStepTicks(min:number, max:number, vp: Rectangle, step?: number, toFixed?: number) {
        let coords = [];
        this.values = [];
        this.labels = [];
        let rectXY: number[] = [];

        let tickStep = this.step;

        if (step) {
            tickStep = step;
        }



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
                        if (toFixed !== null) {
                            this.labels.push(value.toFixed(toFixed).toString()) 
                        } else {
                            this.labels.push(value.toFixed(2).toString());
                        }
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
                coords.push(coordPoint);
                this.values.push(value);    
            }

            curValue = curValue + tickStep;
        }

        curValue = startValue;
        curValue = curValue - tickStep;

        while (curValue > min) {
            if ((curValue >= min) && (curValue <= max)) { 
                

                let pointXY: number[] = [];
                let value = curValue;

                if (this.hasCustomLabels) {
                    value = Math.round(curValue);
                    this.labels.push(this.customLabels[value]);
                } else {
                    if (toFixed !== null) {
                        this.labels.push(value.toFixed(toFixed).toString())
                    } else {
                        this.labels.push(value.toFixed(2).toString());
                    }
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
                coords.push(coordPoint);
                this.values.push(value);    
            }

            curValue = curValue - tickStep;
        }

        return coords;
    }

    generateNiceCbhTicks(min:number, max:number, vp: Rectangle) {
        let coords = [];

        let deviation = Math.abs(max - min);
        let devInd = 0;


        for (let j = 0; j < this.customTicksOptions.length; j++) {

            coords = this.generateFixedStepTicks(min, max, vp, this.customTicksOptions[j], 0);
            const maxValue = this.values.reduce((prev, element) => {
                return (element > prev) ? element : prev;
            }, this.values[0]) 
            
            if ((Math.abs(maxValue-max) < deviation) && (coords.length <= 10) && (coords.length >= 4))  {
                devInd = j;
                deviation = Math.abs(maxValue-max);
            }

        }

        coords = this.generateFixedStepTicks(min, max, vp, this.customTicksOptions[devInd], 0);


        return coords;
    }


    generateCustomDateTicks(min:number, max:number, vp: Rectangle, ctx: CanvasRenderingContext2D) {
        let coords = [];

        for (let j = 0; j < this.customTicksOptions.length; j++) {

            const ticksArr = this.generateCustomDateTicksByOption(j, min, max, vp, ctx);

            coords = ticksArr[0];
            let values = ticksArr[1];
            let labels = ticksArr[2];

            if (this.checkLabelsOverlap(ctx, coords, labels)) {

                this.values = values;
                this.labels = labels;
 
                return coords;
            }

        }

        return coords;
    }


    // Метод анимации изменение набора координат тиков
    tickCoordAnimation(from: Point[], to: Point[], duration: number) {

        let start = performance.now();
        
        const animate = (time) => {
            
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            const tek = from.map((el,i)=> {
                return new Point(from[i].x + (to[i].x - from[i].x)*timeFraction, from[i].y + (to[i].y - from[i].y)*timeFraction);
            });

            this.coords = tek;

            this.onAnimated.dispatch();

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            } else {
    
            }

        }

        requestAnimationFrame(animate);

    }


    makeFromPointArr(from: Point[], to: Point[]): Point[] {
        const resultArr: Point[] = [];
        
        to.forEach((toPoint) => {
            if (from.length !== 0) {
                const minP = from.reduce((fromPoint, cur) => {
                        if (fromPoint.findDist(toPoint) < cur.findDist(toPoint)) return fromPoint
                        return cur; 
                    }, from[0])
                resultArr.push(minP);
            }
        });

        return resultArr;
    }


    // генерация пробных тиков

    generateCustomDateTicksByOption(j:number, min:number, max:number, vp: Rectangle, ctx: CanvasRenderingContext2D): any[] {

        function dateParser(myDate: string) {
            const arr = myDate.split('.');
            arr[2] = '20'+arr[2];
            const date = new Date(+arr[2], +arr[1]-1, +arr[0]);
            return date;
        }

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            

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

        let pointXY: number[] = [];

        let coords = [];
        let values = [];
        let labels = [];

        let yearDel = 1;
        const partYear = this.customTicksOptions[j];
        switch (partYear) {
            case 'half year':
                yearDel = 2;
            break;

            case 'third year':
                yearDel = 3;
            break;

            case 'quarter year':
                yearDel = 4;
            break;
        }

        for (let i = min+1; i <= max; i++) {
            let curLabel = this.customLabels[i];
            let preLabel = this.customLabels[i-1];
            let curDate = dateParser(curLabel);
            let preDate = dateParser(preLabel);

            //начала годов
            if ((curDate.getFullYear() - preDate.getFullYear()) !== 0) {

                switch (this.type) {
                    case 'vertical':
                        pointXY = [0, i];
                    break;
        
                    case 'horizontal':
                        pointXY = [i, 0];
                    break;
                }

                const valuePoint = new Point(pointXY[0], pointXY[1]);
                const coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                coords.push(coordPoint);
                values.push(i); 
                labels.push(curDate.getFullYear());
            } else {
                        //начала месяцев
                    if ( (this.customTicksOptions[j] !== partYear) || (!(curDate.getMonth() % yearDel)) ) {
                            if ((curDate.getMonth() - preDate.getMonth()) !== 0) {

                                switch (this.type) {
                                    case 'vertical':
                                        pointXY = [0, i];
                                    break;
                        
                                    case 'horizontal':
                                        pointXY = [i, 0];
                                    break;
                                }

                                const valuePoint = new Point(pointXY[0], pointXY[1]);
                                const coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                                coords.push(coordPoint);
                                values.push(i); 
                                labels.push(monthNames[curDate.getMonth()]);
                            }
                        }
                    }
            
            //середины месяцев
            if (this.customTicksOptions[j] == 'half month') { 
                if ((curDate.getDay() !== 0) && (curDate.getDay() !== 6)) {
                    if ((curDate.getDate() == 14 || curDate.getDate() == 15 || curDate.getDate() == 16) && 
                        (curDate.getDay() == 1 || curDate.getDay() == 4) || (curDate.getDate() == 14 && curDate.getDay() == 5))  {
                        switch (this.type) {
                            case 'vertical':
                                pointXY = [0, i];
                            break;
                
                            case 'horizontal':
                                pointXY = [i, 0];
                            break;
                        }

                        const valuePoint = new Point(pointXY[0], pointXY[1]);
                        const coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                        coords.push(coordPoint);
                        values.push(i); 
                        labels.push(curDate.getDate());
                    }
                }
            }

        }

        return [coords, values, labels];
    }




    checkLabelsOverlap(ctx: CanvasRenderingContext2D, coords: Point[], labels: string[]): boolean {
        for (let i=1; i<coords.length; i++) {
            const curRec = this.label.getlabelRect(ctx, coords[i], labels[i]);
            const preRec = this.label.getlabelRect(ctx, coords[i-1], labels[i-1]);
            if (curRec.countDistBetweenRects(this.type, preRec) <= 0) return false;
        }
        return true;
    }


    draw(ctx: CanvasRenderingContext2D, viewport: Rectangle) {
        this.coords.forEach((tickCoord, i) => {
            if (this.display) this.drawTick(ctx, tickCoord);
            if (this.label.display) this.label.draw(ctx, tickCoord, this.labels[i]);
        }); 
        if (this.grid.display) this.grid.draw(ctx, viewport, this.coords);
    }


    drawTick(ctx: CanvasRenderingContext2D, tick:Point) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.linewidth;
        let r = this.tickSize;

        switch (this.type) {
            case 'vertical' :
                ctx.moveTo(tick.x-r, tick.y);
                ctx.lineTo(tick.x+r, tick.y);
                ctx.stroke();
            break;

            case 'horizontal' :
                ctx.moveTo(tick.x, tick.y-r);
                ctx.lineTo(tick.x, tick.y);
                ctx.stroke();
            break;
        }
    }

    // Метод анимации изменение параметра step

    /*
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
    */

  }