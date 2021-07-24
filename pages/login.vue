<template>
  <v-container class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <login-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'LoginPage',
    mounted () {
      this.setTitle('')
    },
    methods: mapMutations('app', {
      setTitle: 'setTitle'
    })
  }
</script>
