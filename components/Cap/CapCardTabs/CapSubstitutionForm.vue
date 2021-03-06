<template>
  <base-form :submit="saveSubstitution">
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Substitute Player
        </div>
        <minute-field v-model="minute" />
        <player-select
          v-model="substitution.replacement_id"
          :players="availablePlayers"
          item-value="id"
          label="Replaced By"
          icon="mdi-subdirectory-arrow-right"
          required
        />
        <v-checkbox
          v-model="substitution.injury"
          label="Injury"
          hide-details
        />
        <div class="d-flex">
          <v-spacer />
          <v-btn
            type="submit"
            :disabled="!valid"
            primary
            text
            :loading="loading"
          >
            Save
          </v-btn>
        </div>
      </div>
    </template>
  </base-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import { TeamAccessible, MatchAccessible } from '@/mixins'
  import { activePlayers } from '@/models/Player'

  export default {
    name: 'CapSubstitutionForm',
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    props: {
      cap: { type: Object, required: true }
    },
    data: () => ({
      substitution: {
        player_id: null,
        replacement_id: '',
        injury: false
      }
    }),
    computed: {
      availablePlayers () {
        const selectedIds = this.sortedCaps.map(cap => cap.player_id)
        return activePlayers(this.team.id)
          .filter(player => {
            if (selectedIds.indexOf(player.id) < 0) {
              return true
            } else if (this.record) {
              return player.id === this.record.replacement_id
            }
          })
      }
    },
    watch: {
      cap: {
        immediate: true,
        handler (cap) {
          this.substitution.player_id = cap.player_id
        }
      }
    },
    methods: {
      ...mapActions('substitutions', {
        createSubstitution: 'create'
      }),
      async saveSubstitution () {
        await this.createSubstitution({
          matchId: this.match.id,
          substitution: {
            ...this.substitution,
            minute: this.minute
          }
        })
        this.$emit('submitted')
      }
    }
  }
</script>
