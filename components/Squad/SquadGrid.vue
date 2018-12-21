<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">
        // SQUADS
      </div>
    </v-card-title>
    <v-card-text>
      <v-data-iterator
        :items="rows"
        content-tag="v-layout"
        row
        wrap
        no-data-text="No Squads Recorded">
        <template slot="item" slot-scope="props">
          <v-flex xs12 md6>
            <squad-item :squad="props.item"></squad-item>
          </v-flex>
        </template>
      </v-data-iterator>
    </v-card-text>
  </v-card>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'
  import { Squad } from '@/models'
  import SquadForm from './SquadForm'
  import SquadItem from './SquadItem'

  export default {
    components: {
      SquadForm,
      SquadItem
    },
    mixins: [ TeamAccessible ],
    computed: {
      rows () {
        return Squad
          .query()
          .where('team_id', this.team.id)
          .get()
      }
    }
  }
</script>
