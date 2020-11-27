import { Chart } from "../classes/Chart"
import { customLoadDataFromCsv, csvToCols } from "../scripts/helpers";

export let chart: Chart;
let cbh1: number[] = [];
let cbh5: number[] = [];
let xLabels: Date[] = [];
let zeroSeries: number[] = [];
const gapY: number = 0.08;

export function createChart(container, data) {
    // @ts-ignore
    chart = new Chart(container, [0, 900], [0, 2000]);

    [xLabels, cbh5, cbh1, zeroSeries] = [...data];

    chart.setCanvasPaddings(25, 60, 40, 20); // задаем отступы для области отрисовки

    // ось X
    chart.xAxis.setOptions('start', 1, 'black');
    chart.xAxis.ticks.display = true;
    chart.xAxis.ticks.settickDrawOptions(6, 1, 'black');
    chart.xAxis.ticks.label.setOptions(true, '#B2B2B2', 'bottom', 11, ['12', '"Transcript Pro"']);

    // ось Y
    chart.yAxis.setOptions('end', 1, '#B2B2B2', [1, 2]);
    chart.yAxis.display = true;
    chart.yAxis.position = 'end';
    chart.yAxis.ticks.label.setOptions(true, '#B2B2B2', 'right', 20, ['12', '"Transcript Pro"']);

    // создаем Plots
    chart.addPlot('red_line', 'line', 1, '#FF2222', '#FF2222');
    chart.addPlot('red_area', 'area', 0, '#FFE5E5', '#FFE5E5', 0);
    chart.addPlot('blue_line', 'line', 1, '#0070FF', '#0070FF', 1);
    chart.addPlot('blue_area', 'area', 0, '#D9EAFF', '#D9EAFF', 0);
    chart.addPlot('black_line', 'line', 1, '#000000', '#000000', 1);

    // создаем Tooltipы

    // lines
    chart.findPlotById('blue_line')?.addTooltip('ttId', 'line_vertical_full', 1, '#B2B2B2', [1, 2]);
    chart.findPlotById('red_line')?.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);
    chart.findPlotById('blue_line')?.addTooltip('ttId', 'line_horizontal_end', 1, '#B2B2B2', [1, 2]);

    // circles
    chart.findPlotById('blue_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#0070FF', 4);
    chart.findPlotById('red_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', '#FF2222', 4);
    chart.findPlotById('black_line')?.addTooltip('ttId', 'circle_series', 3, '#ffffff', 'black', 4);

    chart.findPlotById('blue_line')?.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#0070FF', 4);
    chart.findPlotById('red_line')?.addTooltip('ttId', 'circle_y_end', 3, '#ffffff', '#FF2222', 4);

    // labels
    chart.findPlotById('red_line')?.addTooltip('ttId', 'label_x_start', 0.5, 'black', '#ebebeb', 4, xLabels).label.setOptions(true, 'black', 'bottom', 14, ['12', '"Transcript Pro"']);

    // data
    chart.findPlotById('red_line')?.addTooltip('ttId', 'data_y_end', 0.5, '#FF2222', '#FF2222', 4).label.setOptions(true, 'white', 'right', 30, ['12', '"Transcript Pro"']);
    chart.findPlotById('blue_line')?.addTooltip('ttId', 'data_y_end', 0.5, '#0070FF', '#0070FF', 4).label.setOptions(true, 'white', 'right', 30, ['12', '"Transcript Pro"']);

    // delta
    chart.findPlotById('red_line')?.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions(true, 'black', 'right', 35, ['12', '"Transcript Pro"']);
    chart.findPlotById('blue_line')?.addTooltip('delta_1', 'delta_abs', 0.5, 'black', '#ebebeb', 4).label.setOptions(true, 'black', 'right', 35, ['12', '"Transcript Pro"']);

    // подготавливаем данные как на сайте CyberHedge
    let dataNew = prepareDataforCbh(cbh5, cbh1, 0);
    let {
        serie5star,
        area5starTop,
        area5starBottom,
        serie1star,
        area1starTop,
        area1starBottom
    } = dataNew;

    // создаем Series
    chart.addSeriesRow('cyberHedge5_area', [area5starTop, area5starBottom]).setPlotsIds('blue_area');
    chart.addSeriesRow('cyberHedge1_area', [area1starTop, area1starBottom]).setPlotsIds('red_area');
    chart.addSeriesRow('cyberHedge5_line', [serie5star]).setPlotsIds('blue_line');
    chart.addSeriesRow('cyberHedge1_line', [serie1star]).setPlotsIds('red_line');
    chart.addSeriesRow('zero_line', [zeroSeries]).setPlotsIds('black_line');

    //настраиваем параметры осей
    chart.yAxis.ticks.setOptions(false, 'niceCbhStep', [1, 5, 10, 15, 20, 25, 30]);
    chart.yAxis.ticks.label.units = '%';

    chart.xAxis.ticks.setCustomLabels(xLabels);
    chart.xAxis.ticks.setOptions(true, 'customDateTicks', ['half month', 'year', 'half year', 'third year', 'quarter year']);
    chart.xAxis.display = true;

    // настраиваем Min Max осей

    chart.xAxis.setMinMax(chart.data.findExtremes('val'), true); //по экстремумам оси X
    chart.yAxis.setMinMax(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max), true); //scale to fit по Y
    chart.yAxis.setMinMax([chart.yAxis.min - gapY * chart.yAxis.length, chart.yAxis.max + gapY * chart.yAxis.length], true); //добавляем по отступам как на сайте

    //включаем анимацию
    const bezier = require('bezier-easing');
    const easing = bezier(0.65, 0, 0.35, 1);

    //включаем анимацию
    chart.xAxis.ticks.switchAnimation(true, 300);
    chart.yAxis.ticks.switchAnimation(true, 300);
    chart.switchDataAnimation(true, 300);
    chart.data.changeAllSeriesAnimationTimeFunction(easing);

    chart.setCanvasPaddings(25, 60, 40, 20); // задаем отступы для области отрисовки

}


