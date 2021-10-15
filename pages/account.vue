<script>
  import { useFetch, useStore } from '@nuxtjs/composition-api'

  export default {
    name: 'AccountPage',
    setup () {
      const store = useStore()
      useFetch(async () => {
        store.commit('app/setPage', {
          title: 'Account',
          headline: 'Account'
        })
      })
    }
  }
</script>

<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <user-profile />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <user-password-changer />
      </v-col>
    </v-row>
  </v-container>
</template>
