<template>
  <base-form
    :submit="submit"
    :reset-after-submit="false"
  >
    <template #default="{ loading, valid }">
      <v-card>
        <v-toolbar
          color="primary"
          dense
        >
          <v-toolbar-title class="font-weight-light white--text">
            Profile
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
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
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            type="submit"
            color="primary"
            text
            large
            :disabled="!valid"
            :loading="loading"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </base-form>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { isRequired, isEmail } from '@/functions'

  export default {
    name: 'UserProfile',
    data: () => ({
      attributes: {
        fullName: null,
        username: null,
        email: null
      },
      rulesFor: {
        fullName: [isRequired('Name')],
        username: [isRequired('Username')],
        email: [
          isRequired('Email Address'),
          isEmail
        ]
      }
    }),
    computed: {
      ...mapGetters([
        'currentUser'
      ])
    },
    mounted () {
      this.attributes = pick(this.currentUser, [
        'fullName',
        'username',
        'email'
      ])
    },
    methods: {
      ...mapMutations('broadcaster', [
        'announce'
      ]),
      ...mapActions('user', {
        updateUser: 'update'
      }),
      async submit () {
        try {
          this.loading = true
          await this.updateUser({
            id: this.currentUser.id,
            attributes: this.attributes
          })
          this.announce({
            message: 'Profile has been updated!',
            color: 'success'
          })
        } catch (e) {
          this.announce({
            message: e.response?.errors[0].message,
            color: 'red'
          })
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
