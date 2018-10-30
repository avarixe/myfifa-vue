<template>
  <div></div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import { cableURL } from '@/api/myfifa'

  export default {
    mixins: [ TeamAccessible ],
    data: () => ({
      cable: null,
      subscriptions: []
    }),
    computed: {
      ...mapState([ 'token' ]),
      ...mapState('player', { players: 'list' }),
      ...mapState('match', { matches: 'list' }),
      ...mapState('squad', { squads: 'list' }),
      ...mapState('competition', { competitions: 'list' })
    },
    mounted () {
      if (!this.cable && this.token) {
        const ActionCable = require('actioncable')

        this.cable = ActionCable.createConsumer(
          `${cableURL}?access_token=${this.token}`
        )
      }

      const subscription = this.cable.subscriptions.create({
        channel: 'TeamChannel',
        id: this.team.id
      }, {
        received: ({ type, data, destroyed }) => {
          // console.log(type, data, destroyed)
          if (destroyed) {
            switch (type) {
              case 'Player':
                this.removePlayer(data.id)
                break
              case 'Contract':
                if (data.player_id in this.players &&
                    'contracts' in this.players[data.player_id]) {
                  const player = this.players[data.player_id]
                  this.setPlayer({
                    ...player,
                    contracts: player.contracts.filter(c => c.id !== data.id)
                  })
                }
                break
              case 'Loan':
                if (data.player_id in this.players &&
                    'loans' in this.players[data.player_id]) {
                  const player = this.players[data.player_id]
                  this.setPlayer({
                    ...player,
                    loans: player.loans.filter(l => l.id !== data.id)
                  })
                }
                break
              case 'Injury':
                if (data.player_id in this.players &&
                    'injuries' in this.players[data.player_id]) {
                  const player = this.players[data.player_id]
                  this.setPlayer({
                    ...player,
                    injuries: player.injuries.filter(c => c.id !== data.id)
                  })
                }
                break
              case 'Transfer':
                if (data.player_id in this.players &&
                    'transfers' in this.players[data.player_id]) {
                  const player = this.players[data.player_id]
                  this.setPlayer({
                    ...player,
                    transfers: player.transfers.filter(c => c.id !== data.id)
                  })
                }
                break
              case 'Match':
                this.removeMatch(data.id)
                break
              case 'Performance':
                if (data.match_id in this.matches &&
                    'performances' in this.matches[data.match_id]) {
                  const match = this.matches[data.match_id]
                  this.setMatch({
                    ...match,
                    performances: match.performances.filter(p => p.id !== data.id)
                  })
                }
                break
              case 'Goal':
              case 'Substitution':
              case 'Booking':
                if (data.match_id in this.matches &&
                    'events' in this.matches[data.match_id]) {
                  const match = this.matches[data.match_id]
                  this.setMatch({
                    ...match,
                    events: match.events.filter(e => !(e.id === data.id && e.event_type === type))
                  })
                }
                break
              case 'PenaltyShootout':
                if (data.match_id in this.matches) {
                  const match = { ...this.matches[data.match_id] }
                  delete match.penalty_shootout
                  this.setMatch(match)
                }
                break
              case 'Squad':
                this.removeSquad(data.id)
                break
              case 'Competition':
                this.remoteCompetition(data.id)
                break
              case 'Stage':
                if (data.competition_id in this.competitions &&
                    'stages' in this.competitions[data.competition_id]) {
                  const competition = this.competitions[data.competition_id]
                  this.setCompetition({
                    ...competition,
                    stages: competition.stages.filter(s => s.id !== data.id)
                  })
                }
                break
            }
          } else {
            switch (type) {
              case 'Player':
                this.setPlayer({ ...this.players[data.id], ...data })
                break
              case 'Contract':
                if (data.player_id in this.players) {
                  let player = { ...this.players[data.player_id] }
                  let contracts = [ ...player.contracts ]
                  const index = contracts.findIndex(x => x.id === data.id)
                  if (index > -1) {
                    contracts.splice(index, 1, data)
                  } else {
                    contracts.push(data)
                  }
                  this.setPlayer({ ...player, contracts })
                }
                break
              case 'Loan':
                if (data.player_id in this.players) {
                  let player = { ...this.players[data.player_id] }
                  let loans = [ ...player.loans ]
                  const index = loans.findIndex(x => x.id === data.id)
                  if (index > -1) {
                    loans.splice(index, 1, data)
                  } else {
                    loans.push(data)
                  }
                  this.setPlayer({ ...player, loans })
                }
                break
              case 'Injury':
                if (data.player_id in this.players) {
                  let player = { ...this.players[data.player_id] }
                  let injuries = [ ...player.injuries ]
                  const index = injuries.findIndex(x => x.id === data.id)
                  if (index > -1) {
                    injuries.splice(index, 1, data)
                  } else {
                    injuries.push(data)
                  }
                  this.setPlayer({ ...player, injuries })
                }
                break
              case 'Transfer':
                if (data.player_id in this.players) {
                  let player = { ...this.players[data.player_id] }
                  let transfers = [ ...player.transfers ]
                  const index = transfers.findIndex(x => x.id === data.id)
                  if (index > -1) {
                    transfers.splice(index, 1, data)
                  } else {
                    transfers.push(data)
                  }
                  this.setPlayer({ ...player, transfers })
                }
                break
              case 'Match':
                this.setMatch({ ...this.matches[data.id], ...data })
                break
              case 'Performance':
                if (data.match_id in this.matches) {
                  let match = { ...this.matches[data.match_id] }
                  let performances = [ ...match.performances ]
                  const pIdx = performances.findIndex(p => p.id === data.id)
                  if (pIdx > -1) {
                    performances.splice(pIdx, 1, data)
                  } else {
                    performances.push(data)
                  }
                  this.setMatch({ ...match, performances })
                }
                break
              case 'Goal':
              case 'Substitution':
              case 'Booking':
                if (data.match_id in this.matches) {
                  let match = { ...this.matches[data.match_id] }
                  let events = [ ...match.events ]
                  const pIdx = events.findIndex(p => p.id === data.id && p.event_type === type)
                  if (pIdx > -1) {
                    events.splice(pIdx, 1, data)
                  } else {
                    events.push(data)
                  }
                  this.setMatch({ ...match, events })
                }
                break
              case 'PenaltyShootout':
                if (data.match_id in this.matches) {
                  this.setMatch({
                    ...this.matches[data.match_id],
                    penalty_shootout: data
                  })
                }
                break
              case 'Squad':
                this.setSquad({ ...this.squads[data.id], ...data })
                break
              case 'Competition':
                this.setCompetition({ ...this.competitions[data.id], ...data })
                break
              case 'Stage':
                if (data.competition_id in this.competitions) {
                  let competition = { ...this.competitions[data.competition_id] }
                  let stages = [ ...competition.stages ]
                  const sIdx = stages.findIndex(s => s.id === data.id)
                  if (sIdx > -1) {
                    stages.splice(sIdx, 1, data)
                  } else {
                    stages.push(data)
                  }
                  this.setCompetition({ ...competition, stages })
                }
                break
            }
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
        setMatch: 'match/SET',
        setSquad: 'squad/SET',
        setCompetition: 'competition/SET',
        removePlayer: 'player/REMOVE',
        removeMatch: 'match/REMOVE',
        removeSquad: 'squad/REMOVE',
        removeCompetition: 'competition/REMOVE'
      })
    }
  }
</script>
