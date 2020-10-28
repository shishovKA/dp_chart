import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { Label } from "./Label";
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
        this.label = new Label();
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
        var labelCoord = new Point(ttCoord.x, vp.zeroY);
        var labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
        var labelCenter = new Point(labelCoord.x, labelRect.y1 + labelRect.height * 0.5);
        var roundRect = new Rectangle(labelCenter.x - rectWidth * 0.5, labelCenter.y - rectPadding - labelRect.height * 0.5, labelCenter.x + rectWidth * 0.5, labelCenter.y + rectPadding + labelRect.height * 0.5);
        if (roundRect.x1 < vp.x1) {
            labelCoord.x = labelCoord.x + vp.x1 - roundRect.x1;
            roundRect.move(0, vp.x1 - roundRect.x1);
        }
        if (roundRect.x2 > vp.x2) {
            labelCoord.x = labelCoord.x - (roundRect.x2 - vp.x2);
            roundRect.move(0, -roundRect.x2 + vp.x2);
        }
        labelCenter = new Point(labelCoord.x, labelRect.y1 + labelRect.height * 0.5);
        roundRect = new Rectangle(labelCenter.x - rectWidth * 0.5, labelCenter.y - rectPadding - labelRect.height * 0.5, labelCenter.x + rectWidth * 0.5, labelCenter.y + rectPadding + labelRect.height * 0.5);
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
        var ttCoord = new Point(start_ttCoord.x, start_ttCoord.y);
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
        var labelCoord = new Point(vp.x2, ttCoord.y);
        var labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
        var labelStart = new Point(labelRect.x1, labelRect.y1);
        var roundRect = new Rectangle(vp.x2 + 11 - rectPadding, labelStart.y - rectPadding, vp.x2 + rectPadding + 35, labelStart.y - rectPadding + labelRect.height + 2 * rectPadding);
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
        var labelCoord = new Point(ttCoord.x, ttCoord.y);
        //параметры начальные
        this.label.position = 'right';
        this.label.offset = 33;
        var lineX = ttCoord.x;
        labelCoord.y = labelCoord.y - 25;
        var rectPadding = 10;
        var labelText = 'Δ ' + (seriesData.y).toFixed(2);
        var cornersRadius = this._options.mainSize;
        var labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
        var labelStart = new Point(labelRect.x1, labelRect.y1);
        var roundRect = new Rectangle(labelStart.x - rectPadding, labelStart.y - rectPadding, labelStart.x - rectPadding + labelRect.width + 2 * rectPadding, labelStart.y - rectPadding + labelRect.height + 2 * rectPadding);
        if (roundRect.x2 > vp.x2) {
            labelCoord.x = labelCoord.x - roundRect.x2 + vp.x2;
            roundRect.move(-roundRect.x2 + vp.x2, 0);
        }
        if (roundRect.x1 < lineX) {
            labelCoord.x = lineX;
            this.label.position = 'left';
            labelRect = this.label.getlabelRect(ctx, labelCoord, labelText);
            labelStart = new Point(labelRect.x2, labelRect.y1);
            roundRect = new Rectangle(labelStart.x - labelRect.width - rectPadding, labelStart.y - rectPadding, labelStart.x + rectPadding, labelStart.y + labelRect.height + rectPadding);
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
export { Tooltip };
