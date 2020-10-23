import { Signal } from "signals"
import { Canvas } from "./Canvas";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Transformer } from "./Transformer";

export class Series {

    id: string;
    seriesData: number[][];
    plotData: Point[][];
    plots: string[];
    hasAnimation: boolean = false;
    animationDuration: number = 300;
    canvas: Canvas;
    extremes: number[];

    onPlotDataChanged: Signal;
    
    constructor(id: string, container: HTMLElement, ...seriesData: number[][]) {
        this.onPlotDataChanged = new Signal();
        this.id = id;
        this.seriesData = this.getInitialData(seriesData);
        this.extremes = this.findExtremes();

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
        if (!data) seriesData = this.seriesData.slice();

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
        const extremes = this.extremes;
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

            let dataRowInd = this.seriesData[i].slice();
            let dataRowVal = this.seriesData[i + 1].slice();
            if (i == 2) {
                dataRowInd = dataRowInd.slice();
                dataRowVal = dataRowVal.slice();
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


    replaceSeriesData(seriesData_to: number[][]) {
        this.seriesData = this.getInitialData(seriesData_to);
        this.extremes = this.findExtremes();
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

    getClosestPlotPoint(x: number): Point {
        const coord =  this.plotDataArr.reduce((prev, curr, i) => {
            const curDif = Math.abs(curr.x - x);
            const prevDif = Math.abs(prev.x - x);
            if (curDif < prevDif) return curr
            return prev
              }, this.plotDataArr[0]);
        return new Point(coord.x, coord.y);
    }

    get plotDataArr(): Point[] {

        const lineArr: Point[] = [];

        for (let i = 0; i < this.plotData.length; i++) {
            let plotRow = this.plotData[i];
            if (i == 1) {
                plotRow = plotRow.slice().reverse();
            }
            plotRow.forEach((element) => {
                lineArr.push(element);
            });
        }

        return lineArr;
    }

    updatePlotData(axisRect: Rectangle, vp: Rectangle, noAnimation?: boolean) {
        const plotData = this.generatePlotData(axisRect, vp);
        //если нужна анимация графиков
     
        if (noAnimation) {
            this.plotData = plotData;
            this.onPlotDataChanged.dispatch(this);
            return this;
        }
        

        if (this.hasAnimation) {

            const fromData: Point[][] = []
            const toData: Point[][] = []

            for (let i = 0; i < this.plotData.length; i++) {
                let plotRow = this.plotData[i];
                let fromTo = this.makeFromPointArr(plotRow.slice(), plotData[i].slice());
                fromData.push(fromTo[0]);
                toData.push(fromTo[1]);
            }
        
            this.сoordAnimation(fromData, toData, this.animationDuration);

        }

        this.plotData = plotData;
        this.onPlotDataChanged.dispatch(this);
        return this;
    }


    generatePlotData(axisRect: Rectangle, vp: Rectangle): Point[][] {

        const seriesData = this.getDataRange('ind', axisRect.x1, axisRect.x2)
       // const seriesData = this.seriesData.slice();

        let plotData: Point[][] = [];

        const transformer = new Transformer();

        for (let i = 0; i < seriesData.length; i = i + 2) {

            let plotDataRow: Point[] = []

            let dataRowInd = seriesData[i];
            let dataRowVal = seriesData[i + 1];

            dataRowInd.forEach((element, ind) => {
                const seriesPoint = new Point(dataRowInd[ind], dataRowVal[ind]);
                const plotPoint = transformer.getVeiwportCoord(axisRect, vp, seriesPoint);
                plotDataRow.push(new Point(Math.round(plotPoint.x), Math.round(plotPoint.y)));
            });

            plotData.push(plotDataRow);

        }

        return plotData;
 
    }


    // Метод анимации изменение набора координат
    сoordAnimation(fromData: Point[][], toData:Point[][], duration: number) {

        let start = performance.now();

        const animate = (time) => {

            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let tekData: Point[][] = [];

            fromData.forEach((fromRow, ind)=> {
                const tekRow = fromRow.map((el, i) => {
                    return new Point(Math.round(fromRow[i].x + (toData[ind][i].x - fromRow[i].x) * timeFraction), Math.round(fromRow[i].y + (toData[ind][i].y - fromRow[i].y) * timeFraction) );
                });
                tekData.push(tekRow);
            })

            
            this.plotData = tekData;

            this.onPlotDataChanged.dispatch(this);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            } else {
                this.plotData = toData;
                this.onPlotDataChanged.dispatch(this);
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


    }

    

/*

    transpose() {
        let buf = this.seriesData[0].slice();
        this.seriesData[0]= this.seriesData[1].slice();
        this.seriesData[1]=buf.slice();
    }


    makeFromPointArr1(from: Point[], to: Point[]): Point[][] {
        const resultArr: Point[][] = [];

        if (from.length == 0) return resultArr;
        if (to.length == 0) return resultArr;

        const fromResult: Point[] = [];
        const toResult: Point[] = [];

        const toArr = to.slice();
        const fromArr = from.slice();

    // если from < to
        if (fromArr.length < toArr.length) {
     
            toArr.forEach((toPoint) => {
                const minP = fromArr.reduce((cur, fromPoint) => {
                    if (fromPoint.findDistX(toPoint) < cur.findDistX(toPoint)) return fromPoint
                    else {
                        return cur
                    }
                }, fromArr[0]);
                fromResult.push(minP);
            });
        
            resultArr.push(fromResult.slice());
            resultArr.push(toArr.slice());
            
            return resultArr;
        }
    
    // если from > to
        else {

            fromArr.forEach((fromPoint) => {

                const minP = toArr.reduce((cur, toPoint) => {
                    if (toPoint.findDistX(fromPoint) < cur.findDistX(fromPoint)) return toPoint
                    else {
                        return cur
                    }
                }, toArr[0]);


                toResult.push(minP);

            });
        
            resultArr.push(fromArr.slice());
            resultArr.push(toResult.slice());
            
            return resultArr;

        }

    }


    makeFromPointArr2(from: Point[], to: Point[]): Point[][] {
        const resultArr: Point[][] = [];

        if (from.length == 0) return resultArr;
        if (to.length == 0) return resultArr;

        const fromResult: Point[] = [];
        const toResult: Point[] = [];

        const toArr = to.slice();
        const fromArr = from.slice();

    // если from < to
        if (fromArr.length < toArr.length) {

            for (let i = 0; i < fromArr.length-1; i++) {
                //const xLim = 

            }


        }
    
    // если from > to
        else {

            fromArr.forEach((fromPoint) => {

                const minP = toArr.reduce((cur, toPoint) => {
                    if (toPoint.findDistX(fromPoint) < cur.findDistX(fromPoint)) return toPoint
                    else {
                        return cur
                    }
                }, toArr[0]);


                toResult.push(minP);

            });
        
            resultArr.push(fromArr.slice());
            resultArr.push(toResult.slice());
            
            return resultArr;

        }

    }
*/


}

  
  