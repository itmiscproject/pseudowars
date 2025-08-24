<template>
  <div class="container">
    <h1>Pseudo-Wars</h1>
    <div class="wrapper">
      <!-- Board Grid -->
      <div class="board">
        <div class="board-header">
          <div></div>
          <div v-for="stage in stages" :key="stage" class="board-header-cell">Stage {{ stage }}</div>
        </div>
        <div
          v-for="row in rows"
          :key="row"
          class="board-row"
        >
          <div class="board-row-header">Row {{ row }}</div>
          <div
            v-for="stage in stages"
            :key="stage"
            class="board-cell"
            :class="{ selectable: isCardSelectable(row, stage), selected: isSelectedCard(row, stage) }"
            @click="selectCard(row, stage)"
          >
            {{ cardValue(row, stage) }}
          </div>
        </div>
      </div>
      
      <!-- Right Panel -->
      <div class="right-panel">

        <!-- Stage and Player class -->
        <div class="game-info">
          <div><strong>Stage {{ currentStage }}:</strong> Player is an <strong>{{ playerClass }}</strong></div>
        </div>

        <!-- Dice Roller -->
        <div class="dice-roller">
          <button @click="rollDice">Click to throw 3 × D6 dice:</button>
          <div class="dice-results">
            <div v-for="(die, i) in diceResults" :key="i" class="die">{{ die }}</div>
          </div>
        </div>

        <!-- Card Targeting -->
        <div class="card-targeting">
          <label>Target Card:</label>
          <input type="number" v-model.number="targetRow" min="1" max="5" placeholder="Row" />
          <input type="number" v-model.number="targetStage" min="1" max="5" placeholder="Stage" />
        </div>

        <!-- Method Chain Builder -->
        <div class="method-chain-builder">
          <label>Methods to reduce poison mushrooms to 0 in card ({{ targetRow }}, {{ targetStage }}):</label>
          <div v-for="(step, idx) in methodChain" :key="step.id" class="method-step">
            <select v-model="step.method" @change="updateMethodInputs(idx)">
              <option v-for="m in availableMethods" :key="m" :value="m">{{ m }}</option>
            </select>
            <div class="args">
              <template v-for="(arg, argIdx) in step.args" :key="argIdx">
                <select v-if="arg.type === 'method'" v-model="arg.value" @change="updateMethodInputs(idx)"></select>
                <input v-else-if="arg.type === 'number'" type="number" v-model.number="step.args[argIdx].value" />
                <input v-else-if="arg.type === 'array'" type="text" :value="arg.value.join(', ')" readonly />
                <!-- You can expand this with better UI for array inputs -->
              </template>
            </div>
            <span>=> result{{ idx + 1 }} = {{ step.result }}</span>
            <button @click="removeMethod(idx)" class="remove-btn">✕</button>
          </div>
          <button @click="addMethod">Add method</button>
        </div>

        <!-- Submit -->
        <button class="submit-btn" @click="submitChain">Submit</button>

        <!-- Method Reference -->
        <div class="method-reference">
          <label>Methods available for:</label>
          <select v-model="playerClass" @change="loadAvailableMethods">
            <option v-for="c in playerClasses" :key="c" :value="c">{{ c }}</option>
          </select>
          <div v-for="m in classMethods" :key="m.name" class="method-doc">
            <code>{{ m.name }}{{ m.signature }}:</code>
            <pre>{{ m.description }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';

// Board Rows and Stages
const rows = [1, 2, 3, 4, 5];
const stages = [1, 2, 3, 4, 5];

// Sample data for board cards: object keys like 'r1s1', 'r1s2', ...
const cards = reactive({
  'r1s1': 23, 'r2s1': 19, 'r3s1': null, 'r4s1': null, 'r5s1': null,
  // Other cards keep null or initial values...
});

// Selected card by user
const targetRow = ref(1);
const targetStage = ref(1);

// Player info
const playerClasses = ['Apprentice', 'Druid', 'Cleric', 'Paladin'];
const playerClass = ref('Apprentice');
const currentStage = ref(1);

// Dice results (3 dice)
const diceResults = ref([1, 1, 1]);

// Methods available by player class, examples with signatures and docs
const classMethodMap = {
  Apprentice: [
    { name: 'add', signature: '(array)', description: 'return array[0] + array[1]' },
    { name: 'subtract', signature: '(a, b)', description: 'return a - b' },
    { name: 'multiply', signature: '(array)', description: 'return array[0] * array[1]' },
  ],
  Druid: [
    { name: 'add', signature: '(array)', description: 'recursive sum all array elements' },
    { name: 'subtract', signature: '(a, b)', description: 'return a - b' },
    { name: 'multiply', signature: '(array)', description: 'recursive multiply all array elements' },
    { name: 'divide', signature: '(a, b)', description: 'return a / b' },
  ],
  Cleric: [
    { name: 'add', signature: '(array)', description: 'recursive sum all elements' },
    { name: 'subtract', signature: '(a, b)', description: 'return a - b' },
    { name: 'multiply', signature: '(array)', description: 'recursive multiply all elements' },
    { name: 'divide', signature: '(a, b)', description: 'return a / b' },
    { name: 'square', signature: '(a)', description: 'returns a * a' },
    { name: 'factorial', signature: '(n)', description: 'iterative factorial' },
  ],
  Paladin: [
    { name: 'add', signature: '(array)', description: 'recursive sum all elements' },
    { name: 'subtract', signature: '(a, b)', description: 'return a - b' },
    { name: 'multiply', signature: '(array)', description: 'recursive multiply all elements' },
    { name: 'divide', signature: '(a, b)', description: 'return a / b' },
    { name: 'square', signature: '(a)', description: 'returns a * a' },
    { name: 'factorial', signature: '(n)', description: 'iterative factorial' },
    { name: 'power', signature: '(a, n)', description: 'returns a ** n' },
    { name: 'root', signature: '(a, n)', description: 'returns a ** (1/n)' },
    { name: 'modulus', signature: '(a, n)', description: 'returns a % n' },
  ],
};

// Reactive available methods and methods chain
const availableMethods = ref(classMethodMap[playerClass.value].map((m) => m.name));
const classMethods = ref(classMethodMap[playerClass.value]);
const methodChain = reactive([]);

// Unique ID helper for method steps
let methodId = 0;

// Load methods when class changes
function loadAvailableMethods() {
  availableMethods.value = classMethodMap[playerClass.value].map((m) => m.name);
  classMethods.value = classMethodMap[playerClass.value];
  methodChain.splice(0); // Clear chain on class change
}

// Add a new method step with default args placeholders
function addMethod() {
  if (availableMethods.value.length === 0) return;
  const methodName = availableMethods.value[0];
  methodChain.push({
    id: ++methodId,
    method: methodName,
    args: generateArgsPlaceholder(methodName),
    result: null,
  });
}

// Remove a method step
function removeMethod(index) {
  methodChain.splice(index, 1);
}

// Generate argument placeholders based on method name (simple version)
function generateArgsPlaceholder(method) {
  switch (method) {
    case 'add':
    case 'multiply':
      return [
        { type: 'array', value: [diceResults.value[0], diceResults.value[1]] },
      ];
    case 'subtract':
    case 'divide':
      return [
        { type: 'number', value: diceResults.value[0] },
        { type: 'number', value: diceResults.value[1] },
      ];
    case 'square':
      return [{ type: 'number', value: diceResults.value[0] }];
    case 'factorial':
      return [{ type: 'number', value: 3 }];
    case 'power':
    case 'root':
    case 'modulus':
      return [
        { type: 'number', value: diceResults.value[0] },
        { type: 'number', value: diceResults.value[1] },
      ];
    default:
      return [];
  }
}

// Called when method in a step changes; regenerate args placeholders
function updateMethodInputs(index) {
  const step = methodChain[index];
  step.args = generateArgsPlaceholder(step.method);
  step.result = null;
}

// Determine if card can be clicked (optional logic)
function isCardSelectable(row, stage) {
  return true; // For demo, make all selectable
}

// Check if card is selected
function isSelectedCard(row, stage) {
  return targetRow.value === row && targetStage.value === stage;
}

// Get card value or empty string
function cardValue(row, stage) {
  return cards[`r${row}s${stage}`] ?? '';
}

// Select card
function selectCard(row, stage) {
  targetRow.value = row;
  targetStage.value = stage;
}

// Simulate dice roll
function rollDice() {
  diceResults.value = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
  // Reset method results on dice roll
  methodChain.forEach((m) => {
    m.result = null;
  });
}

// Execute the method chain sequentially
function submitChain() {
  let currentValue = cards[`r${targetRow.value}s${targetStage.value}`] || 0;

  methodChain.forEach((step, index) => {
    // Simplified eval - replace this with actual logic or calls to your classes
    let result;
    try {
      switch (step.method) {
        case 'add':
          // sum array elements
          result = (step.args[0].value || []).reduce((a, b) => a + b, 0);
          break;
        case 'subtract':
          result = step.args[0].value - step.args[1].value;
          break;
        case 'multiply':
          result = (step.args[0].value || []).reduce((a, b) => a * b, 1);
          break;
        case 'divide':
          result = step.args[1].value === 0 ? 'NaN' : step.args[0].value / step.args[1].value;
          break;
        case 'square':
          result = Math.pow(step.args[0].value, 2);
          break;
        case 'factorial':
          result = factorial(step.args[0].value);
          break;
        case 'power':
          result = Math.pow(step.args[0].value, step.args[1].value);
          break;
        case 'root':
          result = Math.pow(step.args[0].value, 1 / step.args[1].value);
          break;
        case 'modulus':
          result = step.args[0].value % step.args[1].value;
          break;
        default:
          result = 'Unknown';
      }
    } catch {
      result = 'Error';
    }
    step.result = result;
    currentValue = result;
  });
}

// Helper function: factorial
function factorial(n) {
  if (n < 0) return 'NaN';
  let res = 1;
  for (let i = 1; i <= n; i++) {
    res *= i;
  }
  return res;
}

loadAvailableMethods();
</script>

<style scoped>
.container {
  font-family: Arial, sans-serif;
  max-width: 1000px;
  margin: 1rem auto;
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.wrapper {
  display: flex;
  gap: 2rem;
}

.board {
  border: 1px solid #aaa;
  border-radius: 4px;
  padding: 1rem;
  width: 350px;
  user-select: none;
}

.board-header,
.board-row {
  display: flex;
}

.board-header-cell,
.board-row-header,
.board-cell {
  border: 1px solid #aaa;
  padding: 0.6rem;
  text-align: center;
  user-select: none;
}

.board-header-cell {
  flex: 1;
  font-weight: bold;
  background: #eaf1f5;
}

.board-row-header {
  min-width: 40px;
  font-weight: bold;
  background: #e0d8c4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.board-cell {
  flex: 1;
  cursor: pointer;
  background: white;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease;
}

.board-cell.selectable:hover {
  background-color: #c6e0ff;
}

.board-cell.selected {
  background-color: #7faeff;
  color: white;
  font-weight: bold;
}

.right-panel {
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-info {
  font-size: 1.2rem;
  font-weight: bold;
}

.dice-roller button {
  background-color: #2980b9;
  border: none;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.dice-results {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.die {
  width: 40px;
  height: 40px;
  border: 1px solid #2980b9;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
  user-select: none;
}

.card-targeting input {
  width: 60px;
  margin-left: 0.5rem;
}

.method-chain-builder {
  margin-top: 1rem;
}

.method-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.method-step select,
.method-step input {
  padding: 0.2rem;
  font-size: 1rem;
}

.args input {
  width: 50px;
  margin-left: 0.5rem;
}

.remove-btn {
  background-color: #c0392b;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 0 0.5rem;
  border-radius: 2px;
}

.submit-btn {
  background-color: #27ae60;
  border: none;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  align-self: flex-start;
}

.method-reference {
  margin-top: auto;
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
}

.method-doc {
  margin-bottom: 1rem;
}

.method-doc code {
  font-weight: bold;
  background-color: #ddd;
  padding: 2px 4px;
}
</style>
