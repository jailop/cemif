"use strict";

import "/res/node_modules/d3/dist/d3.js";

const baseURL = '/api/v2'

class MuniDiv extends HTMLElement {
    constructor() {
        super();
        this.style.display = "none";
        this.municipality = this.hasAttribute('municipality') ?
            this.getAttribute('municipality') : '';

    }
    static get observedAttributes() {
        return ['municipality'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        else if (name == 'municipality') {
            if (newValue.length > 0)
                this.style.display = 'block';
            else
                this.style.display = 'none';
        }
    }
}

class Years extends HTMLElement {
    constructor() {
        super();
        let template = document.createElement("template");
        template.innerHTML = `
            <style>
                @import "/res/css/style.css"
            </style>
            <form>
                <div class="grid">
                    <label for="main" class="right">
                        Ejercicio fiscal (año)
                    </label>
                    <div><select id="main"></select></div>
                </div>
            </form>`
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(template.content.cloneNode(true));
        this.selElem = shadow.getElementById("main");
        fetch("/res/data/years.txt")
            .then(response => response.text())
            .then(data => {
                let lines = data.split('\n');
                lines.forEach(d => {
                    if (d.length > 0) {
                        let option = document.createElement('option');
                        option.setAttribute('value', d);
                        option.innerHTML = d;
                        this.selElem.appendChild(option);
                    }
                })
            })
            .then(d => {
                this.selElem.addEventListener('change', d => {
                        this.updateTargets();
                });
                this.updateTargets();
            });
    }
    updateTargets(e) {
        this.year = this.selElem.options[this.selElem.selectedIndex]
            .getAttribute('value')
        this.setAttribute('year', this.year);
        let target = this.getAttribute('target');
        if (target) {
            let targets = target.split(",");
            for (let i = 0; i < targets.length; i++) {
                let elem = document.getElementById(targets[i].trim());
                if (elem) {
                    elem.setAttribute("year", this.year)
                }
            }
        }
        this.dispatchEvent(new Event('change'));
    }
    static get observedAttributes() {
        return ['year'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        if (name == "year") {
            if (oldValue == newValue)
            this.setAttribute('year', newValue);
            let options = this.selElem.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value == newValue) {
                    options[i].setAttribute("selected", "");
                }
                else {
                    options[i].removeAttribute("selected");
                }
            }
        }
    }
}

class Departments extends HTMLElement {
    constructor() {
        super();
        let template = document.createElement("template");
        template.innerHTML = `
            <style>
                @import "/res/css/style.css"
            </style>
            <select id="main"></select>`
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(template.content.cloneNode(true));
        this.selElem = shadow.getElementById("main");
        const option = document.createElement('option');
        option.setAttribute('department', '');
        this.selElem.appendChild(option);
        fetch(baseURL + '/departments')
            .then(response => response.json())
            .then(data => {
                data.forEach(d => {
                    let option = document.createElement('option');
                    option.setAttribute("value", d.department);
                    option.innerHTML = d.department;
                    this.selElem.appendChild(option);
                })
                this.selectedIndex = 0;
                this.setAttribute('department', this.selElem.options[0].value);
            });
        this.selElem.addEventListener('change', (e) => {
            this.setAttribute('department',
                this.selElem.options[this.selElem.selectedIndex]
                    .getAttribute('value'));
            this.dispatchEvent(new Event('change'));
        })
    }
    static get observedAttributes() {
        return ['department'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
    }
};

class Municipalities extends HTMLElement {
    constructor() {
        super();
        let template = document.createElement("template");
        template.innerHTML = `
            <style>
                @import "/res/css/style.css"
            </style>
            <select id="main"></select>`
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(template.content.cloneNode(true));
        this.selElem = shadow.getElementById("main");
        this.updateOptions();
        this.selElem.addEventListener('change', e => {
            const option = this.selElem.options[this.selElem.selectedIndex];
            this.setAttribute('municipality-id', option.getAttribute('value'));
            this.setAttribute('contab-id', option.getAttribute('contab-id'));
            this.setAttribute('shp-id', option.getAttribute('shp-id'));
            this.setAttribute('municipality', option.text);
            this.dispatchEvent(new Event('change'));
        });
    }

