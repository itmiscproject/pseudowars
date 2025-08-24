<template>
  <div>
    <h1>Pseudowars Class Tester</h1>
    <select v-model="selectedClass">
      <option value="ApprenticeTest">Apprentice</option>
      <option value="DruidTest">Druid</option>
      <option value="ClericTest">Cleric</option>
      <option value="PaladinTest">Paladin</option>
    </select>
    <component :is="components[selectedClass]" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

import ApprenticeTest from './components/ApprenticeTest.vue'
import DruidTest from './components/DruidTest.vue'
import ClericTest from './components/ClericTest.vue'
import PaladinTest from './components/PaladinTest.vue'

const selectedClass = ref('ApprenticeTest')

const components = {
  ApprenticeTest,
  DruidTest,
  ClericTest,
  PaladinTest,
}
</script>
