<script setup>
import { ref, watchEffect } from 'vue';
import { pipe } from 'ramda';

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
          <li> <a>My collection </a></li>
          <li> <a> All movies </a> </li>
        </ul>
      </div>
    </section>

    <section>
      <div class="tile is-ancestor">
        <MovieTile v-for="movie in movies" :movie="movie"></MovieTile>
      </div>
    </section>
  </div>
</template>