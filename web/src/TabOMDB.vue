<script setup>
import { isEmpty } from 'ramda';
import { ref, watchEffect } from 'vue';

import { fetchAsMe, debouncedRef, STAUS_LOADING } from './common'
import MovieBriefTile from './MovieBriefTile.vue';

const searchTerms = debouncedRef("", 400);
const movies = ref(null);

watchEffect(() => {
  if (isEmpty(searchTerms.value)) {
    movies.value = null

    return
  }

  fetchAsMe('movies' + '?' + new URLSearchParams({ terms: searchTerms.value }), movies)
})
</script>

<template>
  <div class="field ">
    <div class="control">
      <input v-model="searchTerms" class="input is-info is-medium is-rounded" type="text"
        placeholder="Type keywords to search...">
    </div>
  </div>
  <div class="block">
    <div v-if="movies === STAUS_LOADING" class="content">
      LOADING...
    </div>
    <div v-else-if="movies && movies.length" class="columns is-multiline">
      <MovieBriefTile v-for="movie in movies" :movie="movie"></MovieBriefTile>
    </div>
    <div v-else-if="movies && movies.length === 0" class="content">
      NO MOVIES FOUND
    </div>
  </div>
</template>