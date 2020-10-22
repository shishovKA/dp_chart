

// импорт данных
import { cbh1 } from "./data/cbh1"
import { cbh5 } from "./data/cbh5"
import { xLabels } from "./data/xLabels"

const zeroSeries = cbh1.map(() => {
  return 0;
})



function calculateDeviations(rowData: number[], fromIndex: number) {
    let chartDataVariation = [];
    let zeroPoint = rowData[fromIndex];

    chartDataVariation = [];

    for (let j = 0, m = rowData.length; j < m; j++) {
        chartDataVariation.push(100*(rowData[j] - zeroPoint) / zeroPoint);
    }

    return chartDataVariation;
}


function prepareDataforCbh(star5: number[], star1: number[], fromIndex:number) {
    const arrLength = star5.length;
    let serie5star = calculateDeviations(star5, fromIndex),
        serie1star = calculateDeviations(star1, fromIndex),
        area5starTop = [],
        area5starBottom = [],
        area1starTop = [],
        area1starBottom = [];

    for (let i = 0, l = arrLength; i < l; i++) {
        let item5star = serie5star[i],
            item1star = serie1star[i];

        //если красный график больше 0
        /*
        if (item1star > 0) {
            area1starTop.push(item1star);
            area1starBottom.push(0);

            area5starTop.push(0);
            area5starBottom.push(0);
        }

        if (item1star <= 0) {
            area1starTop.push(item1star);
            area1starBottom.push(item1star);

            area5starTop.push(0);
            area5starBottom.push(0);
        }
        */
        let elTop5 = (item5star > 0) ? ((item5star > item1star) ? item5star : item5star) : 0
        area5starTop.push(elTop5);

        let elBot5 = (item5star > 0) ? ((item1star > 0) ? ((item1star > item5star) ? item5star : item1star) : 0) : item5star
        area5starBottom.push(elBot5);

        let elTop1 = (item1star > 0) ? item1star : ((item5star > 0) ? 0 : ((item5star < item1star) ? item1star : item5star));
        area1starTop.push(elTop1);

        let elBot1 = (item1star > 0) ? 0 : ((item5star < item1star) ? item1star : item1star);
        area1starBottom.push(elBot1);
    }
    return {serie5star, area5starTop, area5starBottom, serie1star, area1starTop, area1starBottom};
}

export { cbh1, cbh5, xLabels, zeroSeries, prepareDataforCbh}