<script setup>
import { ref, shallowRef, watchEffect } from 'vue';
import { isEmpty, isNil } from 'ramda';

import {  authPost, STATUS_LOADING, deriveUserMessageFromResponse } from './common'

const emit = defineEmits(['userMessage', 'switchLoginOrRegister'])
const form = ref({})
const repeatedPassword = ref('')

async function register() {
  const password = form.value.password
  if (!isNil(password) && !isEmpty(password) && password !== repeatedPassword.value) {
    return emit('userMessage', { error: 'Passwords must match' })
  }

  const response = await authPost('register', form.value)
  const userMessage = deriveUserMessageFromResponse(response) ||
    { success: 'You have successfully registered! You can now login.' }

  if (userMessage) {
    emit('userMessage', userMessage)
  }

  if (response.ok) {
    return emit('switchLoginOrRegister')
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
        <label class="label">First name <span class="has-text-weight-light">(optional)</span></label>
        <div class="control">
          <input v-model="form.firstName" class="input" type="text" placeholder="First name">
        </div>
      </div>
      <div class="field">
        <label class="label">Last name <span class="has-text-weight-light">(optional)</span></label>
        <div class="control">
          <input v-model="form.lastName" class="input" type="text" placeholder="Last name">
        </div>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input v-model="form.password" class="input" type="password" placeholder="Password">
        </div>
      </div>
      <div class="field">
        <label class="label">Repeat password</label>
        <div class="control">
          <input v-model="repeatedPassword" class="input" type="password" placeholder="Repeat password">
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button @click.prevent="register" class="button is-link is-fullwidth">Register</button>
        </div>
      </div>
    </form>
    <div class="block">
      <div class="content has-text-right">
        Back to <a class="has-text-weight-bold" @click="$emit('switchLoginOrRegister')">login</a>
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
