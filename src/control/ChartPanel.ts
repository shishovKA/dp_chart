
import { Chart } from "../classes/Chart";
import { cbh1, cbh5, xLabels, zeroSeries, prepareDataforCbh } from "../chartData"
import { chart } from "../chartConfig";

export class ChartPanel {

    container: HTMLElement;

    axisRanges: HTMLElement;
    xAxisOptions: HTMLElement;
    yAxisOptions: HTMLElement;

    animationOptions: HTMLElement;


    chart: Chart;

    minX_input: HTMLElement;
    minX_label: HTMLElement;

    maxX_input: HTMLElement;
    maxX_label: HTMLElement;

    minY_input: HTMLElement;
    minY_label: HTMLElement;

    maxY_input: HTMLElement;
    maxY_label: HTMLElement;

    scaleToFit_input: HTMLElement;

    scaleToFit: boolean = false;


    constructor (container: HTMLElement, chart: Chart) {
        this.container = container;
        this.chart = chart;

        this.axisRanges = this._createAxisRanges();
        this.container.append(this.axisRanges);

        this.xAxisOptions = this._createXAxisOptions();
        this.container.append(this.xAxisOptions);

        this.yAxisOptions = this._createYAxisOptions();
        this.container.append(this.yAxisOptions);

        this.animationOptions = this._createAnimationPanel();
        this.container.append(this.animationOptions);

        this._setListeners();

    }


