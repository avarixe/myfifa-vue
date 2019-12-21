<template lang="pug">
  dialog-form(v-model="dialog" :title="title" :submit="submit")
    template(#activator="{ on }")
      slot(:on="on")
    template(#form)
      dynamic-fields(:object="user" :fields="fields")
    template(#additional-actions)
      v-btn(
        v-if="user.id"
        text
        color="blue"
        @click="passwordMode = !passwordMode"
      ) {{ passwordMode ? 'Profile' : 'Change Password' }}
</template>

<script>
  import { mixins, Component, Watch, Getter, namespace } from 'nuxt-property-decorator'
  import { DialogFormable } from '@/mixins'
  import { DynamicFields } from '@/helpers'

  const user = namespace('user')

  @Component({
    components: {
      DynamicFields
    }
  })
  export default class UserForm extends mixins(DialogFormable) {
    @Getter authenticated
    @user.Action('GET') getUser
    @user.Action('CREATE') createUser
    @user.Action('UPDATE') updateUser

    passwordMode = false
    user = {
      full_name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: ''
    }

    get fields () {
      let fields = []

      if (this.passwordMode) {
        fields.push({
          type: 'password',
          attribute: 'current_password',
          label: 'Current Password'
        })
      } else {
        fields = [
          {
            type: 'string',
            attribute: 'full_name',
            label: 'Name',
            required: true,
            autocapitalize: 'word'
          },
          {
            type: 'string',
            attribute: 'username',
            label: 'Username',
            required: true,
            autocapitalize: 'off'
          },
          {
            type: 'string',
            attribute: 'email',
            label: 'Email',
            required: true,
            inputmode: 'email'
          }
        ]
      }

      if (!this.authenticated || this.passwordMode) {
        fields = [
          ...fields,
          {
            type: 'password',
            attribute: 'password',
            label: this.passwordLabel
          },
          {
            type: 'password',
            attribute: 'password_confirmation',
            label: 'Confirm Password'
          }
        ]
      }

      return fields
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
    async getUserData (val) {
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
