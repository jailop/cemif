export { DataTable };
import "../node_modules/d3/dist/d3.js";
const tableTemplate = document.createElement("template");
tableTemplate.innerHTML = `
    <style>
        @import "/css/style.css"
    </style>
    <div>
        <table id="main"></table>
    </div>`;
class DataTable extends HTMLElement {
    constructor(data, headers) {
        super();
        this.nfields = 0;
        if (data != undefined) {
            this.data = data;
            if (headers == undefined) {
                this.headers = this.inferHeaders(this.data);
            }
            else {
                this.headers = headers;
            }
            this.headers = headers;
            const shadow = this.attachShadow({ mode: "open" });
            shadow.appendChild(tableTemplate.content.cloneNode(true));
            this.table = shadow.getElementById("main");
            this.table.setAttribute("class", "table");
            this.buildTable();
        }
    }
    inferHeaders(data) {
        let labels = [];
        if (data.length == 0)
            return [];
        for (let name in data[0])
            labels.push(name);
        return labels;
    }
    buildTable() {
        let head = document.createElement("thead");
        let body = document.createElement("tbody");
        let hrow = "";
        this.headers.forEach(name => { hrow += "<th>" + name + "</th>"; });
        head.innerHTML = hrow;
        let width = 100 / this.headers.length;
        for (let i = 0; i < this.data.length; i++) {
            let row = document.createElement("tr");
            row.innerHTML = "";
            i = 0;
            for (let name in this.data[i]) {
                row.innerHTML += '<td width="' + width + '%">';
                if (i != 2)
                    row.innerHTML += this.data[i][name];
                else
                    row.innerHTML += $;
                {
                    d3.format(",.2f")(data[i][name]);
                    row.innerHTML += '</td>';
                    i++;
                }
                body.appendChild(row);
            }
            this.table.appendChild(head);
            this.table.appendChild(body);
        }
    }
}