    _createAxisRanges(): HTMLElement {
        const panel = document.createElement('fieldset');
        const title = document.createElement('legend');
        title.textContent = 'Chart control panel';

        panel.append(title);

        // X Axis MIN
        const minX_input = document.createElement('input');
        minX_input.classList.add("panel__input");
        minX_input.type = "range";
        minX_input.name = 'minX_input';
        minX_input.min = this.chart.data.findExtremes('val')[0].toString();
        minX_input.max = this.chart.data.findExtremes('val')[1].toString();
        minX_input.value = this.chart.data.findExtremes('val')[0].toString();
        minX_input.step = "1";

        const minX_title = document.createElement('h4');
        minX_title.classList.add('panel__label');
        minX_title.textContent = 'X axis min';

        const minX_label = document.createElement('p');
        minX_label.classList.add('panel__label');
        minX_label.textContent = minX_input.value;

        let label_from = document.createElement('p');
        label_from.classList.add('panel__label');
        label_from.textContent = minX_input.min;

        let label_to = document.createElement('p');
        label_to.classList.add('panel__label');
        label_to.textContent = minX_input.max;

        let label_container = document.createElement('div');
        label_container.classList.add('panel__label__container');
        label_container.append(label_from);
        label_container.append(minX_label);
        label_container.append(label_to);


        panel.append(minX_title);
        panel.append(minX_input);
        panel.append(label_container);

        this.minX_input = minX_input;
        this.minX_label = minX_label;

        // X Axis MAX
        const maxX_input = document.createElement('input');
        maxX_input.classList.add("panel__input");
        maxX_input.type = "range";
        maxX_input.name = 'maxX_input';
        maxX_input.min = this.chart.data.findExtremes('val')[0].toString();
        maxX_input.max = (this.chart.data.findExtremes('val')[1]).toString();
        maxX_input.value = this.chart.data.findExtremes('val')[1].toString();
        maxX_input.step = "1";


        const maxX_title = document.createElement('h4');
        maxX_title.classList.add('panel__label');
        maxX_title.textContent = 'X axis max';

        const maxX_label = document.createElement('p');
        maxX_label.classList.add('panel__label');
        maxX_label.textContent = maxX_input.value;

        label_from = document.createElement('p');
        label_from.classList.add('panel__label');
        label_from.textContent = maxX_input.min;

        label_to = document.createElement('p');
        label_to.classList.add('panel__label');
        label_to.textContent = maxX_input.max;

        label_container = document.createElement('div');
        label_container.classList.add('panel__label__container');
        label_container.append(label_from);
        label_container.append(maxX_label);
        label_container.append(label_to);

        panel.append(maxX_title);
        panel.append(maxX_input);
        panel.append(label_container);

        this.maxX_input = maxX_input;
        this.maxX_label = maxX_label;

        // Y Axis MIN
        const minY_input = document.createElement('input');
        minY_input.classList.add("panel__input");
        minY_input.type = "range";
        minY_input.name = 'minY_input';
        minY_input.min = -this.chart.data.findExtremes('ind')[1].toFixed();
        minY_input.max = this.chart.data.findExtremes('ind')[1].toFixed();
        minY_input.value = this.chart.data.findExtremes('ind')[0].toFixed();
        minY_input.step = "1";

        const minY_title = document.createElement('h4');
        minY_title.classList.add('panel__label');
        minY_title.textContent = 'Y axis min';

        const minY_label = document.createElement('p');
        minY_label.classList.add('panel__label');
        minY_label.textContent = minY_input.value;

        label_from = document.createElement('p');
        label_from.classList.add('panel__label');
        label_from.textContent = minY_input.min;

        label_to = document.createElement('p');
        label_to.classList.add('panel__label');
        label_to.textContent = minY_input.max;

        label_container = document.createElement('div');
        label_container.classList.add('panel__label__container');
        label_container.append(label_from);
        label_container.append(minY_label);
        label_container.append(label_to);

        panel.append(minY_title);
        panel.append(minY_input);
        panel.append(label_container);

        this.minY_input = minY_input;
        this.minY_label = minY_label;

        // Y Axis MAX
        const maxY_input = document.createElement('input');
        maxY_input.classList.add("panel__input");
        maxY_input.type = "range";
        maxY_input.name = 'maxY_input';
        maxY_input.min = 0;
        maxY_input.max = (1.25*this.chart.data.findExtremes('ind')[1]).toFixed();
        maxY_input.value = this.chart.data.findExtremes('ind')[1].toFixed();
        maxY_input.step = "1";


        const maxY_title = document.createElement('h4');
        maxY_title.classList.add('panel__label');
        maxY_title.textContent = 'Y axis max';

        const maxY_label = document.createElement('p');
        maxY_label.classList.add('panel__label');
        maxY_label.textContent = maxY_input.value;

        label_from = document.createElement('p');
        label_from.classList.add('panel__label');
        label_from.textContent = maxY_input.min;

        label_to = document.createElement('p');
        label_to.classList.add('panel__label');
        label_to.textContent = maxY_input.max;

        label_container = document.createElement('div');
        label_container.classList.add('panel__label__container');
        label_container.append(label_from);
        label_container.append(maxY_label);
        label_container.append(label_to);

        panel.append(maxY_title);
        panel.append(maxY_input);
        panel.append(label_container);

        this.maxY_input = maxY_input;
        this.maxY_label = maxY_label;

        // Scale to Fit
        const scaleToFit = document.createElement('input');
        scaleToFit.classList.add("panel__checkbox");
        scaleToFit.type = "checkbox";
        scaleToFit.name = "scaleToFit";
        scaleToFit.checked = this.scaleToFit;

        let label_scaleToFit = document.createElement('p');
        label_scaleToFit.classList.add("panel__label")
        label_scaleToFit.textContent = "Scale to Fit";

        let checkbox_container = document.createElement('div');
        checkbox_container.classList.add("checkbox__container");

        checkbox_container.append(scaleToFit);
        checkbox_container.append(label_scaleToFit);
        panel.append(checkbox_container);

        this.scaleToFit_input = scaleToFit;

        return panel;
    }



