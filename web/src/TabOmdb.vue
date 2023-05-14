<script setup>
import { ref, watchEffect, inject } from 'vue';
import { isEmpty } from 'ramda';

import { apiGet, debouncedRef, STATUS_LOADING } from './common'
import MovieBriefTile from './MovieBriefTile.vue';

const props = defineProps({
  myMovies: Array,
  likeMovie: Function
})

const searchTerms = debouncedRef("", 400);
const movies = ref(null);
const movieLikes = ref(null)
const jwtToken = inject('jwtToken')

watchEffect(() => {
  if (isEmpty(searchTerms.value)) {
    movies.value = null
    return
  }

  apiGet(jwtToken, 'movies' + '?' + new URLSearchParams({ terms: searchTerms.value }), movies)
})

watchEffect(() => {
  if (!Array.isArray(movies.value)) {
    return
  }

  movieLikes.value = movies.value.map(({ imdbID }) => props.myMovies.includes(imdbID))
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
    <div v-if="movies === STATUS_LOADING" class="content">
      LOADING...
    </div>
    <div v-else-if="movies && movies.length" class="columns is-multiline">
      <MovieBriefTile :like-movie="likeMovie" :is-my-movie="movieLikes[index]" v-for="(movie, index) in movies"
        :movie="movie"></MovieBriefTile>
    </div>
    <div v-else-if="movies && movies.length === 0" class="content">
      NO MOVIES FOUND
    </div>
  </div>
</template>