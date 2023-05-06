<script setup>
import { ref, watchEffect, watch } from 'vue';

import { getAsMe, STATUS_LOADING } from './common'
import MovieDetailsTile from './MovieDetailsTile.vue';

const props = defineProps({
  myMovies: Array
})
const movies = ref(null)

watch(
  () => props.myMovies,
  () => getAsMe('my-movies', movies), 
  { immediate: true, deep: true }
)
</script>

<template>
  <div v-if="movies === STATUS_LOADING" class="content">
    LOADING...
  </div>
  <div v-else-if="movies && movies.length" class="columns is-multiline">
    <MovieDetailsTile v-for="movie in movies" :movie="movie"></MovieDetailsTile>
  </div>
  <div v-else-if="movies && movies.length === 0" class="content is-medium">
    Your collection is empty. Go search for your <strong>favourite movies</strong>!
  </div>
</template>