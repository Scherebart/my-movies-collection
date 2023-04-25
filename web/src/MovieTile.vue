<script setup>
const props = defineProps({
  movie: Object
})
</script>

<template>
  <div class="column is-4">
    <div class="card">
      <div class="card-image">
        <figure class="image ">
          <img :src="movie.Poster" >
        </figure>
      </div>
      <div class="card-header">
        <div class="card-header-title">
          {{ movie.Title }}
        </div>
      </div>
      <div class="card-content">
        <p>Year: {{ movie.Year }}</p>
      </div>
    </div>
  </div>
</template>