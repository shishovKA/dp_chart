import { Signal } from "signals";
import { Rectangle } from "./Rectangle";
import { Ticks } from "./Ticks";
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
        this.onOptionsSetted = new Signal();
        this.onMinMaxSetted = new Signal();
        this.onCustomLabelsAdded = new Signal();
        this.onAnimated = new Signal();
        this.min = 0;
        this.max = 0;
        this.setMinMax(MinMax);
        this.type = type;
        this._options = {
            lineWidth: 1,
            lineColor: '#000000',
            lineDash: [1, 0]
        };
        this.ticks = new Ticks(this.type);
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
                        axisVP = new Rectangle(vp.x1, vp.y1, vp.x1, vp.y2);
                        break;
                    case 'horizontal':
                        axisVP = new Rectangle(vp.x1, vp.y2, vp.x2, vp.y2);
                        break;
                }
                break;
            case 'end':
            case 'start':
                switch (this.type) {
                    case 'vertical':
                        axisVP = new Rectangle(vp.x2, vp.y1, vp.x2, vp.y2);
                        break;
                    case 'horizontal':
                        axisVP = new Rectangle(vp.x1, vp.y1, vp.x2, vp.y1);
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
export { Axis };
