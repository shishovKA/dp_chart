import { Signal } from "signals";
import { Canvas } from "./Canvas";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Transformer } from "./Transformer";
var Series = /** @class */ (function () {
    function Series(id, container) {
        var seriesData = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            seriesData[_i - 2] = arguments[_i];
        }
        this.hasAnimation = false;
        this.animationDuration = 300;
        this.timeFunc = function (time) {
            return time;
        };
        this.onPlotDataChanged = new Signal();
        this.id = id;
        this.seriesData = this.getInitialData(seriesData);
        this.extremes = this.findExtremes();
        this.plots = [];
        this.plotData = [];
        this.canvas = new Canvas(container);
        return this;
    }
    Series.prototype.getInitialData = function (initialData) {
        var resultData = [];
        initialData.forEach(function (dataRow) {
            var ind = [];
            var val = [];
            dataRow.forEach(function (element, index) {
                ind.push(index);
                val.push(element);
            });
            resultData.push(ind);
            resultData.push(val);
        });
        return resultData;
    };
    Series.prototype.setPlotsIds = function () {
        var plotIds = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            plotIds[_i] = arguments[_i];
        }
        this.plots = plotIds;
    };
    Series.prototype.findExtremes = function (data) {
        var seriesData = [];
        if (data)
            seriesData = data;
        if (!data)
            seriesData = this.seriesData.slice();
        var xMin = seriesData[0][0];
        var xMax = seriesData[0][0];
        var yMin = seriesData[1][0];
        var yMax = seriesData[1][0];
        seriesData.forEach(function (dataRow, ind) {
            dataRow.forEach(function (element) {
                switch (ind % 2) {
                    case 0:
                        if (element < xMin)
                            xMin = element;
                        if (element > xMax)
                            xMax = element;
                        break;
                    case 1:
                        if (element < yMin)
                            yMin = element;
                        if (element > yMax)
                            yMax = element;
                        break;
                }
            });
        });
        return [xMin, xMax, yMin, yMax];
    };
    Object.defineProperty(Series.prototype, "dataRect", {
        get: function () {
            var extremes = this.extremes;
            return new Rectangle(extremes[0], extremes[2], extremes[1], extremes[3]);
        },
        enumerable: false,
        configurable: true
    });
    Series.prototype.getDataRange = function (type, min, max) {
        var data = [];
        var _loop_1 = function (i) {
            var ind = [];
            var val = [];
            var dataRowInd = this_1.seriesData[i].slice();
            var dataRowVal = this_1.seriesData[i + 1].slice();
            if (i == 2) {
                dataRowInd = dataRowInd.slice();
                dataRowVal = dataRowVal.slice();
            }
            dataRowInd.forEach(function (el, i) {
                if ((el >= min) && (el <= max)) {
                    ind.push(dataRowInd[i]);
                    val.push(dataRowVal[i]);
                }
            });
            data.push(ind);
            data.push(val);
        };
        var this_1 = this;
        /*
           let arrInd: number = 0;
   
           switch (type) {
               case 'ind':
                   arrInd = 0;
               break;
   
               case 'val':
                   arrInd = 1;
               break;
   
               default:
                   arrInd = 0;
               break;
           }
           */
        for (var i = 0; i < this.seriesData.length; i = i + 2) {
            _loop_1(i);
        }
        return data;
    };
    Series.prototype.replaceSeriesData = function (seriesData_to) {
        this.seriesData = this.getInitialData(seriesData_to);
        this.extremes = this.findExtremes();
    };
    Series.prototype.getClosestPoint = function (x) {
        var ind = this.seriesData[0].reduce(function (prev, curr, i) {
            var curDif = Math.abs(i - x);
            var prevDif = Math.abs(prev - x);
            if (curDif < prevDif)
                return i;
            return prev;
        }, 0);
        return new Point(ind, this.seriesData[1][ind]);
    };
    Series.prototype.getClosestPlotPoint = function (x) {
        var coord = this.plotDataArr.reduce(function (prev, curr, i) {
            var curDif = Math.abs(curr.x - x);
            var prevDif = Math.abs(prev.x - x);
            if (curDif < prevDif)
                return curr;
            return prev;
        }, this.plotDataArr[0]);
        return new Point(coord.x, coord.y);
    };
    Object.defineProperty(Series.prototype, "plotDataArr", {
        get: function () {
            var lineArr = [];
            for (var i = 0; i < this.plotData.length; i++) {
                var plotRow = this.plotData[i];
                if (i == 1) {
                    plotRow = plotRow.slice().reverse();
                }
                plotRow.forEach(function (element) {
                    lineArr.push(element);
                });
            }
            return lineArr;
        },
        enumerable: false,
        configurable: true
    });
    Series.prototype.updatePlotData = function (axisRect, vp, noAnimation) {
        var plotData = this.generatePlotData(axisRect, vp);
        //если нужна анимация графиков
        if (noAnimation) {
            this.plotData = plotData;
            this.onPlotDataChanged.dispatch(this);
            return this;
        }
        if (this.hasAnimation) {
            var fromData = [];
            var toData = [];
            for (var i = 0; i < this.plotData.length; i++) {
                var plotRow = this.plotData[i];
                var fromTo = this.makeFromPointArr(plotRow.slice(), plotData[i].slice());
                fromData.push(fromTo[0]);
                toData.push(fromTo[1]);
            }
            this.сoordAnimation(fromData, toData, this.animationDuration);
        }
        this.plotData = plotData;
        this.onPlotDataChanged.dispatch(this);
        return this;
    };
    Series.prototype.generatePlotData = function (axisRect, vp) {
        var seriesData = this.getDataRange('ind', axisRect.x1, axisRect.x2);
        // const seriesData = this.seriesData.slice();
        var plotData = [];
        var transformer = new Transformer();
        var _loop_2 = function (i) {
            var plotDataRow = [];
            var dataRowInd = seriesData[i];
            var dataRowVal = seriesData[i + 1];
            dataRowInd.forEach(function (element, ind) {
                var seriesPoint = new Point(dataRowInd[ind], dataRowVal[ind]);
                var plotPoint = transformer.getVeiwportCoord(axisRect, vp, seriesPoint);
                plotDataRow.push(new Point(Math.round(plotPoint.x), Math.round(plotPoint.y)));
            });
            plotData.push(plotDataRow);
        };
        for (var i = 0; i < seriesData.length; i = i + 2) {
            _loop_2(i);
        }
        return plotData;
    };
    // Метод анимации изменение набора координат
    Series.prototype.сoordAnimation = function (fromData, toData, duration) {
        var _this = this;
        var start = performance.now();
        var animate = function (time) {
            var tekTime = (time - start) / duration;
            var timeFraction = _this.timeFunc(tekTime);
            if (tekTime > 1)
                tekTime = 1;
            var tekData = [];
            fromData.forEach(function (fromRow, ind) {
                var tekRow = fromRow.map(function (el, i) {
                    return new Point(Math.round(fromRow[i].x + (toData[ind][i].x - fromRow[i].x) * timeFraction), Math.round(fromRow[i].y + (toData[ind][i].y - fromRow[i].y) * timeFraction));
                });
                tekData.push(tekRow);
            });
            _this.plotData = tekData;
            _this.onPlotDataChanged.dispatch(_this);
            if (tekTime < 1) {
                requestAnimationFrame(animate);
            }
            else {
                _this.plotData = toData;
                _this.onPlotDataChanged.dispatch(_this);
            }
        };
        requestAnimationFrame(animate);
    };
    Series.prototype.makeFromPointArr = function (from, to) {
        var resultArr = [];
        if (from.length == 0)
            return resultArr;
        var fromResult = [];
        var toResult = [];
        var toArr = to.slice();
        var fromArr = from.slice();
        // если from < to
        if (fromArr.length < toArr.length) {
            var capacity = Math.floor(toArr.length / fromArr.length);
            var fromInd = 0;
            var roomCount = 0;
            while (fromInd < fromArr.length) {
                fromResult.push(fromArr[fromInd]);
                toArr.shift();
                roomCount = roomCount + 1;
                if (roomCount == capacity) {
                    fromInd = fromInd + 1;
                    roomCount = 0;
                }
            }
            while (toArr.length !== 0) {
                fromResult.push(fromArr[fromArr.length - 1]);
                toArr.shift();
            }
            resultArr.push(fromResult);
            resultArr.push(to);
            return resultArr;
        }
        // если from > to
        else {
            var capacity = Math.floor(fromArr.length / toArr.length);
            var toInd = 0;
            var roomCount = 0;
            while (toInd < toArr.length) {
                toResult.push(toArr[toInd]);
                fromArr.shift();
                roomCount = roomCount + 1;
                if (roomCount == capacity) {
                    toInd = toInd + 1;
                    roomCount = 0;
                }
            }
            while (fromArr.length !== 0) {
                toResult.push(toArr[toArr.length - 1]);
                fromArr.shift();
            }
            resultArr.push(from);
            resultArr.push(toResult);
            return resultArr;
        }
    };
    return Series;
}());
export { Series };
