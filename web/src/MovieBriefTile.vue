<script setup>
const props = defineProps({
  movie: Object
})

import HeartFilled from './heart-filled-svgrepo-com.svg'
import HeartEmptyThick from './heart-empty-thick-svgrepo-com.svg'
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
  border-color: #444;
  background-color: #eaeaeae0;
}

.like-button:hover {
  border-color: #555;
}

.like-button.empty {
  opacity: 0.65;
  transition: all 0.4s ease-out;
}

.like-button.empty:hover {
  background-color: #eaeaeaff;
  opacity: 1;
  box-shadow: 0rem 0rem 0.8rem 0.2rem #999;
  transition: all 0.15s ease-in;
}


.like-button.empty svg path {
  stroke: #333;
}

.like-button.filled {
  opacity: 1;
  background-color: #eaeaeaff;
  border-color: #eaeaeaff;
  border-width: 0.1rem;
  box-shadow: 0rem 0rem 0.8rem 0.4rem #aaa;
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
          <button class="button like-button is-medium filled">
          <!-- <button class="button like-button is-medium empty"> -->
            <HeartFilled class="icon"></HeartFilled>
            <!-- <HeartEmptyThick class="icon"></HeartEmptyThick> -->
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