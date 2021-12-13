"use strict";

import '/res/node_modules/vega/build/vega.js';
import '/res/node_modules/vega-lite/build/vega-lite.js';
import '/res/node_modules/vega-embed/build/vega-embed.js';
import '/res/node_modules/arquero/dist/arquero.js';

class MuniBudgetHeader extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.plotDiv = document.createElement('div');
        this.plotDiv.setAttribute('id', 'plot');
        this.plotDiv.setAttribute('class', 'plot');
        this.plotDiv.setAttribute('class', 'plot');
        this.plotDiv.style.width = '100%';
        this.shadow.appendChild(this.plotDiv);
        this.year = this.hasAttribute('year') ? this.getAttribute('year') : '';
        this.municipality = this.hasAttribute('municipality') ?
            this.getAttribute('municipality') : '';
        this.content = this.hasAttribute('content') ?
            this.getAttribute('content') : '';
    }

    static get observedAttributes() {
        return ['year', 'department', 'contab-id', 'content'];
    }

    connectedCallback() {
        this.preprocessData();
        // this.getCatalog();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        const root = this;
        const year = this.year;
        if (this.csv == undefined)
            return;
        if (name == 'year')
            root.year = this.getAttribute('year');
        else if (name == 'municipality')
            root.municipality = this.getAttribute('municipality');
        else if (name == 'contab-id')
            root.contabId = this.getAttribute('contab-id');
        else if (name == 'content') {
            const c = this.getAttribute('content')
            if (c == 'revenue' || c == 'expenses')
                this.content = c;
        }
        this.getCatalog();
    }

    getCatalog() {
        let root = this;
        const urlObjects = `/api/v2/municipalities/${this.contabId}/objects` +
            `?year=${this.year}`;
        fetch(urlObjects)
            .then(data => data.json())
            .then(d => root.filterData(d))
    }

    filterData(catalog) {
        const root = this;
        let dict = {};
        for (let i = 0; i < catalog.length; i++) {
           dict[catalog[i].object] = catalog[i].object + '. ' +
                catalog[i].name;
        }
        const t = root.csv
            .params({
                year : root.year,
                mun  : root.contabId,
                content : root.content,
                dict : dict
            })
            .filter(d => d.year == year)
            .filter(d => d.muni_contab_id == mun)
            .filter(d => {
                if (content == 'revenue') {
                    return d.object < '50';
                }
                else {
                    return d.object >= '50';
                }
            })
            .derive({moment:  d => {
                if (d.class == 'APR') {
                    return 'A. Aprobado';
                }
                else if (d.class == 'MOD') {
                    return 'B. Modificado';
                }
                else if (d.class == 'ACR') {
                    return 'C. Ejecutado'
                }
            }})
            .derive({name: d => dict[d.object]})
            .select('name', 'moment', 'amount')
            .objects();
        this.plot(t);
    }

    async preprocessData() {
        let urlData = '/res/data/mun-budget-year-header.csv';
        this.csv = await aq.loadCSV(urlData);
    }

    plot(data) {
        if (data == undefined)
            return;
        let root = this;
        let title = 'Ingresos presupuestarios'
        if (root.content == 'expenses') {
            title = 'Egresos presupuestarios';
        }
        let spec = {
            "mark": {"type": "bar", "tooltip": true},
            "data": {
                "values" : data,
            },
            "width": "container",
            "title": title,
            "encoding": {
                "x": {
                    "field": "name",
                    "type": "nominal",
                    "title": "Rubro"
                },
                "y": {
                    "field": "amount",
                    "type": "quantitative",
                    "title": "Monto (USD)"
                },
                "xOffset": {"field": "moment"},
                "color": {
                    "field": "moment",
                    "title": "",
                    "scale": {
                        "scheme": "dark2"
                    }
                }
            },
            "config": {
                "numberFormat": "~s",
            }
        };
        vegaEmbed(root.plotDiv, spec);
    }
}

