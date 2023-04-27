<script setup>
import { ref, watchEffect } from 'vue';

import { HOME_URL, fetchAsMe } from './common'
import MovieTile from './MovieTile.vue';

const movies = ref(null)

watchEffect(() => fetchAsMe('my-movies', movies))
</script>

<template>
  <section v-if="movies === null">
    <div class="container">
      LOADING...
    </div>
  </section>
  <section v-else-if="movies && movies.length">
    <div class="columns is-multiline">
      <MovieTile v-for="movie in movies" :movie="movie"></MovieTile>
    </div>
  </section>
  <section v-else>
    <div class="container">
      YOU HAVE NO MOVIES
    </div>
  </section>
</template>