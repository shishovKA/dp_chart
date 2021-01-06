import { Signal } from "signals"
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";

const canvasDpiScaler = require('canvas-dpi-scaler');

export class Canvas {

    container: HTMLElement;
    canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D | null;
    // @ts-ignore
    height: number;
    // @ts-ignore
    width: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
    // @ts-ignore
    mouseCoords: Point;
    resized: Signal;
    onPaddingsSetted: Signal;
    mouseMoved: Signal;
    mouseOuted: Signal;
    touchEnded: Signal;
    isSquare: boolean = false;
    lineWidth: number = 1;
    color: string = 'black'

    constructor(container: HTMLElement, ...paddings: number[]) {
        this.onPaddingsSetted = new Signal();
        this.mouseMoved = new Signal();
        this.mouseOuted = new Signal();
        this.touchEnded = new Signal();

        this.resized = new Signal();

        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.left = 0;

        this.container.appendChild(this.canvas);
        this._ctx = this.canvas.getContext('2d');
        
        //bind
        this.clear = this.clear.bind(this);

        //listeners
        window.addEventListener('resize', () => { this.resize() });

        //call methods
        this.setPaddings(...paddings);
        this.resize();
    }


    turnOnListenres() {
        this.canvas.addEventListener('mousemove', (event) => {
            this.mouseCoords = this.getMouseCoords(event);
            if (this.inDrawArea) {
                this.mouseMoved.dispatch();
            } else {
                this.mouseCoords = new Point(this.viewport.x2, this.viewport.zeroY);
                this.mouseOuted.dispatch();
            }
          });

        this.canvas.addEventListener('mouseleave', (event) => {
            this.mouseCoords = new Point(this.viewport.x2, this.viewport.zeroY);
            this.mouseOuted.dispatch();
        });

        this.canvas.addEventListener('touchmove', (event) => {
            this.mouseCoords = this.getTouchCoords(event);
            if (this.inDrawArea) {
                this.mouseMoved.dispatch();
            } else {
                this.mouseCoords = new Point(this.viewport.x2, this.viewport.zeroY);
                this.mouseOuted.dispatch();
            }
        });

        this.canvas.addEventListener('touchend', (event) => {
            this.mouseCoords = new Point(this.viewport.x2, this.viewport.zeroY);
            this.touchEnded.dispatch();
        });

        this.mouseCoords = new Point(this.viewport.x2, this.viewport.zeroY); 
    }

    addOnPage() {
        this.container.appendChild(this.canvas);
    }

    get inDrawArea(): boolean {
        if (this.mouseCoords.x < 0) return false;
        if (this.mouseCoords.x > this.viewport.width) return false;
        if (this.mouseCoords.y < 0) return false;
        if (this.mouseCoords.y > this.viewport.height) return false;
        return true;
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
        
        this.mouseCoords = new Point(this.viewport.x2, this.viewport.zeroY);
        this.onPaddingsSetted.dispatch();
        return 
    }


    get ctx(): CanvasRenderingContext2D | null {
        return this._ctx;
    }

    set squareRes(res: boolean) {
        this.isSquare = res;
        this.resize();
    }

    resize() {

        if (this.isSquare) {
            let w = this.container.getBoundingClientRect().width;
            let h = this.container.getBoundingClientRect().height;
            this.width = Math.min(w, h);
            this.height = Math.min(w, h);
        }
        else {
            this.width = this.container.getBoundingClientRect().width;
            this.height = this.container.getBoundingClientRect().height;
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width.toString() + 'px';
        this.canvas.style.height = this.height.toString() + 'px';
        canvasDpiScaler(this.canvas, this._ctx, this.width, this.height);

        this.resized.dispatch();
    }

    clear() {
        if (this._ctx) this._ctx.clearRect(0, 0, this.width, this.height);
       
    }

    get viewport(): Rectangle {
        return new Rectangle(this.left, this.top, this.width-this.right, this.height-this.bottom);
    }

    drawVp() {
        const rect = this.viewport;
        // @ts-ignore
        this.ctx.rect(rect.x1, rect.y1, rect.width, rect.height);
        
        if (this.ctx) {
            this.ctx.strokeStyle = this.color;
            this.ctx.fillStyle = this.color;
            this.ctx.lineWidth = this.lineWidth;
        }

        // @ts-ignore
        this.ctx.stroke();
    }

    // @ts-ignore
    getMouseCoords(event): Point {
        var bcr = this.canvas.getBoundingClientRect();
        return new Point(event.clientX - bcr.left  - this.viewport.x1, event.clientY - bcr.top - this.viewport.y1);
    }

    // @ts-ignore
    getTouchCoords(event): Point {
        const clientX = event.touches[0].clientX;
        const clientY = event.touches[0].clientY;
        var bcr = this.canvas.getBoundingClientRect();
        return new Point(clientX - bcr.left - this.viewport.x1, clientY - bcr.top - this.viewport.y1);
    }

    clipCanvas() {
        const rect = this.viewport;
        let squarePath = new Path2D();
        squarePath.rect( rect.x1, rect.y1, rect.width, rect.height );
        // @ts-ignore
        this._ctx.clip(squarePath);
    }

  }
