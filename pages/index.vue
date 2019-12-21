<template lang="pug">
  v-container.fill-height(fluid)
    v-row(align="center" justify="center")
      v-col(cols="12" sm="8" md="4")
        login-form(v-if="!authenticated")
</template>

<script>
  import { Vue, Component, Watch, Getter, namespace } from 'nuxt-property-decorator'
  import LoginForm from '@/components/App/LoginForm'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      LoginForm
    },
    transition: 'fade-transition'
  })
  export default class IndexPage extends Vue {
    @Getter authenticated
    @app.Mutation('SET_TITLE') setTitle
    @Watch('authenticated', { immediate: true })
    goToTeams (val) {
      val && this.$router.push({ name: 'teams' })
    }

    mounted () {
      this.setTitle('')
    }
  }
</script>
