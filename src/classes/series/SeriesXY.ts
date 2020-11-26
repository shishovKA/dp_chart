import { Series } from "../Series";
import { SeriesBase } from "./SeriesBase";

export class SeriesXY extends SeriesBase implements Series {

    getInitialData(initialData: number[][]): number[][] {
        let resultData: number[][] = []

        const x: number[] = [];
        const y: number[] = [];

        initialData[0].forEach((element, index) => {
            x.push(element);
            y.push(initialData[1][index]);
        });

        resultData.push(x);
        resultData.push(y);

        return resultData;
    }

}


