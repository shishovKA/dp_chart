export class Btn {

    container: HTMLElement;
    element: HTMLElement;


    constructor (container: HTMLElement, ...options: string[]) {
        this.container = container;
        this.element = this._create(...options);
        this.container.append(this.element);
    }


    _create(...options: string[]): HTMLElement {

        const button = document.createElement('button');
        button.classList.add('panel__btn');
        button.textContent = options[0];
        button.style.background= options[1];
        
        
        return button;
    }

}