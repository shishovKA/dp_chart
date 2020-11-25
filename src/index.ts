// @ts-ignore
import WebFont from 'webfontloader';

import { customLoadDataFromCsv, csvToCols } from "./scripts/helpers"
import { Chart } from "./classes/Chart"

// выбираем config
import { prepareData, createChart, reorganizeChart } from "./configs/square-chart"

//подгрузка CSV файла
const sqrData = require('./data/cbhVulnerability_test.csv');


//объявляем переменные
let chart: Chart;
const chartContainer = document.getElementById('indexChart');
const fonts = ['Transcript Pro'];


// проверка подгрузки шрифта
const WebFont = require('webfontloader')

WebFont.load({
  custom: {
    families: fonts,
  },

  active: function () {

    customLoadDataFromCsv(sqrData).then((data) => {
      // @ts-ignore
      let chartData = csvToCols(data);
      //разбираем CSV по рядам
      chartData = prepareData(chartData);
      //создаем chart
      chart = createChart(chartContainer, [...chartData]);
    })
      .catch((err) => {
        console.log(err);
      })
  },
});

// элементы управления
const randBtn = document.getElementById('rand_btn');
//@ts-ignore
randBtn.addEventListener('click', () => {
  reorganizeChart(chart);
})




