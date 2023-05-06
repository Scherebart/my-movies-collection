<script setup>
import { ref, shallowRef, watchEffect } from 'vue';

import TabMyCollection from './TabMyCollection.vue'
import TabOmdb from './TabOmdb.vue'


import { HOME_URL, getAsMe, putAsMe, STATUS_LOADING } from './common'

const me = ref(null)
const activeTab = shallowRef(TabMyCollection)

getAsMe('me', me)

function likeMovie(movieId) {
  if (me.value === null || me.value === STATUS_LOADING) {
    return;
  }

  const { movies } = me.value

  let movieIdIndex = movies.indexOf(movieId)
  if (movieIdIndex > -1) {
    movies.splice(movieIdIndex, 1)
  } else {
    movies.push(movieId)
  }

  return putAsMe('my-movies', movies)
}


</script>

<template>
  <div class="container">
    <nav class="navbar block" role="navigation" aria-label="navigation">
      <div class="navbar-brand">
        <a class="navbar-item" :href="HOME_URL">
          <h1 class="title">
            <img src="/vue.svg" class="logo" alt="Vite logo" />
            My Movies Collection
          </h1>
        </a>
      </div>
      <div class="navbar-end">
        <div class="navbar-item" v-if="me">
          Hello <strong>{{ me.firstName }} {{ me.lastName }}</strong> !
        </div>
        <div class="navbar-item" v-else>
          Hello my guest!
        </div>
      </div>
    </nav>

    <div class="block" v-if="me">
      <div class="tabs is-centered is-medium is-boxed">
        <ul>
          <li :class="{ 'is-active': activeTab === TabMyCollection }">
            <a @click.prevent="activeTab = TabMyCollection">My collection </a>
          </li>
          <li :class="{ 'is-active': activeTab === TabOmdb }">
            <a @click.prevent="activeTab = TabOmdb"> All movies </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="block" v-if="me">
      <KeepAlive>
        <component :like-movie="likeMovie" :my-movies="me.movies" :is="activeTab"></component>
      </KeepAlive>
    </div>
  </div>
</template>