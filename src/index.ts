import WebFont from 'webfontloader';

// импорт стилей
import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/fonts.css";

//импорт класса Chart

//элементы управления

import  bezier  from "bezier-easing"
const easing = bezier(0.65, 0, 0.35, 1);

import { Chart } from "dp-chart-lib"

const path = require('path');
const usCsv = require('./data/cbhPlotData_US.csv');
const euCsv = require('./data/cbhPlotData_EU.csv');

console.log(usCsv);
console.log(euCsv);

const gapY: number = 0.08;

// импорт стилей
import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/fonts.css";


//объявляем данные
let chart: Chart;

let cbh1: number[] = [];
let cbh5: number[] = [];
let xLabels: Date[] = [];
let zeroSeries: number[] = [];

// загрузка из CSV
function loadDataFromCsv(filePath: string) {
  return new Promise(function (resolve, reject) {
    //console.log(path.resolve('https://raw.githubusercontent.com/shishovKA/dp_chart/gh-pages/', filePath))
    csv(filePath)
      .then((data) => {
        let cbh1: number[] = [];
        let cbh5: number[] = [];
        let xLabels: string[] = [];
        let zeroSeries: number[] = [];

        data.forEach((element, index) => {
          if (element.cbhIdx1) cbh1.push(+element.cbhIdx1);
          if (element.cbhIdx5) cbh5.push(+element.cbhIdx5);
          if (element.t) xLabels.push(new Date(element.t));

        });

        zeroSeries = cbh1.map(() => {
          return 0;
        })

        resolve({cbh1, cbh5, xLabels, zeroSeries});

      })
      .catch((error) => {
        reject(new Error("Can't Load CSV"));
      })

  });

}



// рукописная загрузка из CSV
function customLoadDataFromCsv(filePath: string) {

return fetch(filePath).then((response) => {
    var contentType = response.headers.get("content-type");
    if(contentType && (contentType.includes("text/csv") || contentType.includes("application/octet-stream"))) {
      return response.ok ? response.text() : Promise.reject(response.status);
    }
    throw new TypeError("Oops, we haven't got CSV!");
  })
}

// csv to array
function csvToCols(strData, strDelimiter) {
	strDelimiter = strDelimiter || ",";
	let rowData = strData.split("\n");

	let colResult = [];
	for (let i = rowData[0].split(strDelimiter).length - 1; i >= 0; i--) colResult.push([]);
	for (let i = 0, l = rowData.length; i < l; i++) {
		if (rowData[i].length) {
			let row = rowData[i].split(strDelimiter);
			for (let j = row.length - 1; j >= 0; j--) colResult[j].push(row[j]);
		}
  }
	return colResult;
}


// проверка подгрузки шрифта
WebFont.load({
  custom: {
    families: ['Transcript Pro'],
    urls: ['./styles/fonts.css']
  },

  active: function () {

    /*
    loadDataFromCsv(usCsv)
      .then((dataObj)=>{

        cbh1 = dataObj.cbh1;
        cbh5 = dataObj.cbh5;
        xLabels = dataObj.xLabels;
        zeroSeries = dataObj.zeroSeries;

        chart = CbhChart(cbh1, cbh5, xLabels, zeroSeries);
        chart.tooltipsDataIndexUpdated.add(conncetIndexWidget);
        chart.tooltipsDataIndexUpdated.add(conncetRedWidget);
        chart.tooltipsDataIndexUpdated.add(conncetBlueWidget);
        chart.tooltipsDraw(true);

      })
*/
    customLoadDataFromCsv(euCsv).then((data) => {
      let chartData = csvToCols(data);
      //console.log('chartData',chartData);

      cbh1 = chartData[2].slice(1).map((el) => { return +el });
      cbh5 = chartData[1].slice(1).map((el) => { return +el });
      xLabels = chartData[0].slice(1).map((el) => { return new Date(el) });
      zeroSeries = cbh1.map(() => 0);
      console.log('cbh1', cbh1);

      chart = CbhChart(cbh1, cbh5, xLabels, zeroSeries);
      chart.tooltipsDataIndexUpdated.add(conncetIndexWidget);
      chart.tooltipsDataIndexUpdated.add(conncetRedWidget);
      chart.tooltipsDataIndexUpdated.add(conncetBlueWidget);
      chart.tooltipsDraw(true);

      //const max = zeroSeries.length - 1;
      //const min = 0;
      //reorganizeChart(cbh5, cbh1, min, max);
    })
      .catch((err) => {
        console.log(err);
      })

      
  },

});


