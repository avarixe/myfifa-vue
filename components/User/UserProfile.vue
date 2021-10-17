<script>
  import { reactive, computed, onMounted, useStore } from '@nuxtjs/composition-api'
  import { isRequired, isEmail } from '@/functions'

  export default {
    name: 'UserProfile',
    setup () {
      const attributes = reactive({
        fullName: null,
        username: null,
        email: null
      })

      const store = useStore()
      const currentUser = computed(() => store.getters.currentUser)
      onMounted(() => {
        attributes.fullName = currentUser.value.fullName
        attributes.username = currentUser.value.username
        attributes.email = currentUser.value.email
      })


      return {
        attributes,
        rulesFor: {
          fullName: [isRequired('Name')],
          username: [isRequired('Username')],
          email: [
            isRequired('Email Address'),
            isEmail
          ]
        },
        submit: async () => {
          try {
            await store.dispatch('user/update', attributes)
            store.commit('broadcaster/announce', {
              message: 'Profile has been updated!',
              color: 'success'
            })
          } catch (e) {
            store.commit('broadcaster/announce', {
              message: e.message,
              color: 'red'
            })
          }
        }
      }
    }
  }
</script>

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
