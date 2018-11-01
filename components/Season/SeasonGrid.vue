<template>
  <v-card>
    <v-card-title primary-title>
      <div class="title">
        // SEASONS
      </div>
    </v-card-title>
    <v-card-text>
      <v-data-iterator
        :items="rows"
        :loading="loading"
        :pagination-sync="pagination"
        no-data-text="No Seasons Recorded"
        hide-actions
        content-tag="v-layout"
        row
        wrap>
        <template slot="item" slot-scope="props">
          <v-flex xs12 sm6 md4 lg3>
            <season-item
              :season="parseInt(props.item[0])"
              :competitions="props.item[1]"
            ></season-item>
          </v-flex>
        </template>
      </v-data-iterator>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import SeasonItem from '@/components/Season/SeasonItem'

  export default {
    mixins: [ TeamAccessible ],
    components: {
      SeasonItem
    },
    data () {
      return {
        loading: false,
        pagination: {
          rowsPerPage: -1
        }
      }
    },
    computed: {
      ...mapState('competition', { competitions: 'list' }),
      rows () {
        return this.$_orderBy(
          Object.entries(this.$_groupBy(
            Object.values(this.competitions),
            competition => competition.season
          )),
          season => season[0],
          'desc'
        )
      }
    },
    mounted () {
      this.reloadGrid()
    },
    methods: {
      ...mapActions({
        getCompetitions: 'competition/getAll'
      }),
      async reloadGrid () {
        this.loading = true
        try {
          await this.getCompetitions({ teamId: this.team.id })
        } catch (e) {
          alert(e.message)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
