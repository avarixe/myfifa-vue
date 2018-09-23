<template>
  <dialog-form
    v-model="dialog"
    :title="title"
    :submit="submit">
    <slot slot="activator"></slot>
    <v-container slot="form">
      <v-text-field
        v-model="user.full_name"
        label="Name"
        :rules="$_validate('Name', ['required'])"
      ></v-text-field>
      <v-text-field
        v-model="user.email"
        label="Email"
        type="email"
        :rules="$_validate('Email', ['required', 'email'])"
      ></v-text-field>
      <v-text-field
        v-model="user.password"
        label="Password"
        :type="visible1 ? 'text' : 'password'"
        :append-icon="visible1 ? 'visibility_off' : 'visibility'"
        @click:append="visible1 = !visible1"
        :rules="$_validate('Password', ['required'])"
      ></v-text-field>
      <v-text-field
        v-model="user.password_confirmation"
        label="Confirm Password"
        :type="visible2 ? 'text' : 'password'"
        :append-icon="visible2 ? 'visibility_off' : 'visibility'"
        @click:append="visible2 = !visible2"
        :rules="$_validate('Password Confirmation', ['required'])"
      ></v-text-field>
    </v-container>
  </dialog-form>
</template>


<script>
  import { mapActions } from 'vuex'
  import DialogFormable from '@/mixins/DialogFormable'

  export default {
    mixins: [ DialogFormable ],
    props: {
      initialUser: Object
    },
    data: () => ({
      visible1: false,
      visible2: false,
      user: Object.assign({
        full_name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }, this.initialUser)
    }),
    computed: {
      title () {
        return this.user.id ? 'Edit Account' : 'New Account'
      }
    },
    methods: {
      ...mapActions('user', [
        'create',
        'update'
      ]),
      async submit () {
        try {
          let save = this.user.id ? this.update : this.create
          await save(this.user)
        } catch (e) {
          this.$store.commit('broadcaster/announce', {
            message: 'Could not save Account',
            color: 'error'
          })
          throw e
        }
      }
    }
  }
</script>
