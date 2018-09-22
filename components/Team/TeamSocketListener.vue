<template>
  <div></div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import { cableURL } from '@/api/myfifa'

  export default {
    data: () => ({
      cable: null,
      subscriptions: []
    }),
    computed: {
      ...mapState([ 'token' ]),
      ...mapState('player', { players: 'list' }),
      ...mapState('match', { matches: 'list' })
    },
    mounted () {
      if (!this.cable && this.token) {
        const ActionCable = require('actioncable')

        this.cable = ActionCable.createConsumer(
          `${cableURL}?access_token=${this.token}`
        )
      }

      const subscription = this.cable.subscriptions.create({
        channel: 'TeamChannel'
      }, {
        received: ({ type, data }) => {
          console.log(data)
          switch (type) {
            case 'Player':
              this.setPlayer({ ...this.players[data.id], ...data })
              break
            case 'Match':
              this.setMatch({ ...this.matches[data.id], ...data })
              break
          }
        },
        connected: () => {}
      })

      this.subscriptions.push(subscription)
    },
    destroyed () {
      this.subscriptions.forEach((sub) => {
        sub && this.cable.subscriptions.remove(sub)
      })
    },
    methods: {
      ...mapMutations({
        setPlayer: 'player/SET',
        setMatch: 'match/SET'
      })
    }
  }
</script>
