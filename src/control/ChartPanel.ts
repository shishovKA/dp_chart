
import { Chart } from "../classes/Chart";

export class ChartPanel {

    container: HTMLElement;
    element: HTMLElement;
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

        this._create();
        this.container.append(this.element);
        this._setListeners();

    }


    _create() {

        const panel = document.createElement('div');
        panel.classList.add('panel__block');
        this.element = panel;

        const title = document.createElement('h3');
        title.classList.add('panel__title');
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
        maxX_input.max = this.chart.data.findExtremes('val')[1].toString();
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
        maxY_input.min = this.chart.data.findExtremes('ind')[0].toFixed();
        maxY_input.max = this.chart.data.findExtremes('ind')[1].toFixed();
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

    }

    _setListeners() {
        this.minX_input.addEventListener('input', (event) => {
            const max = this.chart.xAxis.max;
            const min = +event.target.value;
            this.minX_label.textContent = event.target.value;
            this.chart.xAxis.setMinMax([min,max], 0);
            if (this.scaleToFit) {
                this.chart.yAxis.setMinMax(this.chart.data.findExtremes('ind', min, max));
            }
            
        })

        this.maxX_input.addEventListener('input', (event) => {
            const min = this.chart.xAxis.min;
            const max = +event.target.value;
            this.maxX_label.textContent = event.target.value;
            this.chart.xAxis.setMinMax([min,max], 0);
            if (this.scaleToFit) {
                this.chart.yAxis.setMinMax(this.chart.data.findExtremes('ind', min, max));
            }
        })

        this.minY_input.addEventListener('input', (event) => {
            const max = this.chart.yAxis.max;
            const min = +event.target.value;
            this.minY_label.textContent = event.target.value;
            this.chart.yAxis.setMinMax([min,max], 0);
        })

        this.maxY_input.addEventListener('input', (event) => {
            const min = this.chart.yAxis.min;
            const max = +event.target.value;
            this.maxY_label.textContent = event.target.value;
            this.chart.yAxis.setMinMax([min,max], 0);
        })

        this.scaleToFit_input.addEventListener('change', (event) => {
            const min = this.chart.xAxis.min;
            const max = this.chart.xAxis.max;
            this.scaleToFit = event.target.checked;
            if (this.scaleToFit) {
                this.chart.yAxis.setMinMax(this.chart.data.findExtremes('ind', min, max), 300);
                this.minY_input.disabled = this.scaleToFit;
                this.maxY_input.disabled = this.scaleToFit;
            } else {
                    const min = +this.minY_input.value;
                    const max = +this.maxY_input.value;
                    this.chart.yAxis.setMinMax([min,max], 300);
                    this.minY_input.disabled = this.scaleToFit;
                    this.maxY_input.disabled = this.scaleToFit;
                }
        })


    }

}