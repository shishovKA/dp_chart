import { Signal } from "signals"
import { Canvas } from "./Canvas";
import { Rectangle } from "./Rectangle";
import { Point } from "./Point";

export interface  Series  {

    id: string;
    seriesData: number[][];
    canvas: Canvas;
    plots: string[];
    hasAnimation: boolean;
    animationDuration: number;

    timeFunc: (time: number) => number;
    
    onPlotDataChanged: Signal;
    onSeriesDataChanged: Signal;
   
    updatePlotData(axisRect: Rectangle, vp: Rectangle, noAnimation?: boolean): void;
    getClosestDataPointX(seriesPoint: Point): [Point, number];
    getClosestDataPointXY(seriesPoint: Point): [Point, number];
    getClosestPlotPointX(coordPoint: Point): Point;
    getClosestPlotPointXY(coordPoint: Point): Point;

    setPlotsIds(...plotIds: string[]): void;
    replaceSeriesData(seriesData_to: number[][], animate: boolean): void;

    getDataRange(type:string, min:number, max:number): number[][];
    findExtremes(data?:number[][]): number[];


}


  
  