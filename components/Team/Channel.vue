<template lang="pug">
  div
</template>

<script>
  import { mapState } from 'vuex'
  import { cableURL } from '@/api'
  import * as models from '@/models'

  export default {
    name: 'TeamChannel',
    data: () => ({
      cable: null,
      subscriptions: [],
      timeout: null,
      insertBuffer: {},
      deleteBuffer: {}
    }),
    computed: mapState([
      'token'
    ]),
    mounted () {
      if (!this.cable && this.token) {
        const ActionCable = require('actioncable')

        this.cable = ActionCable.createConsumer(
          `${cableURL}?access_token=${this.token}`
        )

        const subscription = this.cable.subscriptions.create({
          channel: 'TeamChannel',
          id: this.$route.params.teamId
        }, {
          received: ({ type, data, destroyed }) => {
            // console.log(type, data, destroyed)
            this.addToBuffer({ type, data, destroyed })
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
      addToBuffer ({ type, data, destroyed }) {
        let buffer = destroyed ? this.deleteBuffer : this.insertBuffer

        if (type in buffer) {
          buffer[type].push(data)
        } else {
          buffer[type] = [data]
        }

        if (this.timeout) {
          clearTimeout(this.timeout)
        }

        this.timeout = setTimeout(this.updateStore, 300)
      },
      updateStore () {
        Object.keys(this.deleteBuffer).forEach(async type => {
          const ids = this.deleteBuffer[type].map(data => data.id)
          await models[type].delete(record => ids.indexOf(record.id) > -1)
          delete this.deleteBuffer[type]
        })

        Object.keys(this.insertBuffer).forEach(async type => {
          await models[type].insert({ data: this.insertBuffer[type] })
          delete this.insertBuffer[type]
        })
      }
    }
  }
</script>
