<script setup>
import { ref, shallowRef, watchEffect, inject, computed } from 'vue';

import { isNil } from 'ramda';

import TabMyCollection from './TabMyCollection.vue'
import TabOmdb from './TabOmdb.vue'
import Login from './Login.vue';
import Register from './Register.vue'

import { HOME_URL, apiGet, apiPut, STATUS_LOADING, shortTermRef } from './common'

const lastUserMessage = shortTermRef(null, 10000)

const me = ref(null)
const displayedName = computed(() => {
  console.log('computing displayed name')
  if (me.value) {
    console.log('me value')
    const { username, firstName, lastName } = me.value
    console.log(username, firstName, lastName)
    if (firstName && lastName) {
      return firstName + ' ' + lastName
    } else {
      return username
    }
  }

  return null
})
const activeTab = shallowRef(TabMyCollection)
const loginOrRegister = shallowRef(Login)
const jwtToken = inject('jwtToken')

watchEffect(() => {
  if (!isNil(jwtToken.value)) {
    apiGet(jwtToken, 'me', me)
  } else {
    me.value = null
    showUserMessage({ warning: 'You have been logged out!' })
  }
})

function onLoggedIn(token) {
  jwtToken.value = token
}

function logout() {
  jwtToken.value = null
  showUserMessage({ success: 'You have logged out' })
}

function showUserMessage(userMessage) {
  lastUserMessage.value = userMessage
}

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

  return apiPut(jwtToken, 'my-movies', movies)
}

function switchLoginOrRegister() {
  loginOrRegister.value = loginOrRegister.value === Login ? Register : Login
}
</script>

<style>
.display-enter-active,
.display-leave-active {
  transition: opacity 0.8s ease;
}

.display-enter-from,
.display-leave-to {
  opacity: 0;
}
</style>

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
        <div class="navbar-item">
          <div class="content has-text-right">
            <template v-if="me">
              Hello <span class="has-text-weight-bold">{{ displayedName }}</span>!
              <a class="ml-2 has-text-weight-bold" @click.prevent="logout">Logout</a>
            </template>
            <template v-else>
              Hello <span class="has-text-weight-bold">my guest</span>!
            </template>
          </div>
        </div>
      </div>
    </nav>

    <Transition name="display">
      <article v-if="lastUserMessage && lastUserMessage.success" class="message is-primary">
        <div class="message-body">
          {{ lastUserMessage.success }}
        </div>
      </article>
      <article v-else-if="lastUserMessage && lastUserMessage.error" class="message is-danger">
        <div class="message-body">
          {{ lastUserMessage.error }}
        </div>
      </article>
      <article v-else-if="lastUserMessage && lastUserMessage.warning" class="message is-warning">
        <div class="message-body">
          {{ lastUserMessage.warning }}
        </div>
      </article>
    </Transition>

    <template v-if="me">
      <div class="block">
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

      <div class="block">
        <KeepAlive>
          <component :like-movie="likeMovie" :my-movies="me.movies" :is="activeTab"></component>
        </KeepAlive>
      </div>
    </template>

    <template v-else>
      <component @logged-in="onLoggedIn" @user-message="showUserMessage" @switch-login-or-register="switchLoginOrRegister"
        :is="loginOrRegister">
      </component>
    </template>
  </div>
</template>