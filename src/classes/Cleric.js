import { Druid } from './Druid.js'

export class Cleric extends Druid {
  // Returns a squared value
  power(a) {
    return a * a;
  }

  // Calculates factorial using iterative loop
  factorial(n) {
    let result = 1;
    for (let i = 1; i <= n; i++) {
      result *= i;
    }
    return result;
  }
}
