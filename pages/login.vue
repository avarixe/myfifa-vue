<template>
  <v-container class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="12">
        <v-img
          src="/logo.png"
          contain
          max-height="128px"
        />
      </v-col>
      <v-col
        cols="12"
        class="d-flex justify-center"
      >
        <div
          class="text-center pa-4 elevation-10 rounded-xl"
          :style="titleStyle"
        >
          <div class="font-weight-light text-h4">MyFIFA Manager</div>
          <div class="text-caption">v{{ version }}</div>
        </div>
      </v-col>
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <base-form :submit="login">
          <template #default="{ loading }">
            <v-card
              color="rgba(0, 0, 0, 0.3)"
              class="rounded-xl"
            >
              <v-card-text class="pt-4">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      v-model="username"
                      label="Username"
                      hide-details
                      autofocus
                      autocapitalize="off"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="password"
                      label="Password"
                      :type="visible ? 'text' : 'password'"
                      hide-details
                      :append-icon="`mdi-eye${visible ? '' : '-off'}`"
                      @click:append="visible = !visible"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-alert
                v-model="error"
                type="error"
                dismissible
              >
                {{ errorMessage }}
              </v-alert>
              <v-card-actions>
                <v-spacer />
                <user-form>
                  <template #activator="{ on }">
                    <v-btn
                      color="orange"
                      text
                      large
                      v-on="on"
                    >
                      Register
                    </v-btn>
                  </template>
                </user-form>
                <v-btn
                  type="submit"
                  color="primary"
                  text
                  large
                  :loading="loading"
                >
                  Log In
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </base-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'

  export default {
    name: 'LoginPage',
    transition: 'fade-transition',
    data: () => ({
      username: null,
      password: null,
      error: false,
      errorMessage: null,
      visible: false,
      titleStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        textShadow: '0 0 2px black'
      }
    }),
    computed: mapState([
      'version'
    ]),
    mounted () {
      this.setTitle('')
    },
    methods: {
      ...mapMutations('app', [
        'setTitle'
      ]),
      ...mapActions('auth', [
        'createToken'
      ]),
      async login () {
        try {
          this.error = false
          this.errorMessage = null
          await this.createToken({
            username: this.username,
            password: this.password
          })
        } catch (e) {
          console.error(e)
          this.error = true
          this.errorMessage = e.response
            ? 'Invalid Username/Password. Please try again.'
            : 'API is not enabled.'
        }
      }
    }
  }
</script>
