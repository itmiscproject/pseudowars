<template>
  <div>
    <h2>Cleric Methods</h2>

    <section>
      <h3>add(array)</h3>
      <div v-for="(val, idx) in addArray" :key="idx" class="input-row">
        <input type="number" v-model.number="addArray[idx]" placeholder="Number" />
        <button 
          @click="removeFromArray(addArray, idx)" 
          class="remove-btn"
          v-if="addArray.length > 1"
        >✕</button>
      </div>
      <button @click="addArray.push(0)">Add another number</button>
      <button @click="testAdd">Calculate</button>
      <p>Result: {{ addResult }}</p>
    </section>

    <section>
      <h3>subtract(a, b)</h3>
      <input type="number" v-model.number="subInputA" placeholder="a" />
      <input type="number" v-model.number="subInputB" placeholder="b" />
      <button @click="testSubtract">Calculate</button>
      <p>Result: {{ subResult }}</p>
    </section>

    <section>
      <h3>multiply(array)</h3>
      <div v-for="(val, idx) in multArray" :key="idx" class="input-row">
        <input type="number" v-model.number="multArray[idx]" placeholder="Number" />
        <button
          @click="removeFromArray(multArray, idx)"
          class="remove-btn"
          v-if="multArray.length > 1"
        >✕</button>
      </div>
      <button @click="multArray.push(1)">Add another number</button>
      <button @click="testMultiply">Calculate</button>
      <p>Result: {{ multResult }}</p>
    </section>

    <section>
      <h3>divide(a, b)</h3>
      <input type="number" v-model.number="divInputA" placeholder="a" />
      <input type="number" v-model.number="divInputB" placeholder="b" />
      <button @click="testDivide">Calculate</button>
      <p>Result: {{ divResult }}</p>
    </section>

    <section>
      <h3>Power(a)</h3>
      <input type="number" v-model.number="powerInput" placeholder="a" />
      <button @click="testPower">Calculate</button>
      <p>Result: {{ powerResult }}</p>
    </section>

    <section>
      <h3>factorial(n)</h3>
      <input type="number" v-model.number="factorialInput" placeholder="n" min="0" />
      <button @click="testFactorial">Calculate</button>
      <p>Result: {{ factorialResult }}</p>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Cleric } from '../classes/Cleric.js'

const instance = new Cleric()

// add method inputs
const addArray = ref([0, 0])
const addResult = ref(null)

// subtract method inputs
const subInputA = ref(0)
const subInputB = ref(0)
const subResult = ref(null)

// multiply method inputs
const multArray = ref([1, 1])
const multResult = ref(null)

// divide method inputs
const divInputA = ref(0)
const divInputB = ref(1)
const divResult = ref(null)

// power(square) input/result
const powerInput = ref(0)
const powerResult = ref(null)

// factorial input/result
const factorialInput = ref(0)
const factorialResult = ref(null)

function removeFromArray(arr, index) {
  arr.splice(index, 1)
}

function testAdd() {
  addResult.value = instance.add(addArray.value)
}

function testSubtract() {
  subResult.value = instance.subtract(subInputA.value, subInputB.value)
}

function testMultiply() {
  multResult.value = instance.multiply(multArray.value)
}

function testDivide() {
  if (divInputB.value === 0) {
    divResult.value = 'Error: Division by zero'
  } else {
    divResult.value = instance.divide(divInputA.value, divInputB.value)
  }
}

function testPower() {
  powerResult.value = instance.power(powerInput.value)
}

function testFactorial() {
  if (factorialInput.value < 0) {
    factorialResult.value = 'Error: Negative input'
  } else {
    factorialResult.value = instance.factorial(factorialInput.value)
  }
}
</script>

<style scoped>
section {
  margin-bottom: 1.5em;
}

input {
  width: 80px;
  margin-right: 0.5em;
}

.input-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.25em;
}

.remove-btn {
  background-color: #e74c3c;
  border: none;
  color: white;
  cursor: pointer;
  font-weight: bold;
  padding: 0 0.5em;
  border-radius: 4px;
}
</style>
