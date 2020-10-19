

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


let serie5star = cbh5,
	serie1star = cbh1,
    area5starTop = [],
    area5starBottom = [],
    area1starTop = [],
    area1starBottom = [];

for (let i = 0, l = cbh5.length; i < l; i++) {
    let item5star = serie5star[i],
        item1star = serie1star[i];

    area5starTop.push(item5star > 0 ? Math.max(item5star, item1star, 0) : Math.max(item5star, 0));
    area5starBottom.push(item5star > 0 ? (item1star > 0 ? item1star : 0) : item5star);

    area1starTop.push(item1star > 0 ? item1star : item5star > 0 ? 0 : item5star);
    area1starBottom.push(Math.min(item5star, item1star, 0));
}


export { cbh1, cbh5, xLabels, zeroSeries, calculateDeviations}