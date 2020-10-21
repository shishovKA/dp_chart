//import данных
import { cbh1, cbh5, xLabels, zeroSeries, prepareDataforCbh } from "./chartData"

// импорт ключевого класса Chart
import { Chart } from "./classes/Chart"

// работа с Chart
const chart = new Chart(document.querySelector('.chart__container'), [0, 900], [0, 2000]);
chart.setCanvasPaddings(50, 80, 50, 80); // задаем отступы для области отрисовки

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

// создаем Plot
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

//chart.data.addSeries('cyberHedge5_area', area5starTop, area5starBottom).setPlotsIds('blue_area');
//chart.data.addSeries('cyberHedge1_area', area1starTop, area1starBottom).setPlotsIds('red_area');
//chart.data.addSeries('cyberHedge5_line', serie5star).setPlotsIds('blue_line');
//chart.data.addSeries('cyberHedge1_line', serie1star).setPlotsIds('red_line');
//chart.data.addSeries('zero_line', zeroSeries).setPlotsIds('black_line');


//настраиваем параметры осей
chart.yAxis.ticks.setOptions('niceCbhStep', [1, 5, 10, 15, 20, 25, 30]);
chart.yAxis.ticks.label.units = '%';

chart.xAxis.ticks.setCustomLabels(xLabels);
chart.xAxis.ticks.setOptions('customDateTicks', ['half month', 'year', 'half year', 'third year', 'quarter year']);
chart.xAxis.display = true;

// настраиваем Min Max осей
chart.xAxis.setMinMax(chart.data.findExtremes('val'), true); //по экстремумам оси X
chart.yAxis.setMinMax(chart.data.findExtremes('ind', chart.xAxis.min, chart.xAxis.max), true); //scale to fit по Y
//chart.yAxis.setMinMax([chart.yAxis.min-0.05*chart.yAxis.length, chart.yAxis.max+0.05*chart.yAxis.length]); //добавляем по отступам как на сайте


export {chart}