//настройка виджетов для отображения данных Тултипов
const indexWidget = document.getElementById('chart_w_ind');

function conncetIndexWidget(index: number) {
  if (indexWidget) indexWidget.textContent = index.toString();
}

const redWidget = document.getElementById('chart_w_data_red');

function conncetRedWidget(index: number) {
  if (redWidget) redWidget.textContent = cbh1[index].toFixed(1);
}

const blueWidget = document.getElementById('chart_w_data_blue');

function conncetBlueWidget(index: number) {
  if (blueWidget) blueWidget.textContent = cbh5[index].toFixed(1);
}


//настройка кнопок для управлением диапазоном оси дат

//последняя дата


//кнопка 6M
const SixMBtn = document.getElementById('6M');

SixMBtn.addEventListener("click", (event) => {
    const lastLb = xLabels[xLabels.length-1];
    const maxDate = lastLb;
    const minDate = new Date (new Date (maxDate.getTime()).setMonth(maxDate.getMonth() - 6));
    const max = xLabels.length-1;
    const min = findDateInd(minDate);
    reorganizeChart(cbh5, cbh1, min, max);
  })

//кнопка 1Y
const OneYBtn = document.getElementById('1Y');

OneYBtn.addEventListener("click", (event) => {
    const lastLb: Date = xLabels[xLabels.length-1];
    const maxDate: Date = lastLb;
    const minDate = new Date (new Date (maxDate.getTime()).setFullYear(maxDate.getFullYear() - 1));
    const max = xLabels.length-1;
    const min = findDateInd(minDate);
    reorganizeChart(cbh5, cbh1, min, max);
  })

//кнопка 2Y
const TwoYBtn = document.getElementById('2Y');

TwoYBtn.addEventListener("click", (event) => {
  const lastLb = xLabels[xLabels.length-1];
  const maxDate = lastLb;
  const minDate = new Date (new Date (maxDate.getTime()).setFullYear(maxDate.getFullYear() - 2));
  const max = xLabels.length - 1;
  const min = findDateInd(minDate);
  reorganizeChart(cbh5, cbh1, min, max);
})

//кнопка Max
const MaxBtn = document.getElementById('MAX');

MaxBtn.addEventListener("click", (event) => {
  const max = xLabels.length - 1;
  const min = 0;
  reorganizeChart(cbh5, cbh1, min, max);
});


//Кнока EU
const euBtn = document.getElementById('EU');

if (euBtn) {
  euBtn.addEventListener("click", (event) => {
    
    /*
    loadDataFromCsv(euCsv)
      .then((dataObj) => {
        cbh1 = dataObj.cbh1;
        cbh5 = dataObj.cbh5;
        xLabels = dataObj.xLabels;
        zeroSeries = dataObj.zeroSeries;

        const max = xLabels.length - 1;
        const min = 0;

        reorganizeChart(cbh5, cbh1, min, max);
      })
    */

     customLoadDataFromCsv(euCsv).then((data) => {
      let chartData = csvToCols(data);
      //console.log('chartData',chartData);
    
      cbh1 = chartData[2].slice(1).map((el) => {return +el});
      cbh5 = chartData[1].slice(1).map((el) => {return +el});
      xLabels = chartData[0].slice(1).map((el) => {return new Date(el)});
      zeroSeries = cbh1.map(() => 0 );
    
      console.log('cbh1',cbh1);
    
      const max = zeroSeries.length - 1;
      const min = 0;
      reorganizeChart(cbh5, cbh1, min, max);
    })

  });
}

//Кнока US
const usBtn = document.getElementById('US');

if (usBtn) {
  usBtn.addEventListener("click", (event) => {
    customLoadDataFromCsv(usCsv).then((data) => {
      let chartData = csvToCols(data);
      //console.log('chartData',chartData);
    
      cbh1 = chartData[2].slice(1).map((el) => {return +el});
      cbh5 = chartData[1].slice(1).map((el) => {return +el});
      xLabels = chartData[0].slice(1).map((el) => {return new Date(el)});
      zeroSeries = cbh1.map(() => 0 );
    
      console.log('cbh1',cbh1);
    
      const max = zeroSeries.length - 1;
      const min = 0;
      reorganizeChart(cbh5, cbh1, min, max);
    })
  });
}

