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
        :loading="loading"
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
  import { mapState, mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import SquadForm from '@/components/Squad/SquadForm'
  import SquadItem from '@/components/Squad/SquadItem'
  // import SquadActions from '@/components/Squad/SquadActions'

  export default {
    components: {
      SquadForm,
      // SquadActions
      SquadItem
    },
    mixins: [ TeamAccessible ],
    data () {
      return {
        loading: false
      }
    },
    computed: {
      ...mapState('squad', {
        squads: 'list'
      }),
      rows () {
        return Object.values(this.squads)
      }
    },
    mounted () {
      this.reloadGrid()
      this.getPlayers({ teamId: this.team.id })
    },
    methods: {
      ...mapActions({
        getPlayers: 'player/getAll',
        getSquads: 'squad/getAll'
      }),
      async reloadGrid () {
        this.loading = true
        try {
          await this.getSquads({ teamId: this.team.id })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loading = false
        }
      },
      resultColor (result) {
        switch (result) {
          case 'win':
            return 'green'
          case 'draw':
            return 'grey'
          case 'loss':
            return 'red'
          default:
            return ''
        }
      }
    }
  }
</script>