    _createXAxisOptions() {

        const fieldset = document.createElement('fieldset');

        const legend = document.createElement('legend');
        legend.textContent = 'X Axis Options';

        fieldset.append(legend);

        // fixedCount
        const distType_input1 = document.createElement('input');
        distType_input1.type = "radio";
        distType_input1.id = 'distType_input1';
        distType_input1.name = 'distType_inputX';
        distType_input1.value = 'fixedCount';
        fieldset.append(distType_input1);

        const label1 = document.createElement('label');
        label1.textContent = 'fixed count';
        fieldset.append(label1);

        const count_input = document.createElement('input');
        count_input.type = "number";
        count_input.id = 'count_input';
        count_input.name = 'count_input';
        count_input.min = '1';
        count_input.max = '100';
        count_input.value = '10';
        fieldset.append(count_input);

        const label_count = document.createElement('label');
        label_count.textContent = 'Count';
        fieldset.append(label_count);

        let br = document.createElement('br');
        fieldset.append(br);

        distType_input1.addEventListener('change', (event) => {
            this.chart.xAxis.ticks.setOptions(event.target.value, +count_input.value);
        });

        count_input.addEventListener('change', (event) => {
            if (this.chart.xAxis.ticks.distributionType == 'fixedCount') {
                this.chart.xAxis.ticks.setOptions('fixedCount', +event.target.value) 
            }
        });

        // fixedStep
        const distType_input2 = document.createElement('input');
        distType_input2.type = "radio";
        distType_input2.id = 'distType_input2';
        distType_input2.name = 'distType_inputX';
        distType_input2.value = 'fixedStep';
        
        fieldset.append(distType_input2);

        const label2 = document.createElement('label');
        label2.textContent = 'fixed step';
        fieldset.append(label2);

        const step_input = document.createElement('input');
        step_input.type = "number";
        step_input.id = 'step_input';
        step_input.name = 'step_input';
        step_input.min = '1';
        step_input.max = '1000';
        step_input.value = '100';
        fieldset.append(step_input);

        const label_step = document.createElement('label');
        label_step.textContent = 'Step';
        fieldset.append(label_step);


        br = document.createElement('br');
        fieldset.append(br);

        distType_input2.addEventListener('change', (event) => {
            this.chart.xAxis.ticks.setOptions(event.target.value, +step_input.value);
        });

        step_input.addEventListener('change', (event) => {
            if (this.chart.xAxis.ticks.distributionType == 'fixedStep') {
                this.chart.xAxis.ticks.setOptions('fixedStep', +event.target.value) 
            }
        });

        // customDateTicks

        const distType_input3 = document.createElement('input');
        distType_input3.type = "radio";
        distType_input3.id = 'distType_input3';
        distType_input3.name = 'distType_inputX';
        distType_input3.value = 'customDateTicks';
        
        distType_input3.addEventListener('change', (event) => {
            this.chart.xAxis.ticks.setOptions(event.target.value);
        });

        fieldset.append(distType_input3);

        const label3 = document.createElement('label');
        label3.textContent = 'customDateTicks';
        fieldset.append(label3);

        return fieldset;

    }


