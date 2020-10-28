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
export { Rectangle };
