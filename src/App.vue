<template>
  <div class="container-fluid vh-100 bg-light" style="max-width: 100vw; overflow: hidden;">
    <div class="d-flex w-100 h-100" style="width: 100vw;">

      <!-- Left Sidebar -->
      <div class="d-flex flex-column p-3 bg-white border-end" id="leftDiv" style="width: 300px; min-width: 300px;">
        <button
          :class="['btn', gameStarted ? 'btn-danger' : 'btn-primary', 'mb-3']"
          @click="toggleGame"
        >
          {{ gameStarted ? 'Reset Game' : 'Start New Game' }}
        </button>

        <div v-if="gameStarted" id="statsDiv">
          <h5>Class: Hunter</h5>
          <p>Inheritance: NIL</p>
          <p><strong>Attributes:</strong></p>
          <ul>
            <li>HP: {{ hp }}</li>
          </ul>
          <p><strong>Methods:</strong></p>
          <ul>
            <li @click="showMethod('move')" class="method-link">move()</li>
            <li @click="showMethod('support')" class="method-link">support()</li>
            <li @click="showMethod('execute')" class="method-link">execute()</li>
            <li @click="showMethod('step')" class="method-link">step(n)</li>
            <li @click="showMethod('collect')" class="method-link">collect(n)</li>
            <li @click="showMethod('hit')" class="method-link">hit(n)</li>
          </ul>
        </div>

        <div v-if="selectedMethod" id="methodDiv" class="mt-3 flex-grow-1 overflow-auto" style="min-height: 200px;">
          <hr />
          <pre class="small">{{ methodDescriptions[selectedMethod] }}</pre>
        </div>
      </div>

      <!-- Board -->
      <div class="d-flex align-items-center justify-content-center bg-secondary bg-opacity-10" style="width: 800px; min-width: 800px;">
        <div class="position-relative">
          <div class="board d-grid" :style="boardStyle">
            <div v-for="(tile, index) in 64" :key="index" class="tile border bg-white"></div>
          </div>

          <!-- Column Numbers -->
          <div class="position-absolute d-flex justify-content-between w-100 px-1" :style="columnNumberStyle">
            <div
              v-for="n in 8"
              :key="'col-' + n"
              class="text-danger fw-bold text-center"
              style="width: 50px;"
            >
              {{ n }}
            </div>
          </div>

          <!-- Row Numbers -->
          <div class="position-absolute d-flex flex-column justify-content-between h-100" :style="rowNumberStyle">
            <div
              v-for="n in 8"
              :key="'row-' + n"
              class="text-primary fw-bold text-center"
              style="height: 50px; line-height: 50px;"
            >
              {{ 9 - n }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="d-flex flex-column justify-content-start p-3 bg-white border-start" id="rightDiv" style="width: 300px; min-width: 300px;">
        <p>Right Panel</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const gameStarted = ref(false)
const hp = ref(10)
const selectedMethod = ref('')

const toggleGame = () => {
  gameStarted.value = !gameStarted.value
  selectedMethod.value = ''
  hp.value = 10
}

const showMethod = (methodName) => {
  selectedMethod.value = methodName
}

const methodDescriptions = {
  move: `move():\n    step(flip of coin)`,
  support: `support():\n    collect(flip of coin)`,
  execute: `execute():\n    hit(flip of coin)`,
  step: `step(n):\n    if not blocked by character:\n        move up to n steps vertically or horizontally`,
  collect: `collect(n):\n    if square has resource:\n        collect n number of resource on square`,
  hit: `hit(n):\n    inflict n damage on enemy in adjacent square`
}

const boardStyle = {
  gridTemplateColumns: 'repeat(8, 50px)',
  gridTemplateRows: 'repeat(8, 50px)',
  gap: '2px',
  position: 'relative'
}

const columnNumberStyle = {
  bottom: '-25px',
  left: '0',
  height: '20px'
}

const rowNumberStyle = {
  left: '-25px',
  top: '0',
  width: '20px'
}
</script>

<style scoped>
.tile {
  width: 50px;
  height: 50px;
}
.method-link {
  cursor: pointer;
  color: #0d6efd;
  text-decoration: underline;
}
.method-link:hover {
  color: #0a58ca;
}
</style>