    updateOptions() {
        this.selElem.innerHTML = '';
        const option = document.createElement('option');
        option.setAttribute('value', '');
        this.selElem.appendChild(option);
        let department = this.hasAttribute('department') ?
            this.getAttribute('department') : '';
        let url = baseURL + '/municipalities'
        if (department != "") {
            url += "?department=" + department;
        }
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(d => {
                    let option = document.createElement('option');
                    option.setAttribute('value', d.id);
                    option.setAttribute('contab-id', d.contab);
                    option.setAttribute('shp-id', d.shp);
                    option.innerHTML = d.municipality;
                    this.selElem.appendChild(option);
                })
            });
    }

    static get observedAttributes() {
        return ['department', 'municipality-id'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        if (name == 'department') {
            this.updateOptions();
            this.setAttribute('municipality-id', '');
        }
        if (name == 'municipality-id') {
            // To be implemented
        }
    }
}

class MuniSelector extends HTMLElement {

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `
            <style>
                @import "/res/css/style.css"
            </style>
            <form>
            <div class="grid">
                <label for="dept">
                    Departamento
                    <x-departments id="dept"></x-departments>
                </label>
                <label for="muni">
                    Municipio
                    <x-municipalities id="muni"></x-municipalities>
                </label>
            </div>
            </form>`
        this.setAttribute('department', '');
        this.setAttribute('municipality-id', '');
        this.dept = shadow.getElementById('dept');
        this.muni = shadow.getElementById('muni');
        this.dept.addEventListener('change', (e) => {
            let attr_dept = this.dept.getAttribute('department');
            this.muni.setAttribute('department', attr_dept);
            this.setAttribute('department', attr_dept);
        })
        this.muni.addEventListener('change', (e) => {
            let attr_muni = this.muni.getAttribute('municipality-id');
            this.setAttribute('municipality-id', attr_muni);
            let target = this.getAttribute('target');
            if (target) {
                let targets = target.split(",");
                for (let i = 0; i < targets.length; i++) {
                    let elem = document.getElementById(targets[i]);
                    if (elem) {
                        elem.setAttribute('municipality',
                            this.muni.getAttribute('municipality-id'));
                        elem.setAttribute('contab-id',
                            this.muni.getAttribute('contab-id'));
                        elem.setAttribute('shp-id',
                            this.muni.getAttribute('shp-id'));
                        elem.setAttribute('muniname',
                            this.muni.getAttribute('municipality'));
                    }
                }
            }
        });
    }
    

    connectedCallback() {
        this.muni.setAttribute('department',
            this.dept.getAttribute('department'));
    }

    static get observedAttributes() {
        return ['department', 'municipality-id', 'target'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        if (name == 'department') {
            this.dept.setAttribute('department', newValue);
            this.muni.setAttribute('department', newValue);
        }
        else if (name == 'municipality-id') {
            this.muni.setAttribute('municipality-id', newValue);
            let target = this.getAttribute('target');
            if (target) {
                let targets = target.split(",");
                for (let i = 0; i < targets.length; i++) {
                    let elem = document.getElementById(targets[i]);
                    if (elem != null) {
                        elem.setAttribute('municipality',
                            this.muni.getAttribute('municipality-id'));
                        elem.setAttribute('contab-id',
                            this.muni.getAttribute('contab-id'));
                        elem.setAttribute('shp-id',
                            this.muni.getAttribute('shp-id'));
                    }
                }
            }
        }
    }
}

customElements.define('x-muni-div', MuniDiv);
customElements.define('x-years', Years);
customElements.define('x-departments', Departments);
customElements.define('x-municipalities', Municipalities);
customElements.define('x-muniselector', MuniSelector);