    _createYAxisOptions() {
        const fieldset = document.createElement('fieldset');
    
        const legend = document.createElement('legend');
        legend.textContent = 'Y Axis Options';

        fieldset.append(legend);

        // fixedCount
        const distType_input1 = document.createElement('input');
        distType_input1.type = "radio";
        distType_input1.id = 'distType_input1';
        distType_input1.name = 'distType_inputY';
        distType_input1.value = 'fixedCount';
        fieldset.append(distType_input1);

        const label1 = document.createElement('label');
        label1.textContent = 'fixed count';
        fieldset.append(label1);

        const count_input = document.createElement('input');
        count_input.type = "number";
        count_input.id = 'count_input';
        count_input.name = 'count_input';
        count_input.min = '1';
        count_input.max = '100';
        count_input.value = '10';
        fieldset.append(count_input);

        const label_count = document.createElement('label');
        label_count.textContent = 'Count';
        fieldset.append(label_count);

        let br = document.createElement('br');
        fieldset.append(br);

        distType_input1.addEventListener('change', (event) => {
            this.chart.yAxis.ticks.setOptions(event.target.value, +count_input.value);
        });

        count_input.addEventListener('change', (event) => {
            if (this.chart.yAxis.ticks.distributionType == 'fixedCount') {
                this.chart.yAxis.ticks.setOptions('fixedCount', +event.target.value) 
            }
        });

        // fixedStep
        const distType_input2 = document.createElement('input');
        distType_input2.type = "radio";
        distType_input2.id = 'distType_input2';
        distType_input2.name = 'distType_inputY';
        distType_input2.value = 'fixedStep';
        
        fieldset.append(distType_input2);

        const label2 = document.createElement('label');
        label2.textContent = 'fixed step';
        fieldset.append(label2);

        const step_input = document.createElement('input');
        step_input.type = "number";
        step_input.id = 'step_input';
        step_input.name = 'step_input';
        step_input.min = '1';
        step_input.max = '1000';
        step_input.value = '100';
        fieldset.append(step_input);

        const label_step = document.createElement('label');
        label_step.textContent = 'Step';
        fieldset.append(label_step);


        br = document.createElement('br');
        fieldset.append(br);

        distType_input2.addEventListener('change', (event) => {
            this.chart.yAxis.ticks.setOptions(event.target.value, +step_input.value);
        });

        step_input.addEventListener('change', (event) => {
            if (this.chart.yAxis.ticks.distributionType == 'fixedStep') {
                this.chart.yAxis.ticks.setOptions('fixedStep', +event.target.value) 
            }
        });

        return fieldset;

    }

    _setListeners() {
        this.minX_input.addEventListener('change', (event) => {
            if (+event.target.value >= this.chart.xAxis.max - 1) {
                event.target.value = this.chart.xAxis.max - 1;   
            }
            const max = this.chart.xAxis.max;
            const min = +event.target.value;
            this.minX_label.textContent = event.target.value;

            // подготавливаем данные как на сайте CyberHedge
            let data = prepareDataforCbh(cbh5, cbh1, min);
            let { 
                serie5star,
                area5starTop, 
                area5starBottom, 
                serie1star, 
                area1starTop, 
                area1starBottom 
                } = data;

            

            this.chart.data.findSeriesById('cyberHedge5_area')?.replaceSeriesData([area5starTop, area5starBottom]);
            this.chart.data.findSeriesById('cyberHedge1_area')?.replaceSeriesData([area1starTop, area1starBottom]);
            this.chart.data.findSeriesById('cyberHedge5_line')?.replaceSeriesData([serie5star]);
            this.chart.data.findSeriesById('cyberHedge1_line')?.replaceSeriesData([serie1star]);


            if (this.scaleToFit) {
                this.chart.xAxis.setMinMax([min,max], false);
                this.chart.yAxis.setMinMax(this.chart.data.findExtremes('ind', min, max), true);
                //this.chart.yAxis.setMinMax([this.chart.yAxis.min-0.1*this.chart.yAxis.length, this.chart.yAxis.max+0.1*this.chart.yAxis.length]); //добавляем по отступам как на сайте
            } else {
                this.chart.xAxis.setMinMax([min,max], true);
            }
            
        })

        this.maxX_input.addEventListener('change', (event) => {

            if (+event.target.value <= this.chart.xAxis.min +1) {
                event.target.value =  this.chart.xAxis.min + 1;  
            }

            const min = this.chart.xAxis.min;
            const max = +event.target.value;
            this.maxX_label.textContent = event.target.value;
            
            

            if (this.scaleToFit) {
                this.chart.xAxis.setMinMax([min,max], false);
                this.chart.yAxis.setMinMax(this.chart.data.findExtremes('ind', min, max), true);
                //this.chart.yAxis.setMinMax([this.chart.yAxis.min-0.05*this.chart.yAxis.length, this.chart.yAxis.max+0.05*this.chart.yAxis.length]);
            } else {
                this.chart.xAxis.setMinMax([min,max], true);
            }


        })

        this.minY_input.addEventListener('change', (event) => {

            if (+event.target.value >= this.chart.yAxis.max - 1) {
                event.target.value =  this.chart.yAxis.max - 1;   
            }

            const max = this.chart.yAxis.max;
            const min = +event.target.value;
            this.minY_label.textContent = event.target.value;
            this.chart.yAxis.setMinMax([min,max], true);
        })

        this.maxY_input.addEventListener('change', (event) => {

            if (+event.target.value <= this.chart.yAxis.min + 1) {
                event.target.value =  this.chart.yAxis.min + 1;  
            }

            const min = this.chart.yAxis.min;
            const max = +event.target.value;
            this.maxY_label.textContent = event.target.value;
            this.chart.yAxis.setMinMax([min,max], true);
        })


        this.scaleToFit_input.addEventListener('change', (event) => {
            const min = this.chart.xAxis.min;
            const max = this.chart.xAxis.max;
            this.scaleToFit = event.target.checked;
            if (this.scaleToFit) {
                this.chart.yAxis.setMinMax(this.chart.data.findExtremes('ind', min, max), true);
                //this.chart.yAxis.setMinMax([this.chart.yAxis.min-0.05*this.chart.yAxis.length, this.chart.yAxis.max+0.05*this.chart.yAxis.length]);
                this.minY_input.disabled = this.scaleToFit;
                this.maxY_input.disabled = this.scaleToFit;
            } else {
                    const min = +this.minY_input.value;
                    const max = +this.maxY_input.value;
                    this.chart.yAxis.setMinMax([min,max], true);
                    //this.chart.yAxis.setMinMax([this.chart.yAxis.min-0.05*this.chart.yAxis.length, this.chart.yAxis.max+0.05*this.chart.yAxis.length]);
                    this.minY_input.disabled = this.scaleToFit;
                    this.maxY_input.disabled = this.scaleToFit;
                }
        })

    }



