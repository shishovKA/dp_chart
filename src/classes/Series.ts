import { Signal } from "signals"
import { Canvas } from "./Canvas";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Transformer } from "./Transformer";

export class Series {

    id: string;
    seriesData: number[][];
    plotData: Point[];
    plots: string[];
    hasAnimation: boolean = true;
    animationDuration: number = 300;
    //extremes: number[];
    canvas: Canvas;

    changed: Signal;
    onDataReplaced: Signal;
    onPlotDataChanged: Signal;
    
    constructor(id: string, container: HTMLElement, ...seriesData: number[][]) {
        this.changed = new Signal();
        this.onDataReplaced = new Signal();
        this.onPlotDataChanged = new Signal();
        this.id = id;
        this.seriesData = this.getInitialData(seriesData);
        this.plots = [];
        this.plotData = [];
        this.canvas = new Canvas(container);
        return this
    }


    getInitialData(initialData: number[][]): number[][] {
        let resultData: number[][] = []
        
        initialData.forEach((dataRow) => {
            const ind: number[] = [];
            const val: number[] = [];
            dataRow.forEach((element, index) => {
                ind.push(index);
                val.push(element);
            });
            resultData.push(ind);
            resultData.push(val);
        })

        return resultData;
    }


    setPlotsIds(...plotIds: string[]) {
        this.plots = plotIds;       
    }


    findExtremes(data?:number[][]): number[] {

        let seriesData:number[][] = [];

        if (data) seriesData = data;
        if (!data) seriesData = this.seriesData;

        let xMin: number = seriesData[0][0];
        let xMax: number = seriesData[0][0];
        let yMin: number = seriesData[1][0];
        let yMax: number = seriesData[1][0];

        seriesData.forEach((dataRow, ind) => {
            dataRow.forEach((element) => {
                switch (ind % 2) {
                    case 0:
                        if (element < xMin) xMin = element;
                        if (element > xMax) xMax = element;
                    break;

                    case 1:
                        if (element < yMin) yMin = element;
                        if (element > yMax) yMax = element;
                    break;
                }
            })
        })
        
        return [xMin,xMax,yMin,yMax];
    }


    get dataRect(): Rectangle {
        const extremes = this.findExtremes();
        return new Rectangle(extremes[0], extremes[2], extremes[1], extremes[3]);
    }


    getDataRange(type:string, min:number, max:number): number[][] {
        const data: number[][] = []
 
     /*   
        let arrInd: number = 0;

        switch (type) {
            case 'ind':
                arrInd = 0;
            break;

            case 'val':
                arrInd = 1;
            break;

            default:
                arrInd = 0;
            break;
        }
        */

        for (let i = 0; i < this.seriesData.length; i = i + 2) {
            const ind: number[] = [];
            const val: number[] = [];

            let dataRowInd = this.seriesData[i];
            let dataRowVal = this.seriesData[i + 1];
            if (i == 2) {
                dataRowInd = dataRowInd.slice().reverse();
                dataRowVal = dataRowVal.slice().reverse();
            }

            dataRowInd.forEach((el,i) => {
                if ((el >= min) && (el <= max)) {
                    ind.push(dataRowInd[i]);
                    val.push(dataRowVal[i]);
                }
            });

            data.push(ind);
            data.push(val);
        }

        return data;
    }


    replaceSeriesData(seriesData_to: number[][], duration?: number, transFunc?: any) {
        this.seriesData = this.getInitialData(seriesData_to);
        this.onDataReplaced.dispatch();
    }

    
    getClosestPoint(x: number): Point {
        const ind =  this.seriesData[0].reduce((prev, curr, i) => {
            const curDif = Math.abs(i - x);
            const prevDif = Math.abs(prev - x);
            if (curDif < prevDif) return i
            return prev
              }, 0);
        return new Point(ind, this.seriesData[1][ind])
    }

    transpose() {
        let buf = this.seriesData[0].slice();
        this.seriesData[0]= this.seriesData[1].slice();
        this.seriesData[1]=buf.slice();
    }

    updatePlotData(axisRect: Rectangle, vp: Rectangle, noAnimation?: boolean) {
        let plotData = this.generatePlotData(axisRect, vp);
        //если нужна анимация графиков
        
        if (noAnimation) {
            this.plotData = plotData;
            return this;
        }

        if (this.hasAnimation) {
            
            const fromTo = this.makeFromPointArr(this.plotData, plotData);
        
            if (fromTo.length == 0) {
                this.plotData = plotData;
                return this;
            }
        
            //this.plotData = from;
            this.сoordAnimation(fromTo[0], fromTo[1], this.animationDuration);

            return this
        }

        this.plotData = plotData;
    }


