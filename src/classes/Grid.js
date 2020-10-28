import { Signal } from "signals";
var Grid = /** @class */ (function () {
    function Grid(type) {
        this.display = false;
        this.onOptionsSetted = new Signal();
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
export { Grid };
