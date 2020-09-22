
export class Series {

    id: string;
    seriesData: number[][];
    plots: string[];
    
    constructor(id: string, seriesData: number[][], ...plotIds: string[]) {
        this.id = id;
        this.seriesData = [];

        switch(seriesData.length) {
            case 1:
                const ind: number[] = [];
                const val: number[] = [];     
                seriesData[0].forEach((element, index) => {
                    ind.push(index);
                    val.push(element);
                });
                this.seriesData = [ind, val];
            break;

            case 2:
                this.seriesData = seriesData;
            break;
        }
        
        this.plots = [];
        this.setPlotsIds(plotIds);
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
        this.seriesData = seriesData_to;
    }

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

  
  