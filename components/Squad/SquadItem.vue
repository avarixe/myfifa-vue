<template>
  <material-card>
    <template #header>
      <span class="title font-weight-light mb-2">{{ squad.name }}</span>

      <squad-actions :squad="squad" />
    </template>

    <formation-view :formation="squadPlayers" />
  </material-card>
</template>

<script>
  import { FormationView } from '@/helpers'
  import MaterialCard from '@/components/theme/Card'
  import SquadActions from './SquadActions'

  export default {
    components: {
      MaterialCard,
      SquadActions,
      FormationView
    },
    props: {
      squad: {
        type: Object,
        required: true
      }
    },
    computed: {
      squadPlayers () {
        return this.squad.positions_list.map((pos, i) => ({
          pos: pos,
          player_id: this.squad.players_list[i]
        }))
      }
    }
  }
</script>
