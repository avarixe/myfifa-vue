<script>
  import { ref, reactive, useStore } from '@nuxtjs/composition-api'
  import { isRequired, isEmail } from '@/functions'

  export default {
    name: 'UserForm',
    setup () {
      const attributes = reactive({
        fullName: '',
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      })

      const store = useStore()
      const submit = async () => {
        await store.dispatch('user/create', attributes)
      }

      return {
        attributes,
        rulesFor: {
          fullName: [isRequired('Name')],
          username: [isRequired('Username')],
          email: [
            isRequired('Email Address'),
            isEmail
          ],
          password: [isRequired('Password')],
          passwordConfirmation: [isRequired('Password Confirmation')]
        },
        visible: ref(false),
        submit
      }
    }
  }
</script>

<template>
  <dialog-form
    title="New Account"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>
    <template #form>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            v-model="attributes.fullName"
            label="Name"
            :rules="rulesFor.fullName"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="attributes.username"
            label="Username"
            :rules="rulesFor.username"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="attributes.email"
            label="Email Address"
            :rules="rulesFor.email"
            type="email"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="attributes.password"
            label="Password"
            :rules="rulesFor.password"
            :type="visible ? 'text' : 'password'"
            :append-icon="`mdi-eye${visible ? '' : '-off'}`"
            @click:append="visible = !visible"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="attributes.passwordConfirmation"
            label="Confirm Password"
            :rules="rulesFor.passwordConfirmation"
            :type="visible ? 'text' : 'password'"
            :append-icon="`mdi-eye${visible ? '' : '-off'}`"
            @click:append="visible = !visible"
          />
        </v-col>
      </v-row>
    </template>
  </dialog-form>
</template>
