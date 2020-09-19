class Data {

    storage: Series[];
    
    constructor() {
        this.storage = [];
    }

    addSeries(id: string, seriesData: number[][], ...plotIds: string[]) {
        this.storage.push(new Series(id, seriesData, ...plotIds));   
    }

    removeSeries(id: string) {
        //удаляем серию из массива Storage по id  
    }

    findExtremes(type: string, from: number, to: number): number[] {
        let max: number = 0;
        let min: number;
        //поиск экстремумов на заданном интервале для всех series которые хранятся в Storage
        return [min,max];
    }

  }