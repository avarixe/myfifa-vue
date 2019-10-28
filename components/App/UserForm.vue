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
      <template v-if="!passwordMode">
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

      <template v-if="!authenticated || passwordMode">
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
        @click="passwordMode = !passwordMode"
      >
        {{ passwordMode ? 'Profile' : 'Change Password' }}
      </v-btn>
    </template>
  </dialog-form>
</template>

<script>
  import { mixins, Component, Watch, Getter, namespace } from 'nuxt-property-decorator'
  import { DialogFormable } from '@/mixins'

  const user = namespace('user')

  @Component
  export default class UserForm extends mixins(DialogFormable) {
    @Getter authenticated
    @user.Action('GET') getUser
    @user.Action('CREATE') createUser
    @user.Action('UPDATE') updateUser

    visible = false
    passwordMode = false
    user = {
      full_name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: ''
    }

    get title () {
      if (this.passwordMode) {
        return 'Change Password'
      } else if (this.authenticated) {
        return 'Edit Account'
      } else {
        return 'New Account'
      }
    }

    get passwordLabel () {
      return this.passwordMode ? 'New Password' : 'Password'
    }

    get editParams () {
      return this.passwordMode
        ? ['current_password', 'password', 'password_confirmation']
        : ['full_name', 'username', 'email']
    }

    @Watch('dialog')
    async getUser (val) {
      if (val && this.authenticated) {
        const { data } = await this.getUser()
        this.user = data
      }
    }

    async submit () {
      if (!this.authenticated) {
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
</script>
