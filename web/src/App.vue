<script setup>
import { ref, watchEffect } from 'vue';

import MovieTile from './MovieTile.vue';

const HOME_URL = 'http://localhost:8080/'
const API_URL = HOME_URL + 'api/'
const USER_ID = new URLSearchParams(document.location.search).get('user-id')

const fetchAsMe = async (apiFunction, assignable, options = {}) => {
  const defaultOptions = {
    headers: Object.assign({}, options.headers || {
      'user-id': USER_ID
    })
  };

  const mergedOptions = Object.assign({}, options, defaultOptions);

  const ret = await fetch(API_URL + apiFunction, mergedOptions)
  const body = await ret.json();

  if (ret.status !== 200) {
    console.error(apiFunction, body);
  }

  const value = ret.status == 200 ? body : null;

  if (assignable) {
    assignable.value = value
  }

  return value
};

const me = ref(null)
const movies = ref(null)

const TABS = Object.freeze({
  MY_COLLECTION: 'MY_COLLECTION',
  OMDB: 'OMDB'
})
const activeTab = ref(TABS.MY_COLLECTION)

watchEffect(() =>
  Promise.all([
    fetchAsMe('me', me),
    fetchAsMe('my-movies', movies),
  ])
)
</script>

<template>
  <div class="container">
    <nav class="navbar" role="navigation" aria-label="navigation">
      <div class="navbar-brand">
        <a class="navbar-item" :href="HOME_URL">
          <h1 class="title">
            <img src="/vue.svg" class="logo" alt="Vite logo" />
            My movies collection
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

    <section>
      <div class="tabs is-centered is-medium is-boxed">
        <ul>
          <li :class="{ 'is-active': activeTab === TABS.MY_COLLECTION }"> 
            <a @click.prevent="activeTab = TABS.MY_COLLECTION">My collection </a></li>
          <li :class="{ 'is-active': activeTab === TABS.OMDB }"> 
            <a @click.prevent="activeTab = TABS.OMDB"> All movies </a> </li>
        </ul>
      </div>
    </section>

    <section v-if="movies && movies.length">
      <div class="columns is-multiline">
        <MovieTile v-for="movie in movies" :movie="movie"></MovieTile>
      </div>
    </section>
    <section v-else>
      <div class="container">
        YOU HAVE NO MOVIES
      </div>
    </section>
  </div>
</template>