const baseURL = '/api/v2'

class Years extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        this.selElem = document.createElement('select');
        fetch("/data/years.txt")
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
        this.selElem.addEventListener('change', (e) => {
            this.year = this.selElem.options[this.selElem.selectedIndex]
                .getAttribute('value')
            this.setAttribute('year', this.year);
            let target = this.getAttribute('target').split(',');
            for (let i = 0; i < target.length; i++) {
                let elem = document.getElementById(target[i].trim());
                if (elem) {
                    elem.setAttribute("year", this.year)
                }
            }
            this.dispatchEvent(new Event('change'));
        })
        shadow.appendChild(this.selElem);
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
        const shadow = this.attachShadow({mode: 'open'});
        this.selElem = document.createElement('select');
        const option = document.createElement('option');
        option.setAttribute('department', '');
        this.selElem.appendChild(option);
        fetch(baseURL + '/departments')
            .then(response => response.json())
            .then(data => {
                data.forEach(d => {
                    let option = document.createElement('option');
                    option.setAttribute('value', d.department);
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
        shadow.appendChild(this.selElem);
    }
    static get observedAttributes() {
        return ['department'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        if (name == 'department') {
            /* To be implemented
            let options = this.selElem.getChildren();
            for (let i = 0; i < options.length; i++)
                if (options[i].value == newValue)
                    options[i].setAttribute('selected', '')
            */
        }
    }
};

class Municipalities extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.selElem = document.createElement('select');
        this.updateOptions();
        this.selElem.addEventListener('change', e => {
            const option = this.selElem.options[this.selElem.selectedIndex];
            this.setAttribute('municipality-id', option.getAttribute('value'));
            this.setAttribute('contab-id', option.getAttribute('contab-id'));
            this.setAttribute('shp-id', option.getAttribute('shp-id'));
            this.setAttribute('municipality', option.text);
            this.dispatchEvent(new Event('change'));
        });
        this.shadow.appendChild(this.selElem);
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
            <div class="row">
                <div class="column">
                    <label>Departamento</label>
                    <div>
                      <x-departments id="dept"></x-departments>
                    </div>
                </div>
                <div class="row">
                    <label>Municipio</label>
                    <div>
                      <x-municipalities id="muni"></x-municipalities>
                    </div>
                </div>
            </div>`
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
            let target = this.getAttribute('target').split(',');
            for (let i = 0; i < target.length; i++) {
                let elem = document.getElementById(target[i]);
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
            let target = this.getAttribute('target').split(',');
            for (let i = 0; i < target.length; i++) {
                let elem = document.getElementById(target[i]);
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

customElements.define('x-years', Years);
customElements.define('x-departments', Departments);
customElements.define('x-municipalities', Municipalities);
customElements.define('x-muniselector', MuniSelector);
