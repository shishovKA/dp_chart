// browserify ./src/index.ts -p [ tsify --noImplicitAny ] > chartBlib.js

// @ts-ignore

// @ts-ignore
import WebFont from 'webfontloader';

// helpers
import { customLoadDataFromCsv, csvToCols } from "./scripts/helpers"


// config cbh-indicies
import {chart as chartIND} from "./configs/indices-chart";
import { prepareDataforCbh } from "./configs/indices-chart";
import { createChart as createChart_ind } from "./configs/indices-chart";

// config square-chart
import {chart as chartSQR} from "./configs/square-chart"
import { createChart as createChartSQR } from "./configs/square-chart"
import { prepareData } from "./configs/square-chart"

//подгрузка CSV файла
const sqrData = require('./data/cbhVulnerability_test.csv');

const startCSVurl = './src/data/cbhPlotData_EU.csv';

//объявляем используемые переменные
//let chart: Chart;


// проверка подгрузки шрифта
WebFont.load({
  custom: {
    families: ['Transcript Pro']
  },

  active: function () {

    //загружает стартовый файл
    customLoadDataFromCsv(startCSVurl).then((data) => {

      const chartContainer = document.getElementById('indexChart_0');
      // @ts-ignore
      let chartData = csvToCols(data);
      let cbh1 = chartData[2].slice(1).map((el) => { return +el });
      let cbh5 = chartData[1].slice(1).map((el) => { return +el });
      let xLabels = chartData[0].slice(1).map((el) => { return new Date(el) });
      let zeroSeries = cbh1.map(() => 0);

      //setLastUpdateDate(xLabels[xLabels.length - 1]);
      createChart_ind(chartContainer, [xLabels, cbh5, cbh1, zeroSeries]);
      //chart.tooltipsDataIndexUpdated.add(conncetRedWidget);
      //chart.tooltipsDataIndexUpdated.add(conncetBlueWidget);
      chartIND.tooltipsDraw(true);
    })
      .catch((err) => {
        console.log(err);
      })



    customLoadDataFromCsv(sqrData).then((data) => {
      const chartContainer = document.getElementById('indexChart_2');
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

