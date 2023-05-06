<script setup>
const props = defineProps({
  movie: Object,
  isMyMovie: Boolean,
  likeMovie: Function
})

import HeartFilled from './heart-filled-svgrepo-com.svg'
import HeartEmpty from './heart-empty-svgrepo-com.svg'
import imageMoviePlaceholder from './movie-poster-placeholder.png'

</script>

<style>
.like-button {
  position: absolute;
  margin: 1rem;
  bottom: 0;
  right: 0;
  border-radius: 50%;
  border-width: 0.15rem;
}

.like-button,
.like-button svg {
  transition: all 0.4s ease-out;
}

.like-button:hover,
.like-button:hover svg,
.like-button:focus,
.like-button:focus svg {
  transition: all 0.15s ease-in;
}

.like-button.empty {
  border-color: #555;
  background-color: #eaeaeae0;
  opacity: 0.65;
}

.like-button.empty:hover,
.like-button.empty:focus {
  background-color: #eaeaeaff;
  opacity: 1;
  box-shadow: 0rem 0rem 0.8rem 0.2rem #999;
}

.like-button.filled {
  opacity: 1;
  background-color: #eaeaeaff;
  border-color: #eaeaeaff;
  box-shadow: 0rem 0rem 0.8rem 0.5rem #999 !important;
}

.like-button.filled:hover,
.like-button.filled:focus {
  border-color: #785396;
}

.like-button.empty svg path {
  stroke: #444;
}

.like-button.filled svg {
  fill: #a040f9;
}

</style>

<template>
  <div class="column is-3">
    <div class="card">
      <div class="card-image">
        <figure class="image ">
          <img v-if="movie.Poster" :src="movie.Poster">
          <img v-else :src="imageMoviePlaceholder">
          <button @click="likeMovie(movie.imdbID)" class="button like-button is-medium"
            :class="{ filled: isMyMovie, empty: !isMyMovie }">
            <HeartFilled v-if="isMyMovie" class="icon"></HeartFilled>
            <HeartEmpty v-if="!isMyMovie" class="icon"></HeartEmpty>
          </button>
        </figure>
      </div>
      <div class="card-header">
        <p class="card-header-title">
          {{ movie.Title }}
        </p>
      </div>
      <div class="card-content">
        <p>Year: {{ movie.Year }}</p>
      </div>
    </div>
  </div>
</template>