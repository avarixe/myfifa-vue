<template lang="pug">
  dialog-form(
    v-model="dialog"
    title-icon="mdi-human"
    :title="title"
    :submit="submit"
    :color="color"
  )
    template(#activator="{ on }")
      slot(:on="on")
        tooltip-button(
          label="Penalty Shootout"
          icon="mdi-human"
          color="indigo"
          :on="on"
        )
    template(#form)
      dynamic-fields(:object="penaltyShootout" :fields="fields")
</template>

<script>
  import { mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { TeamAccessible, DialogFormable, MatchAccessible } from '@/mixins'
  import { PenaltyShootoutFields } from '@/functions/fields'

  export default {
    name: 'PenaltyShootoutForm',
    mixins: [
      TeamAccessible,
      DialogFormable,
      MatchAccessible
    ],
    props: {
      record: {
        type: Object,
        default: null
      }
    },
    data: () => ({
      penaltyShootout: {
        home_score: null,
        away_score: null
      }
    }),
    computed: {
      fields () {
        return PenaltyShootoutFields()
      },
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
        createPenaltyShootout: 'CREATE',
        updatePenaltyShootout: 'UPDATE'
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