// подготавливаем данные как на сайте CyberHedge
function reorganizeChart(cbh5, cbh1, min, max) {
  let data = prepareDataforCbh(cbh5, cbh1, min);
  let {
    serie5star,
    area5starTop,
    area5starBottom,
    serie1star,
    area1starTop,
    area1starBottom
  } = data;

  chart.data.findSeriesById('cyberHedge5_area')?.replaceSeriesData([area5starTop, area5starBottom]);
  chart.data.findSeriesById('cyberHedge1_area')?.replaceSeriesData([area1starTop, area1starBottom]);
  chart.data.findSeriesById('cyberHedge5_line')?.replaceSeriesData([serie5star]);
  chart.data.findSeriesById('cyberHedge1_line')?.replaceSeriesData([serie1star]);
  chart.xAxis.ticks.setCustomLabels(xLabels);
  chart.data.findSeriesById('zero_line')?.replaceSeriesData([zeroSeries]);

  chart.xAxis.setMinMax([min,max], false);

  const MinMaxY = chart.data.findExtremes('ind', min, max);
  const lengthY = Math.abs(MinMaxY[0] - MinMaxY[1]);
  chart.yAxis.setMinMax([MinMaxY[0]-gapY*lengthY, MinMaxY[1]+gapY*lengthY], true);
}


//вспомогательные функции для работы

function findDateInd(date: Date) {
  const ind =  xLabels.reduce((prev, curr, i) => {
    const curDif = Math.abs(curr-date);
    const prevDif = Math.abs(xLabels[prev]-date);
    if (curDif < prevDif) return i
    return prev
      }, 0);
  return ind;
}


function calculateDeviations(rowData: number[], fromIndex: number) {
  let chartDataVariation = [];
  let zeroPoint = rowData[fromIndex];
  chartDataVariation = [];
  for (let j = 0, m = rowData.length; j < m; j++) {
    chartDataVariation.push(100 * (rowData[j] - zeroPoint) / zeroPoint);
  }
  return chartDataVariation;
}


function prepareDataforCbh(star5: number[], star1: number[], fromIndex: number) {
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


    let elTop5 = (item5star > 0) ? ((item5star > item1star) ? item5star : item5star) : 0
    area5starTop.push(elTop5);

    let elBot5 = (item5star > 0) ? ((item1star > 0) ? ((item1star > item5star) ? item5star : item1star) : 0) : item5star
    area5starBottom.push(elBot5);

    let elTop1 = (item1star > 0) ? item1star : ((item5star > 0) ? 0 : ((item5star < item1star) ? item1star : item5star));
    area1starTop.push(elTop1);

    let elBot1 = (item1star > 0) ? 0 : ((item5star < item1star) ? item1star : item1star);
    area1starBottom.push(elBot1);
  }
  return { serie5star, area5starTop, area5starBottom, serie1star, area1starTop, area1starBottom };
}

