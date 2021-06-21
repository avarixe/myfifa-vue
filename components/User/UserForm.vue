<template>
  <dialog-form
    v-model="dialog"
    title="New Account"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>
    <template #form>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            v-model="user.full_name"
            label="Name"
            :rules="rulesFor.full_name"
            spellcheck="false"
            autocapitalize="words"
            autocomplete="off"
            autocorrect="off"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="user.username"
            label="Username"
            :rules="rulesFor.username"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="user.email"
            label="Email Address"
            :rules="rulesFor.email"
            type="email"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="user.password"
            label="Password"
            :rules="rulesFor.password"
            :type="visible ? 'text' : 'password'"
            :append-icon="`mdi-eye${visible ? '' : '-off'}`"
            @click:append="visible = !visible"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="user.password_confirmation"
            label="Confirm Password"
            :rules="rulesFor.password_confirmation"
            :type="visible ? 'text' : 'password'"
            :append-icon="`mdi-eye${visible ? '' : '-off'}`"
            @click:append="visible = !visible"
          />
        </v-col>
      </v-row>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { DialogFormable } from '@/mixins'
  import { isRequired, isEmail } from '@/functions'

  export default {
    name: 'UserForm',
    mixins: [
      DialogFormable
    ],
    data: () => ({
      passwordMode: false,
      user: {
        full_name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      rulesFor: {
        full_name: [isRequired('Name')],
        username: [isRequired('Username')],
        email: [
          isRequired('Email Address'),
          isEmail
        ],
        password: [isRequired('Password')],
        password_confirmation: [isRequired('Password Confirmation')]
      },
      visible: false
    }),
    methods: {
      ...mapActions('user', {
        createUser: 'create'
      }),
      async submit () {
        await this.createUser(this.user)
      }
    }
  }
</script>
