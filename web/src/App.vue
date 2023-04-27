<script setup>
import { ref, shallowRef, watchEffect } from 'vue';

import TabMyCollection from './TabMyCollection.vue'
import TabOMDB from './TabOMDB.vue'


import { HOME_URL, fetchAsMe } from './common'

const me = ref(null)
const activeTab = shallowRef(TabMyCollection)

watchEffect(() => fetchAsMe('me', me))
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
          <li :class="{ 'is-active': activeTab === TabOMDB }">
            <a @click.prevent="activeTab = TabOMDB"> All movies </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="block" v-if="me">
      <TabOMDB v-if="activeTab === TabOMDB"></TabOMDB>
      <TabMyCollection v-if="activeTab === TabMyCollection"></TabMyCollection>
    </div>
  </div>
</template>