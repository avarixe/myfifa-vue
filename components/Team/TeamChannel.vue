<template>
  <div></div>
</template>

<script>
  import { cableURL } from '@/api/myfifa'
  import * as models from '@/models'

  export default {
    data: () => ({
      cable: null,
      subscriptions: []
    }),
    mounted () {
      const token = this.$store.state.session.token

      if (!this.cable && token) {
        const ActionCable = require('actioncable')

        this.cable = ActionCable.createConsumer(
          `${cableURL}?access_token=${token}`
        )

        const subscription = this.cable.subscriptions.create({
          channel: 'TeamChannel',
          id: this.$store.state.entities.teams.currentId
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
    },
    destroyed () {
      this.subscriptions.forEach((sub) => {
        sub && this.cable.subscriptions.remove(sub)
      })
    },
    methods: {
    }
  }
</script>