//функция создает и настраивает Chart как на сайте
function CbhChart(cbh1, cbh5, xLabels, zeroSeries): Chart {

  const chart = new Chart(document.getElementById('indexChart'), [0, 900], [0, 2000]);
  chart.setCanvasPaddings(25, 50, 35, 20); // задаем отступы для области отрисовки

  // ось X
  chart.xAxis.setOptions(2, '#7F7F7F');
  chart.xAxis.ticks.display = true;
  chart.xAxis.ticks.settickDrawOptions(6, 2, '#7F7F7F');
  chart.xAxis.ticks.label.setOptions('#B2B2B2', 'bottom', 11, ['11', '"Transcript Pro"']);

  // ось Y
  chart.yAxis.setOptions(2, '#B2B2B2', [1, 2]);
  chart.yAxis.display = true;
  chart.yAxis.position = 'end';
  chart.yAxis.ticks.label.setOptions('#B2B2B2', 'right', 20, ['11', '"Transcript Pro"']);

  // создаем Plots
  chart.addPlot('red_line', 'line', 1, '#FF2222', '#FF2222');
  chart.addPlot('red_area', 'area', 0, '#FFE5E5', '#FFE5E5', 0);
  chart.addPlot('blue_line', 'line', 1, '#0070FF', '#0070FF', 1);
  chart.addPlot('blue_area', 'area', 0, '#D9EAFF', '#D9EAFF', 0);
  chart.addPlot('black_line', 'line', 1, '#000000', '#000000', 1);

  // создаем Tooltipы

  // lines
  chart.findPlotById('red_line')?.addTooltip('ttId', 'line_vertical_full', 1, '#B2B2B2', [1, 2]);
  chart.findPlotById('red_line')?.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);
  chart.findPlotById('blue_line')?.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);

  // circles
  chart.findPlotById('blue_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#0070FF', 4);
  chart.findPlotById('red_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#FF2222', 4);
  chart.findPlotById('black_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', 'black', 4);

  chart.findPlotById('blue_line')?.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#0070FF', 4);
  chart.findPlotById('red_line')?.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#FF2222', 4);

  // labels
  chart.findPlotById('red_line')?.addTooltip('ttId', 'label_x_start', 0.5, 'black', '#ebebeb', 4, xLabels).label.setOptions('black', 'bottom', 11, ['11', '"Transcript Pro"']);

  // data
  chart.findPlotById('red_line')?.addTooltip('ttId', 'data_y_end', 0.5, '#FF2222', '#FF2222', 4).label.setOptions('white', 'right', 11, ['11', '"Transcript Pro"']);
  chart.findPlotById('blue_line')?.addTooltip('ttId', 'data_y_end', 0.5, '#0070FF', '#0070FF', 4).label.setOptions('white', 'right', 11, ['11', '"Transcript Pro"']);

  // delta
  chart.findPlotById('red_line')?.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions('black', 'right', 20, ['11', '"Transcript Pro"']);
  chart.findPlotById('blue_line')?.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions('black', 'right', 20, ['11', '"Transcript Pro"']);

  // подготавливаем данные как на сайте CyberHedge
  let data = prepareDataforCbh(cbh5, cbh1, 0);
  let {
      serie5star,
      area5starTop,
      area5starBottom,
      serie1star,
      area1starTop,
      area1starBottom
  } = data;

  // создаем Series
  chart.addSeries('cyberHedge5_area', area5starTop, area5starBottom).setPlotsIds('blue_area');
  chart.addSeries('cyberHedge1_area', area1starTop, area1starBottom).setPlotsIds('red_area');
  chart.addSeries('cyberHedge5_line', serie5star).setPlotsIds('blue_line');
  chart.addSeries('cyberHedge1_line', serie1star).setPlotsIds('red_line');
  chart.addSeries('zero_line', zeroSeries).setPlotsIds('black_line');

  //настраиваем параметры осей
  chart.yAxis.ticks.setOptions('niceCbhStep', [1, 5, 10, 15, 20, 25, 30]);
  chart.yAxis.ticks.label.units = '%';

  chart.xAxis.ticks.setCustomLabels(xLabels);
  chart.xAxis.ticks.setOptions('customDateTicks', ['half month', 'year', 'half year', 'third year', 'quarter year']);
  chart.xAxis.display = true;

  // настраиваем Min Max осей
  chart.xAxis.setMinMax(chart.data.findExtremes('val'), true); //по экстремумам оси X
  chart.yAxis.setMinMax(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max), true); //scale to fit по Y
  chart.yAxis.setMinMax([chart.yAxis.min-gapY*chart.yAxis.length, chart.yAxis.max+gapY*chart.yAxis.length], true); //добавляем по отступам как на сайте

  //включаем анимацию
  chart.xAxis.ticks.switchAnimation(true, 300);
  chart.yAxis.ticks.switchAnimation(true, 300);
  chart.switchDataAnimation(true, 300);
  chart.data.changeAllSeriesAnimationTimeFunction(easing);

  return chart;

}

// подключение слушателей к разметке как на cbh
prepareCsvLoadMenu();

//функция вешает слушатели на панель nav - USA / EU
function prepareCsvLoadMenu() {
  let zoneItems = document.querySelectorAll('.index .zones li');
  zoneItems.forEach( (item) => {
    item.addEventListener('click',  () => {
      let link = item.querySelector('a');
      document.querySelector('.index .zones li.selected').classList.remove('selected');
      //document.querySelector('.index .ranges li.selected').classList.remove('selected');
      //document.querySelector('.index .ranges li:last-child').classList.add('selected');
      item.classList.add('selected');
      
      loadDataFromCsv(link.href)
      .then((dataObj) => {
        cbh1 = dataObj.cbh1;
        cbh5 = dataObj.cbh5;
        xLabels = dataObj.xLabels;
        zeroSeries = dataObj.zeroSeries;
        const max = xLabels.length - 1;
        const min = 0;
        reorganizeChart(cbh5, cbh1, min, max);
      })

    });
  });
}