export class Matrix {
    constructor(m) {
        if (m == undefined)
            this.data = [[]];
        else
            this.data = m;
    }
    max() {
        let max = -Number.MAX_VALUE;
        for (let i = 0; i < this.data.length; i++)
            for (let j = 0; j < this.data[i].length; j++)
                if (this.data[i][j] > max)
                    max = this.data[i][j];
        return max;
    }
    min() {
        let min = Number.MAX_VALUE;
        for (let i = 0; i < this.data.length; i++)
            for (let j = 0; j < this.data[i].length; j++)
                if (this.data[i][j] < min)
                    min = this.data[i][j];
        return min;
    }
}
