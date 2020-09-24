export class SeriesCtrl {

    container: HTMLElement;
    element: HTMLElement;
    upBtn: HTMLElement;
    downBtn: HTMLElement;
    delBtn: HTMLElement; 

    constructor (container: HTMLElement, ...options: string[]) {
        this.container = container;
        this.element = this._create(...options);
        this.container.append(this.element);
    }


    _create(...options: string[]): HTMLElement {

        const block = document.createElement('div');
        block.classList.add('series__block');
        block.style.background= options[1];

        const title = document.createElement('h3');
        title.classList.add('panel__title');
        title.textContent = options[0];

        const upBtn = document.createElement('button');
        upBtn.classList.add('panel__submit');
        upBtn.textContent = '+';
        this.upBtn = upBtn;

        const downBtn = document.createElement('button');
        downBtn.classList.add('panel__submit');
        downBtn.textContent = '-';
        this.downBtn = downBtn;

        const delBtn = document.createElement('button');
        delBtn.classList.add('panel__submit');
        delBtn.textContent = 'remove series';
        this.delBtn = delBtn;
        
        block.append(title);
        block.append(upBtn);
        block.append(downBtn);
        block.append(delBtn);

        return block;
    }

}