<template>
  <material-card>
    <template slot="header">
      <span
        v-text="'Squads'"
        class="title font-weight-light mb-2"
      />

      <squad-form>
        <v-tooltip bottom>
          <v-btn slot="activator" flat>
            <v-icon>mdi-plus-circle-outline</v-icon>
          </v-btn>
          New Squad
        </v-tooltip>
      </squad-form>
    </template>

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
  </material-card>
</template>

<script>
  import { Squad } from '@/models'
  import MaterialCard from '@/components/theme/Card'
  import SquadForm from './SquadForm'
  import SquadItem from './SquadItem'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    components: {
      MaterialCard,
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
