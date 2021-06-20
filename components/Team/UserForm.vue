<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit"
  >
    <template #activator="{ on }">
      <slot :on="on" />
    </template>
    <template #form>
      <v-col
        v-if="passwordMode"
        cols="12"
      >
        <v-text-field
          v-model="user.current_password"
          label="Current Password"
          :rules="rulesFor.current_password"
          :type="visible ? 'text' : 'password'"
          :append-icon="`mdi-eye${visible ? '' : '-off'}`"
          @click:append="visible = !visible"
        />
      </v-col>
      <v-row
        v-else
        dense
      >
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
      </v-row>
      <v-row
        v-if="!currentUser || passwordMode"
        dense
      >
        <v-col cols="12">
          <v-text-field
            v-model="user.password"
            :label="passwordLabel"
            :rules="rulesForPassword"
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
    <template #additional-actions>
      <v-btn
        v-if="user.id"
        text
        color="blue"
        @click="passwordMode = !passwordMode"
      >
        {{ passwordMode ? 'Profile' : 'Change Password' }}
      </v-btn>
    </template>
  </dialog-form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import pick from 'lodash.pick'
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
        current_password: [isRequired('Current Password')],
        password_confirmation: [isRequired('Password Confirmation')]
      },
      visible: false
    }),
    computed: {
      ...mapGetters([
        'currentUser'
      ]),
      title () {
        if (this.passwordMode) {
          return 'Change Password'
        } else if (this.currentUser) {
          return 'Edit Account'
        } else {
          return 'New Account'
        }
      },
      passwordLabel () {
        return this.passwordMode ? 'New Password' : 'Password'
      },
      rulesForPassword () {
        return [isRequired(this.passwordLabel)]
      },
      editParams () {
        return this.passwordMode
          ? ['current_password', 'password', 'password_confirmation']
          : ['full_name', 'username', 'email']
      }
    },
    watch: {
      async dialog (val) {
        if (val && this.currentUser) {
          this.user = pick(this.currentUser, [
            'id',
            'full_name',
            'username',
            'email'
          ])
        }
      }
    },
    methods: {
      ...mapActions('user', {
        createUser: 'create',
        updateUser: 'update'
      }),
      async submit () {
        if (!this.currentUser) {
          await this.createUser(this.user)
        } else {
          let params = {}

          this.editParams.forEach(attr => {
            params[attr] = this.user[attr]
          })

          await this.updateUser(params)
        }
      }
    }
  }
</script>
