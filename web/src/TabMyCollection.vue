<script setup>
import { ref, watchEffect, watch, inject } from 'vue';
import { difference } from 'ramda';

import { apiGet, STATUS_LOADING } from './common'
import MovieDetailsTile from './MovieDetailsTile.vue';

const props = defineProps({
  myMovies: Array,
  likeMovie: Function
})
const movies = ref(null)
const jwtToken = inject('jwtToken')

let _prev_props = {
  myMovies: props.myMovies ?? []
}
watch(
  () => props.myMovies,
  () => {
    const addedItems = difference(props.myMovies, _prev_props.myMovies)
    const removedItems = difference(_prev_props.myMovies, props.myMovies)
    _prev_props.myMovies = Array.from(props.myMovies ?? [])

    if (addedItems.length > 0) {
      return apiGet(jwtToken, 'my-movies', movies)
    }

    for (const removedMovieId of removedItems) {
      const movieIndex = movies.value.findIndex(({ imdbID }) => imdbID === removedMovieId)
      if (movieIndex > -1) {
        movies.value.splice(movieIndex, 1)
      }
    }
  },
  { deep: true }
)
</script>

<style>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}
</style>

<template>
  <div v-if="movies === STATUS_LOADING" class="content">
    LOADING...
  </div>
  <TransitionGroup tag="div" name="fade" v-else-if="movies && movies.length" class="columns is-multiline">
    <MovieDetailsTile v-for="movie in movies" :key="movie.imdbID" :like-movie="likeMovie" :movie="movie">
    </MovieDetailsTile>
  </TransitionGroup>
  <div v-else-if="!movies || movies.length === 0" class="content is-medium">
    Your collection is empty. Go search for your <strong>favourite movies</strong>!
  </div>
</template>