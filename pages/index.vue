<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <login-form v-if="!authenticated" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'AppPage',
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    computed: mapGetters([
      'authenticated'
    ]),
    mounted () {
      this.setTitle('')
    },
    methods: mapMutations('app', {
      setTitle: 'SET_TITLE'
    })
  }
</script>
