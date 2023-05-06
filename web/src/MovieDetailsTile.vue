<script setup>
import imageMoviePlaceholder from './movie-poster-placeholder.png'
import Cross from './cross-svgrepo-com.svg'

const props = defineProps({
  movie: Object,
  likeMovie: Function
})

</script>

<style>
.cross-button {
  position: absolute;
  margin: 1rem;
  bottom: 0;
  right: 0;
  border-color: #444;
  border-radius: 50%;
  border-width: 0.15rem;
  background-color: #eaeaeae0;
  opacity: 0.65;
}

.cross-button,
.cross-button svg {
  transition: all 0.4s ease-out;
}

.cross-button:hover,
.cross-button:hover svg,
.cross-button:focus,
.cross-button:focus svg {
  transition: all 0.15s ease-in;
}

.cross-button:hover,
.cross-button:focus {
  box-shadow: 0rem 0rem 1rem 0.6rem #fda39eca !important;
  background-color: #fda39eca;
  border-color: #501418;
  opacity: 1;
}

.cross-button svg path {
  stroke: #444;
}

.cross-button:hover svg path,
.cross-button:focus svg path {
  stroke: #501418;
}
</style>

<template>
  <div class="column is-3">
    <div class="card">
      <div class="card-image">
        <figure class="image ">
          <img v-if="movie.Poster" :src="movie.Poster">
          <img v-else :src="imageMoviePlaceholder">

          <button @click="likeMovie(movie.imdbID)" class="button cross-button is-medium">
            <Cross class="icon"></Cross>
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
        <br>
        <p>
          {{ movie.Plot }}
        </p>
      </div>
    </div>
  </div>
</template>