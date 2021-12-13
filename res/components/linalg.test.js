import { Matrix} from './linalg.js';

let m = new Matrix();
let a = [[]];
console.assert(m.data == a, "Matrix: empty constructor failed");

let n = new Matrix([[2, 1], [3, -1]]);
console.assert(n.data[0][0] == 2, "Matrix: copy object constructor failed");
console.assert(n.max() == 3, "Matrix: max function failed");
console.assert(n.min() == -1, "Matrix: min function failed");
