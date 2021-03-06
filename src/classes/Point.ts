export class Point {
    
    x: number;
    y: number;

    constructor(x: number, y: number) {
        //this.x = Math.round(x);
        //this.y = Math.round(y);

        this.x = x;
        this.y = y;
    }

    findDist(next: Point): number {
        const dist = Math.sqrt((this.x-next.x)*(this.x-next.x)+(this.y-next.y)*(this.y-next.y));
        return dist;
    }


    findDistX(next: Point): number {
        const dist = Math.abs(this.x-next.x);
        return dist;
    }

}