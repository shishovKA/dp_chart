import { Signal } from "signals"

export class Series {

    id: string;
    seriesData: number[][];
    plots: string[];
    changed: Signal;
    
    constructor(id: string, seriesData: number[][], ...plotIds: string[]) {
        this.changed = new Signal();
        this.id = id;
        this.seriesData = this.getInitialData(seriesData);
        this.plots = [];
        this.setPlotsIds(plotIds);
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


    findExtremes(): number[] {

        let xMin: number = this.seriesData[0][0];
        let xMax: number = this.seriesData[0][0];
        let yMin: number = this.seriesData[1][0];
        let yMax: number = this.seriesData[1][0];
    
        for (let ind = 0; ind < this.seriesData[0].length; ind++ ) {
            if (this.seriesData[0][ind] < xMin) xMin = this.seriesData[0][ind];
            if (this.seriesData[0][ind] > xMax) xMax = this.seriesData[0][ind];
            if (this.seriesData[1][ind] < yMin) yMin = this.seriesData[1][ind];
            if (this.seriesData[1][ind] > yMax) yMax = this.seriesData[1][ind];
        }
        
        return [xMin,xMax,yMin,yMax];
    }


    getDataRange(xMin:number, xMax:number, yMin:number, yMax:number): number[][] {
        const ind: number[] = [];
        const val: number[] = [];
        this.seriesData[0].forEach((el,i) => {
            if ((this.seriesData[0][i] >= xMin) 
            && (this.seriesData[0][i] <= xMax)
            && (this.seriesData[1][i] >= yMin)
            && (this.seriesData[1][i] <= yMax)) {
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
    


    setPlotsIds(plotIds: string[]) {
        this.plots.splice(0,this.plots.length);
        plotIds.forEach( (plotId) => 
            this.plots.push(plotId)
        )       
    }

}


/*




    transpose() {
        //Метод транспонирует данные серии
        //предварительный вариант реализации, возможно придется перезаписывать значения вручную, а не менять ссылки
        let buf = this.seriesData[0];
        this.seriesData[0]= this.seriesData[1];
        this.seriesData[1]=buf;
    }

    */

  
  