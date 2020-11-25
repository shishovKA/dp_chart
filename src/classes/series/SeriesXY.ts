import { Series } from "../Series";
import { SeriesBase } from "./SeriesBase";

export class SeriesXY extends SeriesBase implements Series{

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

        /*
        initialData.forEach((dataRow) => {

            //когда данные формата x,y
            if (Array.isArray(dataRow[0])) {


            } else {
                const ind: number[] = [];
                const val: number[] = [];
                dataRow.forEach((element, index) => {
                    ind.push(index);
                    val.push(element);
                });
                resultData.push(ind);
                resultData.push(val);
            }
        })
        */

        return resultData;
    }

}


