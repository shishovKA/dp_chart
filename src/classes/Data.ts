import { Series } from "./Series";

export class Data {

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
        let min: number = 0;
        //поиск экстремумов на заданном интервале для всех series которые хранятся в Storage
        return [min,max];
    }

    findSeriesById(id: string):Series | null {
        const series: Series[] = this.storage.filter((series) => {
            return series.id === id
        });
        if (series.length !== 0) return series[0];
        return null;
    }

  }