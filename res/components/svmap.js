'use strict';

import '/res/node_modules/d3/dist/d3.min.js';

class SVMap extends HTMLElement {
    constructor() {
        super();
        this.scale = new Array(300).fill(0.5);
        this.color1 = 'white';
        this.color2 = 'blue';
        this.lasMuni = null;
        const shadow = this.attachShadow({mode: 'open'});
        this.div = document.createElement('div');
        shadow.appendChild(this.div);
    }
    draw() {
        let root = this;
        const width = 600;
        const height = 480;
        const margin = 40;
        let sel = d3.select(this.div);
        let svg = sel.append('svg')
            .attr('width', width)
            .attr('height', height);
        let projection = d3.geoEquirectangular();
        projection.fitExtent([[margin,margin],[width - margin,height - margin]], this.geo);
        let geoGenerator = d3.geoPath()
            .projection(projection);
        let scolor = d3.scaleLinear().domain([0.0, 1.0])
            .range([this.color1, this.color2]);
        svg.append('g')
            .selectAll('path')
            .data(this.geo.features)
            .enter()
            .append('path')
            .attr('d', geoGenerator)
            .attr('stroke', 'white')
            .attr('fill', 'white')
            .attr('id', d => 'map' + d.properties.ID_2)
            .attr('shp', d => d.properties.ID_2)
            .attr('shape', d => d.properties.ID_2)
            .attr('fill', d => scolor(this.scale[d.properties.ID_2]))
            .on('mouseenter', function (el) {
               el.target.setAttribute('stroke-width', 3);
            })
            .on('mouseout', function (el) {
                el.target.setAttribute('stroke-width', 1);
            })
            .on('click', function(el) {
                let attr = el.target.getAttribute('shp');
                root.setAttribute('shp', attr);
                /*
                el.target.setAttribute('stroke', 'black');
                if (root.lastMuni != null) {
                    root.lastMuni.setAttribute('stroke', 'lightgray');
                    root.lastMuni = el.target;    
                }
                */
            })
            .append('title')
            .text(d => d.properties.NAME_2)
        // console.log(sel);
    }
    connectedCallback() {
        fetch('/static/res/mun.geojson')
            .then(response => response.json())
            .then(d => {
                this.geo = d;
                this.draw();
                return d;
            });
    }
}

customElements.define('x-svmap', SVMap);
