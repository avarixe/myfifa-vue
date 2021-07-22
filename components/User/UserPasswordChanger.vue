<template>
  <base-form :submit="submit">
    <template #default="{ loading, valid }">
      <v-card>
        <v-toolbar
          color="warning"
          dense
        >
          <v-toolbar-title class="font-weight-light white--text">
            Change Password
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="attributes.currentPassword"
                  label="Current Password"
                  :rules="rulesFor.currentPassword"
                  :type="visible ? 'text' : 'password'"
                  :append-icon="`mdi-eye${visible ? '' : '-off'}`"
                  @click:append="visible = !visible"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="attributes.password"
                  label="New Password"
                  :rules="rulesFor.new_password"
                  :type="visible ? 'text' : 'password'"
                  :append-icon="`mdi-eye${visible ? '' : '-off'}`"
                  autocomplete="new-password"
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
                  autocomplete="new-password"
                  @click:append="visible = !visible"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            type="submit"
            color="warning"
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
  import { isRequired } from '@/functions'

  export default {
    name: 'UserPasswordForm',
    data: () => ({
      attributes: {
        currentPassword: null,
        password: null,
        passwordConfirmation: null
      },
      rulesFor: {
        currentPassword: [isRequired('Current Password')],
        new_password: [isRequired('New Password')],
        passwordConfirmation: [isRequired('Password Confirmation')]
      },
      visible: false
    }),
    computed: {
      ...mapGetters([
        'currentUser'
      ])
    },
    methods: {
      ...mapMutations('broadcaster', [
        'announce'
      ]),
      ...mapActions('user', [
        'changePassword'
      ]),
      async submit () {
        try {
          this.loading = true
          await this.changePassword(this.attributes)
          this.announce({
            message: 'Password has been changed!',
            color: 'success'
          })
        } catch (e) {
          this.announce({
            message: e.message,
            color: 'red'
          })
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
