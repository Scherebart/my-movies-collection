<script setup>
const props = defineProps({
  movie: Object
})
</script>

<template>
  <div class="card tile is-parent is-4">
    <!-- <div class="card"> -->
      <div class="card-content">
        <div class="media-content">
          <p class="title is-4">{{ movie.Title }}</p>
          <p class="subtitle is-6">Year: {{ movie.Year }}</p>
        </div>
      </div>
    <!-- </div> -->
  </div>
</template>