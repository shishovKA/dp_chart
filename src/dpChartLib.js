var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define("Rectangle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rectangle = void 0;
    var Rectangle = /** @class */ (function () {
        function Rectangle(x1, y1, x2, y2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.updateCoords(x1, y1, x2, y2);
        }
        Object.defineProperty(Rectangle.prototype, "width", {
            get: function () {
                return Math.abs(this.x1 - this.x2);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "height", {
            get: function () {
                return Math.abs(this.y1 - this.y2);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "zeroX", {
            get: function () {
                return this.x1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "zeroY", {
            get: function () {
                return this.y2;
            },
            enumerable: false,
            configurable: true
        });
        Rectangle.prototype.updateCoords = function (x1, y1, x2, y2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        };
        Rectangle.prototype.countDistBetweenRects = function (type, next) {
            switch (type) {
                case 'vertical':
                    return this.y1 - next.y2;
                    break;
                case 'horizontal':
                    return this.x1 - next.x2;
                    break;
            }
        };
        Rectangle.prototype.move = function (dx, dy) {
            this.x1 = this.x1 + dx;
            this.y1 = this.y1 + dy;
            this.x2 = this.x2 + dx;
            this.y2 = this.y2 + dy;
        };
        return Rectangle;
    }());
    exports.Rectangle = Rectangle;
});
define("Point", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Point = void 0;
    var Point = /** @class */ (function () {
        function Point(x, y) {
            //this.x = Math.round(x);
            //this.y = Math.round(y);
            this.x = x;
            this.y = y;
        }
        Point.prototype.findDist = function (next) {
            var dist = Math.sqrt((this.x - next.x) * (this.x - next.x) + (this.y - next.y) * (this.y - next.y));
            return dist;
        };
        Point.prototype.findDistX = function (next) {
            var dist = Math.abs(this.x - next.x);
            return dist;
        };
        return Point;
    }());
    exports.Point = Point;
});
define("Label", ["require", "exports", "Point", "signals", "Rectangle"], function (require, exports, Point_1, signals_1, Rectangle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Label = void 0;
    var Label = /** @class */ (function () {
        function Label(type) {
            this.display = true;
            this.color = 'black';
            this.font = '16px serif';
            this.fontSize = 16;
            this.position = 'bottom';
            this.offset = 15;
            this.onOptionsSetted = new signals_1.Signal();
            switch (type) {
                case 'vertical':
                    this.position = 'left';
                    break;
                case 'horizontal':
                    this.position = 'bottom';
                    break;
            }
        }
        Label.prototype.setOptions = function (color, position, offset, fontOptions) {
            this.color = color || 'black';
            this.position = position || 'bottom';
            this.offset = offset || 0;
            if (fontOptions) {
                this.font = fontOptions[0] + "px " + fontOptions[1];
                this.fontSize = +fontOptions[0];
            }
            this.onOptionsSetted.dispatch();
        };
        Label.prototype.draw = function (ctx, coord, labeltext) {
            ctx.fillStyle = this.color;
            ctx.font = this.font;
            ctx.textBaseline = 'middle';
            var text = ctx.measureText(labeltext);
            var labelCoord = new Point_1.Point(coord.x - text.width * 0.5, coord.y);
            switch (this.position) {
                case 'top':
                    labelCoord.y = labelCoord.y - this.offset - this.fontSize * 0.5;
                    break;
                case 'bottom':
                    labelCoord.y = labelCoord.y + this.offset + this.fontSize * 0.5;
                    break;
                case 'left':
                    labelCoord.x = labelCoord.x - this.offset;
                    break;
                case 'right':
                    labelCoord.x = labelCoord.x + this.offset;
                    break;
            }
            var printText = labeltext;
            if (this.units)
                printText = labeltext + this.units;
            ctx.fillText(printText, labelCoord.x, labelCoord.y);
        };
        Label.prototype.getlabelRect = function (ctx, coord, labeltext) {
            ctx.font = this.font;
            var text = ctx.measureText(labeltext);
            var labelCoord = new Point_1.Point(coord.x - text.width * 0.5, coord.y);
            switch (this.position) {
                case 'top':
                    labelCoord.y = labelCoord.y - this.offset - this.fontSize * 0.5;
                    break;
                case 'bottom':
                    labelCoord.y = labelCoord.y + this.offset + this.fontSize * 0.5;
                    break;
                case 'left':
                    labelCoord.x = labelCoord.x - this.offset;
                    break;
                case 'right':
                    labelCoord.x = labelCoord.x + this.offset;
                    break;
            }
            return new Rectangle_1.Rectangle(labelCoord.x, labelCoord.y - this.fontSize * 0.5, labelCoord.x + text.width, labelCoord.y + this.fontSize * 0.5);
        };
        return Label;
    }());
    exports.Label = Label;
});
define("Grid", ["require", "exports", "signals"], function (require, exports, signals_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Grid = void 0;
    var Grid = /** @class */ (function () {
        function Grid(type) {
            this.display = false;
            this.onOptionsSetted = new signals_2.Signal();
            this.type = type;
            this.width = 1;
            this.color = 'black';
            this.lineDash = [1, 0];
        }
        Grid.prototype.setOptions = function (color, width, lineDash) {
            this.width = width;
            this.color = color;
            this.lineDash = lineDash;
            this.onOptionsSetted.dispatch();
        };
        Grid.prototype.draw = function (ctx, vp, coords) {
            var _this = this;
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.setLineDash(this.lineDash);
            coords.forEach(function (tick) {
                ctx.beginPath();
                switch (_this.type) {
                    case 'vertical':
                        ctx.moveTo(vp.x1, tick.y);
                        ctx.lineTo(vp.x2, tick.y);
                        break;
                    case 'horizontal':
                        ctx.moveTo(tick.x, vp.y1);
                        ctx.lineTo(tick.x, vp.y2);
                        break;
                }
                ;
                ctx.stroke();
            });
            ctx.setLineDash([]);
        };
        return Grid;
    }());
    exports.Grid = Grid;
});
define("Transformer", ["require", "exports", "Rectangle", "Point"], function (require, exports, Rectangle_2, Point_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Transformer = void 0;
    var Transformer = /** @class */ (function () {
        function Transformer() {
            this.matrix = [];
        }
        Transformer.prototype.getPlotRect = function (axisRect, seriesRect, vp) {
            var tx = (seriesRect.x1 - axisRect.x1);
            var ty = -(seriesRect.y2 - axisRect.y2);
            var scaleX = seriesRect.width / axisRect.width;
            var scaleY = seriesRect.height / axisRect.height;
            tx = Math.round(tx * vp.width / axisRect.width);
            ty = Math.round(ty * vp.height / axisRect.height);
            this.matrix = [scaleX, 0, tx, 0, scaleY, ty];
            return this.transform(vp);
        };
        Transformer.prototype.getVeiwportCoord = function (fromRect, toRect, point) {
            var tx = (point.x - fromRect.x1);
            var ty = -(point.y - fromRect.y2);
            tx = Math.round(tx * toRect.width / fromRect.width);
            ty = Math.round(ty * toRect.height / fromRect.height);
            this.matrix = [0, 0, tx, 0, 0, ty];
            var coordRect = this.transform(toRect);
            var coord = new Point_2.Point(coordRect.zeroX, coordRect.zeroY);
            return coord;
        };
        Transformer.prototype.transform = function (viewport) {
            var matrix = [1, 0, 0, 0, 1, 0];
            if (this.matrix) {
                matrix = this.matrix;
            }
            var x1;
            var y1;
            var x2;
            var y2;
            x1 = this.transFunc(0, 0, matrix.slice(0, 3)) + viewport.x1;
            y1 = this.transFunc(0, 0, matrix.slice(3)) + viewport.y1;
            x2 = this.transFunc(viewport.width, viewport.height, matrix.slice(0, 3)) + viewport.x1;
            y2 = this.transFunc(viewport.width, viewport.height, matrix.slice(3)) + viewport.y1;
            return new Rectangle_2.Rectangle(x1, y1, x2, y2);
        };
        Transformer.prototype.transFunc = function (x, y, coeff) {
            var res;
            return res = coeff[0] * x + coeff[1] * y + coeff[2];
        };
        return Transformer;
    }());
    exports.Transformer = Transformer;
});
define("Ticks", ["require", "exports", "signals", "Point", "Rectangle", "Label", "Grid", "Transformer"], function (require, exports, signals_3, Point_3, Rectangle_3, Label_1, Grid_1, Transformer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Ticks = void 0;
    var Ticks = /** @class */ (function () {
        function Ticks(axistype) {
            this.display = false;
            this.hasCustomLabels = false;
            this.hasAnimation = false;
            this.animationDuration = 300;
            // параметры отрисовки тика
            this.linewidth = 2;
            this.tickSize = 5;
            this.color = 'black';
            this.onOptionsSetted = new signals_3.Signal();
            this.onCustomLabelsAdded = new signals_3.Signal();
            this.onAnimated = new signals_3.Signal();
            this.coords = [];
            this.values = [];
            this.labels = [];
            this.type = axistype;
            this.label = new Label_1.Label(this.type);
            this.grid = new Grid_1.Grid(this.type);
            this.distributionType = 'default';
            this.count = 5;
            this.step = 100;
            this.bindChildSignals();
        }
        Ticks.prototype.switchAnimation = function (hasAnimation, duration) {
            this.hasAnimation = hasAnimation;
            if (duration)
                this.animationDuration = duration;
        };
        Ticks.prototype.bindChildSignals = function () {
            var _this = this;
            this.label.onOptionsSetted.add(function () {
                _this.onOptionsSetted.dispatch();
            });
            this.grid.onOptionsSetted.add(function () {
                _this.onOptionsSetted.dispatch();
            });
        };
        Ticks.prototype.setCustomLabels = function (labels) {
            this.hasCustomLabels = true;
            this.customLabels = labels;
            this.onCustomLabelsAdded.dispatch();
        };
        Ticks.prototype.settickDrawOptions = function (length, width, color) {
            this.linewidth = width;
            this.tickSize = length;
            this.color = color;
        };
        Ticks.prototype.setOptions = function (distributionType) {
            var options = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                options[_i - 1] = arguments[_i];
            }
            switch (distributionType) {
                case 'default':
                    this.distributionType = distributionType;
                    this.count = options[0];
                    break;
                case 'fixedCount':
                    this.distributionType = distributionType;
                    this.count = options[0];
                    break;
                case 'fixedStep':
                    this.distributionType = distributionType;
                    this.step = options[0];
                    break;
                case 'customDateTicks':
                    this.distributionType = distributionType;
                    if (options.length !== 0)
                        this.customTicksOptions = options[0];
                    break;
                case 'niceCbhStep':
                    this.distributionType = distributionType;
                    if (options.length !== 0)
                        this.customTicksOptions = options[0];
                    break;
            }
            this.onOptionsSetted.dispatch();
        };
        Ticks.prototype.createTicks = function (min, max, vp, ctx) {
            var coords = [];
            switch (this.distributionType) {
                case 'default':
                    coords = this.generateFixedCountTicks(min, max, vp);
                    break;
                case 'fixedStep':
                    coords = this.generateFixedStepTicks(min, max, vp);
                    break;
                case 'fixedCount':
                    coords = this.generateFixedCountTicks(min, max, vp);
                    break;
                case 'customDateTicks':
                    coords = this.generateCustomDateTicks(min, max, vp, ctx);
                    break;
                case 'niceCbhStep':
                    coords = this.generateNiceCbhTicks(min, max, vp);
                    break;
            }
            //если нужна анимация тиков
            if (this.hasAnimation) {
                var from = this.makeFromPointArr(this.coords, coords);
                if (from.length == 0) {
                    this.coords = coords;
                    return this;
                }
                this.coords = from;
                this.tickCoordAnimation(from, coords, this.animationDuration);
                return this;
            }
            this.coords = coords;
        };
        Ticks.prototype.generateFixedCountTicks = function (min, max, vp) {
            var coords = [];
            this.values = [];
            this.labels = [];
            var stepCoord = 0;
            var rectXY = [];
            var transformer = new Transformer_1.Transformer();
            var stepValue = Math.abs(max - min) / this.count;
            switch (this.type) {
                case 'vertical':
                    stepCoord = vp.height / this.count;
                    rectXY = [0, min, 1, max];
                    break;
                case 'horizontal':
                    stepCoord = vp.width / this.count;
                    rectXY = [min, 0, max, 1];
                    break;
            }
            var fromRect = new Rectangle_3.Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
            for (var i = 0; i <= this.count; i++) {
                var pointXY = [];
                var value = min + i * stepValue;
                if (this.hasCustomLabels) {
                    value = Math.round(value);
                    this.labels.push(this.customLabels[value]);
                }
                else {
                    this.labels.push(value.toFixed(2).toString());
                }
                switch (this.type) {
                    case 'vertical':
                        pointXY = [0, value];
                        break;
                    case 'horizontal':
                        pointXY = [value, 0];
                        break;
                }
                var valuePoint = new Point_3.Point(pointXY[0], pointXY[1]);
                var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                coords.push(coordPoint);
                this.values.push(value);
            }
            return coords;
        };
        Ticks.prototype.generateFixedStepTicks = function (min, max, vp, step, toFixed) {
            var coords = [];
            this.values = [];
            this.labels = [];
            var rectXY = [];
            var tickStep = this.step;
            if (step) {
                tickStep = step;
            }
            var transformer = new Transformer_1.Transformer();
            switch (this.type) {
                case 'vertical':
                    rectXY = [0, min, 1, max];
                    break;
                case 'horizontal':
                    rectXY = [min, 0, max, 1];
                    break;
            }
            var fromRect = new Rectangle_3.Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
            var startValue = 0;
            var curValue = startValue;
            while (curValue < max) {
                if ((curValue >= min) && (curValue <= max)) {
                    var pointXY = [];
                    var value = curValue;
                    if (this.hasCustomLabels) {
                        value = Math.round(curValue);
                        this.labels.push(this.customLabels[value]);
                    }
                    else {
                        if (toFixed !== null) {
                            this.labels.push(value.toFixed(toFixed).toString());
                        }
                        else {
                            this.labels.push(value.toFixed(2).toString());
                        }
                    }
                    switch (this.type) {
                        case 'vertical':
                            pointXY = [0, value];
                            break;
                        case 'horizontal':
                            pointXY = [value, 0];
                            break;
                    }
                    var valuePoint = new Point_3.Point(pointXY[0], pointXY[1]);
                    var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                    coords.push(coordPoint);
                    this.values.push(value);
                }
                curValue = curValue + tickStep;
            }
            curValue = startValue;
            curValue = curValue - tickStep;
            while (curValue > min) {
                if ((curValue >= min) && (curValue <= max)) {
                    var pointXY = [];
                    var value = curValue;
                    if (this.hasCustomLabels) {
                        value = Math.round(curValue);
                        this.labels.push(this.customLabels[value]);
                    }
                    else {
                        if (toFixed !== null) {
                            this.labels.push(value.toFixed(toFixed).toString());
                        }
                        else {
                            this.labels.push(value.toFixed(2).toString());
                        }
                    }
                    switch (this.type) {
                        case 'vertical':
                            pointXY = [0, value];
                            break;
                        case 'horizontal':
                            pointXY = [value, 0];
                            break;
                    }
                    var valuePoint = new Point_3.Point(pointXY[0], pointXY[1]);
                    var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                    coords.push(coordPoint);
                    this.values.push(value);
                }
                curValue = curValue - tickStep;
            }
            return coords;
        };
        Ticks.prototype.generateNiceCbhTicks = function (min, max, vp) {
            var coords = [];
            var deviation = Math.abs(max - min);
            var devInd = 0;
            for (var j = 0; j < this.customTicksOptions.length; j++) {
                coords = this.generateFixedStepTicks(min, max, vp, this.customTicksOptions[j], 0);
                var maxValue = this.values.reduce(function (prev, element) {
                    return (element > prev) ? element : prev;
                }, this.values[0]);
                if ((Math.abs(maxValue - max) < deviation) && (coords.length <= 10) && (coords.length >= 4)) {
                    devInd = j;
                    deviation = Math.abs(maxValue - max);
                }
            }
            coords = this.generateFixedStepTicks(min, max, vp, this.customTicksOptions[devInd], 0);
            return coords;
        };
        Ticks.prototype.generateCustomDateTicks = function (min, max, vp, ctx) {
            var coords = [];
            for (var j = 0; j < this.customTicksOptions.length; j++) {
                var ticksArr = this.generateCustomDateTicksByOption(j, min, max, vp, ctx);
                coords = ticksArr[0];
                var values = ticksArr[1];
                var labels = ticksArr[2];
                if (this.checkLabelsOverlap(ctx, coords, labels)) {
                    this.values = values;
                    this.labels = labels;
                    return coords;
                }
            }
            return coords;
        };
        // Метод анимации изменение набора координат тиков
        Ticks.prototype.tickCoordAnimation = function (from, to, duration) {
            var _this = this;
            var start = performance.now();
            var animate = function (time) {
                var timeFraction = (time - start) / duration;
                if (timeFraction > 1)
                    timeFraction = 1;
                var tek = from.map(function (el, i) {
                    return new Point_3.Point(from[i].x + (to[i].x - from[i].x) * timeFraction, from[i].y + (to[i].y - from[i].y) * timeFraction);
                });
                _this.coords = tek;
                _this.onAnimated.dispatch();
                if (timeFraction < 1) {
                    requestAnimationFrame(animate);
                }
                else {
                }
            };
            requestAnimationFrame(animate);
        };
        Ticks.prototype.makeFromPointArr = function (from, to) {
            var resultArr = [];
            to.forEach(function (toPoint) {
                if (from.length !== 0) {
                    var minP = from.reduce(function (fromPoint, cur) {
                        if (fromPoint.findDist(toPoint) < cur.findDist(toPoint))
                            return fromPoint;
                        return cur;
                    }, from[0]);
                    resultArr.push(minP);
                }
            });
            return resultArr;
        };
        // генерация пробных тиков
        Ticks.prototype.generateCustomDateTicksByOption = function (j, min, max, vp, ctx) {
            function dateParser(myDate) {
                var arr = myDate.split('.');
                arr[2] = '20' + arr[2];
                var date = new Date(+arr[2], +arr[1] - 1, +arr[0]);
                return date;
            }
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var rectXY = [];
            var transformer = new Transformer_1.Transformer();
            switch (this.type) {
                case 'vertical':
                    rectXY = [0, min, 1, max];
                    break;
                case 'horizontal':
                    rectXY = [min, 0, max, 1];
                    break;
            }
            var fromRect = new Rectangle_3.Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
            var pointXY = [];
            var coords = [];
            var values = [];
            var labels = [];
            var yearDel = 1;
            var partYear = this.customTicksOptions[j];
            switch (partYear) {
                case 'half year':
                    yearDel = 2;
                    break;
                case 'third year':
                    yearDel = 3;
                    break;
                case 'quarter year':
                    yearDel = 4;
                    break;
            }
            for (var i = min + 1; i <= max; i++) {
                //let curLabel = this.customLabels[i];
                //let preLabel = this.customLabels[i-1];
                //let curDate = dateParser(curLabel);
                //let preDate = dateParser(preLabel);
                var curDate = this.customLabels[i];
                var preDate = this.customLabels[i - 1];
                //начала годов
                if ((curDate.getFullYear() - preDate.getFullYear()) !== 0) {
                    switch (this.type) {
                        case 'vertical':
                            pointXY = [0, i];
                            break;
                        case 'horizontal':
                            pointXY = [i, 0];
                            break;
                    }
                    var valuePoint = new Point_3.Point(pointXY[0], pointXY[1]);
                    var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                    coords.push(coordPoint);
                    values.push(i);
                    labels.push(curDate.getFullYear());
                }
                else {
                    //начала месяцев
                    if ((this.customTicksOptions[j] !== partYear) || (!(curDate.getMonth() % yearDel))) {
                        if ((curDate.getMonth() - preDate.getMonth()) !== 0) {
                            switch (this.type) {
                                case 'vertical':
                                    pointXY = [0, i];
                                    break;
                                case 'horizontal':
                                    pointXY = [i, 0];
                                    break;
                            }
                            var valuePoint = new Point_3.Point(pointXY[0], pointXY[1]);
                            var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                            coords.push(coordPoint);
                            values.push(i);
                            labels.push(monthNames[curDate.getMonth()]);
                        }
                    }
                }
                //середины месяцев
                if (this.customTicksOptions[j] == 'half month') {
                    if ((curDate.getDay() !== 0) && (curDate.getDay() !== 6)) {
                        if ((curDate.getDate() == 14 || curDate.getDate() == 15 || curDate.getDate() == 16) &&
                            (curDate.getDay() == 1 || curDate.getDay() == 4) || (curDate.getDate() == 14 && curDate.getDay() == 5)) {
                            switch (this.type) {
                                case 'vertical':
                                    pointXY = [0, i];
                                    break;
                                case 'horizontal':
                                    pointXY = [i, 0];
                                    break;
                            }
                            var valuePoint = new Point_3.Point(pointXY[0], pointXY[1]);
                            var coordPoint = transformer.getVeiwportCoord(fromRect, vp, valuePoint);
                            coords.push(coordPoint);
                            values.push(i);
                            labels.push(curDate.getDate());
                        }
                    }
                }
            }
            return [coords, values, labels];
        };
        Ticks.prototype.checkLabelsOverlap = function (ctx, coords, labels) {
            for (var i = 1; i < coords.length; i++) {
                var curRec = this.label.getlabelRect(ctx, coords[i], labels[i]);
                var preRec = this.label.getlabelRect(ctx, coords[i - 1], labels[i - 1]);
                if (curRec.countDistBetweenRects(this.type, preRec) <= 0)
                    return false;
            }
            return true;
        };
        Ticks.prototype.draw = function (ctx, viewport) {
            var _this = this;
            this.coords.forEach(function (tickCoord, i) {
                if (_this.display)
                    _this.drawTick(ctx, tickCoord);
                if (_this.label.display)
                    _this.label.draw(ctx, tickCoord, _this.labels[i]);
            });
            if (this.grid.display)
                this.grid.draw(ctx, viewport, this.coords);
        };
        Ticks.prototype.drawTick = function (ctx, tick) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.linewidth;
            var r = this.tickSize;
            switch (this.type) {
                case 'vertical':
                    ctx.moveTo(tick.x - r, tick.y);
                    ctx.lineTo(tick.x + r, tick.y);
                    ctx.stroke();
                    break;
                case 'horizontal':
                    ctx.moveTo(tick.x, tick.y - r);
                    ctx.lineTo(tick.x, tick.y);
                    ctx.stroke();
                    break;
            }
        };
        return Ticks;
    }());
    exports.Ticks = Ticks;
});
define("Axis", ["require", "exports", "signals", "Rectangle", "Ticks"], function (require, exports, signals_4, Rectangle_4, Ticks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Axis = void 0;
    //описание класса
    var Axis = /** @class */ (function () {
        function Axis(MinMax, type) {
            var options = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                options[_i - 2] = arguments[_i];
            }
            this.display = false;
            this.position = 'start';
            this.gridOn = false;
            this.onOptionsSetted = new signals_4.Signal();
            this.onMinMaxSetted = new signals_4.Signal();
            this.onCustomLabelsAdded = new signals_4.Signal();
            this.onAnimated = new signals_4.Signal();
            this.min = 0;
            this.max = 0;
            this.setMinMax(MinMax);
            this.type = type;
            this._options = {
                lineWidth: 1,
                lineColor: '#000000',
                lineDash: [1, 0]
            };
            this.ticks = new Ticks_1.Ticks(this.type);
            this.setOptions.apply(this, options);
            this.bindChildSignals();
        }
        Axis.prototype.bindChildSignals = function () {
            var _this = this;
            this.ticks.onOptionsSetted.add(function () {
                _this.onOptionsSetted.dispatch();
            });
            this.ticks.onCustomLabelsAdded.add(function () {
                _this.onCustomLabelsAdded.dispatch();
            });
            this.ticks.onAnimated.add(function () {
                _this.onAnimated.dispatch();
            });
        };
        Object.defineProperty(Axis.prototype, "length", {
            get: function () {
                return Math.abs(this.max - this.min);
            },
            enumerable: false,
            configurable: true
        });
        Axis.prototype.setOptions = function () {
            var options = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                options[_i] = arguments[_i];
            }
            switch (options.length) {
                case 1:
                    this._options.lineWidth = options[0];
                    break;
                case 2:
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    break;
                case 3:
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    this._options.lineDash = options[2];
                    break;
            }
            this.onOptionsSetted.dispatch();
        };
        Axis.prototype.setMinMax = function (MinMax, hasPlotAnimation) {
            var to;
            var from;
            from = [this.min, this.max];
            switch (MinMax.length) {
                case 0:
                    to = [0, 100];
                    break;
                case 1:
                    to = [MinMax[0], 100];
                    break;
                case 2:
                    to = [MinMax[0], MinMax[1]];
                    break;
            }
            /*
            if (duration) {
                this.axisRangeAnimation(from, to, duration);
                return;
            }
            */
            this.min = to[0];
            this.max = to[1];
            this.onMinMaxSetted.dispatch(hasPlotAnimation);
        };
        Axis.prototype.draw = function (ctx, viewport) {
            var axisVp = this.getaxisViewport(viewport);
            if (this.display)
                this.drawAxis(ctx, axisVp);
            this.ticks.draw(ctx, viewport);
        };
        Axis.prototype.getaxisViewport = function (vp) {
            var axisVP;
            switch (this.position) {
                case 'start':
                    switch (this.type) {
                        case 'vertical':
                            axisVP = new Rectangle_4.Rectangle(vp.x1, vp.y1, vp.x1, vp.y2);
                            break;
                        case 'horizontal':
                            axisVP = new Rectangle_4.Rectangle(vp.x1, vp.y2, vp.x2, vp.y2);
                            break;
                    }
                    break;
                case 'end':
                case 'start':
                    switch (this.type) {
                        case 'vertical':
                            axisVP = new Rectangle_4.Rectangle(vp.x2, vp.y1, vp.x2, vp.y2);
                            break;
                        case 'horizontal':
                            axisVP = new Rectangle_4.Rectangle(vp.x1, vp.y1, vp.x2, vp.y1);
                            break;
                    }
                    break;
                    break;
            }
            return axisVP;
        };
        Axis.prototype.drawAxis = function (ctx, viewport) {
            ctx.strokeStyle = this._options.lineColor;
            ctx.lineWidth = this._options.lineWidth;
            ctx.setLineDash(this._options.lineDash);
            ctx.beginPath();
            ctx.moveTo(viewport.x1, viewport.y1);
            ctx.lineTo(viewport.x2, viewport.y2);
            ctx.stroke();
            ctx.setLineDash([]);
        };
        Axis.prototype.axisRangeAnimation = function (from, to, duration) {
            var _this = this;
            var start = performance.now();
            var animate = function (time) {
                var timeFraction = (time - start) / duration;
                if (timeFraction > 1)
                    timeFraction = 1;
                _this.min = from[0] + (to[0] - from[0]) * timeFraction;
                _this.max = from[1] + (to[1] - from[1]) * timeFraction;
                _this.onMinMaxSetted.dispatch();
                if (timeFraction < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        };
        return Axis;
    }());
    exports.Axis = Axis;
});
define("Canvas", ["require", "exports", "signals", "Point", "Rectangle"], function (require, exports, signals_5, Point_4, Rectangle_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Canvas = void 0;
    var canvasDpiScaler = require('canvas-dpi-scaler');
    var Canvas = /** @class */ (function () {
        function Canvas(container) {
            var paddings = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                paddings[_i - 1] = arguments[_i];
            }
            this.changed = new signals_5.Signal();
            this.mouseMoved = new signals_5.Signal();
            this.mouseOuted = new signals_5.Signal();
            this.touchEnded = new signals_5.Signal();
            this.container = container;
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'absolute';
            this.top = 0;
            this.right = 0;
            this.bottom = 0;
            this.left = 0;
            this.setPaddings.apply(this, paddings);
            this.container.appendChild(this.canvas);
            this._ctx = this.canvas.getContext('2d');
            this.clear = this.clear.bind(this);
            this.resize();
        }
        Canvas.prototype.turnOnListenres = function () {
            var _this = this;
            this.canvas.addEventListener('mousemove', function (event) {
                _this.mouseCoords = _this.getMouseCoords(event);
                if (_this.inDrawArea) {
                    _this.mouseMoved.dispatch();
                }
                else {
                    _this.mouseCoords = new Point_4.Point(_this.viewport.width, _this.viewport.zeroY);
                    _this.mouseOuted.dispatch();
                }
            });
            this.canvas.addEventListener('mouseleave', function (event) {
                _this.mouseCoords = new Point_4.Point(_this.viewport.width, _this.viewport.zeroY);
                _this.mouseOuted.dispatch();
            });
            this.canvas.addEventListener('touchmove', function (event) {
                _this.mouseCoords = _this.getTouchCoords(event);
                if (_this.inDrawArea) {
                    _this.mouseMoved.dispatch();
                }
                else {
                    _this.mouseCoords = new Point_4.Point(_this.viewport.width, _this.viewport.zeroY);
                    _this.mouseOuted.dispatch();
                }
            });
            this.canvas.addEventListener('touchend', function (event) {
                _this.mouseCoords = new Point_4.Point(_this.viewport.width, _this.viewport.zeroY);
                _this.touchEnded.dispatch();
            });
            this.mouseCoords = new Point_4.Point(this.viewport.width, this.viewport.zeroY);
        };
        Canvas.prototype.addOnPage = function () {
            this.container.appendChild(this.canvas);
        };
        Object.defineProperty(Canvas.prototype, "inDrawArea", {
            get: function () {
                if (this.mouseCoords.x < 0)
                    return false;
                if (this.mouseCoords.x > this.viewport.width)
                    return false;
                if (this.mouseCoords.y < 0)
                    return false;
                if (this.mouseCoords.y > this.viewport.height)
                    return false;
                return true;
            },
            enumerable: false,
            configurable: true
        });
        Canvas.prototype.setPaddings = function () {
            var paddings = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                paddings[_i] = arguments[_i];
            }
            var fields = {};
            var defaultPad = 50;
            switch (paddings.length) {
                case 0:
                    this.top = defaultPad;
                    this.right = defaultPad;
                    this.bottom = defaultPad;
                    this.left = defaultPad;
                    break;
                case 1:
                    this.top = paddings[0];
                    this.right = defaultPad;
                    this.bottom = defaultPad;
                    this.left = defaultPad;
                    break;
                case 2:
                    this.top = paddings[0];
                    this.right = paddings[1];
                    this.bottom = paddings[0];
                    this.left = paddings[1];
                    break;
                case 3:
                    this.top = paddings[0];
                    this.right = paddings[1];
                    this.bottom = paddings[2];
                    this.left = defaultPad;
                    break;
                case 4:
                    this.top = paddings[0];
                    this.right = paddings[1];
                    this.bottom = paddings[2];
                    this.left = paddings[3];
                    break;
            }
            this.mouseCoords = new Point_4.Point(this.viewport.width, this.viewport.zeroY);
            this.changed.dispatch();
            return;
        };
        Object.defineProperty(Canvas.prototype, "ctx", {
            get: function () {
                return this._ctx;
            },
            enumerable: false,
            configurable: true
        });
        Canvas.prototype.resize = function () {
            this.clear();
            this.drawVp();
            this.width = this.container.getBoundingClientRect().width;
            this.height = this.container.getBoundingClientRect().height;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.style.width = this.width.toString() + 'px';
            this.canvas.style.height = this.height.toString() + 'px';
            canvasDpiScaler(this.canvas, this._ctx, this.width, this.height);
        };
        Canvas.prototype.clear = function () {
            if (this._ctx)
                this._ctx.clearRect(0, 0, this.width, this.height);
        };
        Object.defineProperty(Canvas.prototype, "viewport", {
            get: function () {
                return new Rectangle_5.Rectangle(this.left, this.top, this.width - this.right, this.height - this.bottom);
            },
            enumerable: false,
            configurable: true
        });
        Canvas.prototype.drawVp = function () {
            var rect = this.viewport;
            this.ctx.rect(rect.x1, rect.y1, rect.width, rect.height);
            this.ctx.stroke();
        };
        Canvas.prototype.getMouseCoords = function (event) {
            var bcr = this.canvas.getBoundingClientRect();
            return new Point_4.Point(event.clientX - bcr.left - this.viewport.zeroX, event.clientY - bcr.top - this.viewport.y1);
        };
        Canvas.prototype.getTouchCoords = function (event) {
            var clientX = event.touches[0].clientX;
            var clientY = event.touches[0].clientY;
            var bcr = this.canvas.getBoundingClientRect();
            return new Point_4.Point(clientX - bcr.left - this.viewport.zeroX, clientY - bcr.top - this.viewport.y1);
        };
        Canvas.prototype.clipCanvas = function () {
            var rect = this.viewport;
            var squarePath = new Path2D();
            squarePath.rect(rect.x1, rect.y1, rect.width, rect.height);
            this._ctx.clip(squarePath);
        };
        return Canvas;
    }());
    exports.Canvas = Canvas;
});
define("Series", ["require", "exports", "signals", "Canvas", "Point", "Rectangle", "Transformer"], function (require, exports, signals_6, Canvas_1, Point_5, Rectangle_6, Transformer_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Series = void 0;
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
            this.onPlotDataChanged = new signals_6.Signal();
            this.id = id;
            this.seriesData = this.getInitialData(seriesData);
            this.extremes = this.findExtremes();
            this.plots = [];
            this.plotData = [];
            this.canvas = new Canvas_1.Canvas(container);
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
                return new Rectangle_6.Rectangle(extremes[0], extremes[2], extremes[1], extremes[3]);
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
            return new Point_5.Point(ind, this.seriesData[1][ind]);
        };
        Series.prototype.getClosestPlotPoint = function (x) {
            var coord = this.plotDataArr.reduce(function (prev, curr, i) {
                var curDif = Math.abs(curr.x - x);
                var prevDif = Math.abs(prev.x - x);
                if (curDif < prevDif)
                    return curr;
                return prev;
            }, this.plotDataArr[0]);
            return new Point_5.Point(coord.x, coord.y);
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
            var transformer = new Transformer_2.Transformer();
            var _loop_2 = function (i) {
                var plotDataRow = [];
                var dataRowInd = seriesData[i];
                var dataRowVal = seriesData[i + 1];
                dataRowInd.forEach(function (element, ind) {
                    var seriesPoint = new Point_5.Point(dataRowInd[ind], dataRowVal[ind]);
                    var plotPoint = transformer.getVeiwportCoord(axisRect, vp, seriesPoint);
                    plotDataRow.push(new Point_5.Point(Math.round(plotPoint.x), Math.round(plotPoint.y)));
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
                        return new Point_5.Point(Math.round(fromRow[i].x + (toData[ind][i].x - fromRow[i].x) * timeFraction), Math.round(fromRow[i].y + (toData[ind][i].y - fromRow[i].y) * timeFraction));
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
    exports.Series = Series;
});
define("Data", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Data = void 0;
    var Data = /** @class */ (function () {
        function Data() {
            this.seriesStorage = [];
        }
        Data.prototype.findExtremes = function (type, from, to) {
            var maxArr = [];
            var minArr = [];
            this.seriesStorage.forEach(function (series) {
                var dataRange;
                if ((from !== undefined) && (to !== undefined)) {
                    dataRange = series.getDataRange(type, from, to);
                }
                else {
                    dataRange = series.seriesData;
                }
                var extremes = series.findExtremes(dataRange);
                switch (type) {
                    case 'ind':
                        minArr.push(extremes[2]);
                        maxArr.push(extremes[3]);
                        break;
                    case 'val':
                        minArr.push(extremes[0]);
                        maxArr.push(extremes[1]);
                        break;
                }
            });
            return [Math.min.apply(Math, minArr), Math.max.apply(Math, maxArr)];
        };
        Data.prototype.findSeriesById = function (id) {
            var series = this.seriesStorage.filter(function (series) {
                return series.id === id;
            });
            if (series.length !== 0)
                return series[0];
            return null;
        };
        Data.prototype.switchAllSeriesAnimation = function (hasAnimation, duration) {
            this.seriesStorage.forEach(function (series, ind) {
                series.hasAnimation = hasAnimation;
                if (duration)
                    series.animationDuration = duration;
            });
        };
        Data.prototype.changeAllSeriesAnimationTimeFunction = function (newTimeFunc) {
            this.seriesStorage.forEach(function (series, ind) {
                series.timeFunc = newTimeFunc;
            });
        };
        return Data;
    }());
    exports.Data = Data;
});
define("Tooltip", ["require", "exports", "Rectangle", "Point", "Label"], function (require, exports, Rectangle_7, Point_6, Label_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tooltip = void 0;
    //описание класса
    var Tooltip = /** @class */ (function () {
        function Tooltip(id, type) {
            var options = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                options[_i - 2] = arguments[_i];
            }
            this._id = id;
            this.type = type;
            this._options = {
                lineWidth: 1,
                lineColor: '#000000',
                brushColor: '#000000',
                mainSize: 2,
                lineDash: [],
            };
            this.label = new Label_2.Label();
            //if (labels) this.labels = labels;
            this.setOptions(options);
        }
        Object.defineProperty(Tooltip.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: false,
            configurable: true
        });
        Tooltip.prototype.setOptions = function (options) {
            switch (this.type) {
                case 'circle_series':
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    this._options.brushColor = options[2];
                    this._options.mainSize = options[3];
                    break;
                case 'line_vertical_full':
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    this._options.lineDash = options[2];
                    break;
                case 'line_horizontal_end':
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    this._options.lineDash = options[2];
                    break;
                case 'label_x_start':
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    this._options.brushColor = options[2];
                    this._options.mainSize = options[3];
                    this.labels = options[4];
                    break;
                case 'circle_y_end':
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    this._options.brushColor = options[2];
                    this._options.mainSize = options[3];
                    break;
                case 'data_y_end':
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    this._options.brushColor = options[2];
                    this._options.mainSize = options[3];
                    break;
                case 'delta_abs':
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    this._options.brushColor = options[2];
                    this._options.mainSize = options[3];
                    break;
            }
        };
        Tooltip.prototype.drawTooltip = function (ctx, vp, ttCoord, xyData, toDraw) {
            switch (this.type) {
                case 'circle_series':
                    this.drawCircleSeries(ctx, ttCoord);
                    break;
                case 'line_vertical_full':
                    this.drawLineVerticalFull(ctx, vp, ttCoord);
                    break;
                case 'line_horizontal_end':
                    this.drawLineHorizontalEnd(ctx, vp, ttCoord);
                    break;
                case 'label_x_start':
                    this.drawLabelXStart(ctx, vp, ttCoord, xyData);
                    break;
                case 'circle_y_end':
                    this.drawCircleYEnd(ctx, vp, ttCoord);
                    break;
                case 'data_y_end':
                    return this.drawDataYEnd(ctx, vp, ttCoord, xyData, toDraw);
                case 'delta_abs':
                    this.drawDeltaAbs(ctx, vp, ttCoord, xyData);
                    break;
            }
        };
        Tooltip.prototype.drawCircleSeries = function (ctx, ttCoord) {
            ctx.strokeStyle = this._options.lineColor;
            ctx.lineWidth = this._options.lineWidth;
            ctx.fillStyle = this._options.brushColor;
            ctx.setLineDash(this._options.lineDash);
            ctx.beginPath();
            ctx.arc(ttCoord.x, ttCoord.y, this._options.mainSize, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        };
        Tooltip.prototype.drawLineVerticalFull = function (ctx, vp, ttCoord) {
            ctx.strokeStyle = this._options.lineColor;
            ctx.lineWidth = this._options.lineWidth;
            ctx.setLineDash(this._options.lineDash);
            ctx.beginPath();
            ctx.moveTo(ttCoord.x, vp.y1);
            ctx.lineTo(ttCoord.x, vp.zeroY);
            ctx.stroke();
            ctx.setLineDash([]);
        };
        Tooltip.prototype.drawLineHorizontalEnd = function (ctx, vp, ttCoord) {
            ctx.strokeStyle = this._options.lineColor;
            ctx.lineWidth = this._options.lineWidth;
            ctx.setLineDash(this._options.lineDash);
            ctx.beginPath();
            ctx.moveTo(ttCoord.x, ttCoord.y);
            ctx.lineTo(vp.x2, ttCoord.y);
            ctx.stroke();
            ctx.setLineDash([]);
        };
        Tooltip.prototype.drawLabelXStart = function (ctx, vp, ttCoord, seriesData) {
            ctx.strokeStyle = this._options.lineColor;
            ctx.lineWidth = this._options.lineWidth;
            ctx.fillStyle = this._options.brushColor;
            ctx.setLineDash(this._options.lineDash);
            // параметры
            var rectPadding = 4;
            var rectWidth = 55;
            var labelText = (this.labels[seriesData.x]).toLocaleDateString('en');
            var cornersRadius = this._options.mainSize;
            var labelCoord = new Point_6.Point(ttCoord.x, vp.zeroY);
            var labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
            var labelCenter = new Point_6.Point(labelCoord.x, labelRect.y1 + labelRect.height * 0.5);
            var roundRect = new Rectangle_7.Rectangle(labelCenter.x - rectWidth * 0.5, labelCenter.y - rectPadding - labelRect.height * 0.5, labelCenter.x + rectWidth * 0.5, labelCenter.y + rectPadding + labelRect.height * 0.5);
            if (roundRect.x1 < vp.x1) {
                labelCoord.x = labelCoord.x + vp.x1 - roundRect.x1;
                roundRect.move(0, vp.x1 - roundRect.x1);
            }
            if (roundRect.x2 > vp.x2) {
                labelCoord.x = labelCoord.x - (roundRect.x2 - vp.x2);
                roundRect.move(0, -roundRect.x2 + vp.x2);
            }
            labelCenter = new Point_6.Point(labelCoord.x, labelRect.y1 + labelRect.height * 0.5);
            roundRect = new Rectangle_7.Rectangle(labelCenter.x - rectWidth * 0.5, labelCenter.y - rectPadding - labelRect.height * 0.5, labelCenter.x + rectWidth * 0.5, labelCenter.y + rectPadding + labelRect.height * 0.5);
            this.roundRect(ctx, roundRect.x1, roundRect.y1, roundRect.width, roundRect.height, cornersRadius);
            ctx.fill();
            ctx.stroke();
            this.label.draw(ctx, labelCoord, labelText);
            return roundRect;
        };
        Tooltip.prototype.roundRect = function (ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        };
        Tooltip.prototype.drawCircleYEnd = function (ctx, vp, ttCoord) {
            ctx.strokeStyle = this._options.lineColor;
            ctx.lineWidth = this._options.lineWidth;
            ctx.fillStyle = this._options.brushColor;
            ctx.setLineDash(this._options.lineDash);
            ctx.beginPath();
            ctx.arc(vp.x2, ttCoord.y, this._options.mainSize, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        };
        Tooltip.prototype.drawDataYEnd = function (ctx, vp, start_ttCoord, seriesData, toDraw) {
            var ttCoord = new Point_6.Point(start_ttCoord.x, start_ttCoord.y);
            ctx.strokeStyle = this._options.lineColor;
            ctx.lineWidth = this._options.lineWidth;
            ctx.fillStyle = this._options.brushColor;
            ctx.setLineDash(this._options.lineDash);
            // параметры
            var rectPadding = 6;
            var labelText = (seriesData.y).toFixed(1) + '%';
            var cornersRadius = this._options.mainSize;
            this.label.position = 'right';
            this.label.offset = 23;
            var labelCoord = new Point_6.Point(vp.x2, ttCoord.y);
            var labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
            var labelStart = new Point_6.Point(labelRect.x1, labelRect.y1);
            var roundRect = new Rectangle_7.Rectangle(vp.x2 + 11 - rectPadding, labelStart.y - rectPadding, vp.x2 + rectPadding + 35, labelStart.y - rectPadding + labelRect.height + 2 * rectPadding);
            if (roundRect.y1 < vp.y1) {
                labelCoord.y = labelCoord.y + vp.y1 - roundRect.y1;
                ttCoord.y = labelCoord.y;
                roundRect.move(0, vp.y1 - roundRect.y1);
            }
            if (roundRect.y2 > vp.y2) {
                labelCoord.y = labelCoord.y - (roundRect.y2 - vp.y2);
                ttCoord.y = labelCoord.y;
                roundRect.move(0, -roundRect.y2 + vp.y2);
            }
            this.roundRect(ctx, roundRect.x1, roundRect.y1, roundRect.width, roundRect.height, cornersRadius);
            //labelCoord.x = roundRect.x1+roundRect.width*0.5-labelRect.width*0.5-this.label.offset;
            if (toDraw) {
                ctx.fill();
                ctx.stroke();
                this.label.draw(ctx, labelCoord, labelText);
            }
            return roundRect;
        };
        Tooltip.prototype.drawDeltaAbs = function (ctx, vp, ttCoord, seriesData) {
            ctx.strokeStyle = this._options.lineColor;
            ctx.lineWidth = this._options.lineWidth;
            ctx.fillStyle = this._options.brushColor;
            ctx.setLineDash(this._options.lineDash);
            var labelCoord = new Point_6.Point(ttCoord.x, ttCoord.y);
            //параметры начальные
            this.label.position = 'right';
            this.label.offset = 33;
            var lineX = ttCoord.x;
            labelCoord.y = labelCoord.y - 25;
            var rectPadding = 10;
            var labelText = 'Δ ' + (seriesData.y).toFixed(2);
            var cornersRadius = this._options.mainSize;
            var labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
            var labelStart = new Point_6.Point(labelRect.x1, labelRect.y1);
            var roundRect = new Rectangle_7.Rectangle(labelStart.x - rectPadding, labelStart.y - rectPadding, labelStart.x - rectPadding + labelRect.width + 2 * rectPadding, labelStart.y - rectPadding + labelRect.height + 2 * rectPadding);
            if (roundRect.x2 > vp.x2) {
                labelCoord.x = labelCoord.x - roundRect.x2 + vp.x2;
                roundRect.move(-roundRect.x2 + vp.x2, 0);
            }
            if (roundRect.x1 < lineX) {
                labelCoord.x = lineX;
                this.label.position = 'left';
                labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
                labelStart = new Point_6.Point(labelRect.x2, labelRect.y1);
                roundRect = new Rectangle_7.Rectangle(labelStart.x - labelRect.width - rectPadding, labelStart.y - rectPadding, labelStart.x + rectPadding, labelStart.y + labelRect.height + rectPadding);
            }
            if (roundRect.y1 < vp.y1) {
                labelCoord.y = labelCoord.y + vp.y1 - roundRect.y1;
                roundRect.move(0, vp.y1 - roundRect.y1);
            }
            this.roundRect(ctx, roundRect.x1, roundRect.y1, roundRect.width, roundRect.height, cornersRadius);
            ctx.fill();
            ctx.stroke();
            this.label.draw(ctx, labelCoord, labelText);
        };
        return Tooltip;
    }());
    exports.Tooltip = Tooltip;
});
define("Plot", ["require", "exports", "Tooltip"], function (require, exports, Tooltip_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Plot = void 0;
    //описание класса
    var Plot = /** @class */ (function () {
        function Plot(id, type) {
            var options = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                options[_i - 2] = arguments[_i];
            }
            this.hasAnimation = false;
            this.animationDuration = 300;
            this._id = id;
            this.type = type;
            this._options = {
                lineWidth: 0.5,
                lineColor: '#000000',
                brushColor: '#000000',
                mainSize: 1,
            };
            this.setOptions(options);
            this.tooltips = [];
        }
        Plot.prototype.setOptions = function (options) {
            switch (options.length) {
                case 1:
                    this._options.lineWidth = options[0];
                    break;
                case 2:
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    break;
                case 3:
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    this._options.brushColor = options[2];
                    break;
                case 4:
                    this._options.lineWidth = options[0];
                    this._options.lineColor = options[1];
                    this._options.brushColor = options[2];
                    this._options.mainSize = options[3];
                    break;
            }
        };
        Object.defineProperty(Plot.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: false,
            configurable: true
        });
        Plot.prototype.drawPlot = function (ctx, plotData) {
            ctx.strokeStyle = this._options.lineColor;
            ctx.lineWidth = this._options.lineWidth;
            ctx.globalAlpha = 1;
            ctx.fillStyle = this._options.brushColor;
            switch (this.type) {
                case 'dotted':
                    this.drawDotted(ctx, plotData);
                    break;
                case 'line':
                    this.drawLine(ctx, plotData);
                    break;
                case 'area':
                    this.drawArea(ctx, plotData);
                    break;
            }
        };
        Plot.prototype.drawDotted = function (ctx, plotData) {
            for (var i = 1; i < plotData.length; i++) {
                ctx.beginPath();
                ctx.arc(plotData[i].x, plotData[i].y, this._options.mainSize, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        };
        Plot.prototype.drawLine = function (ctx, plotData) {
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.moveTo(plotData[0].x, plotData[0].y);
            for (var i = 1; i < plotData.length; i++) {
                ctx.lineTo(plotData[i].x, plotData[i].y);
            }
            ctx.stroke();
        };
        Plot.prototype.drawArea = function (ctx, plotData) {
            ctx.beginPath();
            ctx.lineTo(plotData[0].x, plotData[0].y);
            for (var i = 1; i < plotData.length; i++) {
                ctx.lineTo(plotData[i].x, plotData[i].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        };
        Plot.prototype.addTooltip = function (id, type) {
            var options = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                options[_i - 2] = arguments[_i];
            }
            var tooltip = new (Tooltip_1.Tooltip.bind.apply(Tooltip_1.Tooltip, __spreadArrays([void 0, id, type], options)))();
            this.tooltips.push(tooltip);
            return tooltip;
        };
        Plot.prototype.findTooltipById = function (id) {
            var tooltips = this.tooltips.filter(function (tooltip) {
                return tooltip.id === id;
            });
            if (tooltips.length !== 0)
                return tooltips[0];
            return null;
        };
        return Plot;
    }());
    exports.Plot = Plot;
});
define("Chart", ["require", "exports", "Canvas", "Data", "Plot", "Axis", "Transformer", "Rectangle", "Point", "Series", "signals"], function (require, exports, Canvas_2, Data_1, Plot_1, Axis_1, Transformer_3, Rectangle_8, Point_7, Series_1, signals_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Chart = void 0;
    var Chart = /** @class */ (function () {
        function Chart(container, xMinMax, yMinMax) {
            var _this = this;
            this.container = container;
            this.canvas = new Canvas_2.Canvas(container);
            this.canvasA = new Canvas_2.Canvas(container);
            this.canvasTT = new Canvas_2.Canvas(container);
            this.canvasTT.turnOnListenres();
            this.canvasTT.canvas.style.zIndex = "10";
            this.data = new Data_1.Data();
            this.plots = [];
            this.xAxis = new Axis_1.Axis(xMinMax, 'horizontal');
            this.yAxis = new Axis_1.Axis(yMinMax, 'vertical');
            this.tooltipsDraw = this.tooltipsDraw.bind(this);
            this.seriesReDraw = this.seriesReDraw.bind(this);
            window.addEventListener('resize', function () { _this.reSize(); });
            this.reSize();
            this.bindChildSignals();
            this.tooltipsDraw(true);
            this.tooltipsDataIndexUpdated = new signals_7.Signal();
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
                return (new Rectangle_8.Rectangle(this.xAxis.min, this.yAxis.min, this.xAxis.max, this.yAxis.max));
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
            var plot = new (Plot_1.Plot.bind.apply(Plot_1.Plot, __spreadArrays([void 0, id, type], options)))();
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
            var newSeries = new (Series_1.Series.bind.apply(Series_1.Series, __spreadArrays([void 0, id, this.container], seriesData)))();
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
            var transformer = new Transformer_3.Transformer();
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
                                        tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, new Point_7.Point(tooltipCoord.x, tooltipCoord.y), pointData);
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
                                            var absData = new Point_7.Point(Math.abs(pointData.x - delta_abs_buf[0].x), Math.abs(pointData.y - delta_abs_buf[0].y));
                                            tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, ttCoord, absData);
                                            delta_abs_buf.pop();
                                            delta_abs_buf_coord.pop();
                                        }
                                        break;
                                    case 'data_y_end':
                                        data_y_end_buf.push([tooltip, tooltipCoord, pointData]);
                                        break;
                                    case 'label_x_start':
                                        tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasA.viewport, new Point_7.Point(tooltipCoord.x, tooltipCoord.y), pointData);
                                        break;
                                    case 'line_vertical_full':
                                        tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasA.viewport, new Point_7.Point(tooltipCoord.x, tooltipCoord.y), pointData);
                                        break;
                                    default:
                                        tooltip.drawTooltip(_this.canvasTT.ctx, _this.canvasTT.viewport, new Point_7.Point(tooltipCoord.x, tooltipCoord.y), pointData);
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
    exports.Chart = Chart;
});
define("index", ["require", "exports", "Chart"], function (require, exports, Chart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Chart = void 0;
    Object.defineProperty(exports, "Chart", { enumerable: true, get: function () { return Chart_1.Chart; } });
});
