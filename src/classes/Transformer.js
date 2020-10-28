import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
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
        var coord = new Point(coordRect.zeroX, coordRect.zeroY);
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
        return new Rectangle(x1, y1, x2, y2);
    };
    Transformer.prototype.transFunc = function (x, y, coeff) {
        var res;
        return res = coeff[0] * x + coeff[1] * y + coeff[2];
    };
    return Transformer;
}());
export { Transformer };
