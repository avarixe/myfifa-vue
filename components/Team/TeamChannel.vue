<template>
  <div />
</template>

<script>
  import { mapState } from 'vuex'
  import mapKeys from 'lodash.mapkeys'
  import camelCase from 'lodash.camelcase'

  export default {
    name: 'TeamChannel',
    data: () => ({
      cable: null,
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
          `${this.$config.cableURL}?access_token=${this.token}`
        )

        this.cable.subscriptions.create({
          channel: 'TeamChannel',
          id: this.$route.params.teamId
        }, {
          received: ({ type, data, destroyed }) => {
            // console.log(type, data, destroyed)
            this.addToBuffer({ type, data, destroyed })
          },
          connected: () => {}
        })
      }
    },
    destroyed () {
      this.cable.subscriptions.consumer.disconnect()
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
          await this.$store.$db().model(type).delete(record => ids.indexOf(record.id) > -1)
          delete this.deleteBuffer[type]
        })

        Object.keys(this.insertBuffer).forEach(async type => {
          const data = this.insertBuffer[type].map(
            record => mapKeys(record, (_v, k) => camelCase(k))
          )
          await this.$store.$db().model(type).insert({ data })
          delete this.insertBuffer[type]
        })
      }
    }
  }
</script>
