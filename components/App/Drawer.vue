<template lang="pug">
  v-navigation-drawer#app-drawer(
    :value="drawer"
    app
    clipped
    mobile-break-point="991"
    @input="setDrawer"
  )
    v-list-item
      v-list-item-content
        v-list-item-title.title MyFIFA Manager
        v-list-item-subtitle v{{ version }}
    v-divider
    v-list(v-if="teamId" nav)
      team-date-picker(menu-class="d-block")
        template(#default="{ on, date }")
          v-list-item(
            v-ripple
            color="accent"
            style="width: 100%"
            v-on="on"
          )
            v-list-item-action
              v-icon mdi-calendar
            v-list-item-title {{ date | formatDate }}
      v-list-item(
        v-for="(link, i) in teamLinks"
        :key="i"
        :to="link.to"
        active-class=""
        :exact="link.exact"
      )
        v-list-item-action
          v-icon {{ link.icon }}
        v-list-item-title {{ link.text }}
    v-divider.mx-3(v-if="teamId")
    v-list(nav)
      v-list-item(to="/" exact nuxt)
        v-list-item-action
          v-icon mdi-home
        v-list-item-title Home
      user-form.d-block
        template(#default="{ on }")
          v-list-item(v-on="on")
            v-list-item-action
              v-icon mdi-account-tie
            v-list-item-title Account
      settings-form.d-block
        template(#default="{ on }")
          v-list-item(v-on="on")
            v-list-item-action
              v-icon mdi-settings
            v-list-item-title Settings
      v-list-item(@click="logUserOut")
        v-list-item-action
          v-icon mdi-exit-to-app
        v-list-item-title Logout
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { Team } from '@/models'
  import SettingsForm from './SettingsForm'
  import TeamDatePicker from '@/components/Team/DatePicker'
  import UserForm from './UserForm'

  export default {
    name: 'AppDrawer',
    components: {
      SettingsForm,
      TeamDatePicker,
      UserForm
    },
    computed: {
      ...mapState([
        'version'
      ]),
      ...mapState('app', [
        'drawer'
      ]),
      teamId () {
        return this.$route.params.teamId
      },
      team () {
        return Team.find(this.teamId)
      },
      teamName () {
        return this.team.title
      },
      teamLinks () {
        if (this.teamId) {
          return [
            {
              to: {
                name: 'teams-teamId',
                params: { teamId: this.teamId }
              },
              exact: true,
              icon: 'mdi-view-dashboard',
              text: 'Dashboard'
            },
            {
              to: this.linkTo('seasons'),
              icon: 'mdi-trophy',
              text: 'Seasons'
            },
            {
              to: this.linkTo('players'),
              icon: 'mdi-account',
              text: 'Players'
            },
            {
              to: this.linkTo('matches'),
              icon: 'mdi-soccer-field',
              text: 'Matches'
            },
            {
              to: this.linkTo('squads'),
              icon: 'mdi-clipboard-text',
              text: 'Squads'
            }
          ]
        } else {
          return []
        }
      }
    },
    mounted () {
      this.setDrawer(window.innerWidth >= 991)
    },
    methods: {
      ...mapMutations('app', {
        setDrawer: 'SET_DRAWER'
      }),
      ...mapActions({
        logout: 'LOGOUT'
      }),
      async logUserOut () {
        await this.logout()
      },
      linkTo (page) {
        return {
          name: `teams-teamId-${page}`,
          params: { teamId: this.team.id }
        }
      }
    }
  }
</script>
