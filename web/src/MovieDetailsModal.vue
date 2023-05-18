<script setup>
import { ref, inject } from 'vue';

import { isNil } from 'ramda';

import { apiGet, STATUS_LOADING } from './common';
import imageMoviePlaceholder from './movie-poster-placeholder.png'
import HeartFilled from './heart-filled-svgrepo-com.svg'
import HeartEmpty from './heart-empty-svgrepo-com.svg'

const props = defineProps({
  movieId: String,
  isMyMovie: {
    type: Boolean,
    default: null
  },
  likeMovie: Function
})
const emits = defineEmits(['closeModal'])

const movie = ref(null)
const jwtToken = inject('jwtToken')

apiGet(jwtToken, 'movies/' + props.movieId, movie)
</script>

<style>
@media screen and (min-width: 1024px) {

  .modal-card,
  .modal-content {
    width: 893px;
  }
}
</style>

<template>
  <div class="modal">
    <div @click="$emit('closeModal')" class="modal-background"></div>
    <div class="modal-card" v-if="movie === null || movie === STATUS_LOADING">
      <div class="modal-card-head">
        <p class="modal-card-title">
          LOADING...
        </p>
      </div>
    </div>
    <div v-else class="modal-card is-big" style="">
      <div class="modal-card-head">
        <p class="modal-card-title">{{ movie.Title }}</p>
        <button @click="$emit('closeModal')" class="delete is-large" aria-label="close"></button>
      </div>
      <div class="modal-card-body columns">
        <figure class="column is-6 image" style="">
          <img v-if="movie.Poster" :src="movie.Poster">
          <img v-else :src="imageMoviePlaceholder">
        </figure>
        <div class="column is-6 content">
          <p class="">
            {{ movie.Plot }}
          </p>
          <br>
          <p>Year: {{ movie.Year }} {{ isMyMovie }}</p>

          <button v-if="!isNil(isMyMovie)" @click.stop="likeMovie(movie.imdbID)" class="button like-button is-medium"
            :class="{ filled: isMyMovie, empty: !isMyMovie }">
            <HeartFilled v-if="isMyMovie" class="icon"></HeartFilled>
            <HeartEmpty v-else class="icon"></HeartEmpty>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
