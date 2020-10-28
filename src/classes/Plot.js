var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Tooltip } from "./Tooltip";
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
        var tooltip = new (Tooltip.bind.apply(Tooltip, __spreadArrays([void 0, id, type], options)))();
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
export { Plot };
