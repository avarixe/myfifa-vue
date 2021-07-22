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
      attributes: {
        fullName: '',
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      },
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
      visible: false
    }),
    methods: {
      ...mapActions('user', {
        createUser: 'create'
      }),
      async submit () {
        await this.createUser(this.attributes)
      }
    }
  }
</script>