    _createAnimationPanel() {

        const fieldset = document.createElement('fieldset');
    
        const legend = document.createElement('legend');
        legend.textContent = 'Animation options';

        fieldset.append(legend);

        // X Axis ticks animation
        let label = document.createElement('label');
        label.for = 'xTickAnimationSwitch';
        fieldset.append(label);

        let input = document.createElement('input');
        input.type = "checkbox";
        input.id = 'xTickAnimationSwitch';
        input.name = 'xTickAnimationSwitch';
        label.append(input);

        let text = document.createTextNode('X axis ticks animation');
        label.append(text);

        input.addEventListener('change', (event) => {
            this.chart.xAxis.ticks.switchAnimation(event.target.checked);
        });
        // end

        let br = document.createElement('br');
        fieldset.append(br);

        // Y Axis ticks animation
        label = document.createElement('label');
        label.for = 'yTickAnimationSwitch';
        fieldset.append(label);

        input = document.createElement('input');
        input.type = "checkbox";
        input.id = 'yTickAnimationSwitch';
        input.name = 'yTickAnimationSwitch';
        label.append(input);

        text = document.createTextNode('Y axis ticks animation');
        label.append(text);

        input.addEventListener('change', (event) => {
            this.chart.yAxis.ticks.switchAnimation(event.target.checked);
        });

        // end

        br = document.createElement('br');
        fieldset.append(br);

        // PlotsData animation
        label = document.createElement('label');
        label.for = 'plotDataAnimation';
        fieldset.append(label);

        input = document.createElement('input');
        input.type = "checkbox";
        input.id = 'plotDataAnimation';
        input.name = 'plotDataAnimation';
        label.append(input);

        text = document.createTextNode('Data animation');
        label.append(text);

        input.addEventListener('change', (event) => {
            this.chart.data.switchAllSeriesAnimation(event.target.checked);
        });
        
        return fieldset;

    }

}