// подготоваливает данные для Chart
export function prepareDataforCbh(star5: number[], star1: number[], fromIndex: number) {
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


// перевод из абсолютных величин в %
function calculateDeviations(rowData: number[], fromIndex: number) {
    let chartDataVariation = [];
    let zeroPoint = rowData[fromIndex];
    chartDataVariation = [];
    for (let j = 0, m = rowData.length; j < m; j++) {
        chartDataVariation.push(100 * (rowData[j] - zeroPoint) / zeroPoint);
    }
    return chartDataVariation;
}



// подключение слушателей к разметке как на cbh

//функция вешает слушатели на панель nav - USA / EU
(function prepareCsvLoadMenu() {
    let zoneItems = document.querySelectorAll('.index .zones li');
    zoneItems.forEach((item) => {
      item.addEventListener('click', () => {
        let link = item.querySelector('a');
        // @ts-ignore
        document.querySelector('.index .zones li.selected').classList.remove('selected');
        item.classList.add('selected');
  
        const rangeSelected = document.querySelector('.ranges li.selected');
  
        // @ts-ignore
        customLoadDataFromCsv(link.href).then((data) => {
          // @ts-ignore
          let chartData = csvToCols(data);

  
          cbh1 = chartData[2].slice(1).map((el) => { return +el });
          cbh5 = chartData[1].slice(1).map((el) => { return +el });
          xLabels = chartData[0].slice(1).map((el) => { return new Date(el) });
          zeroSeries = cbh1.map(() => 0);
  
          setLastUpdateDate(xLabels[xLabels.length - 1]);
  
          const max = xLabels.length - 1;
          const min = 0;
          reorganizeChart(cbh5, cbh1, min, max, false);
          // @ts-ignore
          rangeSelected.click(rangeSelected);
        })
  
      });
    });
  
  }());
  
  //функция вешает слушатели на панель ranges
  (function prepareRangesMenu() {
    let ranges = document.querySelectorAll('.ranges li');
    ranges.forEach((item) => {
      item.addEventListener('click', () => {
        // @ts-ignore
        document.querySelector('.ranges li.selected').classList.remove('selected');
        item.classList.add('selected');
        const lastLb = xLabels[xLabels.length - 1];
        let maxDate = lastLb,
          minDate,
          max = xLabels.length - 1,
          min = 0;
  
        switch (item.innerHTML) {
          case '6M':
            minDate = new Date(new Date(maxDate.getTime()).setMonth(maxDate.getMonth() - 6));
            min = findDateInd(minDate);
            break;
  
          case '1Y':
            minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 1));
            min = findDateInd(minDate);
            break;
  
          case '2Y':
            minDate = new Date(new Date(maxDate.getTime()).setFullYear(maxDate.getFullYear() - 2));
            min = findDateInd(minDate);
            break;
  
          case 'YTD':
            minDate = new Date(new Date(maxDate.getFullYear(), 0, 1).getTime()),
              min = findDateInd(minDate);
            break;
  
        }
  
        reorganizeChart(cbh5, cbh1, min, max, true);
  
      });
    })
  
  }());
  
  
  
  //настройка виджетов для отображения данных Тултипов
  const redWidget = document.getElementById('cbhIdx1-val');
  const blueWidget = document.getElementById('cbhIdx5-val');
  
  function conncetRedWidget(index: number) {
    if (redWidget) redWidget.innerHTML = cbh1[index].toFixed(1);
  }
  
  function conncetBlueWidget(index: number) {
    if (blueWidget) blueWidget.innerHTML = cbh5[index].toFixed(1);
  }
  
  
  // настройка Chart
  // @ts-ignore
  function reorganizeChart(cbh5, cbh1, min, max, onlyData?: boolean) {
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
    chart.data.findSeriesById('zero_line')?.replaceSeriesData([zeroSeries]);
  
    if (onlyData) {
      // @ts-ignore
      chart.xAxis.ticks.setCustomLabels(xLabels);
      chart.xAxis.setMinMax([min, max], false);
      const MinMaxY = chart.data.findExtremes('ind', min, max);
      const lengthY = Math.abs(MinMaxY[0] - MinMaxY[1]);
      chart.yAxis.setMinMax([MinMaxY[0] - gapY * lengthY, MinMaxY[1] + gapY * lengthY], true);
    }
  }
  
  
  function setLastUpdateDate(lastDate: Date) {
    // NOTE: fill last update node
    let lastUpdateNode = document.querySelector('.last-update time');
    // @ts-ignore
    lastUpdateNode.datetime = lastDate.toISOString();
    // @ts-ignore
    lastUpdateNode.innerHTML = [lastDate.getDate(), lastDate.toLocaleString('en-US', { month: 'long' }), lastDate.getFullYear()].join(' ');
  }
  
  
  //поиск индекса ближайщей даты
  function findDateInd(date: Date) {
    const ind = xLabels.reduce((prev, curr, i) => {
      // @ts-ignore
      const curDif = Math.abs(curr - date);
      // @ts-ignore
      const prevDif = Math.abs(xLabels[prev] - date);
      if (curDif < prevDif) return i
      return prev
    }, 0);
    return ind;
  }
  
  