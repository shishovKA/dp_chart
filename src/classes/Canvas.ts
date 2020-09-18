
import { Rectangle } from "./Rectangle";

export class Canvas {

    container: HTMLElement;
    canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
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
        this.height = this.container.getBoundingClientRect().height;
        this.width = this.container.getBoundingClientRect().width;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.container.appendChild(this.canvas);
        this._spreadPaddings(paddings);
    }

    setPaddings(...paddings: number[]) {
        this._spreadPaddings(paddings);
    }

    _spreadPaddings(paddings: number[]) {
        let fields = {};
        switch(paddings.length) {
            case 0:
                this.top = 0;
                this.right = 0;
                this.bottom = 0;
                this.left = 0;
            break;
          
            case 1:
                this.top = paddings[0];
                this.right = 0;
                this.bottom = 0;
                this.left = 0;
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
                this.left = 0;
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

    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }

    resize(newWidth?: number, newHeight?: number) {
        if (newWidth) {
            this.height = newHeight;
            this.width = newWidth;
        } else {
            this.height = this.container.getBoundingClientRect().height;
            this.width = this.container.getBoundingClientRect().width;
        }
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    clear() {
        this._ctx.clearRect(0, 0, this.width, this.height);
    }

    get viewport(): Rectangle {
        return new Rectangle(this.left, this.top, this.width-this.right, this.height-this.bottom);
    }

  }
