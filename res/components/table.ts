export { DataTable };

const tableTemplate = document.createElement("template");
tableTemplate.innerHTML = `
<style>
    @import "/css/style.css"
</style>
<div>
    <table id="main"></table>
</div>`

class DataTable extends HTMLElement {
    data : object[];
    headers : string[];
    nfields = 0;
    table : HTMLElement;
    constructor(data : object[], headers?: string[]) {
        super();
        if (data != undefined) {
            this.data = data;
            if (headers == undefined) {
                this.headers = this.inferHeaders(this.data);
            } else {
                this.headers = headers;
            }
            this.headers = headers;
            const shadow = this.attachShadow({mode: "open"});
            shadow.appendChild(tableTemplate.content.cloneNode(true));
            this.table = shadow.getElementById("main");
            this.table.setAttribute("class", "table");
            this.buildTable();
        }
    }
    inferHeaders(data: object[]) : string[] {
        let labels : string[] = [];
        if (data.length == 0)
            return [];
        for (let name in data[0])
            labels.push(name);
        return labels;
    }
    buildTable() {
        let head : HTMLElement = document.createElement("thead");
        let body : HTMLElement = document.createElement("tbody");
        let hrow = ""
        this.headers.forEach(name => { hrow += "<th>" + name + "</th>"; });
        head.innerHTML = hrow;
        let width = 100 / this.headers.length;
        for (let i = 0; i < this.data.length; i++) {
            let row = document.createElement("tr");
            row.innerHTML = "";
            for (let name in this.data[i]) {
                row.innerHTML += '<td width="' + width + '%">' + this.data[i][name] + '</td>';
            }
            body.appendChild(row);
        }
        this.table.appendChild(head);
        this.table.appendChild(body);
    }
}

customElements.define("x-table", DataTable);