class MuniBudgetYears extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.plotDiv = document.createElement('div');
        this.plotDiv.setAttribute('id', 'plot');
        this.plotDiv.setAttribute('class', 'plot');
        this.plotDiv.style.width = '100%';
        this.shadow.appendChild(this.plotDiv);
        this.municipality = this.hasAttribute('municipality') ?
            this.getAttribute('municipality') : '';
        this.contabId = this.hasAttribute('contab-id') ?
            this.getAttribute('contab-id') : '';
        this.content = this.hasAttribute('content') ?
            this.getAttribute('content') : '';
    }

    static get observedAttributes() {
        return ['contab-id', 'muniname', 'content'];
    }

    connectedCallback() {
        this.preprocessData();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        const root = this;
        if (this.csv == undefined)
            return;
        if (name == 'municipality')
            root.municipality = this.getAttribute('municipality');
        else if (name == 'contab-id')
            root.contabId = this.getAttribute('contab-id');
        else if (name == 'content') {
            const c = this.getAttribute('content')
            if (c == 'revenue' || c == 'expenses')
                this.content = c;
        }
        else if (name == 'muniname') {
            this.muniName = this.getAttribute('muniname');
        }
        this.filterData();
    }

    filterData() {
        const root = this;
        const t = root.csv
            .params({
                mun  : root.contabId,
                content : root.content,
            })
            .filter(d => d.muni_contab_id == mun)
            .filter(d => {
                if (content == 'revenue') {
                    return d.object < '50';
                }
                else {
                    return d.object >= '50';
                }
            })
            .filter(d => d.object < '90')
            .derive({kind:  d => {
                if (content == "expenses") {
                    if (d.object >= '50' && d.object < '60') {
                        return 'A. Gastos';
                    }
                    else if (d.object >= '60' && d.object < '70') {
                        return 'B. Inversiones';
                    }
                    else if (d.object >= '70' && d.object < '80') {
                        return "C. Amortización de deudas";
                    }
                }
                else {
                    if (d.object == "16" || d.object == '22') {
                        return "B. Trasferencias recibidas";
                    }
                    else if (d.object == "31") {
                        return "C. Endeudamiento";
                    }
                    else if (d.object == "41") {
                        return "D. Contribuciones especiales";
                    }
                    else {
                        return "A. Ingresos propios"
                    }
                }
            }})
            .groupby('year', 'kind')
            .rollup({sum: d => op.sum(d.amount)})
            .select('year', 'kind', 'sum')
            .objects();
        this.plot(t);
    }

    async preprocessData() {
        let urlData = '/res/data/mun-budget-year-header.csv';
        this.csv = await aq.loadCSV(urlData);
    }

    plot(data) {
        if (data == undefined)
            return;
        let root = this;
        let title = ["Alcaldía Municipal de " + root.muniName];
        if (root.content == 'expenses') {
            title[1] = 'Egresos presupuestarios';
        }
        else {
            title[1] = 'Ingresos presupuestarios'
        }
        let spec = {
            "mark": {
                "type": "line",
                "point": true,
                "tooltip": true,
                "strokeWidth": 3
            },
            "data": {
                "values" : data,
            },
            "width": "container",
            "title": title,
            "encoding": {
                "x": {
                    "field": "year",
                    "type": "nominal",
                    "title": "Ejercicio fiscal"
                },
                "y": {
                    "field": "sum",
                    "type": "quantitative",
                    "title": "Monto (USD)"
                },
                "xOffset": {"field": "kind"},
                "color": {
                    "field": "kind",
                    "title": "",
                    "scale": {
                        "scheme": "dark2"
                    }
                }
            },
            "config": {
                "numberFormat": "~s",
            }
        };
        vegaEmbed(root.plotDiv, spec);
    }
}

