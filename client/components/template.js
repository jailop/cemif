const baseURL = '/api/v2'

class Component extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        this.selElem = document.createElement('select');
        this.selElem.addEventListener('change', (e) => {
        shadow.appendChild(this.selElem);
    }
    static get observedAttributes() {
        return [];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
    }
}
