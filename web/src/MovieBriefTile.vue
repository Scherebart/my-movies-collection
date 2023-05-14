<script setup>
import { ref } from 'vue';

import HeartFilled from './heart-filled-svgrepo-com.svg'
import HeartEmpty from './heart-empty-svgrepo-com.svg'
import imageMoviePlaceholder from './movie-poster-placeholder.png'
import MovieDetailsModal from './MovieDetailsModal.vue';

const props = defineProps({
  movie: Object,
  isMyMovie: Boolean,
  likeMovie: Function
})

const modalIsDisplayed = ref(false)

function showOrCloseModal() {
  modalIsDisplayed.value = !modalIsDisplayed.value
}

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
  border-color: #444;
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
  box-shadow: 0rem 0rem 0.8rem 0.4rem #999 !important;
}

.like-button.filled:hover,
.like-button.filled:focus {
  border-color: #785396;
}

.like-button.empty path {
  stroke: #444;
}

.like-button.filled svg {
  fill: #a040f9;
}
</style>

<template>
  <div class="movie-brief-tile column is-3">
    <div class="card">
      <div class="card-image">
        <figure @click="showOrCloseModal" class="image">
          <img v-if="movie.Poster" :src="movie.Poster" class="is-clickable">
          <img v-else :src="imageMoviePlaceholder">
          <button @click.stop="likeMovie(movie.imdbID)" class="button like-button is-medium"
            :class="{ filled: isMyMovie, empty: !isMyMovie }">
            <HeartFilled v-if="isMyMovie" class="icon"></HeartFilled>
            <HeartEmpty v-else class="icon"></HeartEmpty>
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
    <MovieDetailsModal v-if="modalIsDisplayed" :movie-id="movie.imdbID" :is-my-movie="isMyMovie" :like-movie="likeMovie"
      @close-modal="showOrCloseModal" :class="{ 'is-active': modalIsDisplayed }"></MovieDetailsModal>
  </div>
</template>