class MuniContabHeader extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.plotDiv = document.createElement('div');
        this.plotDiv.setAttribute('id', 'plot');
        this.plotDiv.setAttribute('class', 'plot');
        this.plotDiv.setAttribute('class', 'plot');
        this.plotDiv.style.width = '100%';
        this.shadow.appendChild(this.plotDiv);
        this.year = this.hasAttribute('year') ? this.getAttribute('year') : '';
        this.municipality = this.hasAttribute('municipality') ?
            this.getAttribute('municipality') : '';
        this.content = this.hasAttribute('content') ?
            this.getAttribute('content') : '';
    }

    static get observedAttributes() {
        return ['year', 'department', "muniname", 'contab-id', 'content'];
    }

    connectedCallback() {
        this.preprocessData();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        const root = this;
        const year = this.year;
        if (this.csv == undefined)
            return;
        if (name == 'year')
            root.year = this.getAttribute('year');
        else if (name == 'municipality')
            root.municipality = this.getAttribute('municipality');
        else if (name == 'contab-id')
            root.contabId = this.getAttribute('contab-id');
        else if (name == 'content') {
            const c = this.getAttribute('content')
            if (c == 'assets' || c == 'liabilities')
                this.content = c;
        }
        else if (name == "muniname") {
            root.muniName = this.getAttribute("muniname");
        }
        const urlAccounts = `/api/v2/municipalities/${this.contabId}/accounts` +
            `?year=${this.year}`;
        fetch(urlAccounts)
            .then(data => data.json())
            .then(d => root.filterData(d))
    }

    filterData(catalog) {
        const root = this;
        let dict = {};
        for (let i = 0; i < catalog.length; i++) {
           dict[catalog[i].account] = catalog[i].account + '. ' +
                catalog[i].name;
        }
        const t = root.csv
            .params({
                year : root.year,
                mun  : root.contabId,
                content : root.content,
                dict : dict
            })
            .filter(d => d.year == year)
            .filter(d => d.muni_contab_id == mun)
            .filter(d => {
                if (content == 'assets') {
                    return d.account >= '200' && d.account < '400';
                }
                else {
                    return d.account >= '400' && d.account < '800';
                }
            })
            .derive({name: d => dict[d.account]})
            .select('year', 'name', 'amount')
            .objects();
        this.plot(t);
    }

    async preprocessData() {
        let urlData = '/res/data/mun-contab-year-header.csv';
        this.csv = await aq.loadCSV(urlData);
    }

    plot(data) {
        if (data == undefined)
            return;
        let root = this;
        let title = ["Alcaldía Municipal de " + root.muniName];
        if (root.content == 'liabilities') {
            title[1] = 'Obligaciones';
        }
        else {
            title[1] = 'Recursos'
        }
        title[1] += " (" + root.year + ")";
        let spec = {
            "mark": {"type": "bar", "tooltip": true},
            "data": {
                "values" : data,
            },
            "width": "container",
            "title": title,
            "encoding": {
                "x": {
                    "field": "name",
                    "type": "nominal",
                    "title": "Cuenta"
                },
                "y": {
                    "field": "amount",
                    "type": "quantitative",
                    "title": "Monto (USD)",

                },
                "color": {
                    "field": "year",
                    "scale": {
                        "scheme": "dark2"
                    }
                }
            },
            "config": {
                "numberFormat": "~s",
            }
        };
        vegaEmbed(root.plotDiv, spec);
    }
}

class MuniContabYears extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.plotDiv = document.createElement('div');
        this.plotDiv.setAttribute('id', 'plot');
        this.plotDiv.setAttribute('class', 'plot');
        this.plotDiv.style.width = '100%';
        this.shadow.appendChild(this.plotDiv);
        this.municipality = this.hasAttribute('municipality') ?
            this.getAttribute('municipality') : '';
        this.contabId = this.hasAttribute('contab-id') ?
            this.getAttribute('contab-id') : '';
        this.content = this.hasAttribute('content') ?
            this.getAttribute('content') : '';
    }

    static get observedAttributes() {
        return ['contab-id', 'content'];
    }

    connectedCallback() {
        this.preprocessData();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        const root = this;
        if (this.csv == undefined)
            return;
        if (name == 'municipality')
            root.municipality = this.getAttribute('municipality');
        else if (name == 'contab-id')
            root.contabId = this.getAttribute('contab-id');
        else if (name == 'content') {
            const c = this.getAttribute('content')
            if (c == 'assets' || c == 'liabilities')
                this.content = c;
        }
        this.filterData();
    }

    filterData() {
        const root = this;
        const t = root.csv
            .params({
                mun  : root.contabId,
                content : root.content,
            })
            .filter(d => d.muni_contab_id == mun)
            .filter(d => {
                if (content == 'assets') {
                    return d.account >= '200' && d.account < '400';
                }
                else {
                    return d.account >= '400' && d.account < '800';
                }
            })
            .derive({upper: d => op.substring(d.account, 0, 2)})
            .derive({kind:  d => {
                if (content == "assets") {
                    if (d.upper == "21" || d.upper == "22") {
                        return "A. Fondos e inversiones financieras";
                    }
                    else if (d.upper == "23" || d.upper == "24") {
                        return "B. Existencias y bienes de uso";
                    }
                    else if (d.upper == "25") {
                        return "C. Inversiones en proyectos";
                    }
                    else {
                        return d.account;
                    }
                }
                else {
                    if (d.upper == '41') {
                        return "A. Obligaciones de corto plazo"
                    }
                    else {
                        return "B. Deuda de largo plazo"
                    }
                }
            }})
            .groupby('year', 'kind')
            .rollup({sum: d => op.sum(d.amount)})
            .select('year', 'kind', 'sum')
            .objects();
        this.plot(t);
    }

    async preprocessData() {
        let urlData = '/res//data/mun-contab-year-header.csv';
        this.csv = await aq.loadCSV(urlData);
    }

    plot(data) {
        if (data == undefined)
            return;
        let root = this;
        let title = "Recursos";
        if (root.content == 'liabilities') {
            title = "Obligaciones";
        }
        let spec = {
            "mark": {
                "type": "line",
                "point": true,
                "tooltip": true,
                "strokeWidth": 3
            },
            "data": {
                "values" : data,
            },
            "width": "container",
            "title": title,
            "encoding": {
                "x": {
                    "field": "year",
                    "type": "nominal",
                    "title": "Ejercicio fiscal"
                },
                "y": {
                    "field": "sum",
                    "type": "quantitative",
                    "title": "Monto (USD)"
                },
                "xOffset": {"field": "kind"},
                "color": {
                    "field": "kind",
                    "title": "",
                    "scale": {
                        "scheme": "dark2"
                    }
                }
            },
            "config": {
                "numberFormat": "~s",
            }
        };
        vegaEmbed(root.plotDiv, spec);
    }
}

