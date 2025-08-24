<template>
  <div>
    <h2>Druid Methods</h2>

    <section>
      <h3>add(array)</h3>
      <div v-for="(val, idx) in addArray" :key="idx" class="input-row">
        <input type="number" v-model.number="addArray[idx]" placeholder="Number" />
        <button @click="removeFromArray(addArray, idx)" class="remove-btn" v-if="addArray.length > 1">✕</button>
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
        <button @click="removeFromArray(multArray, idx)" class="remove-btn" v-if="multArray.length > 1">✕</button>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Druid } from '../classes/Druid.js'

const instance = new Druid()

// add method inputs and result
const addArray = ref([0, 0])
const addResult = ref(null)

// subtract method inputs and result
const subInputA = ref(0)
const subInputB = ref(0)
const subResult = ref(null)

// multiply method inputs and result
const multArray = ref([1, 1])
const multResult = ref(null)

// divide method inputs and result
const divInputA = ref(0)
const divInputB = ref(1)
const divResult = ref(null)

function removeFromArray(arrayRef, index) {
  arrayRef.splice(index, 1)
}

// Test method calls interfacing with class instance
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
  // Basic check to avoid division by zero
  if (divInputB.value === 0) {
    divResult.value = 'Error: Division by zero'
  } else {
    divResult.value = instance.divide(divInputA.value, divInputB.value)
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
