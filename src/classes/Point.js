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
export { Point };
