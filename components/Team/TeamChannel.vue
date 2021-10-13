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
      socket: null,
      reconnectTimeout: null,
      reconnectWait: 250,
      timeout: null,
      insertBuffer: {},
      deleteBuffer: {}
    }),
    computed: {
      ...mapState('auth', [
        'token'
      ]),
      cableURL () {
        return `${this.$config.baseURL.replace('http', 'ws')}/cable`
      }
    },
    mounted () {
      this.connectToWebSocket()
    },
    destroyed () {
      this.socket.onclose = null
      this.socket.close()
    },
    methods: {
      connectToWebSocket () {
        if (this.token) {
          this.socket = new WebSocket(
            `${this.cableURL}?access_token=${this.token}`
          )

          this.socket.onmessage = event => {
            const { message } = JSON.parse(event.data)
            const { type, data, destroyed } = message || {}
            if (type) {
              // console.log(type, data, destroyed)
              this.addToBuffer({ type, data, destroyed })
            }
          }

          this.socket.onopen = () => {
            this.reconnectWait = 250
            this.socket.send(JSON.stringify({
              command: 'subscribe',
              identifier: JSON.stringify({
                channel: 'TeamChannel',
                id: this.$route.params.teamId
              })
            }))
          }

          this.socket.onclose = () => {
            delete this.socket
            this.reconnectTimeout = setTimeout(
              this.connectToWebSocket,
              Math.min(10000, this.reconnectWait *= 2)
            )
          }
        }
      },
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
          await this.$store.$db().model(type).insertOrUpdate({ data })
          delete this.insertBuffer[type]
        })
      }
    }
  }
</script>
