<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        xs12
        sm8
        md4
      >
        <login-form v-if="!authenticated" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { Vue, Component, Watch } from 'nuxt-property-decorator'
  import { mapGetters } from 'vuex'
  import LoginForm from '@/components/App/LoginForm'

  @Component({
    components: {
      LoginForm
    },
    computed: mapGetters(['authenticated']),
    transition: 'fade-transition'
  })
  export default class IndexPage extends Vue {
    layout = () => 'default'
    middleware = () => 'home'

    mode = 'login'

    @Watch('authenticated', { immediate: true })
    goToTeams (val) {
      val && this.$router.push({ name: 'teams' })
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', '')
    }
  }
</script>
