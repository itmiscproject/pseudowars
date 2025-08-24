import { Cleric } from './Cleric.js'

export class Paladin extends Cleric {
  // Override power to compute a**n
  power(a, n) {
    return a ** n;
  }

  // New method root
  root(a,n) {
    return this.power(a, 1/n)
  }

  // New method modulus
  modulus(a, n) {
    return a % n;
  }
}
