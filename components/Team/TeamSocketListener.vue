<template>
  <div></div>
</template>

<script>
  import { cableURL } from '@/api/myfifa'

  export default {
    data: () => ({
      cable: null,
      subscriptions: []
    }),
    mounted () {
      if (!this.cable) {
        const ActionCable = require('actioncable')

        this.cable = ActionCable.createConsumer(
          `${cableURL}?access_token=${this.$store.state.token}`
        )
      }

      const subscription = this.cable.subscriptions.create({
        channel: 'TeamChannel'
      }, {
        received: (data) => {
          console.log(data)
        },
        connected: () => {}
      })

      this.subscriptions.push(subscription)
    },
    destroyed () {
      this.subscriptions.forEach((sub) => {
        sub && this.cable.subscriptions.remove(sub)
      })
    }
  }
</script>
