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
  import { mapGetters, mapActions } from 'vuex'
  import { DialogFormable } from '@/mixins'
  import { DynamicFields } from '@/helpers'

  export default {
    name: 'UserForm',
    components: {
      DynamicFields
    },
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
      }
    }),
    computed: {
      ...mapGetters([
        'authenticated'
      ]),
      fields () {
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
      },
      title () {
        if (this.passwordMode) {
          return 'Change Password'
        } else if (this.authenticated) {
          return 'Edit Account'
        } else {
          return 'New Account'
        }
      },
      passwordLabel () {
        return this.passwordMode ? 'New Password' : 'Password'
      },
      editParams () {
        return this.passwordMode
          ? ['current_password', 'password', 'password_confirmation']
          : ['full_name', 'username', 'email']
      }
    },
    watch: {
      async dialog (val) {
        if (val && this.authenticated) {
          const { data } = await this.getUser()
          this.user = data
        }
      }
    },
    methods: {
      ...mapActions('users', {
        getUser: 'GET',
        createUser: 'CREATE',
        updateUser: 'UPDATE'
      }),
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
  }
</script>
