export class Panel {

    container: HTMLElement;
    element: HTMLElement;
    form: HTMLElement;

    constructor (container: HTMLElement, ...options: string[]) {
        this.container = container;
        this.element = this._create(...options);
        this.container.append(this.element);
    }

    get submitBtn():HTMLElement {
        return this.element.querySelector('.panel__submit')
    }

    get values():number[] {
        const val1 = this.form.elements["input1"].value;
        const val2 = this.form.elements["input2"].value;
        return [+val1, +val2]
    }

    get duration():number {
        const duration = this.form.elements["input3"].value;
        return duration
    }

    _create(...options: string[]): HTMLElement {

        const form = document.createElement('form');
        form.classList.add('panel__block');
        this.form = form;

        const title = document.createElement('h3');
        title.classList.add('panel__title');
        title.textContent = options[0];

        const label1 = document.createElement('p');
        label1.classList.add('panel__label');
        label1.textContent = options[1];

        const input1 = document.createElement('input');
        input1.classList.add("panel__input");
        input1.type = "text";
        input1.name = "input1";
        input1.placeholder = "0";
        input1.value = options[4];

        const label2 = document.createElement('p');
        label2.classList.add('panel__label');
        label2.textContent = options[2];

        const input2 = document.createElement('input');
        input2.classList.add("panel__input");
        input2.type = "text";
        input2.name = "input2";
        input2.placeholder = "0";
        input2.value = options[5];

        const label3 = document.createElement('p');
        label3.classList.add('panel__label');
        label3.textContent = options[3];

        const input3 = document.createElement('input');
        input3.classList.add("panel__input");
        input3.type = "text";
        input3.name = "input3";
        input3.placeholder = "0";
        input3.value = options[6];

        const button = document.createElement('button');
        button.classList.add('panel__submit');
        button.textContent = 'Update';
        
        form.append(title);
        form.append(label1);
        form.append(input1);
        form.append(label2);
        form.append(input2);
        form.append(label3);
        form.append(input3);
        form.append(button);
        
        return form;
    }

}