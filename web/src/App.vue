<script setup>
import { ref } from 'vue';

const message = ref('It\'s my movies collection!')
</script>

<template>
  <img src="/vue.svg" class="logo" alt="Vite logo" />

  <h2>{{ message }}</h2>
</template>