import { Signal } from "signals"
import { Rectangle } from "./Rectangle";

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
    mouseCoords: number[];
    changed: Signal;
    mouseMoved: Signal;


    
    constructor(container: HTMLElement, ...paddings: number[]) {
        this.changed = new Signal();
        this.mouseMoved = new Signal();

        this.container = container;
        this.canvas = document.createElement('canvas');
        this._ctx = this.canvas.getContext('2d');
        
        this.height = 0;
        this.width = 0;
        this.mouseCoords = [0,0];
        this.container.appendChild(this.canvas);

        this.resize();
        
        this.canvas.width = this.height;
        this.canvas.height = this.width;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.left = 0;
        this.setPaddings(...paddings);

        this.canvas.addEventListener('mousemove', (event) => {
            this.mouseCoords = this.getMouseCoords(event);
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

    resize(wh?: number[]) {
        if (wh) {
            this.height = wh[1];
            this.width = wh[0];
        } else {
            if (this.container) {
                this.height = this.container.getBoundingClientRect().height;
                this.width = this.container.getBoundingClientRect().width;
            }
        }

        this.scaleCanvas(this.canvas, this._ctx, this.width, this.height);

    }

    clear() {
        if (this._ctx) this._ctx.clearRect(0, 0, this.width, this.height);
    }

    get viewport(): Rectangle {
        return new Rectangle(this.left, this.top, this.canvas.width-this.right, this.canvas.height-this.bottom);
    }

    drawVp() {
        const rect = this.viewport;
        this.ctx.rect(rect.x1, rect.y1, rect.width, rect.height);
        this.ctx.stroke();
    }

    getMouseCoords(event) {
        var bcr = this.canvas.getBoundingClientRect();
        this.mouseMoved.dispatch();
        return [event.clientX - bcr.left - this.viewport.zeroX, event.clientY - bcr.top];
    }

    clipCanvas() {
        const rect = this.viewport;
        let squarePath = new Path2D();
        squarePath.rect( rect.x1, rect.y1, rect.width, rect.height );
        this.ctx.clip(squarePath);
    }

    scaleCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, width:number, height:number) {
        // assume the device pixel ratio is 1 if the browser doesn't specify it
        const devicePixelRatio = window.devicePixelRatio || 1;
      
        // determine the 'backing store ratio' of the canvas context
        const backingStoreRatio = (
          context.webkitBackingStorePixelRatio ||
          context.mozBackingStorePixelRatio ||
          context.msBackingStorePixelRatio ||
          context.oBackingStorePixelRatio ||
          context.backingStorePixelRatio || 1
        );
      
        // determine the actual ratio we want to draw at
        const ratio = devicePixelRatio / backingStoreRatio;
      
        if (devicePixelRatio !== backingStoreRatio) {
          // set the 'real' canvas size to the higher width/height
          canvas.width = width * ratio;
          canvas.height = height * ratio;
      
          // ...then scale it back down with CSS
          canvas.style.width = width + 'px';
          canvas.style.height = height + 'px';
        }
        else {
          // this is a normal 1:1 device; just scale it simply
          canvas.width = width;
          canvas.height = height;
          canvas.style.width = '';
          canvas.style.height = '';
        }
      
        // scale the drawing context so everything will work at the higher ratio
        context.scale(ratio, ratio);
      }

  }
