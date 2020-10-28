var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Canvas } from "./Canvas";
import { Data } from "./Data";
import { Plot } from "./Plot";
import { Axis } from "./Axis";
import { Transformer } from "./Transformer";
import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { Series } from "./Series";
import { Signal } from "signals";
var Chart = /** @class */ (function () {
    function Chart(container, xMinMax, yMinMax) {
        var _this = this;
        this.container = container;
        this.canvas = new Canvas(container);
        this.canvasA = new Canvas(container);
        this.canvasTT = new Canvas(container);
        this.canvasTT.turnOnListenres();
        this.canvasTT.canvas.style.zIndex = "10";
        this.data = new Data();
        this.plots = [];
        this.xAxis = new Axis(xMinMax, 'horizontal');
        this.yAxis = new Axis(yMinMax, 'vertical');
        this.tooltipsDraw = this.tooltipsDraw.bind(this);
        this.seriesReDraw = this.seriesReDraw.bind(this);
        window.addEventListener('resize', function () { _this.reSize(); });
        this.reSize();
        this.bindChildSignals();
        this.tooltipsDraw(true);
        this.tooltipsDataIndexUpdated = new Signal();
    }
    Chart.prototype.bindChildSignals = function () {
        var _this = this;
        // axis
        this.xAxis.onOptionsSetted.add(function () {
            _this.xAxis.ticks.createTicks(_this.xAxis.min, _this.xAxis.max, _this.xAxis.getaxisViewport(_this.canvasA.viewport), _this.canvasA.ctx);
            _this.axisReDraw();
        });
        //min max
        this.xAxis.onMinMaxSetted.add(function (hasPlotAnimation) {
            _this.xAxis.ticks.createTicks(_this.xAxis.min, _this.xAxis.max, _this.xAxis.getaxisViewport(_this.canvasA.viewport), _this.canvasA.ctx);
            if (hasPlotAnimation)
                _this.seriesUpdatePlotData();
            _this.axisReDraw();
            _this.tooltipsDraw(true);
        });
        this.xAxis.onCustomLabelsAdded.add(function () {
            _this.xAxis.ticks.createTicks(_this.xAxis.min, _this.xAxis.max, _this.xAxis.getaxisViewport(_this.canvasA.viewport), _this.canvasA.ctx);
            _this.axisReDraw();
        });
        this.xAxis.onAnimated.add(function () {
            _this.axisReDraw();
        });
        this.yAxis.onOptionsSetted.add(function () {
            _this.yAxis.ticks.createTicks(_this.yAxis.min, _this.yAxis.max, _this.yAxis.getaxisViewport(_this.canvasA.viewport), _this.canvasA.ctx);
            _this.axisReDraw();
        });
        //min max
        this.yAxis.onMinMaxSetted.add(function (hasPlotAnimation) {
            _this.yAxis.ticks.createTicks(_this.yAxis.min, _this.yAxis.max, _this.yAxis.getaxisViewport(_this.canvasA.viewport), _this.canvasA.ctx);
            _this.axisReDraw();
            if (hasPlotAnimation)
                _this.seriesUpdatePlotData();
            _this.tooltipsDraw(true);
        });
        this.yAxis.onCustomLabelsAdded.add(function () {
            _this.yAxis.ticks.createTicks(_this.yAxis.min, _this.yAxis.max, _this.yAxis.getaxisViewport(_this.canvasA.viewport), _this.canvasA.ctx);
            _this.axisReDraw();
        });
        this.yAxis.onAnimated.add(function () {
            _this.axisReDraw();
        });
        // canvas
        this.canvasTT.mouseMoved.add(this.tooltipsDraw);
        this.canvasTT.mouseOuted.add(function () {
            _this.tooltipsDraw(true);
        });
        this.canvasTT.touchEnded.add(function () {
            _this.tooltipsDraw(true);
        });
    };
    Object.defineProperty(Chart.prototype, "axisRect", {
        get: function () {
            return (new Rectangle(this.xAxis.min, this.yAxis.min, this.xAxis.max, this.yAxis.max));
        },
        enumerable: false,
        configurable: true
    });
    Chart.prototype.reSize = function () {
        this.canvas.resize();
        this.canvasA.resize();
        this.canvasTT.resize();
        this.data.seriesStorage.forEach(function (series, ind) {
            series.canvas.resize();
        });
        this.seriesUpdatePlotData();
        this.ticksCreate();
        this.axisReDraw();
    };
    Chart.prototype.axisReDraw = function () {
        this.canvasA.clear();
        this.axisDraw();
    };
    // генерируем PlotData у series
    Chart.prototype.seriesUpdatePlotData = function () {
        var _this = this;
        this.data.seriesStorage.forEach(function (series, ind) {
            series.updatePlotData(_this.axisRect, series.canvas.viewport);
        });
    };
    // генерируем тики у Осей
    Chart.prototype.ticksCreate = function () {
        this.xAxis.ticks.createTicks(this.xAxis.min, this.xAxis.max, this.xAxis.getaxisViewport(this.canvasA.viewport), this.canvasA.ctx);
        this.yAxis.ticks.createTicks(this.yAxis.min, this.yAxis.max, this.yAxis.getaxisViewport(this.canvasA.viewport), this.canvasA.ctx);
    };
    // отрисовываем Оси
    Chart.prototype.axisDraw = function () {
        this.xAxis.draw(this.canvasA.ctx, this.canvasA.viewport);
        this.yAxis.draw(this.canvasA.ctx, this.canvasA.viewport);
    };
    // отрисовка одной серии
    Chart.prototype.seriesReDraw = function (series) {
        var _this = this;
        var canvas = series.canvas;
        canvas.clear();
        canvas.clipCanvas();
        series.plots.forEach(function (plotId) {
            var plot = _this.findPlotById(plotId);
            if (plot) {
                plot.drawPlot(canvas.ctx, series.plotDataArr);
            }
            ;
        });
        this.tooltipsDraw(true);
    };
    Chart.prototype.setCanvasPaddings = function () {
        var _a, _b, _c;
        var paddings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paddings[_i] = arguments[_i];
        }
        (_a = this.canvas).setPaddings.apply(_a, paddings);
        (_b = this.canvasTT).setPaddings.apply(_b, paddings);
        (_c = this.canvasA).setPaddings.apply(_c, paddings);
        this.data.seriesStorage.forEach(function (series, ind) {
            var _a;
            (_a = series.canvas).setPaddings.apply(_a, paddings);
        });
    };
    Chart.prototype.addPlot = function (id, type) {
        var options = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            options[_i - 2] = arguments[_i];
        }
        var plot = new (Plot.bind.apply(Plot, __spreadArrays([void 0, id, type], options)))();
        this.plots.push(plot);
    };
    Chart.prototype.findPlotById = function (id) {
        var plots = this.plots.filter(function (plot) {
            return plot.id === id;
        });
        if (plots.length !== 0)
            return plots[0];
        return null;
    };
    Chart.prototype.addSeries = function (id) {
        var seriesData = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            seriesData[_i - 1] = arguments[_i];
        }
        var newSeries = new (Series.bind.apply(Series, __spreadArrays([void 0, id, this.container], seriesData)))();
        this.data.seriesStorage.push(newSeries);
        newSeries.canvas.setPaddings(this.canvas.top, this.canvas.right, this.canvas.bottom, this.canvas.left);
        newSeries.updatePlotData(this.axisRect, newSeries.canvas.viewport, true);
        newSeries.onPlotDataChanged.add(this.seriesReDraw);
        return newSeries;
    };
    Chart.prototype.switchDataAnimation = function (hasAnimation, duration) {
        this.data.seriesStorage.forEach(function (series, ind) {
            series.hasAnimation = hasAnimation;
            if (duration)
                series.animationDuration = duration;
        });
    };
    // отрисовываем тултипы
    Chart.prototype.tooltipsDraw = function (drawLast) {
        var _this = this;
        this.canvasTT.clear();
        var mouseXY = this.canvasTT.mouseCoords;
        var transformer = new Transformer();
        var delta_abs_buf = [];
        var delta_abs_buf_coord = [];
        var data_y_end_buf = [];
        this.data.seriesStorage.forEach(function (series) {
            var seriesX = _this.xAxis.min + mouseXY.x * (_this.xAxis.length) / _this.canvasTT.viewport.width;
            var pointData = series.getClosestPoint(seriesX);
            var tooltipCoord = series.getClosestPlotPoint(mouseXY.x + _this.canvasTT.left);
            _this.tooltipsDataIndexUpdated.dispatch(pointData.x);
            //const tooltipCoord = transformer.getVeiwportCoord(this.axisRect, this.canvasTT.viewport, pointData);
            series.plots.forEach(function (plotId) {
                var plot = _this.findPlotById(plotId);
                if (plot) {
                    plot.tooltips.forEach(function (tooltip) {
                        if (drawLast) {
                            switch (tooltip.type) {
                                case 'data_y_end':
                                    data_y_end_buf.push([tooltip, tooltipCoord, pointData]);
                                    break;
                                case 'circle_series':
                                    tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, new Point(tooltipCoord.x, tooltipCoord.y), pointData);
                                    break;
                            }
                        }
                        else {
                            switch (tooltip.type) {
                                case 'delta_abs':
                                    if (delta_abs_buf.length == 0) {
                                        delta_abs_buf.push(pointData);
                                        delta_abs_buf_coord.push(tooltipCoord);
                                    }
                                    else {
                                        var ttCoord = (delta_abs_buf_coord[0].y < tooltipCoord.y) ? delta_abs_buf_coord[0] : tooltipCoord;
                                        var absData = new Point(Math.abs(pointData.x - delta_abs_buf[0].x), Math.abs(pointData.y - delta_abs_buf[0].y));
                                        tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, ttCoord, absData);
                                        delta_abs_buf.pop();
                                        delta_abs_buf_coord.pop();
                                    }
                                    break;
                                case 'data_y_end':
                                    data_y_end_buf.push([tooltip, tooltipCoord, pointData]);
                                    break;
                                case 'label_x_start':
                                    tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasA.viewport, new Point(tooltipCoord.x, tooltipCoord.y), pointData);
                                    break;
                                case 'line_vertical_full':
                                    tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasA.viewport, new Point(tooltipCoord.x, tooltipCoord.y), pointData);
                                    break;
                                default:
                                    tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, new Point(tooltipCoord.x, tooltipCoord.y), pointData);
                                    break;
                            }
                        }
                    });
                }
                ;
            });
        });
        // рассталкиваем друг от друга боковые тултипы
        data_y_end_buf.sort(function (a, b) { return a[1].y - b[1].y; });
        for (var i = 0; i < data_y_end_buf.length - 1; i++) {
            var rect1 = data_y_end_buf[i][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i][1], data_y_end_buf[i][2], false);
            var rect2 = data_y_end_buf[i + 1][0].drawTooltip(this.canvasTT.ctx, this.canvasTT.viewport, data_y_end_buf[i + 1][1], data_y_end_buf[i + 1][2], false);
            if (rect1.y2 > rect2.y1) {
                var abs = Math.abs(rect1.y2 - rect2.y1);
                var abs1 = -abs * 0.5;
                var abs2 = abs * 0.5;
                if (Math.abs(rect1.y1 - this.canvasTT.viewport.y1) < Math.abs(abs1)) {
                    abs1 = -Math.abs(rect1.y1 - this.canvasTT.viewport.y1);
                    abs2 = (abs + abs1);
                }
                if (Math.abs(rect2.y2 - this.canvasTT.viewport.y2) < abs2) {
                    abs2 = -Math.abs(rect1.y2 - this.canvasTT.viewport.y2);
                    abs1 = -(abs - abs2);
                }
                data_y_end_buf[i][1].y = data_y_end_buf[i][1].y + abs1;
                data_y_end_buf[i + 1][1].y = data_y_end_buf[i + 1][1].y + abs2;
            }
        }
        data_y_end_buf.forEach(function (ttRow) {
            ttRow[0].drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, ttRow[1], ttRow[2], true);
        });
    };
    return Chart;
}());
export { Chart };
