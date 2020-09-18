export class Rectangle {
    
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.updateCoords(x1, y1, x2, y2);
    }

    get width(): number {
        return Math.abs(this.x1-this.x2)
    }

    get height(): number {
        return Math.abs(this.y1-this.y2)
    }

    get zeroX(): number {
        return this.x1
    }

    get zeroY(): number {
        return this.y2
    }

    updateCoords(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

}