    generatePlotData(axisRect: Rectangle, vp: Rectangle): Point[] {
        let seriesData = this.seriesData;
        //let seriesData = this.getDataRange('ind', axisRect.x1, axisRect.x2);
        let plotData: Point[] = [];

        const transformer = new Transformer();

/*
        for (let i = 0; i < this.seriesData.length; i = i + 2) {
            this.seriesData[i].forEach((element, ind) => {
                const seriesPoint = new Point(this.seriesData[i][ind], this.seriesData[i + 1][ind]);
                const plotPoint = transformer.getVeiwportCoord(axisRect, vp, seriesPoint);
                plotData.push(plotPoint);
            });
        }
*/

        for (let i = 0; i < seriesData.length; i = i + 2) {
            let dataRowInd = seriesData[i];
            let dataRowVal = seriesData[i + 1];
            if (i == 2) {
                dataRowInd = dataRowInd.slice().reverse();
                dataRowVal = dataRowVal.slice().reverse();
            }
            dataRowInd.forEach((element, ind) => {
                const seriesPoint = new Point(dataRowInd[ind], dataRowVal[ind]);
                const plotPoint = transformer.getVeiwportCoord(axisRect, vp, seriesPoint);
                plotData.push(new Point(Math.round(plotPoint.x), Math.round(plotPoint.y)));
            });
        }

/*
        //если нужна анимация графиков
        if (noAnimation) {
            this.plotData = plotData;
            return this;
        }

        if (this.hasAnimation) {
            const from = this.makeFromPointArr(this.plotData, plotData);

            if (from.length == 0) {
                this.plotData = plotData;
                return this;
            }

            this.plotData = from;
            this.сoordAnimation(from, plotData, this.animationDuration);

            return this
        }

        this.plotData = plotData;
*/

        return plotData;
    }


    // Метод анимации изменение набора координат
    сoordAnimation(from: Point[], to: Point[], duration: number) {

        let start = performance.now();

        const animate = (time) => {

            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            const tek = from.map((el, i) => {
                return new Point(Math.round(from[i].x + (to[i].x - from[i].x) * timeFraction), Math.round(from[i].y + (to[i].y - from[i].y) * timeFraction) );
            });

            this.plotData = tek;

            this.onPlotDataChanged.dispatch(this.canvas, this);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            } else {
                this.plotData = to;
            }

        }

        requestAnimationFrame(animate);

    }


    makeFromPointArr(from: Point[], to: Point[]): Point[][] {
        const resultArr: Point[][] = [];

        if (from.length == 0) return resultArr;

        const fromResult: Point[] = [];
        const toResult: Point[] = [];

        const toArr = to.slice();
        const fromArr = from.slice();

    // если from < to
        if (fromArr.length < toArr.length) {

         
            const capacity = Math.floor(toArr.length/fromArr.length);
            let fromInd = 0;
            let roomCount = 0;

            while (fromInd < fromArr.length) {
                fromResult.push(fromArr[fromInd]);
                toArr.shift();
                roomCount = roomCount + 1;
                if (roomCount == capacity) {
                    fromInd = fromInd + 1;
                    roomCount = 0;
                }
            }
        
            while (toArr.length !== 0) {
                fromResult.push(fromArr[fromArr.length-1]);
                toArr.shift();
            }
        
            resultArr.push(fromResult);
            resultArr.push(to);
            
            return resultArr;
        }
    
    // если from > to
        else {

            const capacity = Math.floor(fromArr.length / toArr.length);
            let toInd = 0;
            let roomCount = 0;

            while (toInd < toArr.length) {
                toResult.push(toArr[toInd]);
                fromArr.shift();
                roomCount = roomCount + 1;
                if (roomCount == capacity) {
                    toInd = toInd + 1;
                    roomCount = 0;
                }
            }
        
            while (fromArr.length !== 0) {
                toResult.push(toArr[toArr.length-1]);
                fromArr.shift();
            }
        
            resultArr.push(from);
            resultArr.push(toResult);
            
            return resultArr;

        }

    
    /*

to.forEach((toPoint) => {
                if (from.length !== 0) {
                    const minP = from.reduce((fromPoint, cur) => {
                        if (fromPoint.findDistX(toPoint) < cur.findDistX(toPoint)) return fromPoint
                        else {
                            return cur
                        }
                    }, from[0])
                    resultArr.push(minP);
                }
            });

    */


    }


}

  
  