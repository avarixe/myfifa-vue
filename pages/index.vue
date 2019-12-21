<template lang="pug">
  v-container.fill-height(fluid)
    v-row(align="center" justify="center")
      v-col(cols="12" sm="8" md="4")
        login-form(v-if="!authenticated")
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import LoginForm from '@/components/App/LoginForm'

  export default {
    middleware: [
      'authenticated'
    ],
    components: {
      LoginForm
    },
    transition: 'fade-transition',
    computed: mapGetters([
      'authenticated'
    ]),
    watch: {
      authenticated: {
        handler (val) {
          val && this.$router.push({ name: 'teams' })
        },
        immediate: true
      }
    },
    mounted () {
      this.setTitle('')
    },
    methods: mapMutations({
      setTitle: 'SET_TITLE'
    })
  }
</script>
