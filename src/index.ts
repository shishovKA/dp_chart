// browserify ./src/index.ts -p [ tsify --noImplicitAny ] > chart-bundle.js

// @ts-ignore

// @ts-ignore
import WebFont from 'webfontloader';

// helpers
import { customLoadDataFromCsv, csvToCols } from "./scripts/helpers"

// config cbh-indicies-black
import { createChart as createChart_ind_black } from "./configs/indices-chart-black";

// config cbh-indicies-colored
import { createChart as createChart_ind_colored } from "./configs/indices-chart-colored";

// config cbh-indicies
import { createChart as createChart_ind } from "./configs/indices-chart";

// config square-chart
import { createChart as createChartSQR } from "./configs/square-chart"
import { prepareData } from "./configs/square-chart"

// config indicies-article1
import { createChart as createChart_article } from "./configs/indices-article";

//пути до CSV файлов
const sqrData = './src/data/cbhVulnerability_test.csv';
const EU = './src/data/cbhPlotData_EU.csv';
const EU_Labels = './src/data/cbhPlotData_EU_labeled.csv';
const startCSVurl = './src/data/cbhPlotData_US.csv';
const article1 = './src/data/article1.csv';
const article1_labels = './src/data/article1_labels.csv';


// проверка подгрузки шрифта
WebFont.load({
  custom: {
    families: ['Transcript Pro']
  },

  active: function () {

    // график по серии Article1
    customLoadDataFromCsv(article1).then((data) => {
      customLoadDataFromCsv(article1_labels).then((dataLables) => {
      const chartContainer = document.getElementById('indexChart_4');
      // @ts-ignore
      let chartData = csvToCols(data);
      let cbh1 = chartData[2].slice(1).map((el) => { return +el }).reverse();
      let cbh5 = chartData[1].slice(1).map((el) => { return +el }).reverse();
      let xLabels = chartData[0].slice(1).map((el) => { return new Date(el) }).reverse();
      let zeroSeries = cbh1.map(() => 0);

      // @ts-ignore
      let chartLables = csvToCols(dataLables);
      let x = chartLables[0].slice(1).map((el) => { return +el });
      let y = chartLables[1].slice(1).map((el) => { return +el });
      let texts = chartLables[2].slice(1).map((el) => { return el });

      

      // вызов функции создания графика из конфига .src/configs/indices-chart-colored.ts
      createChart_article(chartContainer, [xLabels, cbh5, cbh1, zeroSeries, [x,y], texts]);

      })
    })
      .catch((err) => {
        console.log(err);
      })

    // черно-белый график
    customLoadDataFromCsv(EU).then((data) => { //загружаем первый CSV с данными для серии

      customLoadDataFromCsv(EU_Labels).then((dataLables) => { // загружаем второй CSV с данными для серии с подписями
        const chartContainer = document.getElementById('indexChart_0');
        // @ts-ignore
        let chartData = csvToCols(data);
        let cbh = chartData[1].slice(1).map((el) => { return +el });
        let xLabels = chartData[0].slice(1).map((el) => { return new Date(el) });
        let zeroSeries = cbh.map(() => 0);

        // @ts-ignore
        let chartLables = csvToCols(dataLables);
        let x = chartLables[0].slice(1).map((el) => { return +el });
        let y = chartLables[1].slice(1).map((el) => { return +el });
        let texts = chartLables[2].slice(1).map((el) => { return el });

        createChart_ind_black(chartContainer, [xLabels, cbh, zeroSeries, [x, y], texts]); //кастомная функция создания и настройки объекта Chart

      })
    })
      .catch((err) => {
        console.log(err);
      });


    // цветной график CBH-indices-colored
    customLoadDataFromCsv(startCSVurl).then((data) => {
      const chartContainer = document.getElementById('indexChart_1');
      // @ts-ignore
      let chartData = csvToCols(data);
      let cbh1 = chartData[2].slice(1).map((el) => { return +el });
      let cbh5 = chartData[1].slice(1).map((el) => { return +el });
      let xLabels = chartData[0].slice(1).map((el) => { return new Date(el) });
      let zeroSeries = cbh1.map(() => 0);

      // вызов функции создания графика из конфига .src/configs/indices-chart-colored.ts
      createChart_ind_colored(chartContainer, [xLabels, cbh5, cbh1, zeroSeries]);

    })
      .catch((err) => {
        console.log(err);
      })


    // старый график CBH-indices
    customLoadDataFromCsv(startCSVurl).then((data) => {
      const chartContainer = document.getElementById('indexChart_2');
      // @ts-ignore
      let chartData = csvToCols(data);
      let cbh1 = chartData[2].slice(1).map((el) => { return +el });
      let cbh5 = chartData[1].slice(1).map((el) => { return +el });
      let xLabels = chartData[0].slice(1).map((el) => { return new Date(el) });
      let zeroSeries = cbh1.map(() => 0);

      createChart_ind(chartContainer, [xLabels, cbh5, cbh1, zeroSeries]);

    })
      .catch((err) => {
        console.log(err);
      })


    // квадратный график
    customLoadDataFromCsv(sqrData).then((data) => {
      const chartContainer = document.getElementById('indexChart_3');
      // @ts-ignore
      let chartData = csvToCols(data);
      //разбираем CSV по рядам
      chartData = prepareData(chartData);
      //создаем chart
      createChartSQR(chartContainer, [...chartData]);
    })
      .catch((err) => {
        console.log(err);
      })


  },
});

