import { Rectangle } from "./Rectangle";

interface axisOptions  {
    lineWidth: number;
    lineColor: string;
    // и тд
}

//описание класса

export class Axis {

    min: number;
    max: number;
    type: string;
    _options: axisOptions;
    //ticks: Ticks;
    
    constructor( min: number, max: number, type: string, ...options: any) {
        this.min = min;
        this.max = max;
        this.type = type;

        this._options = {
            lineWidth: 1,
            lineColor: '#000000'
        };

        this._spreadOptions(...options);
    }

    _spreadOptions(...options: any[]) {
        //разбираем пакет опций для графика

        switch(options.length) {
            case 1:
                this._options.lineWidth = options[0];
            break;
          
            case 2:
                this._options.lineWidth = options[0];
                this._options.lineColor = options[1];
            break;
        }
    }

    setOptions(...options: any) {
        //устанавливаем опции оси
    }

    setMinMax(min: number, max: number) {
        //присваивем min и max
    }


    drawAxis(ctx: CanvasRenderingContext2D, viewport: Rectangle) {
        //функция отрисовки оси на канвасе
        ctx.beginPath();
        ctx.strokeStyle = this._options.lineColor;
        ctx.lineWidth = this._options.lineWidth;
        ctx.moveTo(viewport.x1, viewport.y2);

        switch(this.type) {
            case 'vertical':
                ctx.lineTo(viewport.x1, viewport.y1);
            break;
          
            case 'horizontal':
                ctx.lineTo(viewport.x2, viewport.y2);
            break;
          }
        ctx.closePath();
        ctx.stroke();
    }

  }