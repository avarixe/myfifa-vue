<template>
  <div />
</template>

<script>
  import { Vue, Component } from 'nuxt-property-decorator'
  import { cableURL } from '@/api'
  import * as models from '@/models'

  @Component
  export default class TeamChannel extends Vue {
    cable = null
    subscriptions = []

    mounted () {
      const token = this.$store.state.token

      if (!this.cable && token) {
        const ActionCable = require('actioncable')

        this.cable = ActionCable.createConsumer(
          `${cableURL}?access_token=${token}`
        )

        const subscription = this.cable.subscriptions.create({
          channel: 'TeamChannel',
          id: this.$route.params.teamId
        }, {
          received: ({ type, data, destroyed }) => {
            // console.log(type, data, destroyed)
            if (type in models) {
              if (destroyed) {
                models[type].delete(data.id)
              } else {
                models[type].insert({ data })
              }
            }
          },
          connected: () => {}
        })

        this.subscriptions.push(subscription)
      }
    }

    destroyed () {
      this.subscriptions.forEach((sub) => {
        sub && this.cable.subscriptions.remove(sub)
      })
    }
  }
</script>
