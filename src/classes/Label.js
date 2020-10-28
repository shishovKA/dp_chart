import { Point } from "./Point";
import { Signal } from "signals";
import { Rectangle } from "./Rectangle";
var Label = /** @class */ (function () {
    function Label(type) {
        this.display = true;
        this.color = 'black';
        this.font = '16px serif';
        this.fontSize = 16;
        this.position = 'bottom';
        this.offset = 15;
        this.onOptionsSetted = new Signal();
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
        var labelCoord = new Point(coord.x - text.width * 0.5, coord.y);
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
        var labelCoord = new Point(coord.x - text.width * 0.5, coord.y);
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
        return new Rectangle(labelCoord.x, labelCoord.y - this.fontSize * 0.5, labelCoord.x + text.width, labelCoord.y + this.fontSize * 0.5);
    };
    return Label;
}());
export { Label };
