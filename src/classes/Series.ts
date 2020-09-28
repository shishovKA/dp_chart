import { Signal } from "signals"

export class Series {

    id: string;
    seriesData: number[][];
    plots: string[];
    tooltips: string[];
    changed: Signal;
    
    constructor(id: string, seriesData: number[][], plotIds: string[], tooltipsIds?: string[]) {
        this.changed = new Signal();
        this.id = id;
        this.seriesData = this.getInitialData(seriesData);
        this.plots = [];
        this.setPlotsIds(plotIds);
        this.tooltips = [];
        this.setTooltipsIds(tooltipsIds);
    }


    getInitialData(initialData: number[][]): number[][] {
        let resultData: number[][] = []
        switch(initialData.length) {
            case 1:
                const ind: number[] = [];
                const val: number[] = [];     
                initialData[0].forEach((element, index) => {
                    ind.push(index);
                    val.push(element);
                });
                resultData = [ind, val];
            break;

            case 2:
                resultData = initialData;
            break;
        }
        return resultData;
    }


    setPlotsIds(plotIds: string[] ) {
        this.plots = plotIds;       
    }

    setTooltipsIds(tooltipsIds: string[] | undefined) {
        if (tooltipsIds) this.tooltips = tooltipsIds;      
    }


    findExtremes(data?:number[][]): number[] {

        let seriesData:number[][] = [[],[]];

        if (data) seriesData = data;
        if (!data) seriesData = this.seriesData;

        let xMin: number = seriesData[0][0];
        let xMax: number = seriesData[0][0];
        let yMin: number = seriesData[1][0];
        let yMax: number = seriesData[1][0];
    
        for (let ind = 0; ind < seriesData[0].length; ind++ ) {
            if (seriesData[0][ind] < xMin) xMin = seriesData[0][ind];
            if (seriesData[0][ind] > xMax) xMax = seriesData[0][ind];
            if (seriesData[1][ind] < yMin) yMin = seriesData[1][ind];
            if (seriesData[1][ind] > yMax) yMax = seriesData[1][ind];
        }
        
        return [xMin,xMax,yMin,yMax];
    }


    getDataRange(type:string, min:number, max:number): number[][] {
        const ind: number[] = [];
        const val: number[] = [];
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

        this.seriesData[0].forEach((el,i) => {
            if ((this.seriesData[arrInd][i] >= min) && (this.seriesData[arrInd][i] <= max)) {
                ind.push(this.seriesData[0][i]);
                val.push(this.seriesData[1][i]);
            }
        });
        return [ind, val];
    }


    replaceSeriesData(seriesData_to: number[][], duration?: number, transFunc?: any) {
        
        if (duration) {
            this.seriesAnimation(this.seriesData, this.getInitialData(seriesData_to), duration)
        } else {
            this.seriesData = this.getInitialData(seriesData_to);
            this.changed.dispatch();
        }
 
    }

    seriesAnimation(from: number[][], to: number[][], duration: number) {
        
        let start = performance.now();

        const animate = (time) => {

            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;
            // вычисление текущего состояния анимации
        
            from[0].forEach((el,ind) => {
                this.seriesData[0][ind] = from[0][ind] + (to[0][ind] - from[0][ind])*timeFraction;
                this.seriesData[1][ind] = from[1][ind] + (to[1][ind] - from[1][ind])*timeFraction;
            })

            this.changed.dispatch(); // отрисовать её
            // return if the desired time hasn't elapsed
            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }

        }

        requestAnimationFrame(animate);

    }

    getClosestData(x: number): number[] {
        const ind =  this.seriesData[0].reduce((prev, curr, i) => {
            const curDif = Math.abs(i - x);
            const prevDif = Math.abs(prev - x);
            if (curDif < prevDif) return i
            return prev
              }, 0);
        return [ind, this.seriesData[1][ind], ]
    }

    transpose() {
        let buf = this.seriesData[0].slice();
        this.seriesData[0]= this.seriesData[1].slice();
        this.seriesData[1]=buf.slice();
    }


  //метод определяет ход изменения точек графиков
  /*
    createTransitData(from: number[][], to: number[][]):number[][] {

        let transitData: number[][] = [[],[]];

        //соеднинение графиков из большего числа точек а меньшее
        if (from[0].length >= to[0].length) {
        const maxPair =  Math.floor(from[0].length/to[0].length);
        let pairCounter = 0;
        let j = 0;
        
        from[0].forEach((el,index) => {
            pairCounter = pairCounter+1;
            if (pairCounter > maxPair) {
            pairCounter = 1;
            j = j+1;
            if (j >= to[0].length) { j = to[0].length-1 }
            }
            transitData[0].push(to[0][j]);
            transitData[1].push(to[1][j]);
        });

        return transitData;
        }
        
        //соеднинение графиков из меньшего числа точек а большее
        if (from[0].length < to[0].length) {
        const maxPair =  Math.floor(to[0].length/from[0].length);
        let pairCounter = 0;
        let j = 0;
        
        to[0].forEach((el,index) => {
            pairCounter = pairCounter+1;
            if (pairCounter > maxPair) {
            pairCounter = 1;
            j = j+1;
            if (j >= from[0].length) { j = from[0].length-1 }
            }
            transitData[0].push(from[0][j]);
            transitData[1].push(from[0][j]);
        });

        return transitData;
        }
        
    }
    */
    

}


/*






    */

  
  