export class Panel {

    container: HTMLElement;
    element: HTMLElement;
    form: HTMLElement;
    fieldsCount: number;
    title: string;

    constructor (container: HTMLElement, title: string, fieldsCount: number, ...options: string[]) {
        this.container = container;
        this.fieldsCount = fieldsCount;
        this.title = title;
        this.element = this._create(...options);
        this.container.append(this.element);
    }

    get submitBtn():HTMLElement {
        return this.element.querySelector('.panel__submit')
    }

    get values():number[] {
        const values: number[] = [];
        for (let i=0; i<this.form.elements.length-1; i++) {
            values.push(+this.form.elements[i].value)
        }
        return values;
    }


    _create(...options: string[]): HTMLElement {

        const form = document.createElement('form');
        form.classList.add('panel__block');
        this.form = form;

        const title = document.createElement('h3');
        title.classList.add('panel__title');
        title.textContent = this.title;

        form.append(title);

        for (let i=0; i<this.fieldsCount; i++) {
            const label = document.createElement('p');
            label.classList.add('panel__label');
            label.textContent = options[i*2];
    
            const input = document.createElement('input');
            input.classList.add("panel__input");
            input.type = "text";
            input.name = `input${i}`;
            input.placeholder = "0";
            input.value = options[i*2+1];

            form.append(label);
            form.append(input);
        }

        const button = document.createElement('button');
        button.classList.add('panel__submit');
        button.textContent = 'Update';
        
        form.append(button);
        
        return form;
    }

}