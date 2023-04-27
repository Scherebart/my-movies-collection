<script setup>
import { ref, watchEffect } from 'vue';

import { fetchAsMe,STAUS_LOADING } from './common'
import MovieDetailsTile from './MovieDetailsTile.vue';

const movies = ref(null)

watchEffect(() => fetchAsMe('my-movies', movies))
</script>

<template>
  <div v-if="movies === STAUS_LOADING" class="content">
    LOADING...
  </div>
  <div v-else-if="movies && movies.length" class="columns is-multiline">
    <MovieDetailsTile v-for="movie in movies" :movie="movie"></MovieDetailsTile>
  </div>
  <div v-else-if="movies && movies.length === 0" class="content is-medium">
    Your collection is empty. Go search for your <strong>favourite movies</strong>!
  </div>
</template>