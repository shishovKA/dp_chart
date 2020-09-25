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
        const series: Series[] = this.storage.filter((series) => {
            return series.id !== id
        });
        this.storage = series.slice();   
    }

    findExtremes(type: string, from: number, to: number): number[] {
        let maxArr: number[] = [];
        let minArr: number[] = [];

        this.storage.forEach((series) => {
            const extremes = series.findExtremes(series.getDataRange(type, from, to));
            switch (type) {
                case 'ind':
                    minArr.push(extremes[2]);
                    maxArr.push(extremes[3]);
                break;
    
                case 'val':
                    minArr.push(extremes[0]);
                    maxArr.push(extremes[1]);
                break;
            }
        })

        return [Math.min(...minArr), Math.max(...maxArr)];
    }

    findSeriesById(id: string):Series | null {
        const series: Series[] = this.storage.filter((series) => {
            return series.id === id
        });
        if (series.length !== 0) return series[0];
        return null;
    }

  }