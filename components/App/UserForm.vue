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
      <template v-if="!changePassword">
        <v-col cols="12">
          <v-text-field
            v-model="user.full_name"
            label="Name"
            :rules="$_validate('Name', ['required'])"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="user.username"
            label="Username"
            :rules="$_validate('Username', ['required'])"
            autocapitalize="off"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="user.email"
            label="Email"
            type="email"
            :rules="$_validate('Email', ['required', 'email'])"
          />
        </v-col>
      </template>
      <v-col
        v-else
        cols="12"
      >
        <v-text-field
          v-model="user.current_password"
          label="Current Password"
          :type="visible ? 'text' : 'password'"
          :append-icon="`mdi-eye${visible ? '-off' : ''}`"
          @click:append="visible = !visible"
        />
      </v-col>

      <template v-if="!authenticated || changePassword">
        <v-col cols="12">
          <v-text-field
            v-model="user.password"
            :label="passwordLabel"
            :type="visible ? 'text' : 'password'"
            :append-icon="`mdi-eye${visible ? '-off' : ''}`"
            @click:append="visible = !visible"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="user.password_confirmation"
            label="Confirm Password"
            :type="visible ? 'text' : 'password'"
            :append-icon="`mdi-eye${visible ? '-off' : ''}`"
            @click:append="visible = !visible"
          />
        </v-col>
      </template>
    </template>

    <template #additional-actions>
      <v-btn
        v-if="user.id"
        text
        color="blue"
        @click="changePassword = !changePassword"
      >
        {{ changePassword ? 'Profile' : 'Change Password' }}
      </v-btn>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Watch } from 'nuxt-property-decorator'
  import { mapGetters, mapActions } from 'vuex'
  import { DialogFormable } from '@/mixins'

  @Component({
    computed: mapGetters([
      'authenticated'
    ]),
    methods: mapActions('user', {
      get: 'GET',
      create: 'CREATE',
      update: 'UPDATE'
    })
  })
  export default class UserForm extends mixins(DialogFormable) {
    visible = false
    changePassword = false
    user = {
      full_name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: ''
    }

    get title () {
      return this.authenticated ? 'Edit Account' : 'New Account'
    }

    get passwordLabel () {
      return this.changePassword ? 'New Password' : 'Password'
    }

    get editParams () {
      return this.changePassword
        ? ['current_password', 'password', 'password_confirmation']
        : ['full_name', 'username', 'email']
    }

    @Watch('dialog')
    async getUser (val) {
      if (val && this.authenticated) {
        const { data } = await this.get()
        this.user = data
      }
    }

    async submit () {
      try {
        if (!this.authenticated) {
          await this.create(this.user)
        } else {
          let params = {}

          this.editParams.forEach(attr => {
            params[attr] = this.user[attr]
          })

          await this.update(params)
        }
      } catch (e) {
        this.$store.commit('broadcaster/ANNOUNCE', {
          message: 'Could not save Account',
          color: 'error'
        })
        throw e
      }
    }
  }
</script>
