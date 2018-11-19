<template>
  <div></div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import { cableURL } from '@/api/myfifa'
  import { formatter as stageFormatter } from '@/api/modules/stage'

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
              case 'Loan':
              case 'Injury':
              case 'Transfer':
                this.removeNestedRecord('Player', type, data)
                break
              case 'Match':
                this.removeMatch(data.id)
                break
              case 'Cap':
                this.removeNestedRecord('Match', type, data)
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
                this.removeNestedRecord('Match', type, data, { singular: true })
                break
              case 'Squad':
                this.removeSquad(data.id)
                break
              case 'Competition':
                this.removeCompetition(data.id)
                break
              case 'Stage':
                this.removeNestedRecord('Competition', type, data)
                break
            }
          } else {
            switch (type) {
              case 'Player':
                this.setPlayer({ ...this.players[data.id], ...data })
                break
              case 'PlayerHistory':
              case 'Contract':
              case 'Loan':
              case 'Injury':
              case 'Transfer':
                this.setNestedRecord('Player', type, data)
                break
              case 'Match':
                this.setMatch({ ...this.matches[data.id], ...data })
                break
              case 'Cap':
                this.setNestedRecord('Match', type, data)
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
                this.setNestedRecord('Match', type, data, { singular: true })
                break
              case 'Squad':
                this.setSquad({ ...this.squads[data.id], ...data })
                break
              case 'Competition':
                this.setCompetition({ ...this.competitions[data.id], ...data })
                break
              case 'Stage':
                this.setNestedRecord('Competition', type, data, { formatter: stageFormatter })
                break
              case 'TableRow':
              case 'Fixture':
                if (data.competition_id in this.competitions) {
                  const competition = this.competitions[data.competition_id]
                  if ('stages' in competition && data.stage_id in competition.stages) {
                    const stage = competition.stages[data.stage_id]
                    const attr = this.attributize(type)
                    let records = { ...stage[attr], [data.id]: data }
                    this.setCompetition({
                      ...competition,
                      stages: {
                        ...competition.stages,
                        [stage.id]: { ...stage, [attr]: records }
                      }
                    })
                  }
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
      }),
      removeNestedRecord (parentType, associationType, data, options = {}) {
        const attr = this.attributize(associationType)
        const parentId = data[`${parentType.toLowerCase()}_id`]
        const parentRecords = this[this.attributize(parentType)]
        const setParent = this[`set${parentType}`]

        if (parentId in parentRecords &&
            attr in parentRecords[parentId]) {
          let parent = parentRecords[parentId]
          if (options.singular) {
            delete parent[attr]
            setParent(parent)
          } else {
            let records = { ...parent[attr] }
            delete records[data.id]
            setParent({ ...parent, [attr]: records })
          }
        }
      },
      setNestedRecord (parentType, associationType, data, options = {}) {
        const formatter = options.formatter || function (x) { return x }
        const attr = this.attributize(associationType)
        const parentId = data[`${parentType.toLowerCase()}_id`]
        const parentRecords = this[this.attributize(parentType)]
        const setParent = this[`set${parentType}`]

        if (parentId in parentRecords) {
          const parent = parentRecords[parentId]
          if (options.singular) {
            setParent({ ...parent, [attr]: data })
          } else {
            let records = { ...parent[attr] }
            records[data.id] = formatter(data)
            setParent({ ...parent, [attr]: records })
          }
        }
      },
      attributize (x) {
        switch (x) {
          case 'PlayerHistory': return 'player_histories'
          case 'PenaltyShootout': return 'penalty_shootout'
          case 'Injury': return 'injuries'
          case 'Match': return 'matches'
          case 'TableRow': return 'table_rows'
          default: return `${x.toLowerCase()}s`
        }
      }
    }
  }
</script>
