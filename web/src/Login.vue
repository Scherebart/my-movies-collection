<script setup>
import { ref } from 'vue';

import { authPost, deriveUserMessageFromResponse } from './common'

const emit = defineEmits(['userMessage', 'switchLoginOrRegister', 'loggedIn'])
const form = ref({})

async function login() {
  const response = await authPost('login', form.value)
  const userMessage = deriveUserMessageFromResponse(response) ||
    { success: 'You have successfully logged in!' }

  if (userMessage) {
    emit('userMessage', userMessage)
  }

  const { ok, body } = response
  if (ok) {
    emit('loggedIn', body.token)
  }
}
</script>

<template>
  <div class="box" id="login-box">
    <form class="block">
      <div class="field">
        <label class="label">Username</label>
        <div class="control">
          <input v-model="form.username" class="input" type="text" placeholder="Username">
        </div>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input v-model="form.password" class="input" type="password" placeholder="Password">
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button type="submit" @click.prevent="login" class="button is-link is-fullwidth">Login</button>
        </div>
      </div>
    </form>
    <div class="block">
      <div class="content has-text-right">
        Do you want to <a class="has-text-weight-bold" @click="$emit('switchLoginOrRegister')">register</a>?
      </div>
    </div>
  </div>
</template>

<style>
#login-box {
  max-width: 30rem;
  margin-left: auto;
  margin-right: auto;
}
</style>
