'use strict';

var assert = require('assert');

import { Matrix } from '../components/linalg.js';

describe('Matrix', function() {
    let m = new LinAlg.Matrix([
        [2.0, -1.0, 2.5],
        [9.2, 1.0, -3.0]
    ]);
    describe('#maxOf()', function() {
        it('should return the maximum value', function() {
            assert.equal(m.max(), 9.2);
        })
    })
})
