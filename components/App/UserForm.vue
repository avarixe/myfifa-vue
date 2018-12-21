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
        v-model="user.username"
        label="Username"
        :rules="$_validate('Username', ['required'])"
      ></v-text-field>
      <v-text-field
        v-model="user.email"
        label="Email"
        type="email"
        :rules="$_validate('Email', ['required', 'email'])"
      ></v-text-field>
      <template v-if="!user.id">
        <v-text-field
          v-model="user.password"
          label="Password"
          :type="visible1 ? 'text' : 'password'"
          :append-icon="`mdi-eye${visible1 ? '-off' : ''}`"
          @click:append="visible1 = !visible1"
          :rules="$_validate('Password', ['required'])"
        ></v-text-field>
        <v-text-field
          v-model="user.password_confirmation"
          label="Confirm Password"
          :type="visible2 ? 'text' : 'password'"
          :append-icon="`mdi-eye${visible2 ? '-off' : ''}`"
          @click:append="visible2 = !visible2"
          :rules="$_validate('Password Confirmation', ['required'])"
        ></v-text-field>
      </template>
    </v-container>
  </dialog-form>
</template>


<script>
  import { mapActions } from 'vuex'
  import DialogFormable from '@/mixins/DialogFormable'

  export default {
    mixins: [ DialogFormable ],
    data: () => ({
      visible1: false,
      visible2: false,
      user: {
        full_name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    }),
    computed: {
      title () {
        return this.user.id ? 'Edit Account' : 'New Account'
      }
    },
    watch: {
      async dialog (val) {
        if (val && this.$store.getters.authenticated) {
          const { data } = await this.get()
          this.user = data
        }
      }
    },
    methods: {
      ...mapActions('user', {
        get: 'GET',
        create: 'CREATE',
        update: 'UPDATE'
      }),
      async submit () {
        try {
          let save = this.user.id ? this.update : this.create
          await save(this.user)
        } catch (e) {
          this.$store.commit('broadcaster/ANNOUNCE', {
            message: 'Could not save Account',
            color: 'error'
          })
          throw e
        }
      }
    }
  }
</script>
