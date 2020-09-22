
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
    
    constructor(container: HTMLElement, ...paddings: number[]) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this._ctx = this.canvas.getContext('2d');
        
        this.height = 0;
        this.width = 0;

        if (this.container) {
            this.height = this.container.getBoundingClientRect().height;
            this.width = this.container.getBoundingClientRect().width;
            this.container.appendChild(this.canvas);
        }
        
        this.canvas.width = this.height;
        this.canvas.height = this.width;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.left = 0;
        this.setPaddings(...paddings);
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
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    clear() {
        if (this._ctx) this._ctx.clearRect(0, 0, this.width, this.height);
    }

    get viewport(): Rectangle {
        return new Rectangle(this.left, this.top, this.width-this.right, this.height-this.bottom);
    }

  }
