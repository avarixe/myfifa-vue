<script>
  import { ref, reactive, useStore } from '@nuxtjs/composition-api'
  import { isRequired } from '@/functions'

  export default {
    name: 'UserPasswordForm',
    setup () {
      const attributes = reactive({
        currentPassword: null,
        password: null,
        passwordConfirmation: null
      })

      const store = useStore()
      const submit = async () => {
        try {
          await store.dispatch('user/changePassword', attributes)
          store.commit('broadcaster/announce', {
            message: 'Password has been changed!',
            color: 'success'
          })
        } catch (e) {
          store.commit('broadcaster/announce', {
            message: e.message,
            color: 'red'
          })
        }
      }

      return {
        attributes,
        rulesFor: {
          currentPassword: [isRequired('Current Password')],
          new_password: [isRequired('New Password')],
          passwordConfirmation: [isRequired('Password Confirmation')]
        },
        visible: ref(false),
        submit
      }
    }
  }
</script>

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
