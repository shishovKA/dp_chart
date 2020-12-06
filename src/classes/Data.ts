import { Series } from "./Series";

export class Data {

    seriesStorage: Series[];
    
    constructor() {
        this.seriesStorage = [];
    }

    findExtremes(type: string, from?: number, to?: number): number[] {
        let maxArr: number[] = [];
        let minArr: number[] = [];

        
        this.seriesStorage.forEach((series) => {
            let dataRange:  number[][];
            if ((from !== undefined) && (to !== undefined)) { 
                    dataRange = series.getDataRange(type, from, to) 
                } else { dataRange = series.seriesData }

            const extremes = series.findExtremes(dataRange);
            
            switch (type) {
                case 'ind':
                    if (extremes[2] !== undefined) minArr.push(extremes[2]);
                    if (extremes[3] !== undefined) maxArr.push(extremes[3]);
                break;
    
                case 'val':
                    if (extremes[0] !== undefined) minArr.push(extremes[0]);
                    if (extremes[1] !== undefined) maxArr.push(extremes[1]);
                break;
            }
        })

        return [Math.min(...minArr), Math.max(...maxArr)];
    }

    findSeriesById(id: string):Series | null {
        const series: Series[] = this.seriesStorage.filter((series) => {
            return series.id === id
        });
        if (series.length !== 0) return series[0];
        return null;
    }

    switchAllSeriesAnimation(hasAnimation: boolean, duration?: number) {
        this.seriesStorage.forEach((series, ind) => {
            series.hasAnimation = hasAnimation;
            if (duration) series.animationDuration = duration;
        })
    }

    changeAllSeriesAnimationTimeFunction(newTimeFunc:(time: number) => number) {
        this.seriesStorage.forEach((series, ind) => {
            series.timeFunc = newTimeFunc;
        })
    }

/*
    addSeries(id: string, ...seriesData: number[][]) {
        const newSeries = new Series(id, ...seriesData);
        this.storage.push(newSeries);
        this.onSeriesAdded.dispatch();
        newSeries.onDataReplaced.add(this.onDataReplaced.dispatch);
        newSeries.onPlotDataChanged.add( this.onPlotDataAnimated.dispatch );
        return newSeries;
    }

    removeSeries(id: string) {
        const series: Series[] = this.storage.filter((series) => {
            return series.id !== id
        });
        this.storage = series.slice();   
    }

*/

  }