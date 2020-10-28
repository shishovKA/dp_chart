import { Signal } from "signals";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
var canvasDpiScaler = require('canvas-dpi-scaler');
var Canvas = /** @class */ (function () {
    function Canvas(container) {
        var paddings = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paddings[_i - 1] = arguments[_i];
        }
        this.changed = new Signal();
        this.mouseMoved = new Signal();
        this.mouseOuted = new Signal();
        this.touchEnded = new Signal();
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
                _this.mouseCoords = new Point(_this.viewport.x2, _this.viewport.zeroY);
                _this.mouseOuted.dispatch();
            }
        });
        this.canvas.addEventListener('mouseleave', function (event) {
            _this.mouseCoords = new Point(_this.viewport.x2, _this.viewport.zeroY);
            _this.mouseOuted.dispatch();
        });
        this.canvas.addEventListener('touchmove', function (event) {
            _this.mouseCoords = _this.getTouchCoords(event);
            if (_this.inDrawArea) {
                _this.mouseMoved.dispatch();
            }
            else {
                _this.mouseCoords = new Point(_this.viewport.x2, _this.viewport.zeroY);
                _this.mouseOuted.dispatch();
            }
        });
        this.canvas.addEventListener('touchend', function (event) {
            _this.mouseCoords = new Point(_this.viewport.x2, _this.viewport.zeroY);
            _this.touchEnded.dispatch();
        });
        this.mouseCoords = new Point(this.viewport.x2, this.viewport.zeroY);
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
        this.mouseCoords = new Point(this.viewport.x2, this.viewport.zeroY);
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
            return new Rectangle(this.left, this.top, this.width - this.right, this.height - this.bottom);
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
        return new Point(event.clientX - bcr.left - this.viewport.x1, event.clientY - bcr.top - this.viewport.y1);
    };
    Canvas.prototype.getTouchCoords = function (event) {
        var clientX = event.touches[0].clientX;
        var clientY = event.touches[0].clientY;
        var bcr = this.canvas.getBoundingClientRect();
        return new Point(clientX - bcr.left - this.viewport.x1, clientY - bcr.top - this.viewport.y1);
    };
    Canvas.prototype.clipCanvas = function () {
        var rect = this.viewport;
        var squarePath = new Path2D();
        squarePath.rect(rect.x1, rect.y1, rect.width, rect.height);
        this._ctx.clip(squarePath);
    };
    return Canvas;
}());
export { Canvas };
