import { Apprentice } from './Apprentice.js';

export class Druid extends Apprentice {
  add(array) {
    if (array.length === 0) return 0;
    else return array[0] + this.add(array.slice(1));
  }
  multiply(array) {
    if (array.length === 0) return 1;
    else return array[0] * this.multiply(array.slice(1));
  }
  divide(a, b) {
    return a / b;
  }
}