class MuniIndicator extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.plotDiv = document.createElement('div');
        this.plotDiv.setAttribute('id', 'plot');
        this.plotDiv.setAttribute('class', 'plot');
        this.plotDiv.style.width = '100%';
        this.shadow.appendChild(this.plotDiv);
        this.municipality = this.hasAttribute('municipality') ?
            this.getAttribute('municipality') : '';
        this.contabId = this.hasAttribute('contab-id') ?
            this.getAttribute('contab-id') : '';
        this.key = this.hasAttribute('key') ?
            this.getAttribute('key') : '';
        this.dict = {};
        this.dict[this.key] = "Indicador";
    }

    static get observedAttributes() {
        return ['contab-id', 'key'];
    }

    connectedCallback() {
        this.preprocessData();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        const root = this;
        if (name == 'municipality') {
            root.municipality = this.getAttribute('municipality');
        }
        else if (name == 'contab-id') {
            root.contabId = this.getAttribute('contab-id');
        }
        else if (name == 'key') {
            root.key = this.getAttribute('key')
        }
        this.plot();
    }

    async preprocessData() {
        this.dict = {};
        await fetch('/res/data/muni-indicators-keys.csv')
            .then(response => response.text())
            .then(text => {
                let lines = text.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    let tokens = lines[i].split(",");
                    this.dict[tokens[0]] = tokens[1];
                }
                this.plot();
            });
    }

    plot() {
        let root = this;
        // let title = root.dict[this.key];
        let spec = {
            "mark": {
                "type": "line",
                "point": true,
                "tooltip": true,
                "strokeWidth": 3
            },
            "data": {"url": "/res/data/muni-indicators.csv"},
            "width": "container",
            "title": root.dict[root.key],
            "encoding": {
                "x": {
                    "field": "year",
                    "type": "nominal",
                    "title": "Ejercicio fiscal",


                },
                "y": {
                    "field": "value",
                    "type": "quantitative",

                },

            },
            "transform": [
                {"filter": "datum.contab == " + root.contabId},
                {"filter": "datum.group == '" + root.key + "'"}
            ],
            "config": {
                // "numberFormat": "~s",
                "range": {
                    "ramp": {
                        "scheme": "dark2"
                    }
                }
            }
        };
        vegaEmbed(root.plotDiv, spec);
    }
}

customElements.define('x-muni-budget-headers', MuniBudgetHeader);
customElements.define("x-muni-budget-years", MuniBudgetYears);
customElements.define('x-muni-contab-headers', MuniContabHeader);
customElements.define('x-muni-contab-years', MuniContabYears);
customElements.define('x-muni-indicator', MuniIndicator);
