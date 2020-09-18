
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

}

/*

    setPlotsIds(plotIds: string[]) {
        
        this.plots.splice(0,this.plots.length);
        
        
        plotIds.forEach( (plotId) => 
            this.plots.push(plotId)
        )
            
    }

    
    getDataRange(xMin:number, xMax:number, yMin:number, yMax:number): number[][] {
        let seriesDataRange: number[][]
        //Метод формирует и выдает усеченный массив seriesData, по заданным интервалам
        return seriesDataRange;
    }



    replaceSeriesData(seriesData_to: number[], duration?: number, transFunc?: any) {
        //запуск анимации по изменению seriesData
        //TODO: решить проблемы с типом функции
    }



    transpose() {
        //Метод транспонирует данные серии
        //предварительный вариант реализации, возможно придется перезаписывать значения вручную, а не менять ссылки
        let buf = this.seriesData[0];
        this.seriesData[0]= this.seriesData[1];
        this.seriesData[1]=buf;
    }

    */

  
  