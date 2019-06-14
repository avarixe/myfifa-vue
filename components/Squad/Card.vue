<template>
  <v-card outlined>
    <v-card-title>
      <span class="subtitle-1 font-weight-light">{{ squad.name }}</span>

      <v-spacer />

      <squad-form :squad-data="squad" >
        <template #default="{ on: dialog }">
          <v-tooltip
            bottom
            color="orange"
          >
            <template #activator="{ on: tooltip }">
              <v-btn
                v-on="{ ...dialog, ...tooltip }"
                text
                icon
              >
                <v-icon color="orange">mdi-pencil</v-icon>
              </v-btn>
            </template>
            Edit
          </v-tooltip>
        </template>
      </squad-form>

      <record-remove
        :record="squad"
        store="squads"
        :label="`Squad: ${ squad.name }`"
      />
    </v-card-title>

    <v-divider class="mx-3" />

    <v-card-text>
      <formation-view :formation="squadPlayers" />
    </v-card-text>
  </v-card>
</template>

<script>
  import { FormationView, RecordRemove } from '@/helpers'
  import SquadForm from './Form'

  export default {
    components: {
      SquadForm,
      FormationView,
      RecordRemove
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
