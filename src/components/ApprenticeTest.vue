<template>
  <div>
    <h2>Apprentice Methods</h2>
    <div>
      <label>add([a,b]): </label>
      <input type="number" v-model.number="addInput1" placeholder="a" />
      <input type="number" v-model.number="addInput2" placeholder="b" />
      <button @click="doAdd">Calculate</button>
      <span>Result: {{ addResult }}</span>
    </div>
    <div>
      <label>subtract(a,b): </label>
      <input type="number" v-model.number="subInputA" placeholder="a" />
      <input type="number" v-model.number="subInputB" placeholder="b" />
      <button @click="doSubtract">Calculate</button>
      <span>Result: {{ subResult }}</span>
    </div>
    <div>
      <label>multiply([a,b]): </label>
      <input type="number" v-model.number="multInput1" placeholder="a" />
      <input type="number" v-model.number="multInput2" placeholder="b" />
      <button @click="doMultiply">Calculate</button>
      <span>Result: {{ multResult }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Apprentice } from '../classes/Apprentice.js'

const instance = new Apprentice()

const addInput1 = ref(0)
const addInput2 = ref(0)
const addResult = ref(null)

const subInputA = ref(0)
const subInputB = ref(0)
const subResult = ref(null)

const multInput1 = ref(0)
const multInput2 = ref(0)
const multResult = ref(null)

function doAdd() {
  addResult.value = instance.add([addInput1.value, addInput2.value])
}

function doSubtract() {
  subResult.value = instance.subtract(subInputA.value, subInputB.value)
}

function doMultiply() {
  multResult.value = instance.multiply([multInput1.value, multInput2.value])
}
</script>
