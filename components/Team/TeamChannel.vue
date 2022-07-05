<template>
  <v-snackbar
    v-model="snackbar"
    top
    app
    :timeout="connectionState === 'Connected' ? 5000 : -1"
    :color="connectionColor"
  >
    {{ connectionMessage }}
    <template #action="{ attrs }">
      <v-btn
        v-if="connectionState === 'Disconnected'"
        dark
        text
        v-bind="attrs"
        @click="connectToWebSocket"
      >
        Reconnect
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  import { mapState } from 'vuex'
  import mapKeys from 'lodash.mapkeys'
  import camelCase from 'lodash.camelcase'

  export default {
    name: 'TeamChannel',
    data: () => ({
      snackbar: true,
      connectionState: 'Connecting',
      socket: null,
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
      },
      connectionMessage () {
        switch (this.connectionState) {
          case 'Connecting':
            return `Connecting to ${this.cableURL}...`
          case 'Connected':
            return `Connected to ${this.cableURL}!`
          case 'Disconnected':
            return 'Connection has been terminated.'
          default:
            return 'Invalid State: Please refresh the page.'
        }
      },
      connectionColor () {
        switch (this.connectionState) {
          case 'Connecting':
            return 'warning'
          case 'Connected':
            return 'success'
          case 'Disconnected':
            return 'error'
          default:
            return null
        }
      }
    },
    mounted () {
      if (!this.socket) {
        this.connectToWebSocket()
      }
    },
    destroyed () {
      this.socket.close()
    },
    methods: {
      connectToWebSocket () {
        if (this.token) {
          this.connectionState = 'Connecting'
          this.snackbar = true

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
            this.socket.send(JSON.stringify({
              command: 'subscribe',
              identifier: JSON.stringify({
                channel: 'TeamChannel',
                id: this.$route.query.teamId
              })
            }))

            this.connectionState = 'Connected'
            setTimeout(() => {
              this.snackbar = false
            }, 3000)
          }

          this.socket.onclose = () => {
            this.connectionState = 'Disconnected'
            this.snackbar = true
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
