import { Signal } from "signals";
export declare class Chart {
    container: HTMLElement;
    canvas: Canvas;
    canvasA: Canvas;
    canvasTT: Canvas;
    data: Data;
    plots: Plot[];
    xAxis: Axis;
    yAxis: Axis;
    tooltipsDataIndexUpdated: Signal;
    constructor(container: HTMLElement, xMinMax: number[], yMinMax: number[]);
    bindChildSignals(): void;
    get axisRect(): Rectangle;
    reSize(): void;
    axisReDraw(): void;
    seriesUpdatePlotData(): void;
    ticksCreate(): void;
    axisDraw(): void;
    seriesReDraw(series: Series): void;
    setCanvasPaddings(...paddings: number[]): void;
    addPlot(id: string, type: string, ...options: any): void;
    findPlotById(id: string): Plot | null;
    addSeries(id: string, ...seriesData: number[][]): Series;
    switchDataAnimation(hasAnimation: boolean, duration?: number): void;
    tooltipsDraw(drawLast?: boolean): void;
}
export declare class Data {
    seriesStorage: Series[];
    constructor();
    findExtremes(type: string, from?: number, to?: number): number[];
    findSeriesById(id: string): Series | null;
    switchAllSeriesAnimation(hasAnimation: boolean, duration?: number): void;
    changeAllSeriesAnimationTimeFunction(newTimeFunc: (time: number) => number): void;
}
export declare class Series {
    id: string;
    seriesData: number[][];
    plotData: Point[][];
    plots: string[];
    hasAnimation: boolean;
    animationDuration: number;
    canvas: Canvas;
    extremes: number[];
    timeFunc: (time: number) => number;
    onPlotDataChanged: Signal;
    constructor(id: string, container: HTMLElement, ...seriesData: number[][]);
    getInitialData(initialData: number[][]): number[][];
    setPlotsIds(...plotIds: string[]): void;
    findExtremes(data?: number[][]): number[];
    get dataRect(): Rectangle;
    getDataRange(type: string, min: number, max: number): number[][];
    replaceSeriesData(seriesData_to: number[][]): void;
    getClosestPoint(x: number): Point;
    getClosestPlotPoint(x: number): Point;
    get plotDataArr(): Point[];
    updatePlotData(axisRect: Rectangle, vp: Rectangle, noAnimation?: boolean): this;
    generatePlotData(axisRect: Rectangle, vp: Rectangle): Point[][];
    сoordAnimation(fromData: Point[][], toData: Point[][], duration: number): void;
    makeFromPointArr(from: Point[], to: Point[]): Point[][];
}
export declare class Canvas {
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
    mouseOuted: Signal;
    touchEnded: Signal;
    constructor(container: HTMLElement, ...paddings: number[]);
    turnOnListenres(): void;
    addOnPage(): void;
    get inDrawArea(): boolean;
    setPaddings(...paddings: number[]): void;
    get ctx(): CanvasRenderingContext2D | null;
    resize(): void;
    clear(): void;
    get viewport(): Rectangle;
    drawVp(): void;
    getMouseCoords(event: any): Point;
    getTouchCoords(event: any): Point;
    clipCanvas(): void;
}
interface axisOptions {
    lineWidth: number;
    lineColor: string;
    lineDash: number[];
}
export declare class Axis {
    display: boolean;
    position: string;
    min: number;
    max: number;
    type: string;
    _options: axisOptions;
    gridOn: boolean;
    ticks: Ticks;
    onOptionsSetted: Signal;
    onMinMaxSetted: Signal;
    onCustomLabelsAdded: Signal;
    onAnimated: Signal;
    constructor(MinMax: number[], type: string, ...options: any);
    bindChildSignals(): void;
    get length(): number;
    setOptions(...options: any[]): void;
    setMinMax(MinMax: number[], hasPlotAnimation?: boolean): void;
    draw(ctx: CanvasRenderingContext2D, viewport: Rectangle): void;
    getaxisViewport(vp: Rectangle): Rectangle;
    drawAxis(ctx: CanvasRenderingContext2D, viewport: Rectangle): void;
    axisRangeAnimation(from: number[], to: number[], duration: number): void;
}
export declare class Ticks {
    display: boolean;
    hasCustomLabels: boolean;
    hasAnimation: boolean;
    animationDuration: number;
    label: Label;
    grid: Grid;
    type: string;
    distributionType: string;
    count: number;
    step: number;
    coords: Point[];
    values: number[];
    labels: string[];
    customLabels?: string[];
    customTicksOptions?: any[];
    linewidth: number;
    tickSize: number;
    color: string;
    onOptionsSetted: Signal;
    onCustomLabelsAdded: Signal;
    onAnimated: Signal;
    constructor(axistype: string);
    switchAnimation(hasAnimation: boolean, duration?: number): void;
    bindChildSignals(): void;
    setCustomLabels(labels: string[]): void;
    settickDrawOptions(length: number, width: number, color: string): void;
    setOptions(distributionType: string, ...options: any[]): void;
    createTicks(min: number, max: number, vp: Rectangle, ctx: CanvasRenderingContext2D): this;
    generateFixedCountTicks(min: number, max: number, vp: Rectangle): any[];
    generateFixedStepTicks(min: number, max: number, vp: Rectangle, step?: number, toFixed?: number): any[];
    generateNiceCbhTicks(min: number, max: number, vp: Rectangle): any[];
    generateCustomDateTicks(min: number, max: number, vp: Rectangle, ctx: CanvasRenderingContext2D): any[];
    tickCoordAnimation(from: Point[], to: Point[], duration: number): void;
    makeFromPointArr(from: Point[], to: Point[]): Point[];
    generateCustomDateTicksByOption(j: number, min: number, max: number, vp: Rectangle, ctx: CanvasRenderingContext2D): any[];
    checkLabelsOverlap(ctx: CanvasRenderingContext2D, coords: Point[], labels: string[]): boolean;
    draw(ctx: CanvasRenderingContext2D, viewport: Rectangle): void;
    drawTick(ctx: CanvasRenderingContext2D, tick: Point): void;
}
export declare class Grid {
    display: boolean;
    type: string;
    width: number;
    color: string;
    lineDash: number[];
    onOptionsSetted: Signal;
    constructor(type: string);
    setOptions(color: string, width: number, lineDash: number[]): void;
    draw(ctx: CanvasRenderingContext2D, vp: Rectangle, coords: Point[]): void;
}
export declare class Label {
    display: boolean;
    color: string;
    font: string;
    fontSize: number;
    position: string;
    offset: number;
    units?: string;
    onOptionsSetted: Signal;
    constructor(type?: string);
    setOptions(color?: string, position?: string, offset?: number, fontOptions?: string[]): void;
    draw(ctx: CanvasRenderingContext2D, coord: Point, labeltext: string): void;
    getlabelRect(ctx: CanvasRenderingContext2D, coord: Point, labeltext: string): Rectangle;
}
interface plotOptions {
    lineWidth: number;
    lineColor: string;
    brushColor: string;
    mainSize: number;
}
export declare class Plot {
    hasAnimation: boolean;
    animationDuration: number;
    _id: string;
    type: string;
    _options: plotOptions;
    tooltips: Tooltip[];
    constructor(id: string, type: string, ...options: any);
    setOptions(options: any[]): void;
    get id(): string;
    drawPlot(ctx: CanvasRenderingContext2D, plotData: Point[]): void;
    drawDotted(ctx: CanvasRenderingContext2D, plotData: Point[]): void;
    drawLine(ctx: CanvasRenderingContext2D, plotData: Point[]): void;
    drawArea(ctx: CanvasRenderingContext2D, plotData: Point[]): void;
    addTooltip(id: string, type: string, ...options: any): Tooltip;
    findTooltipById(id: string): Tooltip | null;
}
export declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    findDist(next: Point): number;
    findDistX(next: Point): number;
}
export declare class Rectangle {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    constructor(x1: number, y1: number, x2: number, y2: number);
    get width(): number;
    get height(): number;
    get zeroX(): number;
    get zeroY(): number;
    updateCoords(x1: number, y1: number, x2: number, y2: number): void;
    countDistBetweenRects(type: string, next: Rectangle): number;
    move(dx: number, dy: number): void;
}
interface tooltipOptions {
    lineWidth: number;
    lineColor: string;
    brushColor: string;
    mainSize: number;
    lineDash: number[];
}
export declare class Tooltip {
    _id: string;
    type: string;
    _options: tooltipOptions;
    labels?: string[];
    label: Label;
    constructor(id: string, type: string, ...options: any);
    get id(): string;
    setOptions(options: any[]): void;
    drawTooltip(ctx: CanvasRenderingContext2D, vp: Rectangle, ttCoord: Point, xyData: Point, toDraw?: boolean): Rectangle;
    drawCircleSeries(ctx: CanvasRenderingContext2D, ttCoord: Point): void;
    drawLineVerticalFull(ctx: CanvasRenderingContext2D, vp: Rectangle, ttCoord: Point): void;
    drawLineHorizontalEnd(ctx: CanvasRenderingContext2D, vp: Rectangle, ttCoord: Point): void;
    drawLabelXStart(ctx: CanvasRenderingContext2D, vp: Rectangle, ttCoord: Point, seriesData: Point): Rectangle;
    roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void;
    drawCircleYEnd(ctx: CanvasRenderingContext2D, vp: Rectangle, ttCoord: Point): void;
    drawDataYEnd(ctx: CanvasRenderingContext2D, vp: Rectangle, start_ttCoord: Point, seriesData: Point, toDraw?: boolean): Rectangle;
    drawDeltaAbs(ctx: CanvasRenderingContext2D, vp: Rectangle, ttCoord: Point, seriesData: Point): void;
}
export declare class Transformer {
    matrix: number[];
    constructor();
    getPlotRect(axisRect: Rectangle, seriesRect: Rectangle, vp: Rectangle): Rectangle;
    getVeiwportCoord(fromRect: Rectangle, toRect: Rectangle, point: Point): Point;
    transform(viewport: Rectangle): Rectangle;
    transFunc(x: number, y: number, coeff: number[]): number;
}
export {};
