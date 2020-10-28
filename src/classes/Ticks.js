import { Signal } from "signals";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Label } from "./Label";
import { Grid } from "./Grid";
import { Transformer } from "./Transformer";
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
        this.onOptionsSetted = new Signal();
        this.onCustomLabelsAdded = new Signal();
        this.onAnimated = new Signal();
        this.coords = [];
        this.values = [];
        this.labels = [];
        this.type = axistype;
        this.label = new Label(this.type);
        this.grid = new Grid(this.type);
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
        var transformer = new Transformer();
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
        var fromRect = new Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
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
            var valuePoint = new Point(pointXY[0], pointXY[1]);
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
        var transformer = new Transformer();
        switch (this.type) {
            case 'vertical':
                rectXY = [0, min, 1, max];
                break;
            case 'horizontal':
                rectXY = [min, 0, max, 1];
                break;
        }
        var fromRect = new Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
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
                var valuePoint = new Point(pointXY[0], pointXY[1]);
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
                var valuePoint = new Point(pointXY[0], pointXY[1]);
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
                return new Point(from[i].x + (to[i].x - from[i].x) * timeFraction, from[i].y + (to[i].y - from[i].y) * timeFraction);
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
        var transformer = new Transformer();
        switch (this.type) {
            case 'vertical':
                rectXY = [0, min, 1, max];
                break;
            case 'horizontal':
                rectXY = [min, 0, max, 1];
                break;
        }
        var fromRect = new Rectangle(rectXY[0], rectXY[1], rectXY[2], rectXY[3]);
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
                var valuePoint = new Point(pointXY[0], pointXY[1]);
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
                        var valuePoint = new Point(pointXY[0], pointXY[1]);
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
                        var valuePoint = new Point(pointXY[0], pointXY[1]);
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
export { Ticks };
