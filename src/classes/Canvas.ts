import { Signal } from "signals"
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";

const canvasDpiScaler = require('canvas-dpi-scaler');

export class Canvas {

    container: HTMLElement;
    canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D | null;
    height: number;
    width: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
    mouseCoords: Point;
    changed: Signal;
    mouseMoved: Signal;

    constructor(container: HTMLElement, ...paddings: number[]) {
        this.changed = new Signal();
        this.mouseMoved = new Signal();

        this.container = container;
        this.canvas = document.createElement('canvas');

        this.width = this.container.getBoundingClientRect().width;
        this.height = this.container.getBoundingClientRect().height;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.container.appendChild(this.canvas);
        this._ctx = this.canvas.getContext('2d');
        
        //canvasDpiScaler(this.canvas, this._ctx);

        this.resize();
        

        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.left = 0;
        this.setPaddings(...paddings);

        this.canvas.addEventListener('mousemove', (event) => {
            this.mouseCoords = this.getMouseCoords(event);
            this.mouseMoved.dispatch();
          });
    }

    setPaddings(...paddings: number[]) {
        let fields = {};
        const defaultPad: number = 50;

        switch(paddings.length) {
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
        
        this.changed.dispatch();
        return 
    }


    get ctx(): CanvasRenderingContext2D | null {
        return this._ctx;
    }

    resize() {
        this.clear();
        this.width = this.container.getBoundingClientRect().width;
        this.height = this.container.getBoundingClientRect().height;
        canvasDpiScaler(this.canvas, this._ctx, this.width, this.height);
    }

    clear() {
        if (this._ctx) this._ctx.clearRect(0, 0, this.width, this.height);
    }

    get viewport(): Rectangle {
        return new Rectangle(this.left, this.top, this.width-this.right, this.height-this.bottom);
    }

    drawVp() {
        const rect = this.viewport;
        this.ctx.rect(rect.x1, rect.y1, rect.width, rect.height);
        this.ctx.stroke();
    }

    getMouseCoords(event): Point {
        var bcr = this.canvas.getBoundingClientRect();
        return new Point(event.clientX - bcr.left - this.viewport.zeroX, event.clientY - bcr.top - this.viewport.y1);
    }

    clipCanvas() {
        const rect = this.viewport;
        let squarePath = new Path2D();
        squarePath.rect( rect.x1, rect.y1, rect.width, rect.height );
        this.ctx.clip(squarePath);
    }

  }
