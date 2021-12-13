'use strict';

import '/res/node_modules/d3/dist/d3.min.js';
import { Matrix } from './linalg.js';

class LinePlot extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        this.div = document.createElement('div');
        shadow.appendChild(this.div);
        this.data = [
            [0.0, 0.1, 0.2],
            [0.1, 0.2, 0.0],
            [0.2, 0.0, 0.1]
        ];
        this.labels = [0, data[0].lenght]
        labels ???
    }
    line(element, value, color) {
        let transf = d3.line()
            .x(d => x(d.month))
            .y(d => y(d[value]))
        element.append('g')
            .append('path')
            .attr('d', transf(data))
            .attr('fill', 'none')
            .attr('stroke', color)
    }
    draw() {
        let root = this;  // To keep the this reference
        const width = 600;
        const height = 480;
        const margin = 40;
        const n = this.data[0].length;
        const max = Matrix(root.data).max();
        const min = Matrix(root.data).min();
        let sel = d3.select(root.div);
        let svg = sel.append('svg')
            .attr('width', width)
            .attr('height', height);
        let x = d3.scaleLinear()
            .domain(root.labels)
            .range([margin, width - margin])
        let y = d3.scaleLinear()
            .domain([min, max])
            .range([height - margin, margin])
    }
}
