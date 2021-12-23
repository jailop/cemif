"use strict";

import '/res/node_modules/vega/build/vega.js';
import '/res/node_modules/vega-lite/build/vega-lite.js';
import '/res/node_modules/vega-embed/build/vega-embed.js';
import '/res/node_modules/arquero/dist/arquero.js';

import { DataTable } from "./table.js";
// import { formatExpression } from 'vega-lite/build/src/timeunit';

aq.addFunction("d3format", d3.format(",.2f"));

const selectTemplate = document.createElement("template");
selectTemplate.innerHTML = `
<style>
    @import "/res/css/style.css"
</style>
<div>
<div><select id="main"></select></div>
<div><span id="note"></span></div>
</div>`

const divTemplate = document.createElement("template");
divTemplate.innerHTML = `
<style>
    @import "/res/css/style.css"
</style>
<div id="main"></div>`

class SelectIndicators extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(selectTemplate.content.cloneNode(true));
        this.selElem = shadow.getElementById("main");
        this.span = shadow.getElementById("note");
        d3.csv("/res/data/muni-indicators-keys.csv", d => {
                let option = document.createElement("option");
                option.setAttribute("value", d.key);
                option.setAttribute("category", d.category);
                option.setAttribute("scale", d.scale);
                option.setAttribute("note", d.note);
                option.text = d.label;
                this.selElem.appendChild(option);
                })
        .then(() => {
            this.selElem.addEventListener('change', () => {
                    this.updateTargets()
            });
            this.updateTargets();
        });
    }
    updateTargets() {
        let root = this;
        let elem = root.selElem.options[root.selElem.selectedIndex];
        this.span.innerHTML = elem.getAttribute("note");
        let key = elem.getAttribute("value");
        let category = elem.getAttribute("category");
        let label = elem.text;
        let scale = elem.getAttribute("scale");
        let target = this.getAttribute('target');
        if (target) {
            let targets = target.split(",");
            for (let i = 0; i < targets.length; i++) {
                let elem = document.getElementById(targets[i]);
                if (elem) {
                    elem.setAttribute('key', key);
                    elem.setAttribute('category', category);
                    elem.setAttribute("label", label);
                    elem.setAttribute("scale", scale);
                }
            }
        }
    }
    static get observedAttributes() {
        return ['key'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        if (name == 'key') {
            for (let i = 0; i < this.selElem.options; i++) {
                if (this.selElem.options[i].getAttribute("") == newValue)
                    this.selElem.options[i].setAttribute("selected", "");
                else
                    this.selElem.options[i].removeAttribute("selected");
            }
        }
    }
}

class MuniIndicators extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.logScale = false;
        this.shadow.appendChild(divTemplate.content.cloneNode(true));
        this.div = this.shadow.getElementById("main");
        this.div.style.width = '100%';
        this.shadow.appendChild(this.div);
        /*
        this.logLabel = document.createElement("span");
        this.logLabel.innerHTML = "Usar escala logarítmica";
        */
        this.year = this.hasAttribute('year') ?
            this.getAttribute('year') : '';
        this.key = this.hasAttribute("key") ?
            this.getAttribute("key") : "";
    }

    static get observedAttributes() {
        return ['year', "key", "label", "scale"];
    }

    connectedCallback() {
        // this.preprocessData();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        else if (name == 'year') {
            this.year = newValue;
        }
        else if (name == "key") {
            this.key = newValue;
        }
        else if (name == "label") {
            this.label = newValue;
        }
        else if (name == "scale") {
            this.scale = newValue;
        }
        this.update(this.key, this.year)
    }

    async update(key, year) {
        let root = this;
        let urlData = "/res/data/muni-indicators.csv";
        let csv = await aq.loadCSV(urlData);

        const t = csv
            .params({
                year  : year,
                key : key,
                log : root.logScale,
            })
            .filter(d => d.group == key)
            .filter(d => d.year == year)
            .filter(d => d.value != 0)
            // .filter({val: d => d3format(d.value)})
            .orderby(aq.desc("value"))
            .select("municipality", "department", "value")
            .objects();
        this.updateDisplay(t);
    }

    updateDisplay(data) {

    }
}

class PlotMuniIndicators extends MuniIndicators {
    constructor() {
        super();
    }
    updateDisplay(data) {
        let root = this;
        /*
        root.checkbox = document.createElement("input");
        root.checkbox.setAttribute("type", "checkbox");
        root.shadow.appendChild(root.checkbox);
        root.checkbox.addEventListener("change", e => {
                root.logScale = !root.logScale;
                root.update(root.key, root.year);
        })
        root.shadow.appendChild(root.logLabel);
        */
        if (data.length == 0)
            return;
        let scale = "linear";
        if (root.scale == "log")
            scale = "log";
        let spec = {
            "mark": {
                "type": "point",
                // "point": true,
                "tooltip": true,
                // "strokeWidth": 3
            },
            "data": {
                "values" : data,
            },
            "width": "container",
            // "title": root.dict[root.key],
            "encoding": {
                "x": {
                    "field": "municipality",
                    "type": "nominal",
                    "title": "Municipalidades",
                    "sort": "-y",
                    "axis": {
                        "labels": false,
                    }
                },
                "y": {
                    "field": "value",
                    "type": "quantitative",
                    "title": "",
                    "scale":  {
                       "type": scale,
                    }
                },

            },
            "config": {
                "numberFormat": "~s",
                "range": {
                    "ramp": {
                        "scheme": "dark2"
                    }
                }
            }
        };
        vegaEmbed(root.div, spec);
    }
}

class TableMuniIndicators extends MuniIndicators {
    constructor() {
        super();
    }
    updateDisplay(data) {
        /*
        let div = document.createElement("div");
        let table = new DataTable(data, ["Municipio", "Departamento", this.label]);
        div.appendChild(table);
        div.setAttribute("class", "table");
        this.div.innerHTML = "";
        this.div.appendChild(div);
        */

        let root = this;
        // console.log(root.label);
        let div = document.createElement("div");
        div.setAttribute("class", "overflow");
        div.style.overflow = "auto";
        let table = document.createElement("table");
        table.setAttribute("class", "table");
        let head = document.createElement("thead");
        head.innerHTML = `
            <th>Municipio</th>
            <th>Departamento</th>
            <th>${root.label}</th>`;
        table.appendChild(head);
        for (let i = 0; i < data.length; i++) {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td width="33%">${data[i].municipality}</td>
                <td width="33%">${data[i].department}</td>
                <td width="33%" class="right">${d3.format(",.2f")(data[i].value)}</td>`;
            table.appendChild(row);
        }
        root.div.innerHTML = "";
        div.appendChild(table);
        root.div.appendChild(div);

    }
}

customElements.define("x-muni-sel-indicators", SelectIndicators);
customElements.define('x-muni-indicators-plot', PlotMuniIndicators);
customElements.define('x-muni-indicators-table', TableMuniIndicators);
