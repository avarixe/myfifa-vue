<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-repeat"
    title="Record Substitution"
    :submit="submit"
    :color="color"
  >
    <slot
      slot="activator"
    />

    <v-container
      slot="form"
    >
      <v-layout
        wrap
      >
        <v-flex
          xs12
        >
          <minute-field
            v-model="minute"
            :extra-time="match.extra_time"
          />
        </v-flex>
        <v-flex
          xs12
        >
          <player-select
            v-model="substitution.player_id"
            :players="unsubbedPlayers"
            icon="mdi-subdirectory-arrow-left"
            required
          />
        </v-flex>
        <v-flex
          xs12
        >
          <player-select
            v-model="substitution.replacement_id"
            :players="availablePlayers"
            item-value="id"
            label="Replaced By"
            icon="mdi-subdirectory-arrow-right"
            required
          />
        </v-flex>
        <v-flex
          xs12
        >
          <v-checkbox
            label="Injury"
            v-model="substitution.injury"
            hide-details
          />
        </v-flex>
      </v-layout>
    </v-container>
  </dialog-form>
</template>

<script>
  import {
    activePlayers
  } from '@/models/Player'
  import {
    MinuteField,
    PlayerSelect
  } from '@/helpers'
  import {
    TeamAccessible,
    DialogFormable,
    MatchAccessible
  } from '@/mixins'

  export default {
    components: {
      MinuteField,
      PlayerSelect
    },
    mixins: [
      DialogFormable,
      TeamAccessible,
      MatchAccessible
    ],
    data () {
      return {
        substitution: {
          player_id: null,
          replacement_id: '',
          injury: false
        }
      }
    },
    computed: {
      availablePlayers () {
        const selectedIds = this.sortedCaps.map(c => c.player_id)
        return activePlayers(this.team.id)
          .filter(p => selectedIds.indexOf(p.id) < 0)
      },
      unsubbedPlayers () {
        return this.sortedCaps.filter(c => !c.subbed_out)
      }
    },
    methods: {
      async submit () {
        await this.$store.dispatch('substitutions/CREATE', {
          matchId: this.match.id,
          substitution: {
            ...this.substitution,
            minute: this.minute
          }
        })
      }
    }
  }
</script>
