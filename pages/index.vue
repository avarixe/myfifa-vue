<template>
  <v-container
    fluid
    class="fill-height"
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
  import { Vue, Component, Watch } from 'nuxt-property-decorator'
  import { mapGetters } from 'vuex'
  import LoginForm from '@/components/App/LoginForm'

  @Component({
    middleware: ['authenticated'],
    components: {
      LoginForm
    },
    computed: mapGetters(['authenticated']),
    transition: 'fade-transition'
  })
  export default class IndexPage extends Vue {
    @Watch('authenticated', { immediate: true })
    goToTeams (val) {
      val && this.$router.push({ name: 'teams' })
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', '')
    }
  }
</script>
