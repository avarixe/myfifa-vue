<template>
  <dialog-form
    v-model="dialog"
    title-icon="mdi-human"
    :title="title"
    :submit="submit"
    :color="color"
  >
    <template #activator="{ on }">
      <slot :on="on">
        <tooltip-button
          label="Penalty Shootout"
          icon="mdi-human"
          color="indigo"
          :on="on"
        />
      </slot>
    </template>
    <template #form>
      <v-col cols="6">
        <v-text-field
          v-model="penaltyShootout.home_score"
          label="Home Score"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.home_score"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="penaltyShootout.away_score"
          label="Away Score"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.away_score"
          inputmode="numeric"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import { isRequired, isNumber } from '@/functions'

  export default {
    name: 'PenaltyShootoutForm',
    mixins: [
      TeamAccessible,
      DialogFormable,
      MatchAccessible
    ],
    props: {
      record: { type: Object, default: null }
    },
    data: () => ({
      penaltyShootout: {
        home_score: null,
        away_score: null
      },
      rulesFor: {
        home_score: [
          isRequired('Home Score'),
          isNumber('Home Score')
        ],
        away_score: [
          isRequired('Away Score'),
          isNumber('Away Score')
        ]
      }
    }),
    computed: {
      title () {
        return `${this.record ? 'Edit' : 'Record'} Penalty Shootout`
      }
    },
    watch: {
      dialog (val) {
        if (val && this.record) {
          this.penaltyShootout = pick(this.record, [
            'id',
            'home_score',
            'away_score'
          ])
        }
      }
    },
    methods: {
      ...mapActions('penaltyShootout', {
        createPenaltyShootout: 'create',
        updatePenaltyShootout: 'update'
      }),
      async submit () {
        const save = this.record
          ? this.updatePenaltyShootout
          : this.createPenaltyShootout

        await save({
          matchId: this.match.id,
          penaltyShootout: this.penaltyShootout
        })
      }
    }
  }
</script>
