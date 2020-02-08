<template lang="pug">
  v-container
    v-row.mb-2(v-if="!readonly" justify="center" dense)
      cap-form(v-if="match.caps.length < 11" :match="match")
      match-squad-applier(:match="match")
      match-squad-saver(:match="match")
    v-row.text-center(v-if="match.caps.length >= 11" dense)
      v-col
        .display-1.primary--text {{ defOVR }}
        .subheading DEF
      v-col
        .display-1.success--text {{ midOVR }}
        .subheading MID
      v-col
        .display-1.warning--text {{ attOVR }}
        .subheading ATT
    v-divider.mx-3.mb-2
    formation-view(:formation="starters")
      template(#item="{ player }")
        cap-view(
          :cap="player"
          :match="match"
          :readonly="readonly"
        )
    v-row(v-if="substitutes.length > 0")
      v-col
        v-list(dense)
          v-subheader Substitutes
          cap-sub-view(
            v-for="cap in substitutes"
            :key="cap.id"
            :cap="cap"
            :match="match"
            :readonly="readonly"
          )
</template>

<script>
  import { TeamAccessible } from '@/mixins'
  import { Player } from '@/models'
  import { positions } from '@/models/Match'
  import CapForm from '@/components/Cap/Form'
  import CapView from '@/components/Cap/View'
  import CapSubView from '@/components/Cap/SubView'
  import MatchSquadApplier from './SquadApplier'
  import MatchSquadSaver from './SquadSaver'

  export default {
    name: 'MatchLineup',
    components: {
      CapForm,
      CapView,
      CapSubView,
      MatchSquadApplier,
      MatchSquadSaver
    },
    mixins: [
      TeamAccessible
    ],
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    computed: {
      readonly () {
        return this.team.currently_on !== this.match.played_on
      },
      starters () {
        return this.match.caps.filter(c => c.start === 0)
      },
      substitutes () {
        return this.match.caps.filter(c => c.start > 0)
      },
      defOVR () {
        return this.avgOVR('DEF')
      },
      midOVR () {
        return this.avgOVR('MID')
      },
      attOVR () {
        return this.avgOVR('ATT')
      }
    },
    methods: {
      avgOVR (positionType) {
        let playerIds = []

        this.match.caps.forEach(cap => {
          if (positions[cap.pos] === positionType) {
            playerIds.push(cap.player_id)
          }
        })

        const totalOvr = Player
          .query()
          .whereIdIn(playerIds)
          .get()
          .reduce(
            (sum, player) => sum + player.ovrAt(this.match.played_on),
            0
          )

        return Math.round(totalOvr / playerIds.length)
      }
    }
  }
</script>
